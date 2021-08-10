(function () {

  angular.module("awApp").component('instanceGuesserCnduo', {
      templateUrl: 'app/components/instance/cn_duo/guesser/instanceGuesserCnduo.html',
      controller: InstanceGuesserController,

      bindings: {
        roomService: '<',
      },
  });

  InstanceGuesserController.$inject = ['$state', 'navigationService', '$scope'];
  function InstanceGuesserController($state, navigationService, $scope) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("InstanceGuesserController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("InstanceGuesserController::$onInit", "vm.roomService", vm.roomService);

        vm.state              = vm.roomService.room.state;

        vm.commandService     = vm.roomService.commandService;

        vm.roomCommandNames   = Object.keys(vm.roomService.roomCommandHandlers);
        vm.moveToCommandNames = Object.keys(vm.roomService.moveToCommandHandlers);


        vm.roomName = vm.state.name;

        vm.player = vm.state.player;

        // vm.grid_position = vm.state.grid_position;
        vm.grid_game     = vm.state.grid_game;
        vm.grid_content  = vm.state.grid_content;


        // const watched_state = onChange(vm.state, function (path, value, previousValue) {
        //     console.log("InstanceGuesserController::vm.state.onChange");
        //
        //     console.log('path:', path);
        //     console.log('value:', value);
        //     console.log('previousValue:', previousValue);
        //   }
        //   /*,{ignoreKeys: ["$changes"]}*/
        // );

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

        vm.submitSelection = function(cellModel) {
          console.log("submitSelection", cellModel);
          vm.commandService.instance_guesser_submitCellSelection({
            playerId: vm.player.id,
            cellIndex: cellModel.index,
          });
        }


        vm.debug_submitSelection = function() {
            vm.commandService.instance_guesser_submitCellSelection({
              playerId: vm.player.id,
              cellIndex: 0,
            });
        }

        vm.debug_submitEndTurn = function() {
            vm.commandService.instance_guesser_submitEndTurn({
              playerId: vm.player.id,
            });
        }

        vm.goToTellerRoom = function() {
          console.log("navigationService", navigationService);
          const roomService = navigationService.getRoomService("teller");
          $state.go("instanceTeller", {roomService: roomService});
        }


      }

  }

})();
