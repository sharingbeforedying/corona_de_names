(function () {

  angular.module("awApp").component('portal', {
      templateUrl: 'app/components/portal/portal.html',
      controller: PortalController,

      bindings: {
        roomService: '<',
      },
  });

  PortalController.$inject = [];
  function PortalController(/*serverService*/) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("PortalController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("PortalController::$onInit", "vm.roomService", vm.roomService);

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
