(function () {

  angular.module("awApp").component('groupPlayerListItem', {
      templateUrl: 'app/components/group/list/item/groupPlayerListItem.html',
      controller: GroupPlayerListItemController,
      bindings: {
        groupPlayer : "<",

        onRemoveRequest : "&",
      }
  });


  GroupPlayerListItemController.$inject = [];
  function GroupPlayerListItemController() {
      var vm = this;
      vm.groupPlayer = null;
      vm.remove = remove;

      vm.update = function(prop, value) {
        // vm.onUpdate({hero: ctrl.hero, prop: prop, value: value});
      };

      function remove() {
        console.log("remove");
        vm.onRemoveRequest({player : vm.groupPlayer});
      }
  }

})();
