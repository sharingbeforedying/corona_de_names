(function () {

  angular.module("awApp").component('sessionDetail', {
      templateUrl: 'app/components/session/detail/sessionDetail.html',
      controller: SessionDetailController,
      bindings: {
        session: '<',
      }
  });

  SessionDetailController.$inject = ['gameService'];
  function SessionDetailController(gameService) {
      var vm = this;
      vm.join = join;

      /////////////

      function join() {
        console.log("join");
        gameService.session_join(vm.session);
      }

  }

})();
