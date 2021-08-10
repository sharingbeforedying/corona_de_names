(function() {

angular.module("awApp").service('clientRoomClientService', function(roomConnectionService, gameRoomClientService, gameService) {
  console.log('clientRoomClientService');

  this.connect = function(connectionConfig) {
    console.log("connect", connectionConfig);

    roomConnectionService.createPrivateRoom_p(connectionConfig)
                         .then(room => {

                           gameRoomClientService.bindToRoom(room);

                           gameService.stateEventProvider_create__client.notifyObservers({lol : "lolilol"});

                           // room.onMessage.once((message) => {
                           const oncePromise = new Promise((resolve, reject) => {
                             room.onMessage("answer", (message) => {
                               resolve(message);
                             });
                           });
                           oncePromise.then((message) => {
                             if(message.command == "move_to_room") {
                               const roomAccess = message.roomAccess;
                               this.moveToRoom(roomAccess);
                             }
                           });


                         });

  };

  this.moveToRoom = function(connectionConfig) {
    console.log("moveToRoom", connectionConfig);

    roomConnectionService.joinPrivateRoom_p(connectionConfig)
                         .then(room => {

                           console.log("room.name", room.name);
                           console.log("room.state", room.state);

                           switch(room.roomType) {
                              case 0:
                                break;

                              default:
                                console.log("unknown room type", room.type, room);
                                break
                           }

                         });

  };

});

})();
