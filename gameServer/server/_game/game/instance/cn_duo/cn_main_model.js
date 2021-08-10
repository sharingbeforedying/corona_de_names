const CnpGridModel = require('./cn_position_model.js').CnpGridModel;
const positionCellType = require('./PositionCellType.js').positionCellType;

const isNeutral = require('./PositionCellType.js').isNeutral;
const isRed     = require('./PositionCellType.js').isRed;
const isBlue    = require('./PositionCellType.js').isBlue;
const isBlack   = require('./PositionCellType.js').isBlack;

class GameModel {

  constructor(gameCreationModel) {
    var nb_cells      = gameCreationModel.nb_cells;
    var nb_max_turns  = gameCreationModel.nb_max_turns;
    var nb_max_errors = gameCreationModel.nb_max_errors;
    var teams         = gameCreationModel.teams;
    // var startingTeam  = gameCreationModel.startingTeam;
    console.log("nb_max_turns", nb_max_turns, typeof nb_max_turns);

    //------

    this.gridModel  = new CnpGridModel(nb_cells);
    this.cellModels = this.gridModel.cellModels.map(gridCellModel => new CnmCellModel(gridCellModel));

      //absolute
    this.cellModels     = this.gridModel.cellModels.map(gridCellModel => new CnmCellModel(gridCellModel));

      //"pov" (== relative)
    this.cellModels_red  = this.gridModel.cellModels_red.map(gridCellModel => new CnmCellModel(gridCellModel));
    this.cellModels_blue = this.gridModel.cellModels_blue.map(gridCellModel => new CnmCellModel(gridCellModel));


    this.nb_max_turns  = nb_max_turns;
    this.nb_max_errors = nb_max_errors;

    this.nb_turns  = 0;
    this.nb_errors = 0;

    this.teams = teams;
    this.playingTeams = this.teams;

    // this.activeTeamIndex = startingTeam == "red" ? 0 : 1;
    this.activeTeamIndex = 0;

    // this.scoresDict     = {"red" : 0, "blue" : 0};

    this.turnIndex = 0;
    this.currentTurn = null;

    this.newTurnEventListeners         = [];
    // this.bonusTurnEventListeners       = [];
    this.suddenDeathTurnEventListeners = [];
    this.gameOverEventListeners        = [];
    this.completedColorEventListeners  = [];

    this.tellerPhaseEventListeners            = [];
    this.guesserPhaseEventListeners           = [];
    this.everyoneIsGuesserPhaseEventListeners = [];

    this.guesserSelectionEventListeners   = [];
    // this.guesserSelectionInvalidEventListeners = [];
    // this.guesserSelectionGameoverEventListeners = [];


    this.didUpdateCellModelEventListeners = [];


    this.contractCompletedEventListeners = [];
  }

  getActiveTeam() {
    return this.playingTeams[this.activeTeamIndex];
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

  getRemainingTurns() {
    return this.nb_max_turns - this.nb_turns;
  }

  getRemainingErrors() {
    return this.nb_max_errors - this.nb_errors;
  }

  changeTeam() {
      this.activeTeamIndex = (this.activeTeamIndex + 1) % this.playingTeams.length;
  }

  // getScoreForTeam(team) {
  //   return this.scoresDict[team.name];
  // }

  getObjectiveForTeam(team) {
    return this.cellModels
            .filter(cellModel => (cellModel.gridCellModel.type == team.type || cellModel.gridCellModel.type == positionCellType.RED_RED__BLUE_BLUE))
            .length;
  }

  getRevealedForTeam(team) {
    return this.cellModels
            .filter(cellModel => (cellModel.gridCellModel.type == team.type || cellModel.gridCellModel.type == positionCellType.RED_RED__BLUE_BLUE))
            .filter(cellModel => cellModel.flipped)
            .length;
  }

  getRemainingForTeam(team) {
    return this.getObjectiveForTeam(team) - this.getRevealedForTeam(team);
  }


  getObjectiveForAll() {
    return this.cellModels
            .filter(cellModel => (cellModel.gridCellModel.type == positionCellType.RED || cellModel.gridCellModel.type == positionCellType.BLUE || cellModel.gridCellModel.type == positionCellType.RED_RED__BLUE_BLUE))
            .length;
  }

  getRevealedForAll() {
    return this.cellModels
            .filter(cellModel => (cellModel.gridCellModel.type == positionCellType.RED || cellModel.gridCellModel.type == positionCellType.BLUE || cellModel.gridCellModel.type == positionCellType.RED_RED__BLUE_BLUE))
            .filter(cellModel => cellModel.flipped)
            .length;
  }

  getRemainingForAll() {
    return this.getObjectiveForAll() - this.getRevealedForAll();
  }




  startGame() {
    // this.currentTurn = new Turn(this.getActiveTeam());
    // this.sendNewTurnEvent(this.getActiveTeam());
    this.setTurnWithTurnIndex(this.turnIndex);
  }

  endTurn() {
    this.moveToNextTurn();
  }


  moveToNextTurn() {

    this.nb_turns += 1;

    if(this.getRemainingTurns() > 0) {

      // this.changeTeam();
      // this.currentTurn = new Turn(this.getActiveTeam());
      // this.sendNewTurnEvent(this.getActiveTeam());

      this.changeTeam();
      this.turnIndex += 1;
      this.setTurnWithTurnIndex(this.turnIndex);

    } else if(this.getRemainingTurns() == 0) {
      // this.sendSuddenDeathEvent();
      // this.currentTurn = Turn.suddenDeathTurn(this.getRemainingForAll());
      // this.sendNewTurnEvent(this.getActiveTeam());

      this.turnIndex += 1;
      this.setSuddenDeathTurnWithTurnIndex(this.turnIndex);

    } else {
      const loser  = this.getActiveTeam();
      const gameoverEvent = {
        type: 3,
        loser: loser,
      };
      this.sendGameOverEvent(gameoverEvent);
    }



  }

  setTurnWithTurnIndex(turnIndex) {
    this.currentTurn = new Turn(this.turnIndex, this.getActiveTeam());

    this.sendNewTurnEvent(this.currentTurn);
    this.sendTellerPhaseEvent(this.currentTurn);
  }

  moveToSuddenDeathTurn() {
    this.turnIndex += 1;

    this.setSuddenDeathTurnWithTurnIndex(this.turnIndex);
  }

  setSuddenDeathTurnWithTurnIndex(turnIndex) {
    this.currentTurn = Turn.suddenDeathTurn(this.turnIndex, this.getRemainingForAll());

    this.sendSuddenDeathTurnEvent(this.currentTurn);
    this.sendEveryoneIsGuesserPhaseEvent(this.currentTurn);
  }





  // addOnePointToTeam(team) {
  //   this.scoresDict[team.name] += 1;
  // }

  // manageCellSelection(cellModel, callback) {
  manageCellSelection(cellIndex, player, team, selectionCallback) {
    const gameModel = this;

    function manageAction(gameCellModel, action, selectionCallback) {

      const selection = {
        gameCellModel: gameCellModel,
        action: action,
      };
      gameModel.sendGuesserSelectionEvent(player, team, selection);

      if(action.valid) {

         gameCellModel.flipped = true;
         gameModel.sendDidUpdateCellModelEvent(gameCellModel, player, team);


         // gameModel.addOnePointToTeam(gameModel.getActiveTeam());

        selectionCallback(true);
      } else if(action.invalid) {
        gameModel.manageError(gameCellModel, player, team, selectionCallback);
      } else if(action.gameover) {

         gameCellModel.flipped = true;
         gameModel.sendDidUpdateCellModelEvent(gameCellModel, player, team);

        const loser  = gameModel.getActiveTeam();
        // var winner = gameModel.getTeamForIndex(gameModel.activeTeamIndex + 1);
        const gameoverEvent = {
          type:2,
          loser: loser,
        }
        gameModel.sendGameOverEvent(gameoverEvent);

        selectionCallback(false);
      }
    }

    function manageActionSequence(actionSequence) {
      if(actionSequence.is_completed()) {
        console.log("actionSequence.is_completed()");

        gameModel.sendContractCompletedEvent(gameModel.currentTurn);

      } else
      if(actionSequence.is_interrupted()) {
        gameModel.moveToNextTurn();
      } else if(actionSequence.is_gameover()) {

      }
    }

    function manageActionSequence_bonus(actionSequence) {

      if(actionSequence.is_interrupted()) {
        gameModel.moveToNextTurn();
      } else if(actionSequence.is_gameover()) {

      }
    }

    if(!gameModel.isSuddenDeath()) {

      const gameCellModel = this.cellModels[cellIndex];

      const curActionSequence = gameModel.currentTurn.actionSequence;
      if(!curActionSequence.is_completed()) {

        const act = {
          cellModel: gameCellModel,
          team: team,
        };

        curActionSequence.addNewAction(act, action => {
          manageAction(gameCellModel, action, selectionCallback);
        }, actionSequence => {
          manageActionSequence(actionSequence);
        });

      } else {
        //bonus action

        const act = {
          cellModel: gameCellModel,
          team: team,
        };

        curActionSequence.addBonusAction(act, bonusAction => {
          manageAction(gameCellModel, bonusAction, selectionCallback);
        }, actionSequence => {
          manageActionSequence_bonus(actionSequence);
        });
      }


    } else {

      const gameCellModel = this.cellModels[cellIndex];

      // const povCellModels = (team.type == 1) ? this.cellModels_red : this.cellModels_blue;
      // const povCellModel  = povCellModels[cellIndex];

      const curActionSequence = gameModel.currentTurn.actionSequence;

      const act = {
        cellModel: gameCellModel,
        team: team,
      };

      curActionSequence.addNewAction(act, action => {
        manageAction(gameCellModel, action, selectionCallback);
      }, actionSequence => {
        manageActionSequence(actionSequence);
      });

    }




    gameModel.checkIfWinnerWrtGridState();
    gameModel.checkIfLoserWrtErrors();

    gameModel.checkIfCompletedColor();
  }

  manageError(cellModel, player, team, selectionCallback) {
    if(this.nb_errors == this.nb_max_errors) {
      this.nb_turns += 1;
    } else {
      this.nb_errors += 1;
    }

    if(cellModel.guessers.length == 0) {
      // cellModel.guessers.push(this.getActiveTeam());
      cellModel.guessers.push(team);
    } else if(cellModel.guessers.length == 1) {
      const alreadyExaminedByPlayer = cellModel.guessers[0] == team;
      if(!alreadyExaminedByPlayer) {
        cellModel.guessers.push(team);
      } else {
        //ignore
        console.log("cell already selected by player or team");
      }
    } else {
      console.log("cell already has guessers.length == 2");
    }


    if(cellModel.guessers.length == 2) {
      cellModel.flipped = true;
    }
    this.sendDidUpdateCellModelEvent(cellModel, player, team);
    /*
    if(this.nb_errors == this.nb_max_errors - 1) {

    }
    */

    selectionCallback(false);
  }

  isSuddenDeath() {
    return this.nb_turns >= this.nb_max_turns;
  }

  checkIfWinnerWrtGridState() {
    console.log("checkIfWinnerWrtGridState");

    /*
    var remaining_dict = this.teams.reduce((acc,x) => {acc[x] = this.getRemainingForTeam(x); return acc;} ,{});
    Array.from(Object.keys(remaining_dict)).forEach((item, i) => {
      console.log(item);
    });
    */
    var remaining_array = this.teams.map(team => this.getRemainingForAll());

    var winnerIndex = remaining_array.indexOf(0);
    if(winnerIndex != -1) {
      var winner = this.teams[winnerIndex];
      const gameoverEvent = {
        type: 1,
        winner: winner,
      };
      this.sendGameOverEvent(gameoverEvent);
    }
  }


  checkIfLoserWrtErrors() {
    console.log("checkIfLoserWrtErrors");
    if(this.getRemainingErrors() < 0) {
      console.log("this.getRemainingErrors() < 0");
      const loser = this.getActiveTeam();
      const gameoverEvent = {
        type: 4,
        loser: loser,
      };
      this.sendGameOverEvent(gameoverEvent);
    }
  }


  checkIfCompletedColor() {
    console.log("checkIfCompletedColor");
    console.log(this.playingTeams.map((team,index) => {return {index: index, rem: this.getRemainingForTeam(team), team: team};}));
    var completeColorTeamObjs = this.playingTeams
                                       .map((team,index) => {return {index: index, rem: this.getRemainingForTeam(team), team: team};})
                                       .filter(obj => obj.rem == 0);
    completeColorTeamObjs.forEach(obj => {
      this.sendCompletedColorEvent(obj.team);
    });
    var forDeletion = completeColorTeamObjs.map(obj => obj.team);
    this.playingTeams = this.playingTeams.filter(team => !forDeletion.includes(team));
  }




  addNewTurnEventListener(callback) {
    this.newTurnEventListeners.push(callback);
  }

  sendNewTurnEvent(team) {
    this.newTurnEventListeners.forEach((listener, i) => {
      listener(team);
    });
  }


  addSuddenDeathTurnEventListener(callback) {
    this.suddenDeathTurnEventListeners.push(callback);
  }

  sendSuddenDeathTurnEvent(turn) {
    this.suddenDeathTurnEventListeners.forEach((listener, i) => {
      listener(turn);
    });
  }



  addGameOverEventListener(callback) {
    this.gameOverEventListeners.push(callback);
  }

  sendGameOverEvent(gameoverEvent) {
    this.gameOverEventListeners.forEach((listener, i) => {
      listener(gameoverEvent);
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

  addEveryoneIsGuesserPhaseEventListener(callback) {
    this.everyoneIsGuesserPhaseEventListeners.push(callback);
  }

  sendEveryoneIsGuesserPhaseEvent(turn) {
    this.everyoneIsGuesserPhaseEventListeners.forEach((listener, i) => {
      listener(turn);
    });
  }



  addGuesserSelectionEventListener(callback) {
    this.guesserSelectionEventListeners.push(callback);
  }

  sendGuesserSelectionEvent(player, team, selection) {
    this.guesserSelectionEventListeners.forEach((listener, i) => {
      listener(player, team, selection);
    });
  }





  addDidUpdateCellModelEventListener(callback) {
      this.didUpdateCellModelEventListeners.push(callback);
  }

  sendDidUpdateCellModelEvent(cellModel, player, team) {
    this.didUpdateCellModelEventListeners.forEach((listener, i) => {
      listener(cellModel, player, team);
    });
  }


  addContractCompletedEventListener(callback) {
    this.contractCompletedEventListeners.push(callback);
  }

  sendContractCompletedEvent(turn) {
    this.contractCompletedEventListeners.forEach((listener, i) => {
      listener(turn);
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

  manageInput_guesserCellIndex(cellIndex, player, team, callback) {
    this.manageCellSelection(cellIndex, player, team, callback);
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

    this.contract       = null;
    this.actionSequence = null;

    this.canEndTurn = function() {
      var outBool = false;
      if(this.actionSequence) {
        outBool = this.actionSequence.get_current_step() > 0;
      }
      return outBool;
    };

    // this.isBonus = false;
  }

  // static bonusTurn(team) {
  //   var bonusTurn = new Turn(team);
  //   bonusTurn.isBonus = true;
  //   bonusTurn.name = "Bonus turn";
  //   bonusTurn.canEndTurn = () => true;
  //   bonusTurn.registerContract(Contract.bonusContract(team));
  //   return bonusTurn;
  // }

  static suddenDeathTurn(index, count) {
    var suddenDeathTurn = new Turn(index, null);
    suddenDeathTurn.name = "sudden death turn";
    suddenDeathTurn.canEndTurn = () => false;
    var suddenDeathContract = Contract.suddenDeathContract(count);
    suddenDeathTurn.registerContract(suddenDeathContract);
    return suddenDeathTurn;
  }

  registerContract(contract) {
    this.contract = contract;
    this.actionSequence = new ActionSequence(contract);
    console.log("registerContract");
    console.log("contract: " + this.contract);
    console.log("this.actionSequence: " + this.actionSequence);

  }

}

// class TeamModel {
//   constructor(name, color, type) {
//     this.name = name;
//     this.color = color;
//     this.type = type;
//
//     this.isStartingTeam = false;
//   }
// }

class Contract {
  constructor(team, nb_todo) {
    this.name = "Contract";
    this.team = team;
    this.contractItems = [...Array(nb_todo).keys()].map(index => ContractItem.std_contract_item(team));
  }

  // static bonusContract(team) {
  //   var bonusContract = new Contract(team,1);
  //   return bonusContract;
  // }

  static suddenDeathContract(count) {
    var suddenDeathContract = new Contract(null,0);
    suddenDeathContract.contractItems = [...Array(count).keys()].map(x => ContractItem.sudden_death_contract_item());
    return suddenDeathContract;
  }

}

class ContractItem {
  constructor(team,validateAction) {
    this.team           = team;
    this.validateAction = validateAction;
  }

  static std_contract_item(team) {
    return new ContractItem(team, (act, on_valid, on_invalid, on_gameover) => {
      console.log("std_contract_item", "validateAction", act);

      const cellModel = act.cellModel;
      const actTeam   = act.team;
      console.log("cellModel:", cellModel);
      console.log("actTeam:", actTeam);

      if(actTeam != team) {
        throw new Error("actTeam != team");
      }

      //red guesser  has to find red  teller cells
      //blue guesser has to find blue teller cells

      if(team.type == 1) {

        const cellModelType = cellModel.getType();

        if(isBlack(cellModelType)) {
          on_gameover();
        } else if(isRed(cellModelType)) {
          on_valid();
        } else if(isBlue(cellModelType) || isNeutral(cellModelType)) {
          on_invalid();
        } else {
          throw new Error("cellModelType cannot be mapped to a color", cellModelType);
        }

      } else if(team.type == 2) {

        const cellModelType = cellModel.getType();

        if(isBlack(cellModelType)) {
          on_gameover();
        } else if(isBlue(cellModelType)) {
          on_valid();
        } else if(isRed(cellModelType) || isNeutral(cellModelType)) {
          on_invalid();
        } else {
          throw new Error("cellModelType cannot be mapped to a color", cellModelType);
        }

      } else {
        throw new Error("unknown team type", team.type);
      }


    });
  }

  static sudden_death_contract_item() {
    return new ContractItem(null, (act, on_valid, on_invalid, on_gameover) => {
      console.log("sudden_death_contract_item", "validateAction", act);

      const cellModel = act.cellModel;
      const actTeam   = act.team;
      console.log("cellModel:", cellModel);
      console.log("actTeam:", actTeam);

      const cellModelType = cellModel.getType();

      //red guesser  has to find red  teller cells
      //blue guesser has to find blue teller cells

      if(actTeam.type == 1) {

        const cellModelType = cellModel.getType();

        if(isBlack(cellModelType)) {
          on_gameover();
        } else if(isRed(cellModelType)) {
          on_valid();
        } else if(isBlue(cellModelType) || isNeutral(cellModelType)) {
          on_invalid();
        } else {
          throw new Error("cellModelType cannot be mapped to a color", cellModelType);
        }

      } else if(actTeam.type == 2) {

        const cellModelType = cellModel.getType();

        if(isBlack(cellModelType)) {
          on_gameover();
        } else if(isBlue(cellModelType)) {
          on_valid();
        } else if(isRed(cellModelType) || isNeutral(cellModelType)) {
          on_invalid();
        } else {
          throw new Error("cellModelType cannot be mapped to a color", cellModelType);
        }

      } else {
        throw new Error("unknown team type", team.type);
      }

      // if(isBlack(cellModelType) || isNeutral(cellModelType)) {
      //   on_gameover();
      // } else if(isRed(cellModelType) || isBlue(cellModelType)) {
      //   on_valid();
      // } else {
      //   throw new Error("cellModelType cannot be mapped to a color", cellModelType);
      // }

    });
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
    return this.actions.filter(action => action.valid).length;
  }

  is_completed() {
    return this.get_current_step() >= this.contract.contractItems.length;
  }

  is_interrupted() {
    return this.get_nb_invalid() > 0;
  }

  is_gameover() {
    return this.get_nb_gameover() > 0;
  }

  addNewAction(act, action_callback, action_sequence_callback) {
    var step = this.get_current_step();
    var contractItem = this.contract.contractItems[step];

    var action = new Action(contractItem);
    action.configureWithAct(act);


    this.actions.push(action);
    action_callback(action);

    action_sequence_callback(this);
  }

  addBonusAction(act, action_callback, action_sequence_callback) {
    var step = this.get_current_step();

    // const contractItem = this.contract.contractItems[step];
    //contractItem could potentially be anything
    //to keep it simple, let's just reuse last contract item
    const contractItem = this.contract.contractItems[this.contract.contractItems.length - 1];

    var action = new Action(contractItem);
    action.configureWithAct(act);


    this.actions.push(action);
    action_callback(action);

    action_sequence_callback(this);
  }

}

class Action {
  constructor(contractItem, team) {
    this.contractItem = contractItem;

    this.act      = null;

    this.valid    = false;
    this.invalid  = false;
    this.gameover = false;
  }

  configureWithAct(act) {
    this.act = act;

    this.contractItem.validateAction(act, () => {
      console.log("action.onValid");
      //valid
      this.valid = true;
    }, () => {
      console.log("action.onInvalid");
      //invalid
      this.invalid = true;
    }, () => {
      console.log("action.onGameover");
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

  //name = "";
  //type = 0;

  constructor(gridCellModel) {
    this.gridCellModel = gridCellModel;
    this.flipped = false;
    this.guessers = [];
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
