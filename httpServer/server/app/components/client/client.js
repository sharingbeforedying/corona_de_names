(function () {

  angular.module("awApp").component('client', {
      templateUrl: 'app/components/client/client.html',
      controller: ClientController,

      bindings: {
        roomService: '<',
      },
  });

  ClientController.$inject = [];
  function ClientController(/*serverService*/) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("ClientController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("ClientController::$onInit", "vm.roomService", vm.roomService);

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
