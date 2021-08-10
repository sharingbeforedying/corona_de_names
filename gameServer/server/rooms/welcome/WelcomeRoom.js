const colyseus = require('colyseus');

const LinkedRoom = require("../LinkedRoom.js").LinkedRoom;

const WelcomeRoomState  = require('./WelcomeRoomState.js').WelcomeRoomState;

exports.WelcomeRoom = class WelcomeRoom extends LinkedRoom {

  constructor(presence) {
    super(presence);

    const state = new WelcomeRoomState();
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
    } else {
      throw new Error("'passphrase' not found in the database!");
    }
  }

  // onMessage (client, message) {
    //console.log("onMessage",client,message);
  handleMessage(client, message) {
    console.log(this.constructor.name, "handleMessage", message);

    const pendingState = this.getPendingState(client);
    console.log("pendingState", pendingState);

    // const sessionId = client.sessionId;
    const [command, data] = message;

    // console.log("sessionId", sessionId);
    console.log("command", command);
    console.log("data", data);

    this.getRoomLink(client).onMessage([command, data, pendingState]);

    //my_room
    if(command == "go_to_my_room") {
      var commandAnswer;
      try {
        //open client room
        // const moveToConfig = this.createAccess(client, message);
        const moveToConfig = this.getRoomLink(client).onMessage(["createAccess", data, pendingState]);

        commandAnswer = {
          command: command,
          payload : moveToConfig,
        };

      } catch(error) {
        console.log("error", error);

        commandAnswer = {
          command: command,
          error : "error in createAccess(): " + error.message,
        };
      }
      console.log("HERE!!");
      client.send("answer", { commandAnswer : commandAnswer });
      console.log("THERE!!");
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
