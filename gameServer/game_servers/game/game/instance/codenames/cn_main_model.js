const CnpGridModel = require('./cn_position_model.js').CnpGridModel;

const Enums = require('../enums_instance.js');
const cnTeamType = Enums.cnTeamType;

class GameModel {

  constructor(gameCreationModel) {
    var nb_cells      = gameCreationModel.nb_cells;
    var teams         = gameCreationModel.teams;

    // var startingTeam  = gameCreationModel.startingTeam;
    // var startingTeam  = gameCreationModel.teams[0];

    //------

    this.gridModel  = new CnpGridModel(nb_cells);
    this.cellModels = this.gridModel.cellModels.map(gridCellModel => new CnmCellModel(gridCellModel));

    this.teams = gameCreationModel.teams;
    this.playingTeams = this.teams;

    // this.activeTeamIndex = teams.indexOf(startingTeam);
    this.activeTeamIndex = 0;

    // this.scoresDict = {cnTeamType.RED : 0, cnTeamType.BLUE : 0};
    this.scoresDict = {1 : 0, 2 : 0};

    this.turnIndex = 0;
    this.currentTurn = null;

    this.newTurnEventListeners        = [];
    this.bonusTurnEventListeners      = [];
    this.gameOverEventListeners       = [];
    this.completedColorEventListeners = [];

    this.tellerPhaseEventListeners        = [];
    this.guesserPhaseEventListeners       = [];
    this.didUpdateCellModelEventListeners = [];
  }

  getActiveTeam() {
    return this.teams[this.activeTeamIndex];
  }

  getInactiveTeam() {
    return this.getTeamForIndex(this.activeTeamIndex + 1);
  }

  getTeamForIndex(index) {
    return this.teams[index % this.teams.length];
  }

  getIndexForTeam(team) {
      return this.teams.indexOf(team);
  }

  changeTeam() {
      this.activeTeamIndex = (this.activeTeamIndex + 1) % this.teams.length;
  }

  getScoreForTeam(team) {
    return this.scoresDict[team.type];
  }

  getObjectiveForTeam(team) {
    return this.cellModels
            .filter(cellModel => (cellModel.getType() == team.type))
            .length;
  }

  getRevealedForTeam(team) {
    return this.cellModels
            .filter(cellModel => (cellModel.getType() == team.type))
            .filter(cellModel => cellModel.flipped)
            .length;
  }

  getRemainingForTeam(team) {
    return this.getObjectiveForTeam(team) - this.getRevealedForTeam(team);
  }



  startGame() {
    this.setTurnWithTurnIndex(this.turnIndex);
  }

  moveToNextTurn() {
    this.changeTeam();
    this.turnIndex += 1;

    this.setTurnWithTurnIndex(this.turnIndex);
  }

  setTurnWithTurnIndex(turnIndex) {
    this.currentTurn = new Turn(this.turnIndex, this.getActiveTeam());

    this.sendNewTurnEvent(this.currentTurn);
    this.sendTellerPhaseEvent(this.currentTurn);
  }

  moveToBonusTurn() {
    this.turnIndex += 1;

    this.setBonusTurnWithTurnIndex(this.turnIndex);
  }

  setBonusTurnWithTurnIndex(turnIndex) {
    this.currentTurn = Turn.bonusTurn(this.turnIndex, this.getActiveTeam());

    this.sendBonusTurnEvent(this.currentTurn);
    this.sendGuesserPhaseEvent(this.currentTurn);
  }

  endTurn() {
    this.moveToNextTurn();
  }

  addOnePointToTeam(team) {
    this.scoresDict[team.type] += 1;
  }

  manageCellSelection(cellIndex, selectionCallback) {
    const cellModel = this.cellModels[cellIndex];
    cellModel.flipped = true;

    this.sendDidUpdateCellModelEvent(cellModel);

    var curActionSequence = this.currentTurn.actionSequence;
    curActionSequence.addNewAction(cellModel, action => {
      //manage action
      if(action.valid) {
        this.addOnePointToTeam(this.getActiveTeam());

        selectionCallback(true);
      } else if(action.invalid) {
        this.moveToNextTurn();

        selectionCallback(false);
      } else if(action.gameover) {
        var loser  = this.getActiveTeam();
        var winner = this.getTeamForIndex(this.activeTeamIndex + 1);
        this.sendGameOverEvent(winner,loser);

        selectionCallback(false);
      }
    }, actionSequence => {
      //manage action sequence
      if(actionSequence.is_completed()) {
        console.log("actionSequence.is_completed()");
        //
        if(!this.currentTurn.isBonus) {
          this.moveToBonusTurn();
        } else {
          this.moveToNextTurn();
        }
      } else if(actionSequence.is_interrupted()) {

      } else if(actionSequence.is_gameover()) {

      }

    });

    this.checkIfCompletedColor();
    this.checkIfWinnerWrtGridState();

  }

  checkIfWinnerWrtGridState() {
    console.log("checkIfWinnerWrtGridState");

    /*
    var remaining_dict = this.teams.reduce((acc,x) => {acc[x] = this.getRemainingForTeam(x); return acc;} ,{});
    Array.from(Object.keys(remaining_dict)).forEach((item, i) => {
      console.log(item);
    });
    */
    var remaining_array = this.teams.map(team => this.getRemainingForTeam(team));

    var winnerIndex = remaining_array.indexOf(0);
    if(winnerIndex != -1) {
      var winner = this.teams[winnerIndex];
      var loser  = this.getTeamForIndex(winnerIndex + 1);
      this.sendGameOverEvent(winner,loser);
    }
  }


  checkIfCompletedColor() {
    console.log("checkIfCompletedColor");
    console.log(this.playingTeams.map((team, index) => {
      return {
        index: index,
        rem: this.getRemainingForTeam(team),
        team: team
      };
    }));
    var completeColorTeamObjs = this.playingTeams
      .map((team, index) => {
        return {
          index: index,
          rem: this.getRemainingForTeam(team),
          team: team
        };
      })
      .filter(obj => obj.rem == 0);
    completeColorTeamObjs.forEach(obj => {
      this.sendCompletedColorEvent(obj.team);
    });
    var forDeletion = completeColorTeamObjs.map(obj => obj.team);
    this.playingTeams = this.playingTeams.filter(team => !forDeletion.includes(team));
  }


  //IN -> OUT

  addNewTurnEventListener(callback) {
    this.newTurnEventListeners.push(callback);
  }

  sendNewTurnEvent(turn) {
    this.newTurnEventListeners.forEach((listener, i) => {
      listener(turn);
    });
  }

  addBonusTurnEventListener(callback) {
    this.bonusTurnEventListeners.push(callback);
  }

  sendBonusTurnEvent(turn) {
    this.bonusTurnEventListeners.forEach((listener, i) => {
      listener(turn);
    });
  }

  addGameOverEventListener(callback) {
    this.gameOverEventListeners.push(callback);
  }

  sendGameOverEvent(winner,loser) {
    this.gameOverEventListeners.forEach((listener, i) => {
      listener(winner, loser);
    });
  }

  addCompletedColorEventListener(callback) {
    this.completedColorEventListeners.push(callback);
  }

  sendCompletedColorEvent(team) {
    this.completedColorEventListeners.forEach((listener, i) => {
      listener(team);
    });
  }



  addTellerPhaseEventListener(callback) {
    this.tellerPhaseEventListeners.push(callback);
  }

  sendTellerPhaseEvent(turn) {
    this.tellerPhaseEventListeners.forEach((listener, i) => {
      listener(turn);
    });
  }

  addGuesserPhaseEventListener(callback) {
    this.guesserPhaseEventListeners.push(callback);
  }

  sendGuesserPhaseEvent(turn) {
    this.guesserPhaseEventListeners.forEach((listener, i) => {
      listener(turn);
    });
  }


  addDidUpdateCellModelEventListener(callback) {
      this.didUpdateCellModelEventListeners.push(callback);
  }

  sendDidUpdateCellModelEvent(cellModel) {
    this.didUpdateCellModelEventListeners.forEach((listener, i) => {
      listener(cellModel);
    });
  }


  //OUT -> IN

  manageInput_contractNumber(number, callback) {

    //create contract
    const contract = new Contract(this.getActiveTeam(), number);
    this.currentTurn.registerContract(contract);

    const success = true;
    callback(success);
    if(success) {
      this.sendGuesserPhaseEvent(this.currentTurn);
    }
  }

  manageInput_guesserCellIndex(cellIndex, callback) {
    this.manageCellSelection(cellIndex, callback);
  }

  manageInput_guesserEndTurn(callback) {
    this.endTurn();

    const success = true;
    callback(success);
  }


}

class Turn {

  constructor(index, team) {
    this.index = index;
    this.name  = "Turn";
    this.team  = team;

    this.contract = null;
    this.actionSequence = null;

    this.canEndTurn = function() {
      var outBool = false;
      if(this.actionSequence) {
        outBool = this.actionSequence.get_current_step() > 0;
      }
      return outBool;
    };

    this.isBonus = false;
  }

  static bonusTurn(index, team) {
    const bonusTurn = new Turn(index, team);
    bonusTurn.isBonus = true;
    bonusTurn.name = "Bonus turn";
    bonusTurn.canEndTurn = () => true;
    bonusTurn.registerContract(Contract.bonusContract(team));
    return bonusTurn;
  }

  registerContract(contract) {
    this.contract = contract;
    this.actionSequence = new ActionSequence(contract);
    console.log("registerContract");
    console.log("contract: " + console.log(this.contract));
    console.log("this.actionSequence: " + console.log(this.actionSequence));
  }

}

// class TeamModel {
//   constructor(id, type) {
//     this.name = name;
//     this.type = type;
//   }
// }

class Contract {
  constructor(team, nb_todo) {
    this.name = "Contract";
    this.team = team;
    this.contractItems = [...Array(nb_todo).keys()].map(index => new ContractItem(team));
  }

  static bonusContract(team) {
    var bonusContract = new Contract(team,1);
    return bonusContract;
  }

}

class ContractItem {
  constructor(team) {
    this.team = team;
  }

  validateAction(action, on_valid, on_invalid, on_gameover) {

    var cellModel = action;

    if(cellModel.getType() == 3) {
      on_gameover();
    } else if(cellModel.getType() == this.team.type) {
      on_valid();
    } else {
      on_invalid();
    }

  }

}

class ActionSequence {

  constructor(contract) {
    this.contract = contract;
    this.actions = [];
  }

  get_remaining_actions_nb() {
    return this.contract.contractItems.length - this.actions.length;
  }

  get_nb_valid() {
    return this.actions.filter(action => action.valid).length;
  }

  get_nb_invalid() {
    return this.actions.filter(action => action.invalid).length;
  }

  get_nb_gameover() {
    return this.actions.filter(action => action.gameover).length;
  }

  get_current_step() {
    return this.actions.filter(act => act.valid).length;
  }

  is_completed() {
    return this.get_current_step() == this.contract.contractItems.length;
  }

  is_interrupted() {
    return this.get_nb_invalid() > 0;
  }

  is_gameover() {
    return this.get_nb_gameover() > 0;
  }

  addNewAction(cellModel, action_callback, action_sequence_callback) {
    var step = this.get_current_step();
    var contractItem = this.contract.contractItems[step];
    var action = new Action(contractItem);
    action.configureWithCellModel(cellModel);

    this.actions.push(action);
    action_callback(action);

    action_sequence_callback(this);
  }

}

class Action {
  constructor(contractItem) {
    this.contractItem = contractItem;

    this.valid    = false;
    this.invalid  = false;
    this.gameover = false;
  }

  configureWithCellModel(cellModel) {
    this.contractItem.validateAction(cellModel, () => {
      //valid
      this.valid = true;
    }, () => {
      //invalid
      this.invalid = true;
    }, () => {
      //gameover
      this.gameover = true;
    });
  }

}


/*
class GameEvent {
  constructor(name, payload) {
    this.name    = name;
    this.payload = payload;
  }
}
*/


class CnmCellModel {

  constructor(gridCellModel) {
    this.gridCellModel = gridCellModel;
    this.flipped = false;
  }

  getType() {
    return this.gridCellModel.type;
  }

  getIndex() {
    return this.gridCellModel.index;
  }

}

exports.GameModel      = GameModel;
exports.Turn           = Turn;
// exports.TeamModel      = TeamModel;
exports.Contract       = Contract;
exports.ContractItem   = ContractItem;
exports.ActionSequence = ActionSequence;
exports.Action         = Action;
exports.CnmCellModel   = CnmCellModel;
