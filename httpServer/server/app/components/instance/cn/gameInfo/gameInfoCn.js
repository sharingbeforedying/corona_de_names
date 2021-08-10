(function () {

  angular.module("awApp").component('gameInfoCn', {
      templateUrl: 'app/components/instance/cn/gameInfo/gameInfoCn.html',
      controller: GameInfoController,

      bindings: {
        rxGameInfo: '<',
      },
  });

  GameInfoController.$inject = ['$state', 'navigationService', '$scope'];
  function GameInfoController($state, navigationService, $scope) {
      var vm = this;

      vm.$onInit = function() {
        console.log("GameInfoController::$onInit");

        vm.rxGameInfo.subscribe({
          next(gameInfo) {
            console.log('rxGameInfo', 'next', gameInfo);
            vm.gameInfo = gameInfo;
            // $scope.$apply();
          },
          error(err) { console.error('rxGameInfo', 'something wrong occurred: ' + err); },
          complete() { console.log('rxGameInfo', 'done'); }
        });



      }

  }

})();
