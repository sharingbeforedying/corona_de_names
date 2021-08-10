const colyseus = require('colyseus');
const ContentRoomState  = require('./ContentRoomState.js').ContentRoomState;

exports.ContentRoom = class extends colyseus.Room {

  constructor(presence) {
    super();

    const state = new ContentRoomState();
    console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

  }

  onCreate (options) {
    //console.log("onCreate", options);
    console.log("onCreate");

    //todo:
    //this.state.cmd_room_on_create() //-> admin
  }

  onJoin (client, options) {
    //console.log("onJoin",client,options);
    console.log("onJoin");

    //todo:
    //this.state.cmd_room_on_join() //-> greet
  }

  onMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("onMessage");

    const sessionId = client.sessionId;
    const [command, data] = message;

    console.log("sessionId", sessionId);
    console.log("command", command);
    console.log("data", data);


    if(command == "createContentItem") {
      this.state.cmd_createContentItem(sessionId, command, data);
    } else if(command == "removeContentItem") {
      this.state.cmd_removeContentItem(sessionId, command, data);
    } else

    if(command == "setImageAtIndex") {
      this.state.cmd_setImageAtIndex(sessionId, command, data);
    } else if(command == "setWordAtIndex") {
      this.state.cmd_setWordAtIndex(sessionId, command, data);
    }
    /*
    else if (command == "group_setPlayerName") {
      this.state.cmd_group_setGroupPlayerName(sessionId, command, data);
    } else if (command == "group_removePlayer") {
      this.state.cmd_group_removeGroupPlayer(sessionId, command, data);
    }
    */

    else {
      console.log("unknown command:", command);
    }
  }

  onLeave (client, consented) {
    //console.log("onLeave", client, consented);
    console.log("onLeave");
  }

  onDispose() {
    console.log("onDispose");
  }





}
