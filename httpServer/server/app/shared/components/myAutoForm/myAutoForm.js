(function () {

angular.module('awApp').component('myAutoForm', {
  templateUrl: 'app/shared/components/myAutoForm/myAutoForm.html',
  controller: MyAutoFormController,
  bindings: {
    formModel: '<',

    onSubmit: '&'
  }
});

MyAutoFormController.$inject = [];
function MyAutoFormController() {
  var vm = this;

  vm.$onInit = function() {
    console.log("myAutoForm", "vm", vm);
    vm.keys = Object.keys(vm.formModel);
    vm.form = Object.entries(vm.formModel).reduce((acc, [key, obj]) => {
      acc[key] = obj.default;
      return acc;
    }, {});
    console.log(vm.keys, vm.form);
  }

  function update(prop, value) {
    vm.form[prop] = value;
  };

}

})();
