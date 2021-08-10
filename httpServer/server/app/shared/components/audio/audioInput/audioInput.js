(function () {

  angular.module('awApp').component('audioInput', {
    templateUrl: 'app/shared/components/audio/audioInput/audioInput.html',
    controller: AudioInputController,
    bindings: {
      targetSize: "<",

      onSubmit: '&',
      onCancel: '&',
    }
  });

  function manageIncomingEvents(vm, $scope) {
    const fromEventPattern = rxjs.fromEventPattern;
    const tap = rxjs.operators.tap;

    fromEventPattern(
        (handler) => $scope.$on('cancel', handler)
    )
    .subscribe(
      evt  => {
        console.log('fromEventPattern', 'cancel', 'evt', evt);
      }
    );

    fromEventPattern(
        (handler) => $scope.$on('submit', handler)
    )
    .subscribe(
      evt  => {
        console.log('fromEventPattern', 'submit', 'evt', evt);
        // vm.onSubmit({audioSrc: vm.audioSrc});
        vm.submit();
      }
    );
  }

  AudioInputController.$inject = ["$scope", '$sce'];
  function AudioInputController($scope, $sce) {
    var ctrl = this;

    ctrl.$onInit = function() {
      console.log("AudioInputController", "$onInit");

      manageIncomingEvents(ctrl, $scope);
    };

    ctrl.audioSrc = null;
    ctrl.manageInput_data = manageInput_data;

    ////////////

    function manageInput_data(data) {
      console.log("manageInput_data", data);

      const audioSrc = data;
      // ctrl.audioSrc_orig = audioSrc;

      const audioSrc_trusted = $sce.trustAs($sce.RESOURCE_URL, audioSrc);
      ctrl.audioSrc = audioSrc_trusted;
      $scope.$apply();
    }

    ctrl.submit = function() {
      console.log("audioInput", "submit");
      const audioSrc_trusted = ctrl.audioSrc;
      const audioSrc = $sce.getTrustedResourceUrl(audioSrc_trusted);
      ctrl.onSubmit({audioSrc: audioSrc});

      // ctrl.onSubmit({audioSrc: ctrl.audioSrc_orig});
    };


  }

})();
