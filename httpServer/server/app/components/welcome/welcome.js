(function () {

  angular.module("awApp").component('welcome', {
      templateUrl: 'app/components/welcome/welcome.html',
      controller: WelcomeController,

      bindings: {
        roomService: '<',
      },
  });

  WelcomeController.$inject = [];
  function WelcomeController(/*serverService*/) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("WelcomeController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("WelcomeController::$onInit", "vm.roomService", vm.roomService);
        vm.roomCommandNames = Object.keys(vm.roomService.roomCommandHandlers);

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
