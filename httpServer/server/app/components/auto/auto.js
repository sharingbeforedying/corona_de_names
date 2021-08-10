// create the controller and inject Angular's $scope
angular.module("awApp").controller('autoPController', function($scope, gameService) {

  $scope.init = function() {
    console.log("autoPController::init");

    $scope.teamIds = () => Object.keys(gameService.getSessionTeamsMap());

    gameService.onChange(() => {
      console.log("autoPController::gameService.onChange");
      $scope.$apply();
    });

  };

    $scope.auto1 = function(role,teamId) {
      console.log("button clicked: auto_teller");

      gameService.auto_role_in_team(role, teamId);
    };


});
