(function () {

  angular.module("awApp").component('teamsConfigTeamPlayer', {
      templateUrl: 'app/components/instanceConfig/teams/team/player/teamsConfigTeamPlayer.html',
      controller: TeamsConfigTeamPlayerController,
      bindings : {
        player: "<",
        commandService: "<",

        onLeaveRequest: "&",
      }
  });

  TeamsConfigTeamPlayerController.$inject = ['$scope'];
  function TeamsConfigTeamPlayerController($scope) {
      var vm = this;

      vm.player = null;

      vm.$onInit = function() {

        const commandService = vm.commandService;

        vm.handleSelect_role = handleSelect_role(commandService);
        vm.handleCheck_ready = handleCheck_ready(commandService);
      }

      ////////

      function handleSelect_role(commandService) {
        return (role) => {
          commandService.instance_config_teams_teamPlayer_set_role({
            playerId: vm.player.id,
            roleId: role.id,
          });
        };
      }

      function handleCheck_ready(commandService) {
        return (ready) => {
          commandService.instance_config_teams_teamPlayer_set_ready({
            playerId: vm.player.id,
            ready: ready,
          });
        };
      }
  }

})();
