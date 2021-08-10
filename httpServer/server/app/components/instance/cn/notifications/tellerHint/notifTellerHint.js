(function () {

  angular.module("awApp").component('notifTellerHint', {
      templateUrl: 'app/components/instance/cn/notifications/tellerHint/notifTellerHint.html',
      controller: NotifTellerHintController,

      bindings: {
        rxTurn: '<',
      },
  });

  NotifTellerHintController.$inject = ['$state', 'navigationService', '$scope'];
  function NotifTellerHintController($state, navigationService, $scope) {
      var vm = this;

      vm.$onInit = function() {
        console.log("NotifTellerHintController::$onInit");

        vm.rxTurn.subscribe({
          next(turn) {
            console.log('rxTurn', 'next', turn);
            vm.turn = turn;
            // $scope.$apply();
          },
          error(err) { console.error('rxTurn', 'something wrong occurred: ' + err); },
          complete() { console.log('rxTurn', 'done'); }
        });

      }

      vm.style = function() {
        return {
          "background-color" : hexToRgba_cssString("#654321", 0.4),
        };
      }

  }

})();
