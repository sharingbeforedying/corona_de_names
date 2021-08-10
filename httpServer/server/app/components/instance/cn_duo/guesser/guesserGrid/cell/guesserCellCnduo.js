(function () {

  angular.module("awApp").component('guesserCellCnduo', {
      templateUrl: 'app/components/instance/cn_duo/guesser/guesserGrid/cell/guesserCellCnduo.html',
      controller: GuesserCellController,

      bindings: {
        // roomService: '<',
        cellModel: "<",
        onCellSelection: "&",
      },
  });

  GuesserCellController.$inject = [/*'$scope',*/ '$state', 'navigationService', 'displaySettingsService'];
  function GuesserCellController(/*serverService,*/ $state, navigationService, displaySettingsService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("GuesserCellController");

      vm.$onInit = function() {
        console.log("GuesserCellController::$onInit");

        const imageItem = vm.cellModel.content.items[1];
        if(imageItem) {
          const image = imageItem.content;
          vm.image = image;
        }
      }

      vm.cellClicked = function() {
        console.log("GuesserCellController.cellClicked");

        vm.onCellSelection();
      };



      vm.styleForCell = function() {
        var outStyle = {};

        return outStyle;
      };

      vm.styleForCard = function() {
        return {
          // "width"  : "" + $scope.displaySettings.cell_size + "px",
          "height" : "" + displaySettingsService.getSize_cell() + "px",
        };
      };

      vm.styleForWord = function() {
        return {
          "font-size": "" + displaySettingsService.getSize_font() + "px",
        };
      };




      class ContentStyle_unchecked {

        constructor() {

        }

        game(game) {
          const style = {
            "visibility" : "visible",
          };

          Object.assign(this, style);
          return this;
        }

      }

      class ContentStyle_checked {

        constructor() {

        }

        game(game) {
          const style = {
            "visibility" : "hidden",
          };

          Object.assign(this, style);
          return this;
        }

      }



      vm.styleForContent = function() {
        var outStyle = {};

        const evalType = vm.cellModel.game.evalType;
        switch(evalType) {
          case gameCellEvalType.UNCHECKED:
            {
            const cellStyle = new ContentStyle_unchecked();
            outStyle = cellStyle.game(vm.cellModel.game);
            }
            break;
          case gameCellEvalType.CHARACTERIZED:
            {
            const cellStyle = new ContentStyle_checked();
            outStyle = cellStyle.game(vm.cellModel.game);
            }
            break;
          default:
            console.log("unknown evalType", evalType);
            break;
        }

        return outStyle;
      }


      class ContentOverlayStyle_unchecked {

        constructor() {

        }

        game(game) {
          // const color = gameService.colorForPositionType(game.posType);
          const color = game.color;


          const style = {
            "background-color" : hexToRgba_cssString(color, 0.4),
          };

          Object.assign(this, style);
          return this;
        }
      }

      class ContentOverlayStyle_checked {

        constructor() {

        }

        game(game) {
          // const color = gameService.colorForPositionType(game.posType);
          const color = game.color;


          const style = {
            "background-color" : hexToRgba_cssString(color, 0.4),
          };

          Object.assign(this, style);
          return this;
        }
      }

      vm.styleForContentOverlay = function() {
        var outStyle = {};

        const evalType = vm.cellModel.game.evalType;
        switch(evalType) {
          case gameCellEvalType.UNCHECKED:
            {
            const cellStyle = new ContentOverlayStyle_unchecked();
            outStyle = cellStyle.game(vm.cellModel.game);
            }
            break;
          case gameCellEvalType.CHARACTERIZED:
            {
            const cellStyle = new ContentOverlayStyle_checked();
            outStyle = cellStyle.game(vm.cellModel.game);
            }
            break;
          default:
            console.log("unknown evalType", evalType);
            break;
        }

        return outStyle;
      }


  }

})();
