(function () {

  angular.module("awApp").component('instanceBeginCnduo', {
      templateUrl: 'app/components/instance/cn_duo/begin/instanceBeginCnduo.html',
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
