(function () {

  angular.module("awApp").component('templateGrid', {
      templateUrl: 'app/components/instanceConfig/content/templateGrid/templateGrid.html',
      controller: TemplateGridController,

      bindings: {
        gridContent:  "<",
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

    fromEventPattern(
        (handler) => $scope.$on('grid_content', handler)
    )
    .subscribe(
        data  => {
          console.log('fromEventPattern', 'grid_content', 'data', data);
          const grid_content = data[1];
          vm.gridContent = grid_content;
          // $scope.$apply();

          if(vm.gridContent) {
            vm.cellModels = vm.child_models(vm.gridContent);
          }
          $scope.$apply();

        }
    );

  }

  TemplateGridController.$inject = ['$scope', '$state', 'navigationService'];
  function TemplateGridController($scope, $state, navigationService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("TemplateGridController");

      vm.$onInit = function() {
        console.log("TemplateGridController::$onInit");

        //console.log("vm.gridContent",  vm.gridContent);

        manageIncomingEvents(vm, $scope);

        vm.child_models = (grid_content) => {

          const content_cells  = grid_content.cells;

          var cellsOrder = grid_content.cellsOrder;
          if(!cellsOrder) {
            const entries = [...Array(25).keys()].map(cellIndex => {
              const cellId = "" + cellIndex;
              return [cellIndex, cellId];
            });
            cellsOrder = Object.fromEntries(entries);
          }

          console.log("grid_content", grid_content);
          console.log("content_cells", content_cells);
          console.log("cellsOrder", cellsOrder);

          return Object.entries(cellsOrder).map(([cellIndex, cellId]) => {

            return {
              index:    cellIndex,

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


      }

  }

})();
