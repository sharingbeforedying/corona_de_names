(function () {

  angular.module('awApp').component('audioField', {
    templateUrl: 'app/shared/components/audio/audioField/audioField.html',
    controller: AudioFieldController,
    bindings: {

      audioSrcIn: '<',
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
        vm.manageInput(vm.audioSrc);
      }
    );
  }

  AudioFieldController.$inject = ['$scope', '$sce'];
  function AudioFieldController($scope, $sce) {
    var ctrl = this;

    ctrl.$onInit = function() {
      console.log("AudioFieldController", "$onInit");

      manageIncomingEvents(ctrl, $scope);

      if(ctrl.audioSrcIn) {
        const audioSrc_trusted = $sce.trustAs($sce.RESOURCE_URL, ctrl.audioSrcIn);
        ctrl.audioSrc = audioSrc_trusted;
      }
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

    function manageInput(audioSrc) {
      console.log("manageInput", audioSrc);
      ctrl.setEditing(false);
      if(audioSrc) {
        // ctrl.audioSrc = audioSrc;
        const audioSrc_trusted = $sce.trustAs($sce.RESOURCE_URL, audioSrc);
        ctrl.audioSrc = audioSrc_trusted;

        // $scope.$apply();

        ctrl.onSubmit({audioSrc: audioSrc});
      }
    }

    function manageCancel() {
      ctrl.setEditing(false);
      ctrl.onCancel();
    }
  }

})();
