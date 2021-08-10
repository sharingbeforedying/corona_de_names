(function () {

  angular.module("awApp").component('instanceTeller', {
      templateUrl: 'app/components/instance/teller/instanceTeller.html',
      controller: InstanceTellerController,

      bindings: {
        roomService: '<',
      },
  });

  InstanceTellerController.$inject = [/*'$scope',*/ '$state', 'navigationService'];
  function InstanceTellerController(/*serverService,*/ $state, navigationService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("InstanceTellerController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("InstanceTellerController::$onInit", "vm.roomService", vm.roomService);

        vm.state              = vm.roomService.room.state;

        vm.commandService     = vm.roomService.commandService;

        vm.roomCommandNames   = Object.keys(vm.roomService.roomCommandHandlers);
        vm.moveToCommandNames = Object.keys(vm.roomService.moveToCommandHandlers);




        vm.player = vm.state.player;

        vm.grid_position = vm.state.grid_position;
        vm.grid_game     = vm.state.grid_game;
        vm.grid_content  = vm.state.grid_content;

        // vm.rx_grid_game.sub


        vm.debug_submitHint = function() {
            const hint = {
              word:"debugHint007",
              number:3,
            };

            vm.commandService.instance_teller_submitHint({
              playerId: vm.player.id,
              hint: hint,
            });
        }

        vm.manageSubmitHint = function(hint) {
            vm.commandService.instance_teller_submitHint({
              playerId: vm.player.id,
              hint: hint,
            });
        }


        vm.goToGuesserRoom = function() {
          console.log("navigationService", navigationService);
          const roomService = navigationService.getRoomService("guesser");
          $state.go("instanceGuesser", {roomService: roomService});
        }



      }

  }

})();
