(function () {

  angular.module("awApp").component('actionPopover', {
      templateUrl: 'app/shared/components/actionPopover/actionPopover.html',
      controller: ActionPopoverController,
      bindings: {
        actions : "<",
      }
  });

  ActionPopoverController.$inject = [];
  function ActionPopoverController() {
      var vm = this;
      vm.actions = [];
  }

})();
