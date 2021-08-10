// create the controller and inject Angular's $scope
angular.module("awApp").controller('gameGuesserPController', function($scope, gameService) {

  $scope.init = function() {
    console.log("gameGuesserPController::init");


    $scope.teamPSI        = () => gameService.get_local_activeTeamPSI();
    $scope.teamColor      = () => $scope.teamPSI().session.color;

    $scope.playerPSI      = () => gameService.get_local_activePlayerPSI();

    $scope.grid__content  = () => gameService.get_grid__content();
    //$scope.grid__position = () => gameService.get_grid__position();
    $scope.grid__game     = () => gameService.get_grid__game();

    $scope.hint           = () => gameService.get_teller_hint();
    $scope.turn           = () => gameService.get_current_turn();
    $scope.canEndTurn     = () => $scope.turn().canEndTurn;

    $scope.child_models = () => {

      //const position_cells = $scope.grid__position().cells;
      const game_cells     = $scope.grid__game().cells;
      const content_cells  = $scope.grid__content().cells;

      const str_cellIndexes = Object.keys(game_cells)
      const numberSort = (a, b) => a - b;
      const cellIndexes = str_cellIndexes.map(s => parseInt(s)).sort(numberSort);
      return cellIndexes.map(cellIndex => {
        return {
          index:    cellIndex,

          //position: position_cells[cellIndex],
          game:     game_cells[cellIndex],

          content:  content_cells[cellIndex],
        };
      });

    };

    $scope.cellModels = $scope.child_models();

    gameService.onChange(() => {
      console.log("gameGuesserPController::->gameService.onChange");
      $scope.cellModels = $scope.child_models();
      $scope.$apply();
    });

  };


});



/********** HINT ************/

angular.module("awApp").controller('gameGuesserHintController', function($scope, gameService) {
  console.log('gameGuesserHintController');

  $scope.hint_word   = $scope.hint().word;
  $scope.hint_number = $scope.hint().number;

  $scope.submit_endTurn = function() {
    console.log("submit_endTurn");

    const instancePlayer = $scope.playerPSI().instance;
    gameService.instance_guesser_submitEndTurn(instancePlayer);
  };

  $scope.style = function() {
    return {
      "background-color" : hexToRgba_cssString($scope.teamColor(), 0.5),
    };
  }

});



/********** GRID ************/

angular.module("awApp").controller('gameGuesserGridController', function($scope) {
    console.log('gameGuesserGridController');

    $scope.init = function() {

    }

    $scope.styleForGrid = function() {
      return {
        "background-color" : "Transparent",

        //"pointer-events": "auto",
      };
    };

});

angular.module("awApp").controller('gameGuesserCellController', function($scope, gameService, displaySettingsService) {

  $scope.init = function(cellModel) {
    console.log("gameGuesserCellController::init", cellModel);

    $scope.cellModel = cellModel;

    $scope.word  = $scope.cellModel.content.content;
    // $scope.image = $scope.cellModel.content.content;

  }

  $scope.cellClicked = function() {
    const instancePlayer = $scope.playerPSI().instance;
    const cellIndex      = $scope.cellModel.index;
    console.log("gameGuesserCellController.cellClicked", instancePlayer, cellIndex);
    gameService.instance_guesser_submitCellSelection(instancePlayer,cellIndex);
  };




  $scope.styleForCell = function() {
    var outStyle = {};

    return outStyle;
  };



  class ContentStyle_unchecked {

    constructor() {

    }

    game(game) {
      const style = {
        "visibility" : "visible",
      };

      Object.assign(this, style);
      return this;
    }

  }

  class ContentStyle_checked {

    constructor() {

    }

    game(game) {
      const style = {
        "visibility" : "hidden",
      };

      Object.assign(this, style);
      return this;
    }

  }



  $scope.styleForContent = function() {
    var outStyle = {};

    const evalType = $scope.cellModel.game.evalType;
    switch(evalType) {
      case gameCellEvalType.UNCHECKED:
        {
        const cellStyle = new ContentStyle_unchecked();
        outStyle = cellStyle.game($scope.cellModel.game);
        }
        break;
      case gameCellEvalType.CHARACTERIZED:
        {
        const cellStyle = new ContentStyle_checked();
        outStyle = cellStyle.game($scope.cellModel.game);
        }
        break;
      default:
        console.log("unknown evalType", evalType);
        break;
    }

    return outStyle;
  }


  class ContentOverlayStyle_unchecked {

    constructor() {

    }

    game(game) {
      const color = gameService.colorForPositionType(game.posType);

      const style = {
        "background-color" : hexToRgba_cssString(color, 0.4),
      };

      Object.assign(this, style);
      return this;
    }
  }

  class ContentOverlayStyle_checked {

    constructor() {

    }

    game(game) {
      const color = gameService.colorForPositionType(game.posType);

      const style = {
        "background-color" : hexToRgba_cssString(color, 0.4),
      };

      Object.assign(this, style);
      return this;
    }
  }

  $scope.styleForContentOverlay = function() {
    var outStyle = {};

    const evalType = $scope.cellModel.game.evalType;
    switch(evalType) {
      case gameCellEvalType.UNCHECKED:
        {
        const cellStyle = new ContentOverlayStyle_unchecked();
        outStyle = cellStyle.game($scope.cellModel.game);
        }
        break;
      case gameCellEvalType.CHARACTERIZED:
        {
        const cellStyle = new ContentOverlayStyle_checked();
        outStyle = cellStyle.game($scope.cellModel.game);
        }
        break;
      default:
        console.log("unknown evalType", evalType);
        break;
    }

    return outStyle;
  }

});

// angular.module("awApp").controller('cnmTeamController', function($scope,$timeout) {
//   console.log('cnmTeamController');
//
//   $scope.init = function(teamModel) {
//     $scope.team = teamModel;
//   };
//
//   $scope.getObjectiveForTeam = function() {
//     return $scope.gameModel.getObjectiveForTeam($scope.team);
//   }
//
//   $scope.getRemainingForTeam = function() {
//     return $scope.gameModel.getRemainingForTeam($scope.team);
//   }
//
//
//   $scope.styleForTeam = function() {
//     return {
//       "background-color" : $scope.team.color,
//
//       "color" : "white",
//       "font-size": "1.2em",
//
//       /*
//       "visibility" : ($scope.team == $scope.gameModel.getActiveTeam()) ? "visible" : "hidden",
//       */
//     };
//   };
// });
