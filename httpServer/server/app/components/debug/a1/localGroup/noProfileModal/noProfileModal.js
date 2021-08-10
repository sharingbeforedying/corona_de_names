(function() {

  angular.module('awApp').component('noProfileModal', {
    templateUrl: 'app/components/debug/a1/localGroup/noProfileModal/noProfileModal.html',
    bindings: {
      resolve: '<',

      close: '&',
      dismiss: '&'
    },
    controller: function () {
      var vm = this;

      vm.$onInit = function () {
        vm.name     = vm.resolve.name;
        // vm.img      = vm.resolve.img;
      };

    }
  });

})();
