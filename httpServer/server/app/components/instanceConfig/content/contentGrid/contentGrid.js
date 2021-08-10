(function () {

  angular.module("awApp").component('contentGrid', {
      templateUrl: 'app/components/instanceConfig/content/contentGrid/contentGrid.html',
      controller: ContentGridController,

      bindings: {
        gridContent:  "<",
        // refreshTrigger: "<",
        refreshTriggerCell: "<",

        onCellUpdate: "&",

        // gridCommander: "<",
        rxCellStyle: "<",
      },
  });

  function manageIncomingEvents(vm, $scope) {
    const fromEventPattern = rxjs.fromEventPattern;
    const tap = rxjs.operators.tap;

    fromEventPattern(
        (handler) => $scope.$on('cell_size', handler)
    )
    .subscribe(
        data  => {
          console.log('fromEventPattern', 'cell_size', 'data', data);
          const cell_size = data[1];
          vm.cell_size = cell_size;
          // $scope.$apply();
        }
    );

  }

  ContentGridController.$inject = ['$scope', '$state', 'navigationService'];
  function ContentGridController($scope, $state, navigationService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("ContentGridController");

      vm.$onInit = function() {
        console.log("ContentGridController::$onInit");

        //console.log("vm.gridContent",  vm.gridContent);

        manageIncomingEvents(vm, $scope);

        // vm.refreshTrigger.subscribe({
        //   next(x) {
        //     console.log('refreshTrigger', 'got value ' + x);
        //     const gridContent = x;
        //
        //     if(gridContent) {
        //       vm.cellModels = vm.child_models(gridContent);
        //     }
        //     $scope.$apply();
        //   },
        //   error(err) { console.error('refreshTrigger', 'something wrong occurred: ' + err); },
        //   complete() { console.log('refreshTrigger', 'done'); }
        // });

        // vm.gridCommander.rx_all_edit.subscribe({
        //   next(x) {
        //     console.log('rx_allEdit', 'got value ' + x);
        //
        //   }
        // });



        vm.child_models = (grid_content) => {

          const content_cells  = grid_content.cells;

          const cellsOrder     = grid_content.cellsOrder;

          // const str_cellIndexes = Object.keys(content_cells)
          // const numberSort = (a, b) => a - b;
          // const cellIndexes = str_cellIndexes.map(s => {
          //   const cellId    = parseInt(s);
          //   const cellIndex = cellsOrder[cellId];
          //   return cellIndex;
          // }).sort(numberSort);

          // return cellIndexes.map(cellIndex => {
          return Object.entries(cellsOrder).map(([cellIndex, cellId]) => {

            return {
              index:    cellIndex,

              // content:  content_cells[cellIndex],
              content:  content_cells[cellId],
            };
          });

        };

        if(vm.gridContent) {
          vm.cellModels = vm.child_models(vm.gridContent);
        }

        vm.styleForGrid = function() {
          return {
            "background-color" : "Transparent",

            "pointer-events": "auto",
          };
        };


        vm.manageCellUpdate = function(cellUpdate) {
          console.log("manageCellUpdate", cellUpdate);
          vm.onCellUpdate({cellUpdate: cellUpdate});
        }

      }

  }

})();
