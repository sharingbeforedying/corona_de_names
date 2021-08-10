(function () {

  angular.module("awApp").component('sessionPlayer', {
      templateUrl: 'app/components/session/detail/player/sessionPlayer.html',
      controller: SessionPlayerController,
      bindings : {
        sessionPlayer: "<",
      }
  });

  SessionPlayerController.$inject = ['gameService'];
  function SessionPlayerController(gameService) {
      var vm = this;
      vm.$onInit = function() {
        console.log("sessionPlayer::$onInit", vm.sessionPlayer);
      }
  }

})();
