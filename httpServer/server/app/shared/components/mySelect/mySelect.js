(function () {

angular.module('awApp').component('mySelect', {
  templateUrl: 'app/shared/components/mySelect/mySelect.html',
  controller: MySelectController,
  bindings: {
    text:              '<',
    startingOptionKey: '<',
    options:           '<',

    onUpdate: '&'
  }
});

MySelectController.$inject = [];
function MySelectController() {
  var vm = this;

  vm.$onInit = function() {
    console.log("mySelect", "vm", vm);
    vm.model = vm.options[vm.startingOptionKey];
  }
}

})();
