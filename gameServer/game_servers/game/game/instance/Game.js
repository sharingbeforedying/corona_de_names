// const GameState = require('./GameState.js').GameState;
const GameState = require('./GameState.js').GameState;

const PositionGrid = require('./PositionGrid.js').PositionGrid;
const CnpGridModel = require('./codenames/cn_position_model.js').CnpGridModel;

const GameGrid     = require('./GameGrid.js').GameGrid;


const GameCreationModel = require('./codenames/cn_create_model.js').GameCreationModel;
const GameModel         = require('./codenames/cn_main_model.js').GameModel;

const InstanceTeam   = require('./InstanceTeam.js').InstanceTeam;
const InstancePlayer = require('./InstancePlayer.js').InstancePlayer;

const ActionResult = require('./ActionResult.js').ActionResult;
const ActionStep   = require('./ActionStep.js').ActionStep;

const GameTurn = require('./GameTurn.js').GameTurn;




class Game {

  constructor(config) {
    this.config = config;

    this.instanceTeamList = this.createInstanceTeamList(this.config.getOrderedTeamsIter());

    //this.activePlayerIndex = 0;

    const gameCreationModel = GameCreationModel.default(this.instanceTeamList, this.config.nb_cells);
    const gameModel = new GameModel(gameCreationModel);
    this.gameModel = gameModel;

    this.gameState = new GameState();
    this.initializeGameState(this.gameState);

    this.gameTurns = [];

    this.configureLinkFrom(gameModel);
    this.configureLinkTo(gameModel);

    this.gameModel.startGame();
  }

  configureLinkFrom(gameModel) {
    gameModel.addNewTurnEventListener(turn => {
      console.log("newTurnEventListener", turn);

      const index     = turn.index;
      const team      = turn.team;
      const teamId    = team.id;
      const tellerId  = this.getTellerForTurnIndex(team, turn.index).id;
      const guesserId = this.getGuesserForTurnIndex(team, turn.index).id;

      const gameTurn = new GameTurn(index, teamId, tellerId, guesserId, 0);

      this.gameState.turn = gameTurn;
      this.gameTurns.push(gameTurn);
    });

    gameModel.addBonusTurnEventListener(turn => {
      console.log("bonusTurnEventListener", turn);

      const index     = turn.index;
      const team      = turn.team;
      const teamId    = team.id;
      const tellerId  = null;
      const guesserId = this.getGuesserForTurnIndex(team, turn.index).id;

      const gameTurn = new GameTurn(index, teamId, tellerId, guesserId, 1);

       //lastGameTurn = this.gameTurns[this.gameTurns.length - 1];
       //gameTurn.tellerAction = lastGameTurn.tellerAction;

       this.gameState.turn = gameTurn;
       this.gameTurns.push(gameTurn);
    });

    gameModel.addGameOverEventListener((winner,loser) => {
      console.log("gameOverEventListener", winner, loser);


    });
    /*
    gameModel.addCompletedColorEventListener(team => {
      console.log("completedColorEventListener", team);
    });
    */


    gameModel.addTellerPhaseEventListener(turn => {
      console.log("tellerPhaseEventListener", turn);

      const gameStateTurn = this.gameState.turn;
      gameStateTurn.activePlayerId = gameStateTurn.tellerId;
    });

    gameModel.addGuesserPhaseEventListener(turn => {
      console.log("guesserPhaseEventListener", turn);

      const gameStateTurn = this.gameState.turn;
      gameStateTurn.activePlayerId = gameStateTurn.guesserId;
    });


    gameModel.addDidUpdateCellModelEventListener(cellModel => {
      console.log("didUpdateCellModelEventListener", cellModel);
      const cellIndex = cellModel.getIndex();
      const gameGridCell = this.gameState.game_grid.cells[cellIndex];

      // gameGridCell.type = cellModel.flipped ? 1 : 0;
      if(cellModel.flipped) {
        const positionCell = this.gameState.position_grid.cells[cellIndex];
        gameGridCell.posType = positionCell.type;

        gameGridCell.evalType = 1;
      } else {
        //gameGridCell.evalType = 0;
      }
    });
  }

  configureLinkTo(gameModel) {
    //
  }

  manageTellerAction(playerAction) {
    console.log("manageTellerAction", playerAction);

    const instanceStateTurn = this.gameState.turn;

    const number = playerAction.action.number;
    this.gameModel.manageInput_contractNumber(number, (result) => {
      console.log("manageInput_contractNumber", playerAction.action, result);
      const resultString = result ? "ok" : "nok";
      const actionResult = new ActionResult(resultString);
      instanceStateTurn.tellerStep = new ActionStep(playerAction, actionResult);
    });
  }

  manageGuesserSelection(playerAction) {
    const instanceStateTurn = this.gameState.turn;

    const cellIndex = playerAction.action.cellIndex;
    this.gameModel.manageInput_guesserCellIndex(cellIndex, (result) => {
      console.log("manageInput_guesserCellIndex", playerAction.action, result);

      const resultString = result ? "valid" : "invalid";
      const actionResult = new ActionResult(resultString);
      const guesserStep = new ActionStep(playerAction, actionResult);
      instanceStateTurn.guesserSteps.push(guesserStep);

      if(result) {
        instanceStateTurn.canEndTurn = true;
      }
    });

  }

  manageGuesserEndTurn(playerAction) {
    const instanceStateTurn = this.gameState.turn;

    if(!instanceStateTurn.canEndTurn) {
      console.log("manageGuesserEndTurn", "trying to end turn when canEndTurn == false");
      return;
    }

    this.gameModel.manageInput_guesserEndTurn((result) => {
      console.log("manageInput_guesserEndTurn", playerAction.action, result);

      const resultString = result ? "ok" : "nok";
      const actionResult = new ActionResult(resultString);
      const guesserStep = new ActionStep(playerAction, actionResult);
      instanceStateTurn.guesserSteps.push(guesserStep);
    });
  }

  createInstanceTeamList(orderedTeamsIter) {

    const teamsList = orderedTeamsIter.map(sessionTeam => {
      const tellerIds  = Object.values(sessionTeam.players).filter(sessionPlayer => sessionPlayer.role == "teller").map(sessionPlayer => sessionPlayer.id);
      const guesserIds = Object.values(sessionTeam.players).filter(sessionPlayer => sessionPlayer.role == "guesser").map(sessionPlayer => sessionPlayer.id);
      console.log("tellerIds", Array.from(tellerIds));
      console.log("guesserIds", Array.from(guesserIds));

      return new InstanceTeam(sessionTeam.id, tellerIds, guesserIds);
    });

    teamsList[0].type = 1; //RED
    teamsList[1].type = 2; //BLUE

    return teamsList;
  }

  /*
  cnPlayerForInstancePlayerTurnIndex(instancePlayerTurnIndex) {
    console.log("cnPlayerForInstancePlayerTurnIndex", instancePlayerTurnIndex);
    var instancePlayer;

    const nb_players_total = this.instanceTeamList.map(instanceTeam => instanceTeam.getNbOfPlayers()).reduce((a, b) => a + b, 0);

    const teamIndex = (instancePlayerTurnIndex / 2) % 2;
    const instanceTeam = this.instanceTeamList[teamIndex];

    //TODO: manage multiple tellers / guessers

    if(cnPlayerTurnIndex % 2 == 0) {
      instancePlayer = instanceTeam.tellers[0];
    } else {
      instancePlayer = instanceTeam.guessers[0];
    }

    return instancePlayer;
  }
  */

  getTellerForTurnIndex(team, turnIndex) {
    return team.tellers[0];
  }

  getGuesserForTurnIndex(team, turnIndex) {
    return team.guessers[0];
  }

  initializeGameState(gameState) {
    //gameState.position_grid = PositionGrid.default_grid();
    gameState.position_grid = this.positionGridForCnpGridModel(this.gameModel.gridModel);

    gameState.game_grid = this.gameGridForGameCells(this.gameModel.cellModels);


    this.instanceTeamList.forEach((instanceTeam, i) => {
      gameState.teams[instanceTeam.id] = instanceTeam;
    });
  }

  positionGridForCnpGridModel(cnpGridModel) {
    const positionGrid = new PositionGrid(cnpGridModel.nb_items);
    Object.keys(positionGrid.cells).forEach((cellIndex, i) => {
      const cellModel = cnpGridModel.cellModels[cellIndex];
      const cell = positionGrid.cells[cellIndex];
      cell.type = cellModel.type;
    });

    return positionGrid;
  }

  gameGridForGameCells(gameCellModels) {
    const gameGrid = new GameGrid(gameCellModels.length);

    // Object.keys(gameGrid.cells).forEach((cellIndex, i) => {
    //   const cellModel = gameCellModels[cellIndex];
    //   const cell = gameGrid.cells[cellIndex];
    //
    //   //do something
    // });

    return gameGrid;
  }


}

exports.Game = Game;
