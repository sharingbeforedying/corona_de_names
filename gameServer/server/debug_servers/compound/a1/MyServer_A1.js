const PendingState = require('../../../rooms/welcome/PendingState.js').PendingState;
const RoomLink     = require('../../../rooms/RoomLink.js').RoomLink;

const MyServer     = require('../../../my/MyServer.js').MyServer;
const MyClient     = require('../../../my/MyClient.js').MyClient;

const CommandLibrary = require('../../../commands/CommandLibrary.js').CommandLibrary;
const CommandHandler = require('../../../commands/CommandHandler.js').CommandHandler;

class MyServer_A1 extends MyServer {

  constructor(config) {
    super(config);

    if(this.chatRoom) {
      this.connectToSubRoom(this.chatRoom, "chat_chat_chat_chat__better");
    }
  }

  // clientRoomType() {
  //   return 21;
  // }

  openClientRoom(roomFactory, pendingState) {
    const ClientRoomA1 = require("./client/ClientRoomA1").ClientRoomA1;
    roomFactory.openRoom(pendingState.roomName(), ClientRoomA1, {
      pendingState: pendingState,
      createRoomLink : (roomConnection) => {
        console.log("ClientRoomA1", "createRoomLink", roomConnection.id);
        // roomFactory.logRooms();

        const clienRoomLink = new RoomLink(roomConnection, this.clientRoomLinkEventHandlers(roomConnection));

        const myClient      = this.createMyClient(clienRoomLink);
        this.myClients[myClient.id] = myClient;

        return clienRoomLink;
      },
      onDispose: (clientRoom) => {
        console.log("ClientRoomA1", "onDispose", clientRoom);
      },
    });

    //send moveToConfig
    const roomName   = pendingState.roomName();
    console.log("roomName", roomName);
    const passphrase = pendingState.passphrase();
    console.log("passphrase", passphrase);

    const clientRoomAccess = {
      roomPort   : roomFactory.port,
      roomName   : roomName,
      passphrase : passphrase
    };

    const moveToConfig = {
      name             : "www_clientRoomA1_www",

      targetRoomType   : 21,
      connectionConfig : clientRoomAccess,
    };

    return moveToConfig;
  }


  createClientRoomState(incomingClientRoomState) {
    const ClientRoomState_A1 = require('./client/ClientRoomState_A1').ClientRoomState_A1;

    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;
    const MapSchema = schema.MapSchema;

    schema.defineTypes(ClientRoomState_A1, {
      // availableServers : { map : "string" },
      // availableServers : this.serverState._schema.availableServers,
    });

    const clientRoomState = new ClientRoomState_A1();

    const Gemini_Schema = require("../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

    //TODO: dynamic moveToConfigs (echo + compute)
    // const echo = Gemini_Schema.createEcho(this.serverState.availableServers);
    // clientRoomState.availableServers = echo;

    const ConnectionConfig = require("../../../rooms/ConnectionConfig.js").ConnectionConfig;
    const MoveToConfig     = require("../../../rooms/MoveToConfig.js").MoveToConfig;

    const availableServers = this.serverState.availableServers;
    Object.entries(availableServers).forEach(([serverName, serverInfo], i) => {

      const targetRoomInfo = serverInfo.targetRoomInfo;

      // const connectionConfig = new ConnectionConfig(accessType, roomName, roomId, passphrase)
      const connectionConfig = new ConnectionConfig(targetRoomInfo.accessRoomPort, targetRoomInfo.accessType, targetRoomInfo.accessRoomName, targetRoomInfo.accessRoomId, targetRoomInfo.accessRoomPassphrase);

      // const moveToConfig = new MoveToConfig(name, targetRoomType, connectionConfig)
      const moveToConfig = new MoveToConfig(serverInfo.name, 1, connectionConfig);

      clientRoomState.moveToConfigs[serverInfo.name] = moveToConfig;
    });

    //add go_to_chatRoom command
    const availableRooms = this.serverState.availableRooms;
    Object.entries(availableRooms).forEach(([roomName, targetRoomInfo], i) => {

      // const connectionConfig = new ConnectionConfig(accessType, roomName, roomId, passphrase)
      const connectionConfig = new ConnectionConfig(targetRoomInfo.accessRoomPort, targetRoomInfo.accessType, targetRoomInfo.accessRoomName, targetRoomInfo.accessRoomId, targetRoomInfo.accessRoomPassphrase);

      // const moveToConfig = new MoveToConfig(name, targetRoomType, connectionConfig)
      const moveToConfig = new MoveToConfig(targetRoomInfo.name, 1, connectionConfig);

      clientRoomState.moveToConfigs[targetRoomInfo.name] = moveToConfig;
    });

    // return clientRoomState;
    // return Gemini_Schema.createSource(clientRoomState);
    return clientRoomState;
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


  ///////////////////////////////////






  createChatRoom(roomFactory) {

    function roomLinkEventHandlers(roomConnection) {
      return {
        onJoin :        room_join(roomConnection),
        onMessage :     room_message(roomConnection),
        onLeave :       room_leave(roomConnection),
        onRoomDispose : room_roomDispose(roomConnection),
      }
    }

    // function createRoomClient(myClient, clientRoomState) {
    //   // const Gemini_Schema = require("../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;
    //   // const echo = Gemini_Schema.createEcho(clientRoomState);
    //
    //   // return clientRoomState;
    //   return {
    //     id:   myClient.id,
    //     name: clientRoomState.name,
    //   };
    // }

    function room_join(roomConnection) {

      const chatRoom = roomConnection.room;

      return (options) => {
        console.log("chat_join");
        const pendingState      = options.pendingState;

        //remove pending state from portal
        //+
        //remove pending state from chatRoom
        pendingState.consume();

        //link with incoming
        var incomingClientRoomState = null;

        const incomingMyClient = pendingState.incomingMyClient; //for clients coming from portal room
        if(incomingMyClient) {
          console.log("incomingMyClient != null");
          var incomingClientRoomState = incomingMyClient.clientRoomConnection.room.state;
          console.log("incomingClientRoomState", incomingClientRoomState);
        } else {
          console.log("incomingMyClient == null");
        }

        const roomClient = roomConnection.roomClient;

        // const roomClient = createRoomClient(incomingMyClient, incomingClientRoomState);
        chatRoom.addTetheredClient(roomClient, incomingMyClient);

      };
    }

    function room_message(roomConnection) {
      return (message) => {
        console.log("chat_message");
      };
    }

    function room_leave(roomConnection) {
      return (consented) => {
        console.log("chat_leave");
        //this hook is useless
      };
    }

    function room_roomDispose(roomConnection) {
      return () => {
        console.log("chat_roomDispose", "oh...");
      };
    }

    const chatRoomName = "chat_room_a1";
    const chatRoomClass = require("../../../rooms/chat/ChatRoom").ChatRoom;
    // const welcomeRoomName   = "welcome_room";
    const chatRoomPassphrase = "modern_talking";

    return roomFactory.createRoom(chatRoomName, chatRoomClass, {
      passphrase: chatRoomPassphrase,
      createRoomLink : (roomConnection) => {
        console.log("ChatRoom", "createRoomLink", roomConnection.id);
        const chatRoomLink = new RoomLink(roomConnection, roomLinkEventHandlers(roomConnection));
        return chatRoomLink;
      },
    }, {});
  }







}
exports.MyServer_A1 = MyServer_A1;
