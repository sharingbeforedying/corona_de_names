const colyseus = require('colyseus');

const LinkedRoom = require("../LinkedRoom.js").LinkedRoom;

const onChange = require('on-change');

exports.SharedRoom = class SharedRoom extends LinkedRoom {

  constructor(presence) {
    super(presence);

    this.pendingStates = {};

    const _myClients = {};
    const room = this;
    this.myClients = onChange(_myClients, function (path, value, previousValue) {
      console.log("myClients::onChange");

      console.log("path", path);
      console.log("previousValue", previousValue);
      console.log("value", value);


      // const myClient = value;
      // const clientRoomState = myClient.clientRoomConnection.room.state;

      if(previousValue === undefined) {
        room.onAddTetheredClient(value);
      } else if(value === undefined) {
        room.onRemoveTetheredClient(previousValue);
      } else if(previousValue !== undefined) {
        room.onChangeTetheredClient(value);
      } else {
        console.log("on-change ???, !value && !previousValue");
      }

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

  //myClients

  addMyClient(client, myClient) {
    this.myClients[client.id] = myClient;
  }

  getMyClient(client) {
    return this.myClients[client.id];
  }

  removeMyClient(client) {
    delete this.myClients[client.id];
  }

  //room events : myClient

onAddTetheredClient(tetheredClient) {
  super.onAddTetheredClient(tetheredClient);

  const client       = tetheredClient.client;
  const myClient     = tetheredClient.myClient;
  const incomingData = tetheredClient.incomingData;
    console.log("SharedRoom", "onAddMyClient");
  }

  onChangeTetheredClient(tetheredClient) {
    console.log("SharedRoom", "onChangeMyClient");
  }

  onRemoveTetheredClient(tetheredClient) {
    console.log("SharedRoom", "onRemoveMyClient");
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

    this.removeMyClient(client);

    super.onLeave(client, consented);
  }

}
