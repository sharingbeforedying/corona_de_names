const colyseus = require('colyseus');

const LinkedRoom = require("../LinkedRoom.js").LinkedRoom;

const onChange = require('on-change');

exports.SharedRoom = class SharedRoom extends LinkedRoom {

  constructor(presence) {
    super(presence);

    this.pendingStates = {};

    const _tetheredClients = {};
    const room = this;
    this.tetheredClients = onChange(_tetheredClients, function (path, value, previousValue) {
      console.log(this.constructor.name, "tetheredClients::onChange");

      console.log("path", path);
      // console.log("previousValue", previousValue);
      // console.log("value", value);


      // const myClient = value;
      // const clientRoomState = myClient.clientRoomConnection.room.state;

      if(previousValue === undefined) {
        // room.onAddTetheredClient(value);
      } else if(value === undefined) {
        room.onRemoveTetheredClient(previousValue);
      } else if(previousValue !== undefined) {
        room.onChangeTetheredClient(value);
      } else {
        console.log("on-change ???, !value && !previousValue");
      }

      // if(value === null) {
      //   console.log("value === null");
      //   console.log(kill.me.now);
      // }

    });
  }

  //pending states

  addPendingState(identifier, pendingState) {
    console.log(this.constructor.name, "addPendingState", identifier, pendingState);

    const nativeConsumeFunc = pendingState.consumeFunc;
    const room = this;
    pendingState.consumeFunc = () => {
      nativeConsumeFunc();                  //remove from portal
      room.removePendingState(identifier);  //remove from this
    };

    this.pendingStates[identifier] = pendingState;
  }

  getPendingState(identifier) {
    return this.pendingStates[identifier];
  }

  removePendingState(identifier) {
    console.log("removePendingState", identifier);
    delete this.pendingStates[identifier];
  }

  //tetheredClients

  addTetheredClient(client, myClient, incomingData = null) {

    const tetheredClient = {
      client: client,
      myClient: myClient,

      incomingData: incomingData,
    };

    this.tetheredClients[client.id] = tetheredClient;

    this.onAddTetheredClient(tetheredClient);
  }

  getTetheredClient(client) {
    return this.tetheredClients[client.id];
  }

  removeTetheredClient(client) {
    delete this.tetheredClients[client.id];
  }

  //room events : myClient

  onAddTetheredClient(tetheredClient) {
    console.log("SharedRoom", "onAddTetheredClient", tetheredClient.client.id);

    // const client       = tetheredClient.client;
    // const myClient     = tetheredClient.myClient;
    // const incomingData = tetheredClient.incomingData;
  }

  onChangeTetheredClient(tetheredClient) {
    console.log("SharedRoom", "onChangeTetheredClient", tetheredClient.client.id);
  }

  onRemoveTetheredClient(tetheredClient) {
    console.log("SharedRoom", "onRemoveTetheredClient", tetheredClient.client.id);
  }

  ///my clients

  getMyClientsInRoom() {
    // const onChange = require('on-change');
    const tetheredClients = onChange.target(this.tetheredClients);

    const myClientsDuplicateArr = Object.values(tetheredClients).map(tc => tc.myClient);
    // const nbTetheredClients     = myClientsDuplicateArr.length;

    function distinctMyClients(duplicateArr) {
       const array = duplicateArr;

       var unique = [];
       var distinct = [];
       for( let i = 0; i < array.length; i++ ){

         const id  = array[i].id;
         const obj = array[i];

         if( !unique[id]){
           distinct.push(obj);
           unique[id] = 1;
         }
       }
       return distinct;
    }

    const myClientsDistinctArr = distinctMyClients(myClientsDuplicateArr);
    const myClients = Object.fromEntries(myClientsDistinctArr.map(myClient => [myClient.id, myClient]));

    return myClients;
  }

  //room events : std

  onCreate (options) {
    super.onCreate(options);
    //console.log("onCreate", options);
    console.log(this.constructor.name, "onCreate");

    // this.maxClients = 1;
    this.setPrivate();
    this.passphrase  = options.passphrase;

    this.autoDispose = false;
    // this.close = options.close;
  }

  onJoin (client, options) {
    super.onJoin(client, options);

    console.log(this.constructor.name, "onJoin", this.roomName, options);

    const passphrase_client = options.passphrase;
    const passphrase_room   = this.passphrase;

    const passphraseValid = (passphrase_client == passphrase_room);

    if(!passphraseValid) {
      throw new Error("'passphrase' not found in the database!");
    }

    const pendingState = this.getPendingState(options.identifier);
    console.log("pendingState", pendingState);

    if(pendingState) {
      try {
        this.getRoomLink(client).onJoin(Object.assign(options, {pendingState : pendingState}));
      } catch(error) {
        //TODO: put back stack-concealing error
        throw error;
        // throw new Error("onJoin error: " + error.message);
      }
    } else {
      throw new Error("'identifier' not found in the database!");
    }
  }

  onLeave (client, consented) {
    console.log("SharedRoom", "onLeave", /*client,*/ consented);

    this.removeTetheredClient(client);

    super.onLeave(client, consented);
  }

}
