(function () {

  angular.module("awApp").component('tellerHintNumberCnduo', {
      templateUrl: 'app/components/instance/cn_duo/teller/tellerHint/number/tellerHintNumberCnduo.html',
      controller: TellerHintNumberController,

      bindings: {
        number: "=",
        onNumberUpdate: '&',
      },
  });

  TellerHintNumberController.$inject = [/*'$scope',*/ '$state', 'navigationService'];
  function TellerHintNumberController(/*serverService,*/ $state, navigationService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("TellerHintNumberController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("TellerHintNumberController::$onInit");

        vm.number = 3;

        vm.min = 1;
        vm.max = 10;
        vm.numberDidUpdate = function(number) {
          console.log("numberDidUpdate", number);
          vm.number = number;

          vm.onNumberUpdate({number: vm.number});
        };

      }

  }

})();
