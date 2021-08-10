const colyseus = require('colyseus');

const SharedRoom = require("../sharedRoom/SharedRoom.js").SharedRoom;

const ChatRoomState = require("./ChatRoomState.js").ChatRoomState;

const ChatRoomAvatar = require("./ChatRoomAvatar.js").ChatRoomAvatar;

// const onChange = require('on-change');
// const rxjs = require('rxjs');

exports.ChatRoom = class ChatRoom extends SharedRoom {

  constructor(presence) {
    super(presence);

    const state = new ChatRoomState();
    // console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

  }

  //room events : myClient

  onAddTetheredClient(tetheredClient) {
    super.onAddTetheredClient(tetheredClient);

    const client       = tetheredClient.client;
    const myClient     = tetheredClient.myClient;
    const incomingData = tetheredClient.incomingData;

    const clientRoomState = myClient.clientRoomConnection.room.state;

    const roomAvatar = new ChatRoomAvatar(myClient.id, clientRoomState.name);
    this.state.members[myClient.id] = roomAvatar;
  }

  onChangeTetheredClient(tetheredClient) {
    super.onChangeTetheredClient(tetheredClient);

    const clientRoomState = myClient.clientRoomConnection.room.state;

    const roomAvatar = new ChatRoomAvatar(myClient.id, clientRoomState.name);
    this.state.members[myClient.id] = roomAvatar;
  }

  onRemoveTetheredClient(tetheredClient) {
    super.onRemoveTetheredClient(tetheredClient);

    //send 'x has left' to all
    this.state.cmd_chatLeave(myClient);
    delete this.state.members[myClient.id];
  }

  //room events : std

  handleMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("ChatRoom", "onMessage", this.roomName, client.id, message);
    //forward message
    this.getRoomLink(client).onMessage(message);


    const [command, data] = message;

    // console.log("sessionId", sessionId);
    console.log("command", command);
    console.log("data", data);

    //my_room
    if(command == "chatMessage") {

      const myClient = this.getMyClient(client);
      const text     = data.text;

      this.state.cmd_chatMessage(myClient, text);

    }
  }

  onLeave (client, consented) {
    //console.log("onLeave", client, consented);
    console.log("ChatRoom", "onLeave");

    //send 'x has left' to all
    // const myClient = this.getMyClient(client);
    // this.state.cmd_chatLeave(myClient);

    super.onLeave(client, consented);
  }


  ////////////

  sendCommandAnswer(client, commandAnswer) {
    console.log("ChatRoom", this.roomName, "sendCommandAnswer", commandAnswer);
    client.send("answer", { commandAnswer : commandAnswer });
  }

}
