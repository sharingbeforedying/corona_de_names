(function () {

  angular.module("awApp").component('sessionMain', {
      templateUrl: 'app/components/session/main/sessionMain.html',
      controller: SessionMainController,

      bindings: {
        roomService: '<',
      },
  });

  SessionMainController.$inject = ['$scope'];
  function SessionMainController(/*serverService,*/ $scope) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("SessionMainController", "vm.roomService", vm.roomService);

      vm.$onInit = function() {
        console.log("SessionMainController::$onInit", "vm.roomService", vm.roomService);

        vm.state              = vm.roomService.room.state;

        vm.roomCommandNames   = Object.keys(vm.roomService.roomCommandHandlers);

        vm.moveToCommandNames = Object.keys(vm.roomService.moveToCommandHandlers);


        vm.do = (commandName) => {

          const clientCommand = {
            name : commandName,
            data : {},
          };

          vm.roomService.processCommand_p(clientCommand);
        }


        vm.players            = vm.state.players;



        vm.sendChatMessage = (text) => {
          console.log("SessionMainController", "sendChatMessage", text);

          const clientCommand = {
            name : "°°sendChatMessage°°",
            data : {text: text},
          };

          vm.roomService.processCommand_p(clientCommand);

        };

        //listen to messages change
        // vm.roomService.onChatMessagesChange((chatMessages) => {
        //   console.log("ChatController", "onChatMessagesChange", chatMessages);
        //   vm.messages = chatMessages;
        //   $scope.$apply();
        // });

        vm.roomService.rx_messages.pipe(rxjs.operators.take(1)).subscribe({
          next(x) { console.log('rx_messages', 'got value ' + x);
            vm.messages = x;
            // $scope.$apply();
          },
          error(err) { console.error('rx_messages', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_messages', 'done'); }
        });

        vm.roomService.rx_messages.pipe(rxjs.operators.skip(1)).subscribe({
          next(x) { console.log('rx_messages', 'got value ' + x);
            vm.messages = x;
            $scope.$apply();
          },
          error(err) { console.error('rx_messages', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_messages', 'done'); }
        });


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
