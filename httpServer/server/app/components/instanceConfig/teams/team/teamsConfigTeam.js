(function () {

  angular.module("awApp").component('teamsConfigTeam', {
      templateUrl: 'app/components/instanceConfig/teams/team/teamsConfigTeam.html',
      controller: TeamsConfigTeamController,
      bindings : {
        team: "<",
        commandService: "<",

        onJoinRequest:  "&",
        onLeaveRequest: "&",
      }
  });

  TeamsConfigTeamController.$inject = ['$scope'];
  function TeamsConfigTeamController($scope) {
      var vm = this;
      vm.team   = null;
      vm.onJoinRequest = null;

      vm.join        = () => vm.onJoinRequest({team : vm.team});
      vm.leave       = (player) => {
        console.log("leave", player);
        vm.onLeaveRequest({team : vm.team, player: player});
      };

      vm.mutate = mutate;

      function mutate(prop, value) {
        // vm.onUpdate({hero: ctrl.hero, prop: prop, value: value});
        if(prop == "name") {
          const name = value;
          // gameService.session_config_setTeamName(vm.sessionTeam, name);
        } else if(prop == "color") {
          const color = value;
          // gameService.session_config_setTeamColor(vm.sessionTeam, color);
        }
      };

  }

})();
