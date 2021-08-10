(function () {

  angular.module("awApp").component('guesserGridCnduo', {
      templateUrl: 'app/components/instance/cn_duo/guesser/guesserGrid/guesserGridCnduo.html',
      controller: GuesserGridController,

      bindings: {
        // gridPosition: "<",
        gridGame:     "<",
        gridContent:  "<",

        onCellSelection: "&",
      },
  });

  GuesserGridController.$inject = [/*'$scope',*/ '$state', 'navigationService'];
  function GuesserGridController(/*serverService,*/ $state, navigationService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("GuesserGridController");

      vm.$onInit = function() {
        console.log("GuesserGridController::$onInit");

        // console.log("vm.gridPosition", vm.gridPosition);
        console.log("vm.gridGame",     vm.gridGame);
        //console.log("vm.gridContent",  vm.gridContent);

        // const watched_gridGame = onChange(vm.gridGame, function (path, value, previousValue) {
        //     console.log("GuesserGridController::vm.gridGame.onChange");
        //
        //     console.log('path:', path);
        //   	console.log('value:', value);
        //   	console.log('previousValue:', previousValue);
        //   }
        //   /*,{ignoreKeys: ["$changes"]}*/
        // );

        vm.child_models = (/*grid_position,*/ grid_game, grid_content) => {

          // const position_cells = grid_position.cells;
          const game_cells     = grid_game.cells;
          const content_cells  = grid_content.cells;

          const str_cellIndexes = Object.keys(game_cells)
          const numberSort = (a, b) => a - b;
          const cellIndexes = str_cellIndexes.map(s => parseInt(s)).sort(numberSort);
          return cellIndexes.map(cellIndex => {

            return {
              index:    cellIndex,

              // position: position_cells[cellIndex],
              game:     game_cells[cellIndex],

              content:  content_cells[cellIndex],
            };
          });

        };

        if(/*vm.gridPosition &&*/ vm.gridGame && vm.gridContent) {
          vm.cellModels = vm.child_models(/*vm.gridPosition,*/ vm.gridGame, vm.gridContent);
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
