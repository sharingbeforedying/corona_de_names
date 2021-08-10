angular.module("awApp").controller('gameOverController', function($scope, $timeout, $window) {

  $scope.init = function() {
    console.log("gameOverController::init");

    $scope.showPlayAgain = function() {

      $window.location.href = "/play_again";

    };

    //start timer
    const duration = 3000;
    $timeout(function () {

      $scope.showPlayAgain();

    }, duration);

  };

});
