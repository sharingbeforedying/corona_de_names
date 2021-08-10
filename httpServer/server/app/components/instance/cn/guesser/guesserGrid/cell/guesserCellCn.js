(function () {

  angular.module("awApp").component('guesserCellCn', {
      templateUrl: 'app/components/instance/cn/guesser/guesserGrid/cell/guesserCellCn.html',
      controller: GuesserCellController,

      bindings: {
        // roomService: '<',
        cellModel: "<",
        onCellSelection: "&",

        refreshTriggerCell : "<",

      },
  });

  GuesserCellController.$inject = ['displaySettingsService', '$scope'];
  function GuesserCellController(displaySettingsService, $scope) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("GuesserCellController");

      vm.$onInit = function() {
        console.log("GuesserCellController::$onInit");

        if(vm.cellModel.game.examinations.length > 0) {
          vm.examiner = vm.cellModel.game.examinations[0].examiner;
        }
        // if(vm.cellModel.game.examinations["0"]) {
        //   vm.examiner = vm.cellModel.game.examinations["0"].examiner;
        // }

        vm.refreshTriggerCell.subscribe({
          next(cellChange) {
            console.log("cellChange.key", cellChange.key);
            console.log("cellChange.value", cellChange.value);

            if(cellChange.key == vm.cellModel.index) {

              vm.cellModel.game = cellChange.value;

              if(vm.cellModel.game.examinations.length > 0) {
                vm.examiner = vm.cellModel.game.examinations[0].examiner;
              }

              $scope.$apply();
            }

          },
          error(err) { console.error('refreshTriggerCell', 'something wrong occurred: ' + err); },
          complete() { console.log('refreshTriggerCell', 'done'); }
        });


      }

      vm.cellClicked = function() {
        console.log("GuesserCellController.cellClicked");

        if(vm.cellModel.game.evalType == gameCellEvalType.CHARACTERIZED) {
          //ignore
          console.log("cell already CHARACTERIZED");
        } else {
          vm.onCellSelection();
        }

      };



      vm.styleForCell = function() {
        var outStyle = {};

        return outStyle;
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
            // "visibility" : "hidden",
            "visibility" : "visible",
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
          case gameCellEvalType.EXAMINED:
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

        position(position) {

          var style;

          if(position.color == "#000000") {
            console.log("superstylin'");
            style = {
              "margin": "25px",

              // "box-shadow": "0 0 0 4px red, 0 0 0 8px black, 0 0 0 12px red, 0 0 0 16px black, 0 0 0 20px red, 0 0 0 25px black",
              "box-shadow": `
              0 0 0 4px red,
              0 0 0 8px black,
              0 0 0 12px red,
              0 0 0 16px black,
              0 0 0 20px red,
              0 0 0 25px black
              `,
            };
          } else if(position.color == "#00FF00") {
            console.log("superstylin'");
            style = {
              "margin": "12px",

              // "box-shadow": "0 0 0 4px red, 0 0 0 8px black, 0 0 0 12px red, 0 0 0 16px black, 0 0 0 20px red, 0 0 0 25px black",
              "box-shadow": `
              0 0 0 4px green,
              0 0 0 8px black,
              0 0 0 12px green
              `,
            };
          } else {
            style = {
              "border-width": "5px",

              // "border-color": gameService.colorForPositionType(position.type),
              "border-color": position.color,

              "border-style": "solid",
            };
          }

          Object.assign(this, style);
          return this;
        }

        game(game) {
          return this;
        }
      }

      class ContentOverlayStyle_checked {

        constructor() {

        }

        position(position) {

          var style;

          if(position.color == "#000000") {
            console.log("superstylin'");
            style = {
              "margin": "25px",

              // "box-shadow": "0 0 0 4px red, 0 0 0 8px black, 0 0 0 12px red, 0 0 0 16px black, 0 0 0 20px red, 0 0 0 25px black",
              "box-shadow": `
              0 0 0 4px red,
              0 0 0 8px black,
              0 0 0 12px red,
              0 0 0 16px black,
              0 0 0 20px red,
              0 0 0 25px black
              `,
            };
          } else if(position.color == "#00FF00") {
            console.log("superstylin'");
            style = {
              "margin": "12px",

              // "box-shadow": "0 0 0 4px red, 0 0 0 8px black, 0 0 0 12px red, 0 0 0 16px black, 0 0 0 20px red, 0 0 0 25px black",
              "box-shadow": `
              0 0 0 4px green,
              0 0 0 8px black,
              0 0 0 12px green
              `,
            };
          } else {
            style = {
              "border-width": "5px",

              // "border-color": gameService.colorForPositionType(position.type),
              "border-color": position.color,

              "border-style": "solid",
            };
          }

          Object.assign(this, style);
          return this;
        }

        game(game) {
          // const color = gameService.colorForPositionType(game.posType);
          const color = game.color;


          const style = {
            "background-color" : hexToRgba_cssString(color, 0.7),
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
          case gameCellEvalType.EXAMINED:
            {
            const cellStyle = new ContentOverlayStyle_unchecked();
            outStyle = cellStyle.position(vm.cellModel.position)
                                .game(vm.cellModel.game);
            }
            break;
          case gameCellEvalType.CHARACTERIZED:
            {
            const cellStyle = new ContentOverlayStyle_checked();
            outStyle = cellStyle.position(vm.cellModel.position)
                                .game(vm.cellModel.game);
            }
            break;
          default:
            console.log("unknown evalType", evalType);
            break;
        }

        return outStyle;
      }

      vm.styleForMissOverlay = function() {
        var outStyle = {};

        const evalType = vm.cellModel.game.evalType;
        switch(evalType) {
          case gameCellEvalType.EXAMINED:
            outStyle = {
              "visibility" : "visible",
            };
            break;
          default:
            outStyle = {
              "visibility" : "hidden",
            };
            break;
        }

        return outStyle;
      }

      vm.styleForMissWord = function() {
        var outStyle = {};

        const evalType = vm.cellModel.game.evalType;
        outStyle = {
          "color" : vm.cellModel.game.color,
        };

        return outStyle;
      }


  }

})();
