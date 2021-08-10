(function () {

  angular.module("awApp").controller('groupPlayerController', function($scope, gameService) {

      $scope.init = function() {
        console.log("groupPlayerController::init()");
      };


      $scope.activate_setName = function() {
        //console.log("onDblClick", "wordInput:", $scope.wordInput);
        $scope.wordInputFormGroup.hidden = false;

        $scope.wordInput.focus();
        console.log("after:", $scope.wordInput);
      };


      $scope.submit_setName = function() {
        console.log("submit_setName:", $scope.input_word);

        $scope.wordInputFormGroup.hidden = true;

        var newValue = $scope.input_word;
        gameService.group_setPlayerName($scope.groupPlayer.id, newValue);

      };

      $scope.submit_removePlayer = function() {
        gameService.group_removePlayer($scope.groupPlayer.id);
      };


  });

  


})();
