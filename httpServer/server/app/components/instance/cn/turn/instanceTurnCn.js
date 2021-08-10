(function () {

  angular.module("awApp").component('turnCn', {
      templateUrl: 'app/components/instance/cn/turn/instanceTurnCn.html',
      controller: InstanceTurnController,

      bindings: {
        turn: '<',
        refreshTriggerTurn: '<',
      },
  });

  InstanceTurnController.$inject = ['$state', 'navigationService', '$scope'];
  function InstanceTurnController($state, navigationService, $scope) {
      var vm = this;

      vm.$onInit = function() {
        console.log("InstanceTellerController::$onInit", "vm.turn", vm.turn);

        if(vm.turn.tellerStep) {
          vm.tellerHint = vm.turn.tellerStep.playerAction.action;

          console.log("InstanceTellerController::$onInit", "vm.tellerHint", vm.tellerHint);
        }

        vm.refreshTriggerTurn.subscribe({
          next(turn) {
            console.log('refreshTriggerTurn', 'next', turn);
            vm.turn = turn;
            $scope.$apply();
          },
          error(err) { console.error('refreshTriggerTurn', 'something wrong occurred: ' + err); },
          complete() { console.log('refreshTriggerTurn', 'done'); }
        });



      }

  }

})();
