(function () {

  angular.module("awApp").component('instanceTellerCn', {
      templateUrl: 'app/components/instance/cn/teller/instanceTellerCn.html',
      controller: InstanceTellerController,

      bindings: {
        roomService: '<',
      },
  });

  InstanceTellerController.$inject = ['$state', 'navigationService', '$scope', 'displaySettingsService'];
  function InstanceTellerController($state, navigationService, $scope, displaySettingsService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("InstanceTellerController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("InstanceTellerController::$onInit", "vm.roomService", vm.roomService);

        vm.state              = vm.roomService.room.state;

        vm.commandService     = vm.roomService.commandService;

        vm.roomCommandNames   = Object.keys(vm.roomService.roomCommandHandlers);
        vm.moveToCommandNames = Object.keys(vm.roomService.moveToCommandHandlers);




        vm.roomName = vm.state.name;

        vm.player = vm.state.player;

        vm.grid_position = vm.state.grid_position;
        vm.grid_game     = vm.state.grid_game;
        vm.grid_content  = vm.state.grid_content;

        vm.turn = vm.state.turn;
        vm.gameInfo = vm.state.gameInfo;


        vm.roomService.rx_roomCommand_in.subscribe({
          next(message) {
            console.log("rx_roomCommand_in", "next", message);
            const roomCommand = message.room_command;

            if(roomCommand == "playAudio") {
              const audio = message.data;
              vm.playAudio(audio);
            }

          },
        });

        vm.playAudio = function(audio) {
          // const audioPlayer = new Audio(audio);
          // audioPlayer.play();

          //stop previous (if any)
          {
            const audioPlayer = vm.ghettoBlaster;
            if(audioPlayer != null) {
              audioPlayer.pause();
              // audioPlayer.src = audioPlayer.src;
            }
          }

          //set new
          {
            const audioPlayer = new Audio(audio);
            vm.ghettoBlaster = audioPlayer;

            //start
            vm.ghettoBlaster.play();
          }

        };


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


        //debug
        vm.grid_position__goal = vm.state.grid_position__goal;


        vm.roomService.rx_grid_game.pipe(rxjs.operators.skip(1)).subscribe({
          next(grid_game) {
            console.log('rx_grid_game', 'next', grid_game);
            vm.grid_game = grid_game;
            $scope.$apply();
          },
          error(err) { console.error('rx_grid_game', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_grid_game', 'done'); }
        });



        const Rx = rxjs;
        vm.refreshTriggerCell = new Rx.Subject();

        vm.roomService.rx_cell_change.subscribe({
          next(cell_change) {
            console.log('rx_cell_change', 'next', cell_change);
            // $scope.$apply();
            vm.refreshTriggerCell.next(cell_change);
          },
          error(err) { console.error('rx_cell_change', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_cell_change', 'done'); }
        });

        vm.refreshTriggerTurn = new Rx.Subject();
        vm.roomService.rx_turn.pipe(rxjs.operators.skip(1)).subscribe({
          next(turn) {
            console.log('rx_turn', 'next', turn);
            vm.turn = turn;
            // $scope.$apply();
            vm.refreshTriggerTurn.next(turn);
          },
          error(err) { console.error('rx_turn', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_turn', 'done'); }
        });

        vm.rx_turn = vm.roomService.rx_turn;

        vm.rx_gameInfo = vm.roomService.rx_gameInfo;

        const rx_turn__tellerHint = vm.roomService.rx_turn
                                   // .pipe(rxjs.operators.skip(1))
                                     .pipe(
                                       rxjs.operators.filter(turn => {
                                         return turn.tellerStep != null && turn.guesserSteps.length == 0;
                                       }),
                                       rxjs.operators.tap(turn => {
                                         console.log("rx_turn__tellerHint", turn);
                                       })
                                     );

        rx_turn__tellerHint.subscribe({
          next(turn) {
            console.log("")
            vm.styleForNotificationOverlay = {
              // "visibility" : "visible",
              "visibility" : "hidden",

              "background-color" : hexToRgba_cssString("#123456", 0.4),
            };
            $scope.$apply();
          },
          error(err) { console.error('rx_turn', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_turn', 'done'); }
        });





        vm.debug_submitHint = function() {
            const hint = {
              word:"debugHint007",
              number:3,
            };

            vm.commandService.instance_teller_submitHint({
              playerId: vm.player.id,
              hint: hint,
            });
        }

        vm.manageSubmitHint = function(hint) {
            vm.commandService.instance_teller_submitHint({
              playerId: vm.player.id,
              hint: hint,
            });
        }


        vm.goToGuesserRoom = function() {
          console.log("navigationService", navigationService);
          const roomService = navigationService.getRoomService("guesser");
          $state.go("instanceGuesser", {roomService: roomService});
        }



      }

      // vm.styleForNotificationOverlay = function() {
      //   console.log("InstanceTellerController", "styleForNotificationOverlay");
      //   return {
      //     "visibility" : "hidden",
      //   };
      // };
      vm.styleForNotificationOverlay = {
        "visibility" : "hidden",
      };

      vm.notificationClicked = function(notifName) {
        console.log("InstanceTellerController", "notificationClicked", notifName);
        vm.styleForNotificationOverlay = {
          "visibility" : "hidden",
        };
        // $scope.$apply();
      }

      //debug
      vm.switchRole = function() {
        $state.go("instanceGuesser_force");
      }

  }

})();
