(function () {

  angular.module("awApp").component('endCellCn', {
      templateUrl: 'app/components/instance/cn/end/endGrid/cell/endCellCn.html',
      controller: EndCellController,

      bindings: {
        // roomService: '<',
        cellModel: "<",
        onCellSelection: "&",

        // refreshTriggerCell : "<",
      },
  });

  EndCellController.$inject = ['displaySettingsService', '$scope'];
  function EndCellController(displaySettingsService, $scope) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("EndCellController");

      vm.$onInit = function() {
        console.log("EndCellController::$onInit");

        if(vm.cellModel.game.examinations.length > 0) {
          vm.examiner = vm.cellModel.game.examinations[0].examiner;
        }

      }

      vm.cellClicked = function() {
        console.log("EndCellController.cellClicked");

        // if(vm.cellModel.game.evalType == gameCellEvalType.CHARACTERIZED) {
        //   //ignore
        //   console.log("cell already CHARACTERIZED");
        // } else {
        //   vm.onCellSelection();
        // }

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

          var style = {};

        //   if(position.color == "#000000") {
        //     console.log("superstylin'");
        //     style = {
        //       "margin": "25px",
        //
        //       // "box-shadow": "0 0 0 4px red, 0 0 0 8px black, 0 0 0 12px red, 0 0 0 16px black, 0 0 0 20px red, 0 0 0 25px black",
        //       "box-shadow": `
        //       0 0 0 4px red,
        //       0 0 0 8px black,
        //       0 0 0 12px red,
        //       0 0 0 16px black,
        //       0 0 0 20px red,
        //       0 0 0 25px black
        //       `,
        //     };
        //   } else if(position.color == "#00FF00") {
        //     console.log("superstylin'");
        //     style = {
        //       "margin": "12px",
        //
        //       // "box-shadow": "0 0 0 4px red, 0 0 0 8px black, 0 0 0 12px red, 0 0 0 16px black, 0 0 0 20px red, 0 0 0 25px black",
        //       "box-shadow": `
        //       0 0 0 4px green,
        //       0 0 0 8px black,
        //       0 0 0 12px green
        //       `,
        //     };
        //   } else {
        //     style = {
        //       "border-width": "5px",
        //
        //       // "border-color": gameService.colorForPositionType(position.type),
        //       "border-color": position.color,
        //
        //       "border-style": "solid",
        //     };
        //   }
        //
        //   Object.assign(this, style);
        //   return this;
        // }

          function style_boxShadow(lineSize, ...colors) {

            const marginSize = lineSize * colors.length;

            function boxShadowLine(offset, color) {
              return "0 0 0" + " " + offset + "px" + " " + color;
            }

            const boxShadowsLines = colors.reduce((acc, color) => {
                const line = boxShadowLine(acc.offset, color);
                acc.lines.push(line);
                acc.offset += acc.lineSize;
                return acc;
            }, {lines : [], offset: lineSize, lineSize: lineSize}).lines;

            const boxShadowCompleteString = boxShadowsLines.join(",");

            const style =  {
              "margin": marginSize + "px",
              "box-shadow": boxShadowCompleteString,
            };

            return style;
          }

          const posType = position.type;
          const t = positionCellType;
          switch(posType) {
              // case positionCellType.UNKNOWN:
              case t.UNINITIALIZED:
              style = {};
              break;

              case t.NEUTRAL:
              style = {};
              break;
              case t.RED:
              {
                const color = position.color;
                // style = style_boxShadow(4, "green", color, "green", color, "green");
                style = style_boxShadow(4, "green", "green", color, "green", "green");
              }
              break;
              case t.BLUE:
              {
                const color = position.color;
                // style = style_boxShadow(4, "green", color, "green", color, "green");
                style = style_boxShadow(4, "green", "green", color, "green", "green");
              }
              break;
              case t.BLACK:
              style = style_boxShadow(4, "black", "black", "purple", "black", "black");
              break;

              case t.RED_RED__BLUE_BLUE:
              {
                const color = position.color;
                // style = style_boxShadow(4, "green", "violet", "green", "violet", "green");
                style = style_boxShadow(4, "green", "green", "purple", "green", "green");
              }
              break;

              case t.RED_RED__BLUE_NEUTRAL:
              style = {};
              break;
              case t.RED_BLACK__BLUE_BLUE:
              // style = style_boxShadow(4, "black", "red", "black", "red", "black");
              style = style_boxShadow(4, "black", "black", "red", "black", "black");
              break;
              case t.RED_BLACK__BLUE_NEUTRAL:
              // style = style_boxShadow(4, "black", "red", "black", "red", "black");
              style = style_boxShadow(4, "black", "black", "red", "black", "black");
              break;

              case t.BLUE_BLUE__RED_NEUTRAL:
              style = {};
              break;
              case t.BLUE_BLACK__RED_RED:
              // style = style_boxShadow(4, "black", "blue", "black", "blue", "black");
              style = style_boxShadow(4, "black", "black", "blue", "black", "black");
              break;
              case t.BLUE_BLACK__RED_NEUTRAL:
              // style = style_boxShadow(4, "black", "blue", "black", "blue", "black");
              style = style_boxShadow(4, "black", "black", "blue", "black", "black");
              break;

              default:
              console.log("unknown posType", posType);
              // color = "#DA6335";
              style = {};
              break;
            }

            // style = style_boxShadow(4, "blue", "white", "red", "yellow", "orange");
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
            outStyle = cellStyle.game(vm.cellModel.game);
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
