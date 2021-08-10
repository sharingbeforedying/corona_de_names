const PendingState = require('../../../rooms/welcome/PendingState.js').PendingState;
const RoomLink     = require('../../../rooms/RoomLink.js').RoomLink;

const MyServer     = require('../../../my/MyServer.js').MyServer;
const MyClient     = require('../../../my/MyClient.js').MyClient;

const CommandLibrary = require('../../../commands/CommandLibrary.js').CommandLibrary;
const CommandHandler = require('../../../commands/CommandHandler.js').CommandHandler;

// const Rx           = require('rxjs');
// const Rx_operators = require('rxjs/operators');

class MyServer_C1 extends MyServer {

  constructor(config) {
    super(config);

    this.moveToConfigs = {};

    const server = this;

    //room: sessionList
    this.sessionListRoom     = this.createSessionListRoom(this.roomFactory);

    // if(this.sessionListRoom) {
    //   this.connectToSubRoom(this.sessionListRoom, "session_session__better");
    // }

    //add component server
    this.addSessionServer_cnduo();
    this.addSessionServer_cn();

    this.updateMoveToConfigs();

  }

  addSessionServer_cnduo() {
    const roomFactory = this.roomFactory;

    const MyServer_Session = require("../sessionServer/MyServer_Session").MyServer_Session;
    const server_sessionCNDUO = new MyServer_Session({
      roomFactory : roomFactory,

      has_welcomeRoom : false,
    });

    const server_c1 = this;
    server_c1.connectToComponentServer(server_sessionCNDUO, "sessionCNDUO", "c1");
  }

  addSessionServer_cn() {
    const roomFactory = this.roomFactory;

    const MyServer_Session = require("../sessionServer_cn/MyServer_Session").MyServer_Session;
    const server_sessionCN = new MyServer_Session({
      roomFactory : roomFactory,

      has_welcomeRoom : false,
    });

    const server_c1 = this;
    server_c1.connectToComponentServer(server_sessionCN, "sessionCN", "c1");
  }

  updateMoveToConfigs() {
    {
      const ConnectionConfig = require("../../../rooms/ConnectionConfig.js").ConnectionConfig;
      const MoveToConfig     = require("../../../rooms/MoveToConfig.js").MoveToConfig;

      const availableServers = this.serverState.availableServers;
      const arr_richServerMoveToConfig = Object.entries(availableServers).map(([serverName, serverInfo], i) => {

        const targetRoomInfo = serverInfo.targetRoomInfo;

        // const connectionConfig = new ConnectionConfig(accessType, roomName, roomId, passphrase)
        const connectionConfig = new ConnectionConfig(targetRoomInfo.accessRoomPort, targetRoomInfo.accessType, targetRoomInfo.accessRoomName, targetRoomInfo.accessRoomId, targetRoomInfo.accessRoomPassphrase);

        // const moveToConfig = new MoveToConfig(name, targetRoomType, connectionConfig)
        const moveToConfig = new MoveToConfig(serverInfo.name, 1, connectionConfig);

        return {
          serverName: serverName,
          moveToConfig: moveToConfig
        };
      });

      arr_richServerMoveToConfig.forEach((richServerMoveToConfig, i) => {
        const serverName   = richServerMoveToConfig.serverName;
        const moveToConfig = richServerMoveToConfig.moveToConfig;

        this.moveToConfigs[serverName] = moveToConfig;
      });


      //add go_to_chatRoom command
      const availableRooms = this.serverState.availableRooms;
      const arr_richRoomMoveToConfig = Object.entries(availableRooms).map(([roomName, targetRoomInfo], i) => {

        // const connectionConfig = new ConnectionConfig(accessType, roomName, roomId, passphrase)
        const connectionConfig = new ConnectionConfig(targetRoomInfo.accessRoomPort, targetRoomInfo.accessType, targetRoomInfo.accessRoomName, targetRoomInfo.accessRoomId, targetRoomInfo.accessRoomPassphrase);

        // const moveToConfig = new MoveToConfig(name, targetRoomType, connectionConfig)
        const moveToConfig = new MoveToConfig(targetRoomInfo.name, 1, connectionConfig);

        return {
          roomName: roomName,
          moveToConfig: moveToConfig
        };
      });

      arr_richRoomMoveToConfig.forEach((richRoomMoveToConfig, i) => {
        const roomName     = richRoomMoveToConfig.roomName;
        const moveToConfig = richRoomMoveToConfig.moveToConfig;

        this.moveToConfigs[roomName] = moveToConfig;
      });
    }
  }

  openClientRoom(roomFactory, pendingState) {
    const ClientRoomC1 = require("./client/ClientRoomC1").ClientRoomC1;
    roomFactory.openRoom(pendingState.roomName(), ClientRoomC1, {
      pendingState: pendingState,
      createRoomLink : (roomConnection) => {
        //console.log("ClientRoomC1", "createRoomLink", roomConnection.id);
        // roomFactory.logRooms();

        const clienRoomLink = new RoomLink(roomConnection, this.clientRoomLinkEventHandlers(roomConnection));

        const myClient      = this.createMyClient(clienRoomLink);
        this.myClients[myClient.id] = myClient;

        return clienRoomLink;
      },
      onDispose: (clientRoom) => {
        //console.log("ClientRoomC1", "onDispose", clientRoom);
      },
    });

    //send moveToConfig
    const roomName   = pendingState.roomName();
    //console.log("roomName", roomName);
    const passphrase = pendingState.passphrase();
    //console.log("passphrase", passphrase);

    const clientRoomAccess = {
      roomPort   : roomFactory.port,
      roomName   : roomName,
      passphrase : passphrase
    };

    const moveToConfig = {
      name             : "www_clientRoomC1_www",

      targetRoomType   : 22,
      connectionConfig : clientRoomAccess,
    };

    return moveToConfig;
  }

  createClientRoomState(incomingClientRoomState) {
    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;
    const MapSchema = schema.MapSchema;
    const ArraySchema = schema.ArraySchema;

    const ClientRoomState_C1 = require('./client/ClientRoomState_C1').ClientRoomState_C1;

    if(!incomingClientRoomState.group) {
      throw new Error("incomingClientRoomState.group == null");
    }

    if(!ClientRoomState_C1._schema.group) {
      schema.defineTypes(ClientRoomState_C1, {
        // parentStateEcho   : parentClientRoomState.constructor,
        // incomingStateGemini : incomingClientRoomState.constructor,

        // groupEcho : incomingClientRoomState.group.constructor,
        group : incomingClientRoomState.group.constructor,

      });
    }
    // exports.ServerState = ServerState;

    const clientRoomState = new ClientRoomState_C1();
    //console.log("/////////////////////////////////////");
    //console.log("/////////////////////////////////////");

    //console.log("JSON.stringify(clientRoomState)", JSON.stringify(clientRoomState));

    const Gemini_Schema = require("../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;
    // const echo   = Gemini_Schema.createEcho(parentClientRoomState);
    // const gemini = Gemini_Schema.createGemini(incomingClientRoomState);
    // state.parentStateEcho   = echo;
    // state.incomingStateGemini = gemini;

    // state.incomingStateGemini.special_a1 += "_c1_666";

    // clientRoomState.groupEcho = Gemini_Schema.createEcho(incomingClientRoomState.group);
    clientRoomState.group = Gemini_Schema.createEcho(incomingClientRoomState.group);


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
    //console.log("onMyClientJoin", myClient.id, options);

    /*
    * for example, moveClientToRoom(this.roomX)
    */


    const roomConnection =  myClient.clientRoomConnection;

    //auto
    if(options.data && options.data.auto) {
      // const portalRoom = roomConnection.room;
      // const client     = roomConnection.roomClient;

      const autoWord = options.data.auto.autoWord;
      if(autoWord) {

        // if(autoWord == "instanceBegin" ||
        //    autoWord == "teamsConfig") {
        if(autoWord) {

          const room       = roomConnection.room;
          const roomClient = roomConnection.roomClient;
          const roomState  = room.state;

          //target room is in another server -> leap of faith
          console.debug("%o", this.moveToConfigs);
          // const moveToConfig = roomState.moveToConfigs["session_session__better"];

          function isCn(autoWord) {
            var outBool = false;

            if(autoWord.startsWith("autoTeller") || autoWord.startsWith("autoGuesser")) {
              outBool = true;
            }

            return outBool;
          }

          function isCn_duo(autoWord) {
            var outBool = false;

            if(autoWord.startsWith("autoDuo")) {
              outBool = true;
            }

            return outBool;
          }

          function gameTypeForAutoWord(autoWord) {
            var outInt = -1;

            if(isCn_duo(autoWord)) {
              outInt = 2;
            } else if(isCn(autoWord)) {
              outInt = 1;
            }

            return outInt;
          }

          var moveToConfig;
          const gameType = gameTypeForAutoWord(autoWord);
          switch (gameType) {
            case 1:
              moveToConfig = roomState.moveToConfigs["sessionCN"];
              break;
            case 2:
              moveToConfig = roomState.moveToConfigs["sessionCNDUO"];
              break;
            default:
              throw new Error("unknown game type" + gameType);
              break;
          }


          const connectionConfig_auto = {};
          Object.assign(connectionConfig_auto, moveToConfig.connectionConfig);

          if(!connectionConfig_auto.data) {
            connectionConfig_auto.data = {};
          }
          connectionConfig_auto.data.auto = options.data.auto;

          const moveToConfig_auto = {};
          Object.assign(moveToConfig_auto, moveToConfig);
          moveToConfig_auto.connectionConfig = connectionConfig_auto;



          const autoAnswer = {
            moveToConfig: moveToConfig_auto,
          };

          room.sendAutoAnswer(roomClient, autoAnswer);
        }

      } else {
        throw new Error("autoWord == null");
      }

    }
  }

  onMyClientMessage(myClient, message) {
    //console.log("onMyClientMessage");
    //console.log("+++override me please+++");

    const [command, data] = message;
    //console.log("command", command);
    //console.log("data", data);

    const handler = this.commandLibrary.getCommandHandler(command);

    if(handler) {
      handler.handlerFunc(myClient, message);
    } else {
      //console.log("unknown command", command, data);
    }

  }

  onMyClientLeave(myClient, consented) {
    //console.log("onMyClientLeave");
    //console.log("+++override me please+++");

    // const clientState = clientRoom.state;
    // clientState.$gemini_deathSignal();
  }


  /////////////////

  createPreexistingRooms(roomFactory) {
    //console.log("createOwnRooms");
    //console.log("+++override me please+++");
  }

  setupOnDemandRoomOpeners(roomFactory) {

  }

  //////////////////////////////

  createSessionListRoom(roomFactory) {

    function roomLinkEventHandlers(roomConnection) {
      return {
        onJoin :        room_join(roomConnection),
        onMessage :     room_message(roomConnection),
        onLeave :       room_leave(roomConnection),
        onRoomDispose : room_roomDispose(roomConnection),
      }
    }

    function room_join(roomConnection) {

      const sessionListRoom = roomConnection.room;

      return (options) => {
        //console.log("session_join");
        const pendingState      = options.pendingState;

        //remove pending state from portal
        //+
        //remove pending state from chatRoom
        pendingState.consume();

        //link with incoming
        var incomingClientRoomState = null;

        const incomingMyClient = pendingState.incomingMyClient; //for clients coming from portal room
        if(incomingMyClient) {
          //console.log("incomingMyClient != null");
          var incomingClientRoomState = incomingMyClient.clientRoomConnection.room.state;
          //console.log("incomingClientRoomState", incomingClientRoomState);
        } else {
          //console.log("incomingMyClient == null");
        }

        const roomClient = roomConnection.roomClient;

        // const roomClient = createRoomClient(incomingMyClient, incomingClientRoomState);
        sessionListRoom.addTetheredClient(roomClient, incomingMyClient);

      };

    }

    function room_message(roomConnection) {
      return (message) => {
        //console.log("session_message");

        const [command, data] = message;

      };
    }

    function room_leave(roomConnection) {
      return (consented) => {
        //console.log("session_leave");
        //this hook is useless
      };
    }

    function room_roomDispose(roomConnection) {
      return () => {
        //console.log("session_roomDispose", "oh...");
      };
    }

    const sessionListRoomName = "sessionList_room_c1";
    const sessionListRoomClass = require("./sessionList/SessionListRoom.js").SessionListRoom;

    const sessionListRoomPassphrase = "lets_enter_sessionList";

    return roomFactory.createRoom(sessionListRoomName, sessionListRoomClass, {
      passphrase: sessionListRoomPassphrase,
      createRoomLink : (roomConnection) => {
        //console.log("SessionRoom", "createRoomLink", roomConnection.id);
        const roomLink = new RoomLink(roomConnection, roomLinkEventHandlers(roomConnection));
        return roomLink;
      },
    }, {});
  }


}
exports.MyServer_C1 = MyServer_C1;
