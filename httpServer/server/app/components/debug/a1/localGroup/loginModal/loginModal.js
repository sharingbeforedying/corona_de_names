(function() {

  angular.module('awApp').component('loginModal', {
    templateUrl: 'app/components/debug/a1/localGroup/loginModal/loginModal.html',
    bindings: {
      resolve: '<',

      close: '&',
      dismiss: '&'
    },
    controller: function () {
      var vm = this;

      vm.$onInit = function () {
        vm.login    = vm.resolve.login;
        vm.password = vm.resolve.password;
      };

    }
  });

})();
