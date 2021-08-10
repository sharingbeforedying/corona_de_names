(function () {

  angular.module("awApp").component('sessionHall', {
      templateUrl: 'app/components/halls/sessionHall/sessionHall.html',
      controller: SessionHallController,

      bindings: {
        roomService: '<',
      },
  });

  SessionHallController.$inject = [];
  function SessionHallController(/*serverService*/) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("SessionHallController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("SessionHallController::$onInit", "vm.roomService", vm.roomService);

        vm.state              = vm.roomService.room.state;

        vm.roomCommandNames   = Object.keys(vm.roomService.roomCommandHandlers);

        vm.moveToCommandNames = Object.keys(vm.roomService.moveToCommandHandlers);


        vm.do = (commandName) => {

          const clientCommand = {
            name : commandName,
            data : {},
          };

          vm.roomService.processCommand_p(clientCommand);
        }
      }

  }

})();
