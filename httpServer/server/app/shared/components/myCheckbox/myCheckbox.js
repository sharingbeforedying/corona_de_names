(function () {

angular.module('awApp').component('myCheckbox', {
  templateUrl: 'app/shared/components/myCheckbox/myCheckbox.html',
  controller: MyCheckboxController,
  bindings: {
    text:              '<',
    startingValue:     '<',

    onUpdate: '&'
  }
});

MyCheckboxController.$inject = [];
function MyCheckboxController() {
  var vm = this;

  vm.$onInit = function() {
    console.log("myCheckbox", "vm", vm);
    vm.model = vm.startingValue;
  }
}

})();
