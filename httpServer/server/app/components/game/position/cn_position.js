
angular.module("awApp").controller('cnpMainController', function($scope, gameService) {
  console.log('cnpMainController');

  $scope.init = function() {
    console.log("cnpMainController::init");

    $scope.grid = () => gameService.get_grid__position();

    gameService.onChange(() => {
      console.log("cnpMainController::gameService.onChange");
      // console.log("$scope.grid()", $scope.grid());
      $scope.$apply();
    });

  };

});

angular.module("awApp").controller('cnpGridController', function($scope,$timeout) {
    console.log('cnpGridController');

    $scope.child_models = Object.values($scope.grid().cells);

    $scope.get_grid_model = function() {
      return partition($scope.child_models, 5);
    };

    $scope.grid_model = $scope.get_grid_model();

});

angular.module("awApp").controller('cnpCellController', function($scope,$timeout) {

  $scope.init = function(cellModel) {
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

});
