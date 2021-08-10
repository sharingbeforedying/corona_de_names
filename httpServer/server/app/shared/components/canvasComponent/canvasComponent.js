(function () {

  angular.module('awApp').component('canvasComponent', {
    templateUrl: 'app/shared/components/canvasComponent/canvasComponent.html',
    controller: CanvasComponentController,
    bindings: {
      onSubmit: '&',
      onCancel: '&',
    }
  });

  // function manageIncomingEvents(vm, $scope) {
  //   const fromEventPattern = rxjs.fromEventPattern;
  //   const tap = rxjs.operators.tap;
  //
  //   fromEventPattern(
  //       (handler) => $scope.$on('cancel', handler)
  //   )
  //   .subscribe(
  //     evt  => {
  //       console.log('fromEventPattern', 'cancel', 'evt', evt);
  //     }
  //   );
  //
  //   fromEventPattern(
  //       (handler) => $scope.$on('submit', handler)
  //   )
  //   .subscribe(
  //     evt  => {
  //       console.log('fromEventPattern', 'submit', 'evt', evt);
  //       vm.onSubmit({imgSrc: vm.imgSrc});
  //     }
  //   );
  // }

  CanvasComponentController.$inject = ["$scope"];
  function CanvasComponentController($scope) {
    var vm = this;

    vm.$onInit = function() {
      console.log("ImageInputController", "$onInit");

      // manageIncomingEvents(ctrl, $scope);

      const canvas = new fabric.Canvas('canvas007', { selection: false });
      vm.canvas = canvas;

      //debug
      canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
      canvas.selectionColor = 'rgba(0,255,0,0.3)';
      canvas.selectionBorderColor = 'red';
      canvas.selectionLineWidth = 5;

    };

  }

})();
