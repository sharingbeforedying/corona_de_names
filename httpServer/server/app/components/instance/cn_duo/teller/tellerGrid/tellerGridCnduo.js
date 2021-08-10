(function () {

  angular.module("awApp").component('tellerGridCnduo', {
      templateUrl: 'app/components/instance/cn_duo/teller/tellerGrid/tellerGridCnduo.html',
      controller: TellerGridController,

      bindings: {
        gridPosition: "<",
        gridGame:     "<",
        gridContent:  "<",
      },
  });

  TellerGridController.$inject = [/*'$scope',*/ '$state', 'navigationService'];
  function TellerGridController(/*serverService,*/ $state, navigationService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("TellerGridController");

      vm.$onInit = function() {
        console.log("TellerGridController::$onInit");

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
