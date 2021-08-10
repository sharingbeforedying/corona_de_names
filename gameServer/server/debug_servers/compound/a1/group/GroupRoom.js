const colyseus = require('colyseus');
// const ClientState  = require('./ClientState.js').ClientState;

const LinkedRoom = require("../../../../rooms/LinkedRoom.js").LinkedRoom;

exports.GroupRoom = class GroupRoom extends LinkedRoom {

  constructor(presence) {
    super(presence);

  }

  onCreate (options) {
    super.onCreate(options);

    //console.log("onCreate", options);
    console.log(this.constructor.name, "onCreate", this.roomName);

    // this.maxClients = 1;
    this.setPrivate();

    this.passphrase    = options.passphrase;

  }

  onJoin (client, options) {
    super.onJoin(client, options);

    //console.log("onJoin",client,options);
    console.log(this.constructor.name, "onJoin", this.roomName, options);

    const pendingState = this.pendingState;

    const passphrase_client = options.passphrase;
    const passphrase_room   = this.passphrase;

    if(passphrase_client == passphrase_room) {
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


    const sessionId = client.sessionId;
    const [command, data] = message;

    console.log("sessionId", sessionId);
    console.log("command", command);
    console.log("data", data);

    //group
    if (command == "group_create") {
      this.state.cmd_group_create(sessionId, command, data);
    } else if (command == "group_set_name") {
      this.state.cmd_group_set_name(sessionId, command, data);
    }

    else if (command == "group_createPlayer_loginProfile") {
      this.state.cmd_group_createPlayer_loginProfile(sessionId, command, data);
    } else if (command == "group_createPlayer_createProfile") {
      this.state.cmd_group_createPlayer_createProfile(sessionId, command, data);
    } else if (command == "group_createPlayer_noProfile") {
      this.state.cmd_group_createPlayer_noProfile(sessionId, command, data);
    }

    else if (command == "group_setPlayerName") {
      this.state.cmd_group_setGroupPlayerName(sessionId, command, data);
    }

    else if (command == "group_removePlayer") {
      this.state.cmd_group_removePlayer(sessionId, command, data);
    }
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

  sendCommandAnswer(client, commandAnswer) {
    console.log("GroupRoom", this.roomName, "sendCommandAnswer", commandAnswer);
    client.send("answer", { commandAnswer : commandAnswer });
  }

}
