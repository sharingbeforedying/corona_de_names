const PendingState = require('../../../rooms/welcome/PendingState.js').PendingState;
const RoomLink     = require('../../../rooms/RoomLink.js').RoomLink;

const MyServer     = require('../../../my/MyServer.js').MyServer;
const MyClient     = require('../../../my/MyClient.js').MyClient;

const CommandLibrary = require('../../../commands/CommandLibrary.js').CommandLibrary;
const CommandHandler = require('../../../commands/CommandHandler.js').CommandHandler;

class MyServer_Play extends MyServer {

  constructor(config) {
    super(config);

  }

  createClientRoomState(incomingClientRoomState) {
    const ClientRoomState_Play = require('./ClientRoomState_A1').ClientRoomState_A1;

    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;
    const MapSchema = schema.MapSchema;

    schema.defineTypes(ClientRoomState_Play, {
      // availableServers : { map : "string" },
      // availableServers : this.serverState._schema.availableServers,
    });

    const clientRoomState = new ClientRoomState_Play();

    const Gemini_Schema = require("../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

    //TODO: dynamic moveToConfigs (echo + compute)
    // const echo = Gemini_Schema.createEcho(this.serverState.availableServers);
    // clientRoomState.availableServers = echo;

    const ConnectionConfig = require("../../../rooms/ConnectionConfig.js").ConnectionConfig;
    const MoveToConfig     = require("../../../rooms/MoveToConfig.js").MoveToConfig;

    const availableServers = this.serverState.availableServers;
    Object.entries(availableServers).forEach(([serverName, serverInfo], i) => {

      // const connectionConfig = new ConnectionConfig(accessType, roomName, roomId, passphrase)
      const connectionConfig = new ConnectionConfig(serverInfo.accessRoomPort, serverInfo.accessType, serverInfo.accessRoomName, serverInfo.accessRoomId, serverInfo.accessRoomPassphrase);

      // const moveToConfig = new MoveToConfig(name, targetRoomType, connectionConfig)
      const moveToConfig = new MoveToConfig(serverName, 1, connectionConfig);

      clientRoomState.moveToConfigs[serverName] = moveToConfig;
    });


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
exports.MyServer_Play = MyServer_Play;
