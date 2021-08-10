(function () {

  angular.module("awApp").component('sessionCreate', {
      templateUrl: 'app/components/session/create/sessionCreate.html',
      controller: SessionCreateController,
      bindings: {
        formModel: "<",
      }
  });

  SessionCreateController.$inject = ['gameService'];
  function SessionCreateController(gameService) {
      var vm = this;
      vm.formModel = null;

      vm.create = create;

      function create(form) {
        console.log("sessionCreate::create", form);
        gameService.session_create(form);
      };

  }

})();
