
angular.module("awApp").controller('cnMiniController', function($scope, gameService) {
  console.log('cnMiniController');

  $scope.init = function() {
    console.log("cnMiniController::init");

    $scope.teamPSI   = () => gameService.get_local_activeTeamPSI();
    $scope.playerPSI = () => gameService.get_local_activePlayerPSI();

    $scope.grid__content  = () => gameService.get_grid__content();
    $scope.grid__position = () => gameService.get_grid__position();
    $scope.grid__game     = () => gameService.get_grid__game();

    gameService.onChange(() => {
      console.log("cnMiniController::gameService.onChange");
      $scope.$apply();
    });

  };

  $scope.submit_contract = function(word,number) {
    console.log("submit_contract", word, number);
    const instancePlayer = $scope.playerPSI().instance;
    gameRoomClientService.instance_teller_submitHint(instancePlayer, word, number);
  };


});

angular.module("awApp").controller('cnMiniGridController', function($scope,$timeout) {
    console.log('cnMiniGridController');

    $scope.child_models = () => Object.values($scope.grid().cells);

    $scope.get_grid_model = function() {
      return partition($scope.child_models, 5);
    };

    $scope.grid_model = $scope.get_grid_model();

});

angular.module("awApp").controller('cnMiniCellController', function($scope,gameRoomClientService) {

  $scope.init = function(cellIndex, cellModel) {
    console.log("cnMiniCellController", cellIndex, cellModel);
    $scope.cellIndex = cellIndex;
    $scope.cellModel = cellModel;
  }

  $scope.colorForType = function(type) {
    var outColor = '';

    switch (type) {
      case 0:
        outColor = "#AAAAAA";
      break;
      case 1:
        outColor = "#FF0000";
      break;
      case 2:
        outColor = "#0000FF";
      break;
      case 3:
        outColor = "#000000";
      break;
      default:
        outColor = 'type does not exist';
        break;
    }

    return outColor;
  };

  $scope.styleForCell = function() {
    console.log("styleForCell:", $scope.cellModel.type);
    return {
      "background-color" : $scope.colorForType($scope.cellModel.type),
    };
  };

  $scope.cellClicked = function() {
    const instancePlayer = $scope.playerPSI().instance;
    const cellIndex      = $scope.cellIndex;
    console.log("cnmCellController.cellClicked", instancePlayer, cellIndex);
    gameRoomClientService.instance_guesser_submitCellSelection(instancePlayer,cellIndex);
  };

});
