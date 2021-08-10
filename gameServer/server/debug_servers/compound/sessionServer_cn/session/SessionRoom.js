const colyseus = require('colyseus');

const SharedRoom = require("../../../../rooms/sharedRoom/SharedRoom.js").SharedRoom;

// const ChatRoomState = require("./ChatRoomState.js").ChatRoomState;
// const ChatRoomAvatar = require("./ChatRoomAvatar.js").ChatRoomAvatar;

// const onChange = require('on-change');
// const rxjs = require('rxjs');

const SessionRoomState = require("./SessionRoomState.js").SessionRoomState;

exports.SessionRoom = class SessionRoom extends SharedRoom {

  constructor(presence) {
    super(presence);

    const state = new SessionRoomState();
    // console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

    this.myClientsData = {};
  }

  getSessionPlayersForMyClient(myClient) {
    return this.myClientsData[myClient.id];
  }

  //room events : myClient

  onAddTetheredClient(tetheredClient) {
    super.onAddTetheredClient(tetheredClient);

    const client       = tetheredClient.client;
    const myClient     = tetheredClient.myClient;
    const incomingData = tetheredClient.incomingData;

    const myClientData = {};

    // const clientRoomState = myClient.clientRoomConnection.room.state;
    //
    // const roomAvatar = new ChatRoomAvatar(myClient.id, clientRoomState.name);
    // this.state.members[myClient.id] = roomAvatar;

    const clientRoomState = myClient.clientRoomConnection.room.state;

    const group = clientRoomState.group;
    Object.values(group.players).forEach((groupPlayer, i) => {
      const sessionPlayer = this.state.createPlayer(groupPlayer, group);

      myClientData[sessionPlayer.id] = sessionPlayer;
    });

    this.state.addAnimator(group);

    this.myClientsData[myClient.id] = myClientData;
  }

  onChangeTetheredClient(tetheredClient) {
    super.onChangeTetheredClient(tetheredClient);

    // const clientRoomState = myClient.clientRoomConnection.room.state;
    //
    // const roomAvatar = new ChatRoomAvatar(myClient.id, clientRoomState.name);
    // this.state.members[myClient.id] = roomAvatar;
  }

  onRemoveTetheredClient(tetheredClient) {
    super.onRemoveTetheredClient(tetheredClient);

    //send 'x has left' to all
    // this.state.cmd_chatLeave(myClient);
    // delete this.state.members[myClient.id];


  }


  // //room events : std
  //
  // handleMessage (client, message) {
  //   //console.log("onMessage",client,message);
  //   console.log("ChatRoom", "onMessage", this.roomName, client.id, message);
  //   //forward message
  //   this.getRoomLink(client).onMessage(message);
  //
  //
  //   const [command, data] = message;
  //
  //   // console.log("sessionId", sessionId);
  //   console.log("command", command);
  //   console.log("data", data);
  //
  //   //my_room
  //   if(command == "chatMessage") {
  //
  //     const myClient = this.getMyClient(client);
  //     const text     = data.text;
  //
  //     this.state.cmd_chatMessage(myClient, text);
  //
  //   }
  // }
  //
  // onLeave (client, consented) {
  //   //console.log("onLeave", client, consented);
  //   console.log("ChatRoom", "onLeave");
  //
  //   //send 'x has left' to all
  //   // const myClient = this.getMyClient(client);
  //   // this.state.cmd_chatLeave(myClient);
  //
  //   super.onLeave(client, consented);
  // }
  //
  //
  // ////////////
  //
  // sendCommandAnswer(client, commandAnswer) {
  //   console.log("ChatRoom", this.roomName, "sendCommandAnswer", commandAnswer);
  //   client.send("answer", { commandAnswer : commandAnswer });
  // }

}
