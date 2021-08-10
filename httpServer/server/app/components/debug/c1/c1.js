(function () {

  angular.module("awApp").component('c1', {
      templateUrl: 'app/components/debug/c1/c1.html',
      controller: C1Controller,

      bindings: {
        roomService: '<',
      },
  });

  C1Controller.$inject = [];
  function C1Controller(/*serverService*/) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("C1Controller", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("C1Controller::$onInit", "vm.roomService", vm.roomService);

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
