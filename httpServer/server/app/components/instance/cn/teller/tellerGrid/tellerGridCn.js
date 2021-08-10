(function () {

  angular.module("awApp").component('tellerGridCn', {
      templateUrl: 'app/components/instance/cn/teller/tellerGrid/tellerGridCn.html',
      controller: TellerGridController,

      bindings: {
        gridPosition: "<",
        gridGame:     "<",
        gridContent:  "<",

        refreshTriggerCell: "<",

      },
  });

  function manageIncomingEvents(vm, $scope) {
    const fromEventPattern = rxjs.fromEventPattern;

    fromEventPattern(
        (handler) => $scope.$on('cell_size', handler)
    )
    .subscribe(
        data  => {
          console.log('fromEventPattern', 'cell_size', 'data', data);
          const cell_size = data[1];
          vm.cell_size = cell_size;
        }
    );

  }

  TellerGridController.$inject = ['$scope', '$state', 'navigationService'];
  function TellerGridController($scope, $state, navigationService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("TellerGridController");

      vm.$onInit = function() {
        console.log("TellerGridController::$onInit");

        // vm.cell_size = {
        //   width: 200,
        //   height:200,
        // };
        manageIncomingEvents(vm, $scope);

        console.log("vm.gridPosition", vm.gridPosition);
        console.log("vm.gridGame",     vm.gridGame);
        //console.log("vm.gridContent",  vm.gridContent);

        vm.child_models = (grid_position, grid_game, grid_content) => {

          const position_cells = grid_position.cells;
          const game_cells     = grid_game.cells;
          const content_cells  = grid_content.cells;

          const str_cellIndexes = Object.keys(game_cells)
          const numberSort = (a, b) => a - b;
          const cellIndexes = str_cellIndexes.map(s => parseInt(s)).sort(numberSort);
          return cellIndexes.map(cellIndex => {

            return {
              index:    cellIndex,

              position: position_cells[cellIndex],
              game:     game_cells[cellIndex],

              content:  content_cells[cellIndex],
            };
          });

        };

        if(vm.gridPosition && vm.gridGame && vm.gridContent) {
          vm.cellModels = vm.child_models(vm.gridPosition, vm.gridGame, vm.gridContent);
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
