const colyseus = require('colyseus');

const LinkedRoom = require("../LinkedRoom.js").LinkedRoom;

const PortalRoomState  = require('./PortalRoomState.js').PortalRoomState;

exports.PortalRoom = class PortalRoom extends LinkedRoom {

  constructor(presence) {
    super(presence);

    const state = new PortalRoomState();
    // console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

    this.pendingStates         = {};
    this.clientForPendingState = {};
  }

  addPendingState(client, pendingState) {
    const room = this;
    pendingState.consumeFunc = () => {
      room.removePendingState(pendingState);
    };
    this.pendingStates[client.id]               = pendingState;
    this.clientForPendingState[pendingState.id] = client;
  }

  getPendingState(client) {
    return this.pendingStates[client.id];
  }

  removeClient(client) {
    console.log("removeClient", client.id);
    const pendingState = this.pendingStates[client.id];
    if(pendingState) {
      delete this.clientForPendingState[pendingState.id];
      delete this.pendingStates[client.id];
    }
  }

  removePendingState(pendingState) {
    console.log("removePendingState", pendingState.id);
    const client = this.clientForPendingState[pendingState.id];
    delete this.pendingStates[client.id];
    delete this.clientForPendingState[pendingState.id];

    client.leave();
  }

  onCreate (options) {
    super.onCreate(options);
    //console.log("onCreate", options);
    console.log(this.constructor.name, "onCreate");

    this.autoDispose = false;
    this.passphrase  = options.passphrase;

    this.setPrivate();
  }

  onJoin (client, options) {
    super.onJoin(client, options);
    //console.log("onJoin",client,options);
    console.log(this.constructor.name, "onJoin");

    const passphrase_client = options.passphrase;
    const passphrase_room   = this.passphrase;

    const canJoin = (passphrase_client == passphrase_room);
    if(canJoin) {
      const pendingState = this.getRoomLink(client).onJoin(options);
      this.addPendingState(client, pendingState);

      if(this.twoStepOnJoin) {
        this.twoStepOnJoin(client, options);

        //auto
        if(options.data && options.data.auto) {
          // const portalRoom = roomConnection.room;
          // const client     = roomConnection.roomClient;

          const autoAnswer = {};
          // portalRoom.sendAutoAnswer(client, autoAnswer);
          this.sendAutoAnswer(client, autoAnswer);
        }

      } else {
        throw new Error(this.constructor.name + ".twoStepOnJoin" + "== null");
      }

    } else {
      throw new Error("'passphrase' not found in the database!");
    }
  }

  handleMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log(this.constructor.name, "onMessage");

    const pendingState = this.getPendingState(client);
    console.log("pendingState", pendingState);

    // const sessionId = client.sessionId;
    const [command, data] = message;

    // console.log("sessionId", sessionId);
    console.log("command", command);
    console.log("data", data);

    if(command == "createAccess") {
      console.log("warning : invalid command : 'createAccess'");
    } else {
      this.getRoomLink(client).onMessage([command, data, pendingState]);
    }

  }

  onLeave (client, consented) {
    //console.log("onLeave", client, consented);
    console.log(this.constructor.name, "onLeave", "consented:", consented);

    this.getRoomLink(client).onLeave(consented);
    this.removeClient(client);

    //todo:
    //this.state.cmd_room_on_leave()  //->tell all someone left
    super.onLeave(client, consented);
  }

  onDispose() {
    console.log(this.constructor.name, "onDispose");

    super.onDispose();
  }


}
