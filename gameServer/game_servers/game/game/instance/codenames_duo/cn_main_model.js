


class GameModel {

  constructor(gameCreationModel) {
    var nb_cells      = gameCreationModel.nb_cells;
    var nb_max_turns  = gameCreationModel.nb_max_turns;
    var nb_max_errors = gameCreationModel.nb_max_errors;
    var teams         = gameCreationModel.teams;
    var startingTeam  = gameCreationModel.startingTeam;
    console.log("nb_max_turns", nb_max_turns, typeof nb_max_turns);
    //------

    this.gridModel  = new CnpGridModel(nb_cells);
    this.cellModels = this.gridModel.cellModels.map(gridCellModel => new CnmCellModel(gridCellModel));

    this.nb_max_turns  = nb_max_turns;
    this.nb_max_errors = nb_max_errors;

    this.nb_turns  = 0;
    this.nb_errors = 0;

    this.teams = teams;
    this.playingTeams = this.teams;

    this.activeTeamIndex = startingTeam == "red" ? 0 : 1;

    // this.scoresDict     = {"red" : 0, "blue" : 0};

    this.currentTurn = null;

    this.newTurnEventListeners        = [];
    this.bonusTurnEventListeners      = [];
    this.suddenDeathEventListeners    = [];
    this.gameOverEventListeners       = [];
    this.completedColorEventListeners = [];

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
            .filter(cellModel => (cellModel.gridCellModel.type == team.type || cellModel.gridCellModel.type == 4))
            .length;
  }

  getRevealedForTeam(team) {
    return this.cellModels
            .filter(cellModel => (cellModel.gridCellModel.type == team.type || cellModel.gridCellModel.type == 4))
            .filter(cellModel => cellModel.flipped)
            .length;
  }

  getRemainingForTeam(team) {
    return this.getObjectiveForTeam(team) - this.getRevealedForTeam(team);
  }


  getObjectiveForAll() {
    return this.cellModels
            .filter(cellModel => (cellModel.gridCellModel.type == 1 || cellModel.gridCellModel.type == 2 || cellModel.gridCellModel.type == 4))
            .length;
  }

  getRevealedForAll() {
    return this.cellModels
            .filter(cellModel => (cellModel.gridCellModel.type == 1 || cellModel.gridCellModel.type == 2 || cellModel.gridCellModel.type == 4))
            .filter(cellModel => cellModel.flipped)
            .length;
  }

  getRemainingForAll() {
    return this.getObjectiveForAll() - this.getRevealedForAll();
  }




  startGame() {
    this.currentTurn = new Turn(this.getActiveTeam());
    this.sendNewTurnEvent(this.getActiveTeam());
  }

  moveToNextTurn() {
    this.nb_turns += 1;

    if(this.getRemainingTurns() > 0) {
      this.changeTeam();
      this.currentTurn = new Turn(this.getActiveTeam());
      this.sendNewTurnEvent(this.getActiveTeam());
    } else if(this.getRemainingTurns() == 0) {
      this.sendSuddenDeathEvent();
      this.currentTurn = Turn.suddenDeathTurn(this.getRemainingForAll());
      this.sendNewTurnEvent(this.getActiveTeam());
    } else {
      var loser  = this.getActiveTeam();
      this.sendGameOver(null,loser);
    }

  }

  endTurn() {
    this.moveToNextTurn();
  }

  // addOnePointToTeam(team) {
  //   this.scoresDict[team.name] += 1;
  // }

  manageCellSelection(cellModel, callback) {
    var curActionSequence = this.currentTurn.actionSequence;
    curActionSequence.addNewAction(cellModel, action => {
      //manage action
      if(action.valid) {
        // this.addOnePointToTeam(this.getActiveTeam());
        cellModel.flipped = true;
        callback(cellModel);
      } else if(action.invalid) {
        this.manageError(cellModel, callback);
      } else if(action.gameover) {
        cellModel.flipped = true;
        callback(cellModel);

        var loser  = this.getActiveTeam();
        this.sendGameOver(null,loser);
      }
    }, actionSequence => {
      //manage action sequence
      if(actionSequence.is_completed()) {
        console.log("actionSequence.is_completed()");
        //
        // if(!this.currentTurn.isBonus) {
          this.currentTurn = Turn.bonusTurn(this.getActiveTeam());
          this.sendBonusTurnEvent(this.getActiveTeam());
        // } else {
        //   this.moveToNextTurn();
        // }
      } else if(actionSequence.is_interrupted()) {
        this.moveToNextTurn();
      } else if(actionSequence.is_gameover()) {

      }

    });

    this.checkIfWinnerWrtGridState();
    this.checkIfLoserWrtErrors();

    this.checkIfCompletedColor();
  }

  manageError(cellModel, callback) {
    if(this.nb_errors == this.nb_max_errors) {
      this.nb_turns += 1;
    } else {
      this.nb_errors += 1;
    }

    //cellModel.guessers.push(this.getActiveTeam());
    cellModel.guessers.push(this.getInactiveTeam());

    if(cellModel.guessers.length == 2) {
      cellModel.flipped = true;
    }
    /*
    if(this.nb_errors == this.nb_max_errors - 1) {

    }
    */

    callback(cellModel);
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
      this.sendGameOver(winner,null);
    }
  }


  checkIfLoserWrtErrors() {
    console.log("checkIfLoserWrtErrors");
    if(this.getRemainingErrors() < 0) {
      console.log("this.getRemainingErrors() < 0");
      var loser = this.getActiveTeam();
      this.sendGameOver(null,loser);
    }
  }


  checkIfCompletedColor() {
    console.log("checkIfCompletedColor");
    console.log(this.playingTeams.map((team,index) => {return {index: index, rem: this.getRemainingForTeam(team), team: team};}));
    var completeColorTeamObjs = this.playingTeams
                                       .map((team,index) => {return {index: index, rem: this.getRemainingForTeam(team), team: team};})
                                       .filter(obj => obj.rem == 0);
    completeColorTeamObjs.forEach(obj => {
      this.sendCompletedColor(obj.team);
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

  addBonusTurnEventListener(callback) {
    this.bonusTurnEventListeners.push(callback);
  }

  sendBonusTurnEvent(team) {
    this.bonusTurnEventListeners.forEach((listener, i) => {
      listener(team);
    });
  }

  addSuddenDeathEventListener(callback) {
    this.suddenDeathEventListeners.push(callback);
  }

  sendSuddenDeathEvent() {
    this.suddenDeathEventListeners.forEach((listener, i) => {
      listener();
    });
  }

  addGameOverEventListener(callback) {
    this.gameOverEventListeners.push(callback);
  }

  sendGameOver(winner,loser) {
    this.gameOverEventListeners.forEach((listener, i) => {
      listener(winner, loser);
    });
  }

  addCompletedColorEventListener(callback) {
    this.completedColorEventListeners.push(callback);
  }

  sendCompletedColor(team) {
    this.completedColorEventListeners.forEach((listener, i) => {
      listener(team);
    });
  }

}

class Turn {

  contract       = null;
  actionSequence = null;

  constructor(team) {
    this.name = "Turn";
    this.team = team;

    this.canEndTurn = function() {
      var outBool = false;
      if(this.actionSequence) {
        outBool = this.actionSequence.get_current_step() > 0;
      }
      return outBool;
    };

    this.isBonus = false;
  }

  static bonusTurn(team) {
    var bonusTurn = new Turn(team);
    bonusTurn.isBonus = true;
    bonusTurn.name = "Bonus turn";
    bonusTurn.canEndTurn = () => true;
    bonusTurn.registerContract(Contract.bonusContract(team));
    return bonusTurn;
  }

  static suddenDeathTurn(count) {
    var suddenDeathTurn = new Turn(null);
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
    console.log("contract: " + console.log(this.contract));
    console.log("this.actionSequence: " + console.log(this.actionSequence));

  }

  endTurn() {
    this.changeTeam();
  }

}

class TeamModel {
  constructor(name, color, type) {
    this.name = name;
    this.color = color;
    this.type = type;

    this.isStartingTeam = false;
  }
}

class Contract {
  constructor(team, nb_todo) {
    this.name = "Contract";
    this.team = team;
    this.contractItems = [...Array(nb_todo).keys()].map(index => ContractItem.std_contract_item(team));
  }

  static bonusContract(team) {
    var bonusContract = new Contract(team,1);
    return bonusContract;
  }

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
    return new ContractItem(team, (action, on_valid, on_invalid, on_gameover) => {

      var cellModel = action.gridCellModel;

      console.log("cellModel:", cellModel);
      console.log("this:",this);
      console.log("this.team:", this.team);

      // if(this.team.type == 1) {
      if(team.type == 1) {

        if(cellModel.type == 3 || cellModel.type == 5 || cellModel.type == 6 || cellModel.type == 7 || cellModel.type == 8) {
          on_gameover();
        } else if(cellModel.type == 1 || cellModel.type == 4) {
          on_valid();
        } else if(cellModel.type == 2 || cellModel.type == 0) {
          on_invalid();
        } else {
          console.log("??? ??? ???");
        }

      // } else if(this.team.type == 2) {
      } else if(team.type == 2) {


        if(cellModel.type == 3 || cellModel.type == 5 || cellModel.type == 6 || cellModel.type == 7 || cellModel.type == 8) {
          on_gameover();
        } else if(cellModel.type == 2 || cellModel.type == 4) {
          on_valid();
        } else if(cellModel.type == 1 || cellModel.type == 0) {
          on_invalid();
        } else {
          console.log("??? ??? ???");
        }

      } else {
        console.log("???????");
      }
    });
  }

  static sudden_death_contract_item() {
    return new ContractItem(null, (action, on_valid, on_invalid, on_gameover) => {

      var cellModel = action.gridCellModel;

      console.log("cellModel:", cellModel);

      if(cellModel.type == 0 || cellModel.type == 3 || cellModel.type == 5 || cellModel.type == 6 || cellModel.type == 7 || cellModel.type == 8) {
        on_gameover();
      } else if(cellModel.type == 1 || cellModel.type == 2 || cellModel.type == 4) {
        on_valid();
      } else {
        console.log("??? ??? ???");
      }

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
