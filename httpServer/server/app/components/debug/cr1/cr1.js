(function () {

  angular.module("awApp").component('cr1', {
      templateUrl: 'app/components/debug/cr1/cr1.html',
      controller: CR1Controller,

      bindings: {
        roomService: '<',
      },
  });

  CR1Controller.$inject = [];
  function CR1Controller(/*serverService*/) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("CR1Controller", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("CR1Controller::$onInit", "vm.roomService", vm.roomService);

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
