(function () {

  angular.module("awApp").component('instanceGuesserCn', {
      templateUrl: 'app/components/instance/cn/guesser/instanceGuesserCn.html',
      controller: InstanceGuesserController,

      bindings: {
        roomService: '<',
      },
  });

  InstanceGuesserController.$inject = ['$state', 'navigationService', '$scope', 'displaySettingsService'];
  function InstanceGuesserController($state, navigationService, $scope, displaySettingsService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("InstanceGuesserController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("InstanceGuesserController::$onInit", "vm.roomService", vm.roomService);

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



        // const watched_state = onChange(vm.state, function (path, value, previousValue) {
        //     console.log("InstanceGuesserController::vm.state.onChange");
        //
        //     console.log('path:', path);
        //     console.log('value:', value);
        //     console.log('previousValue:', previousValue);
        //   }
        //   /*,{ignoreKeys: ["$changes"]}*/
        // );

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

        vm.rx_gameInfo = vm.roomService.rx_gameInfo;


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


        vm.submitSelection = function(cellModel) {
          console.log("submitSelection", cellModel);

          const isExamined = cellModel.game.evalType == gameCellEvalType.EXAMINED;
          if(isExamined) {
            const examinationPlayerId = cellModel.game.examinations[0].playerId;
            if(vm.player.id == examinationPlayerId) {
              //ignore
              console.log("cell already examined by player");
              return;
            }
          }


          vm.commandService.instance_guesser_submitCellSelection({
            playerId: vm.player.id,
            cellIndex: cellModel.index,
          });

          //play sound
          // if(cellModel.content.items[2]) {
          //   const audio = cellModel.content.items[2].content;
          //   vm.playAudio(audio);
          // }

        };

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



        vm.debug_submitSelection = function() {
            vm.commandService.instance_guesser_submitCellSelection({
              playerId: vm.player.id,
              cellIndex: 0,
            });
        };

        vm.debug_submitEndTurn = function() {
            vm.commandService.instance_guesser_submitEndTurn({
              playerId: vm.player.id,
            });
        };




        //debug
        vm.goToTellerRoom = function() {
          console.log("navigationService", navigationService);
          const roomService = navigationService.getRoomService("teller");
          $state.go("instanceTeller", {roomService: roomService});
        };

        vm.switchRole = function() {
          $state.go("instanceTeller_force");
        };

      }

  }

})();
