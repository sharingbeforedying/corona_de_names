const colyseus = require('colyseus');

const RoomConnection = require("./RoomConnection.js").RoomConnection;

exports.LinkedRoom = class LinkedRoom extends colyseus.Room {

  constructor(presence) {
    super(presence);

    this.roomLinks = {};
  }

  addRoomLink(client) {
    const roomConnection = new RoomConnection(this, client);
    const roomLink       = this.createRoomLink(roomConnection);
    this.roomLinks[client.id] = roomLink;
  }

  getRoomLink(client) {
    // if(!this.roomLinks[client.id]) {
    //   addRoomLink(client);
    // }
    return this.roomLinks[client.id];
  }

  removeRoomLink(client) {
    delete this.roomLinks[client.id];
  }



  onCreate (options) {
    console.log("LinkedRoom", "onCreate");

    this.createRoomLink = options.createRoomLink;
    console.log("this.createRoomLink", this.createRoomLink);

    //TODO: beware, there must be a security flaw in subClass rooms
    this.onMessage("client", (client, message) => {
      this.handleMessage(client,message);
    });
  }

  onJoin (client, options) {
    console.log("LinkedRoom", "onJoin");
    this.addRoomLink(client);
    // this.getRoomLink(client).onJoin(options);
  }

  handleMessage (client, message) {
    console.log("LinkedRoom", "handleMessage");
    // this.getRoomLink(client).onMessage(message);
  }

  onLeave (client, consented) {
    console.log("LinkedRoom", "onLeave", "consented:", consented);
    // this.getRoomLink(client).onLeave(consented);
    this.removeRoomLink(client);
  }

  onDispose() {
    console.log("LinkedRoom", "onDispose");
    Object.values(this.roomLinks).forEach((roomLink, i) => {
      roomLink.onRoomDispose();
      roomLink.roomConnection.close();
    });
    this.roomLinks = null;

    this.didDispose();
  }

  didDispose() {
    console.log("LinkedRoom", "didDispose");
  }


  ////TODO: clean up this "auto" mess
  sendAutoAnswer(client, autoAnswer) {
    console.log("LinkedRoom", this.roomName, "sendAutoAnswer", autoAnswer);
    client.send("answer", { autoAnswer : autoAnswer });
  }


  //sucked-in
  broadcastTrapHole(trapHole) {
    console.log("LinkedRoom", this.roomName, "broadcastTrapHole", trapHole);
    this.broadcast({ trapHole : trapHole });
  }

  sendTrapHole(client, trapHole) {
    console.log("LinkedRoom", this.roomName, "sendTrapHole", trapHole);
    client.send("answer", { trapHole : trapHole });
  }

}
