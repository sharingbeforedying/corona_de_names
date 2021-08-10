// create the controller and inject Angular's $scope
angular.module("awApp").controller('gameTellerPController', function($scope, gameService) {

  $scope.init = function() {
    console.log("gameTellerPController::init");

    $scope.teamPSI        = () => gameService.get_local_activeTeamPSI();
    $scope.teamColor      = () => $scope.teamPSI().session.color;

    $scope.playerPSI      = () => gameService.get_local_activePlayerPSI();

    $scope.grid__content  = () => gameService.get_grid__content();
    $scope.grid__position = () => gameService.get_grid__position();
    $scope.grid__game     = () => gameService.get_grid__game();

    $scope.child_models = () => {

      const position_cells = $scope.grid__position().cells;
      const game_cells     = $scope.grid__game().cells;
      const content_cells  = $scope.grid__content().cells;

      const str_cellIndexes = Object.keys(game_cells)
      const numberSort = (a, b) => a - b;
      const cellIndexes = str_cellIndexes.map(s => parseInt(s)).sort(numberSort);
      return cellIndexes.map(cellIndex => {

        return {
          index:    cellIndex,

          position: position_cells[cellIndex],
          game:     game_cells[cellIndex],

          content:  content_cells[cellIndex],
        };
      });

    };

    $scope.cellModels = $scope.child_models();

    gameService.onChange(() => {
      console.log("gameTellerPController::->gameService.onChange");
      $scope.cellModels = $scope.child_models();
      $scope.$apply();
    });


  };


});



/********** HINT ************/

angular.module("awApp").controller('gameTellerHintController', function($scope, gameService) {
  console.log('gameTellerHintController');

  $scope.number = 3;

  $scope.min = 1;
  $scope.max = 10;
  $scope.numberDidUpdate = function(number) {
    console.log("numberDidUpdate", number);
    $scope.number = number;
  };


  $scope.word = "hint";
  $scope.wordDidUpdate = function(word) {
    console.log("wordDidUpdate", word);
    $scope.word = word;
  };


  $scope.submitHint = function() {
    const word   = $scope.word;
    const number = $scope.number;
    console.log("submitHint", word, number);

    const instancePlayer = $scope.playerPSI().instance;
    gameService.instance_teller_submitHint(instancePlayer, word, number);
  };

  $scope.style = function() {
    return {
      "background-color" : hexToRgba_cssString($scope.teamColor(), 0.5),
    };
  }

});

angular.module("awApp").controller('gameTellerHintPickNumberController', function($scope,$timeout) {
  console.log('gameTellerHintPickNumberController');

});

angular.module("awApp").controller('gameTellerHintPickWordController', function($scope,$timeout) {
  console.log('gameTellerHintPickWordController');

});





/********** GRID ************/

angular.module("awApp").controller('gameTellerGridController', function($scope) {
    console.log('gameTellerGridController');

    $scope.init = function() {
      $scope.cellModels = $scope.child_models();
    }


    $scope.styleForGrid = function() {
      return {
        "background-color" : "Transparent",

        "pointer-events": "auto",
      };
    };

});

angular.module("awApp").controller('gameTellerCellController', function($scope, gameService) {

  $scope.init = function(cellModel) {
    console.log("gameTellerCellController::init", cellModel);

    $scope.cellModel = cellModel;

  }

  $scope.cellClicked = function() {
    console.log("gameTellerCellController.cellClicked");

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

    position(position) {

      const style = {
        "border-width": "5px",
        "border-color": gameService.colorForPositionType(position.type),
        "border-style": "solid",
      };

      Object.assign(this, style);
      return this;
    }

    game(game) {
      return this;
    }
  }

  class ContentOverlayStyle_checked {

    constructor() {

    }

    position(position) {

      // const style = {
      //   "border-width": "5px",
      //   "border-color": gameService.colorForPositionType(position.type),
      //   "border-style": "solid",
      // };
      //
      // Object.assign(this, style);
      return this;
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
        outStyle = cellStyle.position($scope.cellModel.position)
                            .game($scope.cellModel.game);
        }
        break;
      case gameCellEvalType.CHARACTERIZED:
        {
        const cellStyle = new ContentOverlayStyle_checked();
        outStyle = cellStyle.position($scope.cellModel.position)
                            .game($scope.cellModel.game);
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
