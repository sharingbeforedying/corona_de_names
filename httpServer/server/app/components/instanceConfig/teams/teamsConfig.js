(function () {

  angular.module("awApp").component('teamsConfig', {
      templateUrl: 'app/components/instanceConfig/teams/teamsConfig.html',
      controller: TeamsConfigController,
      bindings: {
        // teamsConfig: '<',
        roomService: '<',
      }
  });

  TeamsConfigController.$inject = ['$scope'];
  function TeamsConfigController($scope) {
      var vm = this;
      // vm.session = null;

      vm.$onInit = function() {

        const state = vm.roomService.room.state;

        vm.commandService = vm.roomService.commandService;

        const teamsConfig = state.teamsConfig;
        console.log("teamsConfig", teamsConfig);

        vm.freePlayers = teamsConfig.freePlayers;
        vm.teams       = Object.values(teamsConfig.teams);
        vm.acceptable  = teamsConfig.acceptable;

        vm.roomService.rx_teamsConfig.pipe(rxjs.operators.skip(1)).subscribe({
          next(x) { console.log('rx_teamsConfig', 'got value ' + x);
            const teamsConfig = x;
            console.log("teamsConfig", teamsConfig);

            vm.freePlayers = teamsConfig.freePlayers;
            vm.teams       = Object.values(teamsConfig.teams);

            vm.acceptable  = teamsConfig.acceptable;

            $scope.$apply();
          },
          error(err) { console.error('rx_teamsConfig', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_teamsConfig', 'done'); }
        });



        vm.joinTeam  = joinTeam;
        vm.leaveTeam = leaveTeam;

        vm.submitTeamsConfig  = submitTeamsConfig;

        vm.selectFreePlayer   = selectFreePlayer;
        vm.selectedFreePlayer = null;
        vm.style_freePlayer   = style_freePlayer;
      };

      //////////////////

      function selectFreePlayer(freePlayer) {
        console.log("selectFreePlayer", freePlayer);
        const selected = (vm.selectedFreePlayer == freePlayer);
        if(selected) {
          vm.selectedFreePlayer = null;
        } else {
          vm.selectedFreePlayer = freePlayer;
        }
      }

      function style_freePlayer(freePlayer) {
        console.log("style_freePlayer", freePlayer);

        function styleForSelected() {
          return {
            "border-width": "5px",
            "border-color": "orange",
            "border-style": "double",
          };
        };

        function styleForUnselected() {
          return {
            "border-width": "0px",
            "border-color": "Transparent",
            "border-style": "none",
          };
        };

        var style = {};
        const selected = (vm.selectedFreePlayer == freePlayer);
        if(selected) {
          style = styleForSelected();
        } else {
          style = styleForUnselected();
        }

        return style;
      }

      function joinTeam(team) {
        if(vm.selectedFreePlayer) {
            vm.commandService.instance_config_teams_joinTeam({
              teamId:  team.id,
              playerId: vm.selectedFreePlayer.id,
            });
        } else {
          console.log("ignored");
        }
      };

      function leaveTeam(team, teamPlayer) {
        vm.commandService.instance_config_teams_leaveTeam({
          teamId:  team.id,
          playerId: teamPlayer.id,
        });
      };

      function submitTeamsConfig() {
        vm.commandService.instance_config_teams_submitTeamsConfig();
      };

  }

})();
