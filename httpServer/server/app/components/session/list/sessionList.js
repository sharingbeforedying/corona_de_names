(function () {

  angular.module("awApp").component('sList', {
      templateUrl: 'app/components/session/list/sessionList.html',
      controller: SListController,
      bindings: {
        sessions: "<",
      }
  });

  SListController.$inject = ['$state', 'gameService'];
  function SListController($state, gameService) {
      var vm = this;
      vm.sessions = null;
      vm.handleAction = handleAction;

      ////////////////

      function handleAction(action, session) {
        if(action == "join") {
          join(session);
        } else if(action == "detail") {
          detail(session);
        }
      }

      function join(session) {
        console.log("join");
        gameService.session_join(session);
      }

      function detail(session) {
        console.log("detail");
        $state.go('session.detail', {session: session});
      }

  }

})();
