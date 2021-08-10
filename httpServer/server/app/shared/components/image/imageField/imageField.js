(function () {

  angular.module('awApp').component('imageField', {
    templateUrl: 'app/shared/components/image/imageField/imageField.html',
    controller: ImageFieldController,
    bindings: {
      imgSrc: '<',
      targetSize: '<',

      onSubmit: '&',
      onCancel: '&',
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
        vm.setEditing(true);
      }
    );

    fromEventPattern(
        (handler) => $scope.$on('submit', handler)
    )
    .subscribe(
      evt  => {
        console.log('fromEventPattern', 'submit', 'evt', evt);

        // vm.setEditing(false);
        // vm.onUpdate({value: vm.fieldValue});
        vm.manageInput(vm.imgSrc);
      }
    );
  }

  ImageFieldController.$inject = ['$scope'];
  function ImageFieldController($scope) {
    var ctrl = this;

    ctrl.$onInit = function() {
      console.log("ImageFieldController", "$onInit");

      manageIncomingEvents(ctrl, $scope);
    };

    ctrl.editMode = false;

    ctrl.setEditing = function(editing) {
      ctrl.editMode = editing;
    };

    ctrl.manageInput  = manageInput;
    ctrl.manageCancel = manageCancel;


    // ctrl.reset = function() {
    //   ctrl.fieldValue = ctrl.fieldValueCopy;
    // };

    // ctrl.$onInit = function() {
    //   // Make a copy of the initial value to be able to reset it later
    //   ctrl.fieldValueCopy = ctrl.fieldValue;
    //
    //   // Set a default fieldType
    //   if (!ctrl.fieldType) {
    //     ctrl.fieldType = 'text';
    //   }
    // };

    //////

    function manageInput(imgSrc) {
      console.log("manageInput", imgSrc);
      ctrl.setEditing(false);
      if(imgSrc) {
        ctrl.imgSrc = imgSrc;
        ctrl.onSubmit({imgSrc: ctrl.imgSrc});
      }
    }

    function manageCancel() {
      ctrl.setEditing(false);
      ctrl.onCancel();
    }
  }

})();
