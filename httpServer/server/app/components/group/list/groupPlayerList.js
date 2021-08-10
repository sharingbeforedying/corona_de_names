(function () {

  angular.module("awApp").component('ppList', {
      templateUrl: 'app/components/group/list/groupPlayerList.html',
      controller: PPListController,
      bindings: {
        groupPlayers: "<",
      }
  });

  PPListController.$inject = [];
  function PPListController() {
      var vm = this;

      vm.groupPlayers = [];
  }

})();
