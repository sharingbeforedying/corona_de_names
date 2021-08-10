(function () {

  angular.module("awApp").component('sListItem', {
      templateUrl: 'app/components/session/list/item/sessionListItem.html',
      controller: SListItemController,
      bindings: {
        session : "<",

        onActionRequest: "&",
      }
  });


  SListItemController.$inject = [];
  function SListItemController() {
      var vm = this;
      vm.session = null;

      vm.actions = {
        join : {
          name: "join session",
          go : () => vm.onActionRequest({action: 'join', obj: vm.session}),
        },
        detail : {
          name: "show detail",
          go : () => vm.onActionRequest({action: 'detail', obj: vm.session}),
        }
      }

      vm.actionsPopover = {
        actions: vm.actions,
        templateUrl: "'app/shared/templates/actionsPopoverTemplate.html'",
        title: 'Actions'
      };

  }

})();
