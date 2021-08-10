(function () {

  angular.module("awApp").component('universe', {
      templateUrl: 'app/components/universe/universe.html',
      controller: UniverseController,

      bindings: {
        roomService: '<',
      },
  });

  UniverseController.$inject = [];
  function UniverseController(/*serverService*/) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("UniverseController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("UniverseController::$onInit", "vm.roomService", vm.roomService);
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
