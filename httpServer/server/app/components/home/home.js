(function () {

  angular.module("awApp").component('home', {
      templateUrl: 'app/components/home/home.html',
      controller: HomeController,
  });

  HomeController.$inject = ['gameService'];
  function HomeController(gameService) {
      var vm = this;
      // vm.localId = "";
      vm.connect_to_child = () => gameService.connect_to_child();
  }

})();
