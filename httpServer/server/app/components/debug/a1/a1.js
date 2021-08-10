(function () {

  angular.module("awApp").component('a1', {
      templateUrl: 'app/components/debug/a1/a1.html',
      controller: A1Controller,

      bindings: {
        roomService: '<',
      },
  });

  A1Controller.$inject = [];
  function A1Controller(/*serverService*/) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("A1Controller", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("A1Controller::$onInit", "vm.roomService", vm.roomService);

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
