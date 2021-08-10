
angular.module("awApp").controller('npMainController', function($scope,$timeout) {

  $scope.init = function(min,max,initial,numberDidUpdate) {
    console.log("npMainController::init");

    $scope.numberModel = new NumberPickerModel(min,max,initial, number => {
      numberDidUpdate(number);
    });

  };

  $scope.inc = function() {
    $scope.numberModel.inc();
  };

  $scope.dec = function() {
    $scope.numberModel.dec();
  };

});
