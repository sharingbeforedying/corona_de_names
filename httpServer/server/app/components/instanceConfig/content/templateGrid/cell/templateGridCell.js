(function () {

  angular.module("awApp").component('templateGridCell', {
      templateUrl: 'app/components/instanceConfig/content/templateGrid/cell/templateGridCell.html',
      controller: TemplateGridCellController,
      bindings: {
        cellModel: '<',
      }
  });

  function manageIncomingEvents(vm, $scope) {
    const fromEventPattern = rxjs.fromEventPattern;
    const tap = rxjs.operators.tap;

    // fromEventPattern(
    //     (handler) => $scope.$on('all_edit', handler)
    // )
    // .subscribe(
    //   evt  => {
    //     console.log('fromEventPattern', 'all_edit', 'evt', evt);
    //     $scope.$broadcast("edit");
    //   }
    // );
    //
    // fromEventPattern(
    //     (handler) => $scope.$on('all_submit', handler)
    // )
    // .subscribe(
    //   evt  => {
    //     console.log('fromEventPattern', 'all_submit', 'evt', evt);
    //     $scope.$broadcast("submit");
    //   }
    // );
  }

  TemplateGridCellController.$inject = ['$scope'];
  function TemplateGridCellController($scope) {
    console.log("TemplateGridCellController");

      var vm = this;
      // vm.session = null;

      vm.$onInit = function() {
        console.log("TemplateGridCellController", "$onInit");

        manageIncomingEvents(vm, $scope);
        // setupOutgoingEvents(vm, $scope);

        console.log("vm.cellModel", vm.cellModel);

        // vm.targetSize_cell = {
        //   width:  400,
        //   height: 400,
        // };
        //
        // vm.contentCell = vm.cellModel.content;
        //
        // const word = vm.contentCell.items[0].content;
        // console.log("word", word);
        // vm.word = word;
        //
        // const image = vm.contentCell.items[1].content;
        // console.log("image", image);
        // vm.image = image;

      };


  }

})();
