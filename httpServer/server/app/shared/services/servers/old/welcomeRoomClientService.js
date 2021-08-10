(function () {

angular.module("awApp").service('welcomeRoomClientService_incoming', function(gameService) {
  console.log("welcomeRoomClientService_incoming");

  this.data = {};

  this.listenToChanges = function(room) {

    const localId = room.sessionId;
    this.data["localId"] = localId;

    const cs_incoming = this;
    const changesProcesser = new ChangesProcesser(room, cs_incoming);
    room.state.onChange = (changes) => {
      changesProcesser.logChanges(changes)
                      .processChanges_pending(changes)
                      .notifyObservers(changes);
    };

  };


  //processing

  class ChangesProcesser {

    constructor(room, cs_incoming) {
      this.room        = room;
      this.cs_incoming = cs_incoming;

      this.specificListeners = {};
    }

    listenIfExists(predicate, name, listenStart, listenStop) {
      if(predicate) {
        console.log("predicate == true");
        const listener = this.specificListeners[name];
        if(!listener) {
          console.log("listenStart");
          this.specificListeners[name] = true;
          listenStart();
        }
      } else {
        console.log("predicate == false");
        console.log("listenStop");
        this.specificListeners[name] = false;
        listenStop();
      }
    }

    listenDynamic(name, schemaGetter, evtProvider_create, evtProvider_change) {
      this.listenIfExists(schemaGetter(), name, () => {

        schemaGetter().onChange = (changes) => {
          console.log(name, ".onChange", changes);
          const schema = schemaGetter();
          this.cs_incoming.data[name] = schema;
          evtProvider_change.notifyObservers(schema);
        };

        console.log(name, ".onCreate");
        const schema = schemaGetter();
        this.cs_incoming.data[name] = schema;
        evtProvider_create.notifyObservers(schema);

      }, () => {
        const schema = schemaGetter();
        this.cs_incoming.data[name] = schema;
        evtProvider_change.notifyObservers(schema);
        // getter().onChange = null;
      });
    }

    logChanges(changes) {
      changes.forEach(change => {
          // console.log(change.field);
          // console.log(change.previousValue);
          // console.log(change.value);

          console.log("room.state.onChange", change.field, change.value);
      });

      return this;
    }

    processChanges_pending(changes) {

      changes.forEach(change => {
        if(change.field == "pending") {
          const pending = change.value.toJSON();

          // this.cs_incoming.data["pending"] = pending;
          this.cs_incoming.setPending(pending);
        }
      });

      return this;
    }

    notifyObservers(changes) {
      this.cs_incoming.notifyObservers();

      return this;
    }

  }


  //OBSERVER PATTERN

  this.observerCallbacks = [];

  //register an observer
  this.registerObserverCallback = function(callback){
    this.observerCallbacks.push(callback);
  };

  //call this when you know 'foo' has been changed
  this.notifyObservers = function() {
    const serviceName = "welcomeRoomClientService_incoming";
    this.observerCallbacks.forEach((callback,i) => {callback(serviceName);});
  };


  //state change

  class StateEventProvider {
    constructor() {
      this.observerCallbacks = [];
    }

    onChange(callback) {
      this.observerCallbacks.push(callback);
    }

    notifyObservers(obj) {
      const serviceName = "welcomeRoomClientService_incoming";
      this.observerCallbacks.forEach((callback,i) => {callback(obj);});
    }
  }

  this.stateEventProvider_change__pending = new StateEventProvider("change__pending");
  this.stateEventProvider_create__client  = new StateEventProvider("create__client");


  this.setPending = function(pending) {
    this.data["pending"] = pending;
    this.stateEventProvider_change__pending.notifyObservers(pending);
  }

  this.setServerError = function(error) {
    this.data["serverError"] = error;
  }





  //INTERFACE
  const cs = this;
  cs.interface = {}

  cs.interface.getLocalId = function() {
    return cs.data["localId"];
  }

  cs.interface.getPendingMap = function() {
    return cs.data["pending"];
  }

  cs.interface.stateEventProvider_change__pending = cs.stateEventProvider_change__pending;
  cs.interface.stateEventProvider_create__client  = cs.stateEventProvider_create__client;

  //DI:
  console.log("welcomeRoomClientService_incoming", "interface injection");
  console.log("welcomeRoomClientService_incoming", "interface", Object.keys(this.interface));
  Object.keys(this.interface).forEach((fkey, i) => {
    gameService[fkey] = this.interface[fkey];
  });

  this.registerObserverCallback((serviceName) => {
    gameService.notifyObservers();
  });

});








angular.module("awApp").service('welcomeRoomClientService_outgoing', function(welcomeRoomClientService_incoming, gameService, clientRoomClientService) {
  console.log("welcomeRoomClientService_outgoing");

  this.registerCommands = function(room) {

    const cs = this;
    cs.interface = {};

    cs.interface.go_to_my_room = function() {

      return new Promise((resolve, reject) => {
        const command = "go_to_my_room";
        const data    = {};

        room.onMessage("answer", (message) => {
          console.log("message received from server");
          console.log(message);

          if(message.command == command) {
            if(message.error) {
              reject(message.error);
            } else {
              resolve(message.payload);
            }
          }

        });

        room.send("client", [command, data]);
      })
      .then(connectionConfig => {
        console.log("go_to_my_room() : success", connectionConfig);

        //this will induce dependency injection
        clientRoomClientService.connect(connectionConfig);

      })
      .catch(error => {
        console.log("go_to_my_room() : error", error);
        welcomeRoomClientService_incoming.setServerError(error);
      });

    }


    //DI:
    console.log("welcomeRoomClientService_outgoing", "interface injection");
    console.log("welcomeRoomClientService_outgoing", "interface", Object.keys(this.interface));
    Object.keys(this.interface).forEach((fkey, i) => {
      gameService[fkey] = this.interface[fkey];
    });
  };


});

angular.module("awApp").service('welcomeRoomClientService', function(welcomeRoomClientService_incoming, welcomeRoomClientService_outgoing, roomConnectionService) {
  console.log('welcomeRoomClientService');

  this.connect = function() {

    const connectionConfig = {
      roomPort: 2567,
      roomName: "welcome_room",
      passphrase : "i_have_token_a_shower",
    };

    roomConnectionService.joinPublicRoom_p(connectionConfig)
                         .then(room => {

                           //in
                           welcomeRoomClientService_incoming.listenToChanges(room);

                           //out
                           welcomeRoomClientService_outgoing.registerCommands(room);

                         });

  };


});

//initialize the service(s)
angular.module("awApp").run(function (welcomeRoomClientService) {
  console.log("run");

  const connectionConfig = {};
  connectionConfig.roomPort = 2567;
  connectionConfig.roomName = "welcome_room";

  //this will induce the dependency injections
  welcomeRoomClientService.connect(connectionConfig);
});

})();
