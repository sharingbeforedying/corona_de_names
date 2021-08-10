(function () {

angular.module('awApp').component('editableField', {
  templateUrl: 'app/shared/components/editableField/editableField.html',
  controller: EditableFieldController,
  bindings: {
    fieldValue: '<',
    fieldType: '@?',
    onUpdate: '&'
  }
});

function manageIncomingEvents(vm, $scope) {
  const fromEventPattern = rxjs.fromEventPattern;
  const tap = rxjs.operators.tap;

  fromEventPattern(
      (handler) => $scope.$on('edit', handler)
  )
  .subscribe(
    evt  => {
      console.log('fromEventPattern', 'edit', 'evt', evt);
      vm.editMode = true;
    }
  );

  fromEventPattern(
      (handler) => $scope.$on('submit', handler)
  )
  .subscribe(
    evt  => {
      console.log('fromEventPattern', 'submit', 'evt', evt);
      vm.editMode = false;
      vm.onUpdate({value: vm.fieldValue});
      vm.fieldValueCopy = vm.fieldValue;
    }
  );
}

EditableFieldController.$inject = ['$scope'];
function EditableFieldController($scope) {
  var ctrl = this;
  ctrl.editMode = false;

  ctrl.handleModeChange = function() {
    if (ctrl.editMode) {
      ctrl.onUpdate({value: ctrl.fieldValue});
      ctrl.fieldValueCopy = ctrl.fieldValue;
    }
    ctrl.editMode = !ctrl.editMode;
  };

  ctrl.reset = function() {
    ctrl.fieldValue = ctrl.fieldValueCopy;
  };

  ctrl.$onInit = function() {

    manageIncomingEvents(ctrl, $scope);

    // Make a copy of the initial value to be able to reset it later
    ctrl.fieldValueCopy = ctrl.fieldValue;

    // Set a default fieldType
    if (!ctrl.fieldType) {
      ctrl.fieldType = 'text';
    }
  };
}

})();
