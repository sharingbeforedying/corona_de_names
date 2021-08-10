const colyseus = require('colyseus');
// const ClientState  = require('./ClientState.js').ClientState;

const LinkedRoom = require("../LinkedRoom.js").LinkedRoom;
// const SharedRoom = require("../sharedRoom/SharedRoom.js").SharedRoom;

exports.ClientRoom = class ClientRoom extends LinkedRoom {
// exports.ClientRoom = class ClientRoom extends SharedRoom {


  constructor(presence) {
    super(presence);
  }

  onCreate (options) {
    super.onCreate(options);

    //console.log("onCreate", options);
    console.log(this.constructor.name, "onCreate", this.roomName);

    this.maxClients = 1;
    this.setPrivate();

    this.pendingState    = options.pendingState;
    this.reportOnDispose = options.onDispose;

    // this.close = options.close;
  }

  onJoin (client, options) {
    super.onJoin(client, options);

    //console.log("onJoin",client,options);
    console.log(this.constructor.name, "onJoin", this.roomName, options);

    const pendingState = this.pendingState;

    const passphrase_client  = options.passphrase;
    const passphrase_pending = pendingState.passphrase();

    if(passphrase_client == passphrase_pending) {
      this.getRoomLink(client).onJoin(Object.assign(options, {pendingState : pendingState}));
    } else {
      throw new Error("'passphrase' not found in the database!");
    }
  }

  handleMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("ClientRoom", "onMessage", this.roomName);
    //forward message
    this.getRoomLink(client).onMessage(message);
  }

  onLeave (client, consented) {
    //console.log("onLeave", client, consented);
    console.log("ClientRoom", "onLeave");
    this.getRoomLink(client).onLeave(consented);

    super.onLeave(client, consented);

    this.disconnect();
  }

  onDispose() {
    console.log("ClientRoom", "onDispose", this.roomName, this.autoDispose ? "autoDisposed" : "manually disposed");
    super.onDispose();
  }


  ////////////

  sendMoveToRoom(client, roomAccess) {
    console.log("ClientRoom", this.roomName, "sendMoveToRoom", roomAccess);
    client.send("answer", { command : "move_to_room", roomAccess : roomAccess });
  }

  sendCommandAnswer(client, commandAnswer) {
    console.log("ClientRoom", this.roomName, "sendCommandAnswer", commandAnswer);
    client.send("answer", { commandAnswer : commandAnswer });
  }

}
