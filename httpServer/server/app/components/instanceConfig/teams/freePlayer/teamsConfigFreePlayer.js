(function () {

  angular.module("awApp").component('teamsConfigFreePlayer', {
      templateUrl: 'app/components/instanceConfig/teams/freePlayer/teamsConfigFreePlayer.html',
      controller: TeamsConfigFreePlayerController,
      bindings : {
        freePlayer: "<",
      }
  });

  TeamsConfigFreePlayerController.$inject = [];
  function TeamsConfigFreePlayerController() {
      var vm = this;

      vm.freePlayer = null;

  }

})();
