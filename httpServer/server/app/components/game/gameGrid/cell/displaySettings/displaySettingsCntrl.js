angular.module("awApp").controller('displaySettingsController', function($scope, displaySettingsService) {

  $scope.init = function() {
    console.log("gameTellerPController::init");

    $scope.size_cell = displaySettingsService.getSize_cell();
    $scope.size_font = displaySettingsService.getSize_font();

    $scope.updateWith_cellSize = function(cellSize) {
      console.log("updateWith_cellSize", cellSize);
      displaySettingsService.setSize_cell(cellSize);
    };

    $scope.updateWith_fontSize = function(fontSize) {
      console.log("updateWith_fontSize", fontSize);
      displaySettingsService.setSize_font(fontSize);
    };

  };

});
