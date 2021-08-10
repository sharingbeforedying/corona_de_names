
const PositionGrid     = require('../PositionGrid.js').PositionGrid;

const GameGrid            = require('../GameGrid.js').GameGrid;
const gameCellEvalType    = require('../GameGrid.js').gameCellEvalType;
const GameCellExamination = require('../GameGrid.js').GameCellExamination;


const InstanceTeam   = require('../InstanceTeam.js').InstanceTeam;
const InstancePlayer = require('../InstancePlayer.js').InstancePlayer;

const ActionResult = require('../ActionResult.js').ActionResult;
const ActionStep   = require('../ActionStep.js').ActionStep;

const GameTurn = require('../GameTurn.js').GameTurn;


const Gemini_Schema  = require("../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

const Rx = require('rxjs');


const CnpGridModel      = require('./cn_position_model.js').CnpGridModel;
const GameCreationModel = require('./cn_create_model.js').GameCreationModel;
const GameModel         = require('./cn_main_model.js').GameModel;
const positionCellType  = require('./PositionCellType.js').positionCellType;

const GameState           = require('./GameState.js').GameState;
const SuddenDeathGameTurn = require('./SuddenDeathGameTurn.js').SuddenDeathGameTurn;

class Game {

  constructor(/*config,*/teamsConfigWrapper, nb_cells = 25) {
    // this.config = config;
    // this.instanceTeamList = this.createInstanceTeamList(this.config.getOrderedTeamsIter());

    this.instanceTeamList = this.createInstanceTeamList(teamsConfigWrapper.getOrderedTeamsIter());

    //this.activePlayerIndex = 0;

    const gameCreationModel = GameCreationModel.default(this.instanceTeamList, nb_cells);
    const gameModel = new GameModel(gameCreationModel);
    this.gameModel = gameModel;

    const gameState = new GameState();
    this.gameState = Gemini_Schema.createSource(gameState);
    this.initializeGameState(this.gameState);

    this.gameTurns = [];



    this.rx_newTurn             = new Rx.Subject();
    this.rx_suddenDeathTurn     = new Rx.Subject();

    this.rx_gameOver            = new Rx.Subject();
    this.rx_completedColor      = new Rx.Subject();

    this.rx_tellerPhase            = new Rx.ReplaySubject(1);
    this.rx_guesserPhase           = new Rx.Subject();
    this.rx_everyoneIsGuesserPhase = new Rx.Subject();


    this.rx_didUpdateCellModel  = new Rx.Subject();
    this.rx_selection_valid     = new Rx.Subject();


    this.rx_contractCompleted   = new Rx.Subject();


    this.configureLinkFrom(gameModel);
    this.configureLinkTo(gameModel);




    // this.gameModel.startGame();
  }

  configureLinkFrom(gameModel) {

    const gameState = this.gameState;

    function updateGameInfo() {
      //update gameState.gameInfo
      gameState.gameInfo.remainingTurns  = gameModel.getRemainingTurns();
      gameState.gameInfo.remainingErrors = gameModel.getRemainingErrors();

      gameState.gameInfo.remainingCells  = gameModel.getRemainingForAll();
    }

    gameModel.addNewTurnEventListener(turn => {
      console.log("newTurnEventListener", turn);

      //update gameState
      const index     = turn.index;
      const team      = turn.team;
      const teamId    = team.id;
      const tellerId  = this.getTellerForTurnIndex(team, turn.index).id;
      const guesserId = this.getGuesserForTurnIndex(team, turn.index).id;

      const gameTurn = new GameTurn(index, teamId, tellerId, guesserId, 0);

      this.gameState.turn = gameTurn;
      this.gameTurns.push(gameTurn);

      this.rx_newTurn.next(gameTurn);

      updateGameInfo();
    });

    gameModel.addSuddenDeathTurnEventListener(turn => {
      console.log("suddenDeathTurnEventListener", turn);

      //update gameState
      const index = turn.index;

      const suddenDeathTurn = new SuddenDeathGameTurn(index);

       this.gameState.suddenDeathTurn = suddenDeathTurn;
       this.gameTurns.push(suddenDeathTurn);

       this.gameState.gameInfo.remainingTurns  = 0;
       this.gameState.gameInfo.remainingErrors = 0;
       gameState.gameInfo.remainingCells       = gameModel.getRemainingForAll();

       this.gameState.gameInfo.isSuddenDeath = true;

       this.rx_suddenDeathTurn.next(suddenDeathTurn);
    });

    gameModel.addGameOverEventListener((gameoverEvent) => {
      console.log("gameOverEventListener", gameoverEvent);

      this.rx_gameOver.next(gameoverEvent);
      this.gameState.gameInfo.gameOver = "GAME OVER";

    });


    gameModel.addCompletedColorEventListener(team => {
      console.log("completedColorEventListener", team);

      const cellIndexes = gameModel.cellModels
                                   .filter(cellModel => {
                                      return cellModel.getType() == team.type ||
                                             cellModel.getType() == positionCellType.RED_RED__BLUE_BLUE;
                                   })
                                   .map(cellModel => cellModel.getIndex());

      const gameGridCells = this.gameState.game_grid.cells;
      const gameGridCells_completed = cellIndexes.map(cellIndex => gameGridCells[cellIndex]);

      const color_gold = "#FFD700";
      gameGridCells_completed.forEach((gameGridCell, i) => {
        gameGridCell.color = color_gold;
      });

    });



    gameModel.addTellerPhaseEventListener(turn => {
      console.log("tellerPhaseEventListener", turn);

      //update gameState
      const gameStateTurn = this.gameState.turn;
      gameStateTurn.activePlayerId = gameStateTurn.tellerId;

      {
        var outString = "";

        const playerId = gameStateTurn.tellerId;

        const teller_red  = this.instanceTeamList[0].tellers[0];
        const teller_blue = this.instanceTeamList[1].tellers[0];
        if(playerId == teller_red.id) {
          outString = "P1 (TELLER1)";
        } else if(playerId == teller_blue.id) {
          outString = "P2 (TELLER2)";
        } else {
          outString = "???";
        }

        gameStateTurn.activePlayerString = outString;
      }

      // this.rx_tellerPhase.next(gameStateTurn.tellerId);
      this.rx_tellerPhase.next(gameStateTurn);

    });

    gameModel.addGuesserPhaseEventListener(turn => {
      console.log("guesserPhaseEventListener", turn);

      //update gameState
      const gameStateTurn = this.gameState.turn;
      gameStateTurn.activePlayerId = gameStateTurn.guesserId;


      {
        var outString = "";

        const playerId = gameStateTurn.guesserId;

        const guesser_red  = this.instanceTeamList[0].guessers[0];
        const guesser_blue = this.instanceTeamList[1].guessers[0];
        if(playerId == guesser_red.id) {
          outString = "P2 (GUESSER1)";
        } else if(playerId == guesser_blue.id) {
          outString = "P1 (GUESSER2)";
        } else {
          outString = "???";
        }

        gameStateTurn.activePlayerString = outString;
      }


      // this.rx_guesserPhase.next(gameStateTurn.guesserId);
      this.rx_guesserPhase.next(gameStateTurn);

    });

    gameModel.addEveryoneIsGuesserPhaseEventListener(turn => {
      console.log("everyoneIsGuesserPhaseEventListener", turn);

      //update gameState
      const gameStateTurn = this.gameState.suddenDeathTurn;

      const guessersMap   = this.getAllGuessersMap();
      const guesserIdsMap = Object.keys(guessersMap).reduce((acc, guesserId) => {
        const miniDict = {[guesserId]: true};
        return Object.assign(acc, miniDict);
      }, {});
      gameStateTurn.activePlayerIds = guesserIdsMap;

      this.rx_everyoneIsGuesserPhase.next(gameStateTurn);

    });

    gameModel.addGuesserSelectionEventListener((player, team, selection) => {
      const gameCellModel = selection.gameCellModel;
      const action        = selection.action;

      if(action.valid) {
        const cellIndex = gameCellModel.getIndex();
        this.rx_selection_valid.next(cellIndex);
      }

    });


    gameModel.addDidUpdateCellModelEventListener((cellModel, player, team) => {
      console.log("didUpdateCellModelEventListener"/*, cellModel, player, team*/);

      //update gameState
      const cellIndex = cellModel.getIndex();
      const gameGridCell = this.gameState.game_grid.cells[cellIndex];

      // gameGridCell.type = cellModel.flipped ? 1 : 0;
      if(cellModel.flipped) {
        const positionCell   = this.gameState.position_grid__goal.cells[cellIndex];
        gameGridCell.posType = positionCell.type;
        gameGridCell.color   = this.colorForPositionType(gameGridCell.posType);

        gameGridCell.evalType = gameCellEvalType.CHARACTERIZED;

      } else {
        gameGridCell.evalType = gameCellEvalType.EXAMINED;

        //guessers stuff
        const guessers = cellModel.guessers;
        if(guessers.length == 1) {

          const guesserTeam = guessers[0];
          // const guesserTeam = team;
          console.log("guesserTeam", JSON.stringify(guesserTeam));
          gameGridCell.color = guesserTeam.color;


          //examination
          const turnIndex = this.gameState.turn.index;

          // var examiner = null;
          // if(guesserTeam == this.instanceTeamList[0]) {
          //   examiner = "P2";
          // }
          // if(guesserTeam == this.instanceTeamList[1]) {
          //   examiner = "P1";
          // }

          var examiner = null;
          const guesser_red  = this.instanceTeamList[0].guessers[0];
          const guesser_blue = this.instanceTeamList[1].guessers[0];
          if(player == guesser_red) {
            examiner = "P2";
          } else if(player == guesser_blue) {
            examiner = "P1";
          } else {
            examiner = "???";
          }

          // const playerId = guesserTeam.guessers[0].id;
          const playerId = player.id;

          const gameCellExamination = new GameCellExamination(turnIndex, examiner, playerId);
          gameGridCell.examinations.push(gameCellExamination);
          console.log("gameGridCell", JSON.stringify(gameGridCell));
          // gameGridCell.examinations["0"] = gameCellExamination;
          // console.log("gameGridCell", JSON.stringify(gameGridCell));

          //trigger a set<x>
          const examinations = gameGridCell.examinations;
          gameGridCell.examinations = examinations;

          //trigger a change
          // gameGridCell.examinations[0].examiner = "test123";

        } else {
          throw new Error("cellModel.flipped == false, guessers.length != 1");
        }


      }


      //debug
      if(!this.gameState.game_grid.name) {
        this.gameState.game_grid.name = "grid_name";
      }
      this.gameState.game_grid.name += "_" + cellIndex;

      // this.rx_didUpdateCellModel.next({
      //   cellIndex: cellIndex,
      //   gameGridCell: gameGridCell,
      // });

      updateGameInfo();
    });


    gameModel.addContractCompletedEventListener(turn => {
      console.log("contractCompletedEventListener", turn);

      //update gameState
      const gameStateTurn = this.gameState.turn;
      gameStateTurn.contractCompleted = true;

      this.rx_contractCompleted.next(gameStateTurn);
    });

    // gameModel.addGameInfoDidChangeEventListener(gameModel => {
    //   console.log("gameInfoDidChangeEventListener", gameModel);
    //
    //   //update gameState.gameInfo
    //   gameState.gameInfo.remainingTurns  = gameModel.getRemainingTurns();
    //   gameState.gameInfo.remainingErrors = gameModel.getRemainingErrors();
    //
    //   gameState.gameInfo.remainingCells  = gameModel.getRemainingForAll();
    //
    // });

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

    const guesserId = playerAction.playerId;
    const richTeamPlayersMap = this.getRichTeamPlayersMap();

    const richPlayer = richTeamPlayersMap[guesserId];

    const player     = richPlayer.player;
    const team       = richPlayer.team;

    const cellIndex = playerAction.action.cellIndex;
    this.gameModel.manageInput_guesserCellIndex(cellIndex, player, team, (result) => {
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
      const tellerIds  = Object.values(sessionTeam.players).filter(sessionPlayer => sessionPlayer.role.name == "Teller").map(sessionPlayer => sessionPlayer.id);
      const guesserIds = Object.values(sessionTeam.players).filter(sessionPlayer => sessionPlayer.role.name == "Guesser").map(sessionPlayer => sessionPlayer.id);
      console.log("tellerIds", Array.from(tellerIds));
      console.log("guesserIds", Array.from(guesserIds));

      return new InstanceTeam(sessionTeam.id, sessionTeam.color, tellerIds, guesserIds);
    });

    teamsList[0].type = 1; //RED
    teamsList[1].type = 2; //BLUE

    return teamsList;
  }

  getRichTeamPlayersMap() {
    const richTeamPlayersMap = this.instanceTeamList.reduce((acc, team) => {
      const richPlayersMap = Object.entries(team.players).reduce((acc2, [playerId, player]) => {

        const miniDict = {
          [playerId]: {
            player: player,
            team:   team,
          },
        };
        return Object.assign(acc2, miniDict);

      }, {});
      return Object.assign(acc, richPlayersMap);
    }, {});
    return richTeamPlayersMap;
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

  getAllGuessersMap() {
    return this.instanceTeamList.reduce((acc, team) => {
      const guesser = team.guessers[0];
      const guesserMiniDict = {
        [guesser.id]: guesser,
      };
      return Object.assign(acc, guesserMiniDict);
    }, {});
  }

  initializeGameState(gameState) {
    //gameState.position_grid = PositionGrid.default_grid();
    gameState.position_grid__origin = this.positionGridForCnpGridModel(this.gameModel.gridModel, -2);

    gameState.position_grid__goal = this.positionGridForCnpGridModel(this.gameModel.gridModel, -1);

    gameState.position_grid__red  = this.positionGridForCnpGridModel(this.gameModel.gridModel, 0);
    gameState.position_grid__blue = this.positionGridForCnpGridModel(this.gameModel.gridModel, 1);


    const gameGrid = this.gameGridForGameCells(this.gameModel.cellModels);
    //TODO: do this elsewhere (keep game clean?)
    // const gameGrid_source = Gemini_Schema.createSource(gameGrid);
    // gameState.game_grid = gameGrid_source;
    gameState.game_grid = gameGrid;

    this.instanceTeamList.forEach((instanceTeam, i) => {
      gameState.teams[instanceTeam.id] = instanceTeam;
    });
  }

  colorForPositionType_debug(posType) {
    var color = null;

    const teamsList = this.instanceTeamList;

    switch(posType) {
      // case positionCellType.UNKNOWN:
      case positionCellType.UNINITIALIZED:
        color = "#DDDDDD";
        break;

      case positionCellType.NEUTRAL:
        color = "#FFFFFF";
        break;

      case positionCellType.RED:
        {
          const team = teamsList[0];
          color = team.color;
        }
        break;
      case positionCellType.BLUE:
        {
          const team = teamsList[1];
          color = team.color;
        }
        break;

      case positionCellType.BLACK:
        color = "#000000";
        break;

      case positionCellType.RED_RED__BLUE_BLUE:
        color = "#8A2BE2";
        break;

      default:
        console.log("unknown posType", posType);
        color = "#DA6335";
        break;
    }

    console.log("colorForPositionType", posType, color);

    return color;
  }

  colorForPositionType_origin(posType) {
    var color = null;

    const teamsList = this.instanceTeamList;

    const t = positionCellType;

    switch(posType) {
      // case positionCellType.UNKNOWN:
      case t.UNINITIALIZED:
      color = "#DDDDDD";
      break;

      case t.NEUTRAL:
      color = "#FFFFFF";
      break;
      case t.RED:
      {
      const team = teamsList[0];
      color = team.color;
      }
      break;
      case t.BLUE:
      {
      const team = teamsList[1];
      color = team.color;
      }
      break;
      case t.BLACK:
      color = "#000000";
      break;

      case t.RED_RED__BLUE_BLUE:
      color = "#8A2BE2";
      break;

      case t.RED_RED__BLUE_NEUTRAL:
      color = "#FFFFFF";
      break;
      case t.RED_BLACK__BLUE_BLUE:
      color = "#000000";
      break;
      case t.RED_BLACK__BLUE_NEUTRAL:
      color = "#000000";
      break;

      case t.BLUE_BLUE__RED_NEUTRAL:
      color = "#FFFFFF";
      break;
      case t.BLUE_BLACK__RED_RED:
      color = "#000000";
      break;
      case t.BLUE_BLACK__RED_NEUTRAL:
      color = "#000000";
      break;

      default:
      console.log("unknown posType", posType);
      color = "#DA6335";
      break;
    }

    console.log("colorForPositionType", posType, color);

    return color;
  }

  colorForPositionType(posType) {
    var color = null;

    const teamsList = this.instanceTeamList;

    switch(posType) {
      // case positionCellType.UNKNOWN:
      case positionCellType.UNINITIALIZED:
        color = "#DDDDDD";
        break;

      case positionCellType.NEUTRAL:
        color = "#FFFFFF";
        break;

      case positionCellType.RED:
      case positionCellType.BLUE:
      case positionCellType.RED_RED__BLUE_BLUE:
        color = "#00FF00";
        break;

      case positionCellType.BLACK:
        color = "#000000";
        break;

      default:
        console.log("unknown posType", posType);
        color = "#DA6335";
        break;
    }

    console.log("colorForPositionType", posType, color);

    return color;
  }

  positionGridForCnpGridModel(cnpGridModel, teamIndex) {
    const positionGrid = new PositionGrid(cnpGridModel.nb_items);

    var cellModels;
    switch(teamIndex) {
      case -2:
        cellModels = cnpGridModel.cellModels_origin;
        break;
      case -1:
        cellModels = cnpGridModel.cellModels_goal;
        break;
      case 0:
        cellModels = cnpGridModel.cellModels_red;
        break;
      case 1:
        cellModels = cnpGridModel.cellModels_blue;
        break;
      default:
        throw new Error("unknown teamIndex:", teamIndex);
        break;
    }

    Object.keys(positionGrid.cells).forEach((cellIndex, i) => {
      const cellModel = cellModels[cellIndex];
      const cell      = positionGrid.cells[cellIndex];

      cell.type  = cellModel.type;
      if(teamIndex == -1) {
        //debug
        cell.color = this.colorForPositionType_debug(cell.type);
      }
      else if(teamIndex == -2) {
        cell.color = this.colorForPositionType_origin(cell.type);
      } else {
        cell.color = this.colorForPositionType(cell.type);
      }
    });

    return positionGrid;
  }

  gameGridForGameCells(gameCellModels) {
    const gameGrid = new GameGrid(gameCellModels.length);

    Object.keys(gameGrid.cells).forEach((cellIndex, i) => {
      const cellModel = gameCellModels[cellIndex];
      const cell = gameGrid.cells[cellIndex];

      cell.color = this.colorForPositionType(cell.posType);
    });

    return gameGrid;
  }


}

exports.Game = Game;
