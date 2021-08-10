(function () {

angular.module("awApp").service('contentRoomClientService_incoming', function(gameService) {
  this.data = {};

  this.listenToChanges = function(room) {

    const localId = room.sessionId;
    this.data["localId"] = localId;

    const cs_incoming = this;
    room.state.onChange = (changes) => {
      console.log("contentRoomClientService_incoming::room.state.onChange");
      changes.forEach(change => {
          console.log(change.field);
          console.log(change.value);
          console.log(change.previousValue);

          if(change.field == "<>") {
            // const content = change.value.toJSON();
            // cs_incoming.manageChanges_content()
          } else {
            cs_incoming.data[change.field] = change.value;
          }

          cs_incoming.notifyObservers();
      });
    };

  };


  //OBSERVER PATTERN

  this.observerCallbacks = [];

  //register an observer
  this.registerObserverCallback = function(callback){
    this.observerCallbacks.push(callback);
  };

  //call this when you know 'foo' has been changed
  this.notifyObservers = function(){
    const serviceName = "contentRoomClientService_incoming";
    this.observerCallbacks.forEach((callback,i) => {callback(serviceName);});
  };





  //processing

  this.manageChanges_content = function(localId, groupPlayerGroups) {
    console.log("state.groupPlayerGroups has changed");

  };





  //INTERFACE
  const cs = this;
  cs.interface = {};

  cs.interface.getContent = function() {

  };


  cs.interface.get_grid__content = function() {
    console.log("c_rcs.get_grid__content");
    return cs.data.grid;
  };


  //DI:
  console.log("contentRoomClientService_incoming", "interface injection");
  console.log("contentRoomClientService_incoming", "interface", Object.keys(this.interface));
  Object.keys(this.interface).forEach((fkey, i) => {
    gameService[fkey] = this.interface[fkey];
  });

  this.registerObserverCallback((serviceName) => {
    gameService.notifyObservers();
  });

});

angular.module("awApp").service('contentRoomClientService_outgoing', function(gameService) {

  this.registerCommands = function(room) {

    const cs = this;
    cs.interface = {};

    cs.interface.group_addPlayer = function(nickname) {
      room.send("client", ["group_createPlayer", {nickname: nickname}]);
    };

    cs.interface.sendToServer_word = function(cellIndex, word) {
      room.send("client", ["setWordAtIndex", {index: cellIndex, word: word}]);
    }

    cs.interface.sendToServer_image = function(cellIndex, image) {
      room.send("client", ["setImageAtIndex", {index: cellIndex, image: image}]);
    }


    //DI:
    console.log("contentRoomClientService_outgoing", "interface injection");
    console.log("contentRoomClientService_outgoing", "interface", Object.keys(this.interface));
    Object.keys(this.interface).forEach((fkey, i) => {
      gameService[fkey] = this.interface[fkey];
    });

  };

});

angular.module("awApp").service('contentRoomClientService', function(contentRoomClientService_incoming, contentRoomClientService_outgoing) {
  console.log('contentRoomClientService');

  const roomPort = 2567;
  const roomName = "content_room";

  this.client = new Colyseus.Client("ws://localhost:" + roomPort);

  this.client.joinOrCreate(roomName, {/* options */}).then(room => {
    console.log("joined successfully", room);

    //in
    contentRoomClientService_incoming.listenToChanges(room);

    //out
    contentRoomClientService_outgoing.registerCommands(room);

  }).catch(e => {
    console.error("join error", e);
  });


});

//initialize the service(s)
angular.module("awApp").run(function (contentRoomClientService) {
  console.log("run");
  //this will induce the dependency injections
});

})();
