const PendingState = require('../../rooms/welcome/PendingState.js').PendingState;
const RoomLink     = require('../../rooms/RoomLink.js').RoomLink;

const MyServer     = require('../../my/MyServer.js').MyServer;
const MyClient     = require('../../my/MyClient.js').MyClient;

const CommandLibrary = require('../../commands/CommandLibrary.js').CommandLibrary;
const CommandHandler = require('../../commands/CommandHandler.js').CommandHandler;

class ParentMyServer extends MyServer {

  constructor(config) {
    super(config);

  }

  createClientRoomState() {
    const ParentClientRoomState = require('./ParentClientRoomState').ParentClientRoomState;

    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;
    const MapSchema = schema.MapSchema;

    schema.defineTypes(ParentClientRoomState, {
      // availableServers : { map : "string" },
      availableServers : this.serverState._schema.availableServers,
    });

    const clientRoomState = new ParentClientRoomState();

    const Gemini_Schema = require("../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

    clientRoomState.availableServers = Gemini_Schema.createEcho(this.serverState.availableServers);

    // return clientRoomState;
    return Gemini_Schema.createSource(clientRoomState);
  }


  //myClient handlers

  onMyClientJoin(myClient, options) {
    console.log("onMyClientJoin");
    console.log("+++override me please+++");

    /*
    * for example, moveClientToRoom(this.roomX)
    */
  }

  onMyClientMessage(myClient, message) {
    console.log("onMyClientMessage");
    console.log("+++override me please+++");

    const [command, data] = message;
    console.log("command", command);
    console.log("data", data);

    const handler = this.commandLibrary.getCommandHandler(command);

    if(handler) {
      handler.handlerFunc(myClient, message);
    } else {
      console.log("unknown command", command, data);
    }

  }

  onMyClientLeave(myClient, consented) {
    console.log("onMyClientLeave");
    console.log("+++override me please+++");

    // const clientState = clientRoom.state;
    // clientState.$gemini_deathSignal();
  }


  /////////////////

  createSharedRooms(roomFactory) {
    console.log("createOwnRooms");
    console.log("+++override me please+++");
  }

  setupSingleRoomOpeners(roomFactory) {

  }


}
exports.ParentMyServer = ParentMyServer;
