(function () {

  angular.module("awApp").component('instanceEndCn', {
      templateUrl: 'app/components/instance/cn/end/instanceEndCn.html',
      controller: InstanceEndController,

      bindings: {
        roomService: '<',
      },
  });

  InstanceEndController.$inject = ['$scope', 'displaySettingsService'];
  function InstanceEndController($scope, displaySettingsService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("InstanceEndController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("InstanceEndController::$onInit", "vm.roomService", vm.roomService);

        vm.state              = vm.roomService.room.state;

        vm.grid_position = vm.state.grid_position;
        vm.grid_game     = vm.state.grid_game;
        vm.grid_content  = vm.state.grid_content;

        displaySettingsService.rx_displaySettings.subscribe({
          next(displaySettings) {
            // console.log("displaySettingsService.rx_displaySettings", "next", displaySettings);
            const cell_size = displaySettings.cell_size;
            $scope.$broadcast("cell_size", cell_size);

            const word_color = displaySettings.word_color;
            const word_size  = displaySettings.word_size;
            $scope.$broadcast("word_color", word_color);
            $scope.$broadcast("word_size", word_size);

          },
        });

        const gameoverType = vm.state.gameoverType;
        if(gameoverType) {
          var gameoverString = "";
          switch(gameoverType) {
            //win
            case 1:
              gameoverString = "YOU WIN !"
              break;
              //lose
            case 2:
              gameoverString = "YOU LOSE ! (black cell)";
              break;
            case 3:
              gameoverString = "YOU LOSE ! (out of time)";
              break;
            case 4:
              gameoverString = "YOU LOSE ! (too many errors)";
              break;

            default:
              throw new Error("unknown gameoverType", gameoverType);
          }
          vm.gameoverString = gameoverString;
        }


        vm.roomCommandNames   = Object.keys(vm.roomService.roomCommandHandlers);

        vm.moveToCommandNames = Object.keys(vm.roomService.moveToCommandHandlers);


        vm.do = (commandName) => {

          const clientCommand = {
            name : commandName,
            data : {},
          };

          vm.roomService.processCommand_p(clientCommand);
        }

        vm.move = (commandName) => {

          const clientCommand = {
            name : commandName,
            data : {},
          };

          vm.roomService.processCommand_p(clientCommand);
        }
      }

  }

})();
