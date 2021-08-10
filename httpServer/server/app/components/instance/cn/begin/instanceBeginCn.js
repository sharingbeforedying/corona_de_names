(function () {

  angular.module("awApp").component('instanceBeginCn', {
      templateUrl: 'app/components/instance/cn/begin/instanceBeginCn.html',
      controller: InstanceBeginController,

      bindings: {
        roomService: '<',
      },
  });

  InstanceBeginController.$inject = ['$scope'];
  function InstanceBeginController(/*serverService,*/ $scope) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("InstanceBeginController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("InstanceBeginController::$onInit", "vm.roomService", vm.roomService);

        vm.state              = vm.roomService.room.state;

        vm.roomCommandNames   = Object.keys(vm.roomService.roomCommandHandlers);

        vm.moveToCommandNames = Object.keys(vm.roomService.moveToCommandHandlers);

        vm.roomService.rx_state.pipe(rxjs.operators.skip(1)).subscribe({
          next(state) {
            console.log('rx_state', 'next', state);
            vm.state = state;
            $scope.$apply();
          },
          error(err) { console.error('rx_state', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_state', 'done'); }
        });


        vm.do = (commandName) => {

          const clientCommand = {
            name : commandName,
            data : {},
          };

          vm.roomService.processCommand_p(clientCommand);
        }

        vm.move = (commandName) => {

          const clientCommand = {
            name : commandName,
            data : {},
          };

          vm.roomService.processCommand_p(clientCommand);
        }
      }

  }

})();
