(function () {

  angular.module("awApp").component('instanceTellerCnduo', {
      templateUrl: 'app/components/instance/cn_duo/teller/instanceTellerCnduo.html',
      controller: InstanceTellerController,

      bindings: {
        roomService: '<',
      },
  });

  InstanceTellerController.$inject = ['$state', 'navigationService', '$scope'];
  function InstanceTellerController($state, navigationService, $scope) {
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




        vm.roomName = vm.state.name;

        vm.player = vm.state.player;

        vm.grid_position = vm.state.grid_position;
        vm.grid_game     = vm.state.grid_game;
        vm.grid_content  = vm.state.grid_content;

        //debug
        vm.grid_position__goal = vm.state.grid_position__goal;


        vm.roomService.rx_grid_game.pipe(rxjs.operators.skip(1)).subscribe({
          next(grid_game) {
            console.log('rx_grid_game', 'next', grid_game);
            $scope.$apply();
          },
          error(err) { console.error('rx_grid_game', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_grid_game', 'done'); }
        });

        vm.roomService.rx_cell_change.subscribe({
          next(cell_change) {
            console.log('rx_cell_change', 'next', cell_change);

          },
          error(err) { console.error('rx_cell_change', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_cell_change', 'done'); }
        });


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
