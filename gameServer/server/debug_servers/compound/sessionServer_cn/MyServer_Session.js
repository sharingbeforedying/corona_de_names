const PendingState = require('../../../rooms/welcome/PendingState.js').PendingState;
const RoomLink     = require('../../../rooms/RoomLink.js').RoomLink;

const MyServer     = require('../../../my/MyServer.js').MyServer;
const MyClient     = require('../../../my/MyClient.js').MyClient;

const CommandLibrary = require('../../../commands/CommandLibrary.js').CommandLibrary;
const CommandHandler = require('../../../commands/CommandHandler.js').CommandHandler;

// const Rx           = require('rxjs');
// const Rx_operators = require('rxjs/operators');

class MyServer_Session extends MyServer {

  constructor(config) {
    super(config);

    this.moveToConfigs = {};

    const server = this;

    //sector: instance
    this.instanceSector = this.createInstanceSector(this.roomFactory);
    this.bindToInstanceSector(this.instanceSector);
    this.instanceBeginRoom = this.instanceSector.instanceBeginRoom;

    //sector: instance config
    this.instanceConfigSector = this.createInstanceConfigSector(this.roomFactory);
    this.bindToInstanceConfigSector(this.instanceConfigSector);
    this.teamsConfigRoom   = this.instanceConfigSector.teamsConfigRoom;
    this.contentConfigRoom = this.instanceConfigSector.contentConfigRoom;

    //room: session
    this.sessionRoom     = this.createSessionRoom(this.roomFactory);


    //session -> instanceConfig first room
    this.connectSubRooms(this.sessionRoom, this.teamsConfigRoom, "teamsConfigxxx");
    //instanceConfig last room -> instance first room
    this.connectSubRooms(this.contentConfigRoom, this.instanceSector.instanceBeginRoom, "instanceBeginxxx");


    if(this.sessionRoom) {
      this.connectToSubRoom(this.sessionRoom, "session_session__better");
    }

    //dirty code: more ugliness for the gilted generation
    // this.instanceSector.teamsConfigWrapper = this.teamsConfigRoom.teamsConfigWrapper;
    // this.instanceSector.contentConfig      = this.contentConfigRoom.state.contentConfig;
  }

  // clientRoomType() {
  //   return 23;
  // }

  openClientRoom(roomFactory, pendingState) {
    const ClientRoomSession = require("./client/ClientRoomSession").ClientRoomSession;
    roomFactory.openRoom(pendingState.roomName(), ClientRoomSession, {
      pendingState: pendingState,
      createRoomLink : (roomConnection) => {
        //console.log("ClientRoomsession", "createRoomLink", roomConnection.id);
        // roomFactory.logRooms();

        const clienRoomLink = new RoomLink(roomConnection, this.clientRoomLinkEventHandlers(roomConnection));

        const myClient      = this.createMyClient(clienRoomLink);
        this.myClients[myClient.id] = myClient;

        return clienRoomLink;
      },
      onDispose: (clientRoom) => {
        //console.log("ClientRoomsession", "onDispose", clientRoom);
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
      name             : "www_clientRoomSession_www",

      targetRoomType   : 23,
      connectionConfig : clientRoomAccess,
    };

    return moveToConfig;
  }

  /*
  createClientRoomState(parentClientRoomState) {
    const ChildClientRoomState = require('./ChildClientRoomState').ChildClientRoomState;

    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;
    const MapSchema = schema.MapSchema;

    schema.defineTypes(ChildClientRoomState, {
      // serverState   : this.serverState.constructor,

      // availableRooms   : { map : "string" },
      availableServers : { map : "string" },
    });

    if(parentClientRoomState) {
      //console.log("parentClientRoomState", JSON.stringify(parentClientRoomState));

      schema.defineTypes(ChildClientRoomState, {
        parentStateEcho   : parentClientRoomState.constructor,
        parentStateGemini : parentClientRoomState.constructor,
      });
    }

    const clientRoomState = new ChildClientRoomState();
    //console.log("clientRoomState", JSON.stringify(clientRoomState));

    if(parentClientRoomState) {
      const Gemini_Schema = require("../../utils/gemini/Gemini_Schema.js").Gemini_Schema;
      clientRoomState.parentStateEcho   = Gemini_Schema.createEcho(parentClientRoomState);
      clientRoomState.parentStateGemini = Gemini_Schema.createGemini(parentClientRoomState);
    }
    //console.log("clientRoomState", JSON.stringify(clientRoomState));

    clientRoomState.parentStateGemini.name = "xxx789789xxx";

    //console.log("clientRoomState", JSON.stringify(clientRoomState));


    // clientRoomState.availableRooms

    // const createEcho = require("../utils/gemini/Gemini_Schema.js").Gemini_Schema.createEcho;
    //
    // const echo = createEcho(this.serverState);
    // //console.log("JSON.stringify(this.serverState)", JSON.stringify(this.serverState));
    // //console.log("JSON.stringify(echo)", JSON.stringify(echo));
    // //console.log("this.serverState", this.serverState);
    // //console.log("echo", echo);
    //
    // schema.defineTypes(ClientRoomState, {
    //   serverState   : echo.constructor,
    //
    //   // availableRooms   : { map : "string" },
    //   // availableServers : { map : "string" },
    // });
    //
    // clientRoomState.serverState = echo;
    // // clientRoomState.availableServers = echo.availableServers;



    clientRoomState.availableServers = new MapSchema();

    const availableServers = this.serverState.availableServers;
    Object.keys(availableServers).forEach((roomName, i) => {
      clientRoomState.availableServers[roomName] = availableServers[roomName];
    });

    return clientRoomState;
  }
  */

  // createClientRoomState(incomingClientRoomState) {
  //   const schema    = require('@colyseus/schema');
  //   const Schema    = schema.Schema;
  //   const MapSchema = schema.MapSchema;
  //   const ArraySchema = schema.ArraySchema;
  //
  //   class State extends Schema {
  //       constructor () {
  //           super();
  //
  //           // this.parentStateEcho   = null;
  //           this.incomingStateGemini = null;
  //       }
  //   }
  //   schema.defineTypes(State, {
  //     // parentStateEcho   : parentClientRoomState.constructor,
  //     incomingStateGemini : incomingClientRoomState.constructor,
  //   });
  //   // exports.ServerState = ServerState;
  //
  //   const state = new State();
  //
  //   const Gemini_Schema = require("../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;
  //   // const echo   = Gemini_Schema.createEcho(parentClientRoomState);
  //   const gemini = Gemini_Schema.createGemini(incomingClientRoomState);
  //   // state.parentStateEcho   = echo;
  //   state.incomingStateGemini = gemini;
  //
  //   state.incomingStateGemini.special_a1 += "_session_666";
  //
  //   return state;
  // }

  createClientRoomState(incomingClientRoomState) {
    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;
    const MapSchema = schema.MapSchema;
    const ArraySchema = schema.ArraySchema;

    const ClientRoomState_Session = require('./client/ClientRoomState_Session').ClientRoomState_Session;

    if(!incomingClientRoomState.group) {
      throw new Error("incomingClientRoomState.group == null");
    }

    if(!ClientRoomState_Session._schema.group) {
      schema.defineTypes(ClientRoomState_Session, {
        // parentStateEcho   : parentClientRoomState.constructor,
        // incomingStateGemini : incomingClientRoomState.constructor,

        // groupEcho : incomingClientRoomState.group.constructor,
        group : incomingClientRoomState.group.constructor,

      });
    }
    // exports.ServerState = ServerState;

    const clientRoomState = new ClientRoomState_Session();
    //console.log("/////////////////////////////////////");
    //console.log("/////////////////////////////////////");

    //console.log("JSON.stringify(clientRoomState)", JSON.stringify(clientRoomState));

    const Gemini_Schema = require("../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;
    // const echo   = Gemini_Schema.createEcho(parentClientRoomState);
    // const gemini = Gemini_Schema.createGemini(incomingClientRoomState);
    // state.parentStateEcho   = echo;
    // state.incomingStateGemini = gemini;

    // state.incomingStateGemini.special_a1 += "_session_666";

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
          const moveToConfig = roomState.moveToConfigs["session_session__better"];



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


  // client_join(roomConnection) {
  //   return (options) => {
  //     //console.log("client_join");
  //     const pendingState = options.pendingState;
  //
  //     // this.welcomeRoom.removePendingState(pendingState);
  //     pendingState.consume();
  //
  //     const myClient = this.createMyClient(roomConnection);
  //     this.addMyClient(myClient, roomConnection);
  //
  //
  //     //link with parent
  //     var parentClientRoomState = null;
  //
  //     const parentMyClient = pendingState.parentMyClient;
  //     if(parentMyClient) {
  //       //console.log("parentMyClient != null");
  //       var parentClientRoomState = parentMyClient.clientRoomConnection.room.state;
  //       //console.log("parentClientRoomState", parentClientRoomState);
  //     } else {
  //       //console.log("parentMyClient == null");
  //     }
  //
  //     const clientRoomState = this.createClientRoomState(parentClientRoomState);
  //     myClient.setClientRoomState(clientRoomState);
  //
  //     this.onMyClientJoin(myClient, options);
  //   };
  // }


  //////////////////////////////

  createSessionRoom(roomFactory) {

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

      const sessionRoom = roomConnection.room;

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
        sessionRoom.addTetheredClient(roomClient, incomingMyClient);







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
              const moveToConfig = roomState.moveToConfigs["teamsConfigxxx"];



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



      };
    }

    function room_message(roomConnection) {
      return (message) => {
        //console.log("session_message");

        const [command, data] = message;
        //console.log("command", command);
        //console.log("data", data);

        // const handler = this.commandLibrary.getCommandHandler(command);
        //
        // if(handler) {
        //   handler.handlerFunc(myClient, message);
        // } else {
        //   //console.log("unknown command", command, data);
        // }

        if(command == "go_to_instance_config") {

        }

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

    const sessionRoomName = "session_room_session";
    const sessionRoomClass = require("./session/SessionRoom.js").SessionRoom;

    const sessionRoomPassphrase = "lets_enter_session";

    return roomFactory.createRoom(sessionRoomName, sessionRoomClass, {
      passphrase: sessionRoomPassphrase,
      createRoomLink : (roomConnection) => {
        //console.log("SessionRoom", "createRoomLink", roomConnection.id);
        const roomLink = new RoomLink(roomConnection, roomLinkEventHandlers(roomConnection));
        return roomLink;
      },
    }, {});
  }




  createInstanceSector(roomFactory) {
    const host = this;
    const hostCommandLibrary = host.commandLibrary;

    const InstanceSector = require("./instance/InstanceSector.js").InstanceSector;
    const instanceSector = new InstanceSector({
      roomFactory: roomFactory,
      hostCommandLibrary: hostCommandLibrary,
      host: host,
    });

    // //merge command library
    // Object.entries(instanceSector.commandLibrary.commandHandlers).forEach(([commandName, commandHandler], i) => {
    //   this.commandLibrary.addCommandHandler(commandHandler);
    //
    //   //add roomCommand in roomState
    //   // this.state.roomCommands[commandName] = commandName;
    //
    // });

    return instanceSector;
  }

  closeInstanceSector() {
    this.instanceSector.close();
    this.instanceSector = null;
  }

  createInstanceConfigSector(roomFactory) {
    const host = this;
    const hostCommandLibrary = host.commandLibrary;

    const InstanceConfigSector = require("./instanceConfig/InstanceConfigSector.js").InstanceConfigSector;
    const instanceConfigSector = new InstanceConfigSector({
      roomFactory: roomFactory,
      hostCommandLibrary: hostCommandLibrary,
      host: host,
    });

    return instanceConfigSector;
  }

  closeInstanceConfigSector() {
    this.instanceConfigSector.close();
    this.instanceConfigSector = null;
  }


  connectSubRooms(fromRoom, toRoom, toRoomNickname) {

    const server = this;

    //console.log("connectSubRooms", fromRoom.roomName, toRoom.roomName, toRoomNickname);

    //setup two step

    const portalRoom       = this.getPortalRoomForSubRoom(toRoom, toRoomNickname);
    const portalRoomAccess = this.portalRoomAccess(portalRoom);

    const commandLibrary = this.commandLibrary;

    portalRoom.twoStepOnJoin = (client, options) => {

      var d = new Date();
      var t = d.getTime();
      const single_use_command_name = "single_use_" + client.id + "_" + t;

      const command_handler = new CommandHandler(single_use_command_name, single_use_command_name, (myClient, message) => {
        //console.log(single_use_command_name, "handlerFunc");
        try{
          const pendingState = portalRoom.getPendingState(client);
          pendingState.incomingMyClient = myClient;

          if(fromRoom == server.sessionRoom) {
            const sessionRoom    = fromRoom;
            const sessionPlayers = sessionRoom.getSessionPlayersForMyClient(myClient);
            pendingState.incomingData = {
              sessionPlayers: sessionPlayers,
            };
          }

          if(fromRoom == server.teamsConfigRoom) {
            const teamsConfigRoom = fromRoom;
            // const sessionPlayers = sessionRoom.getSessionPlayersForMyClient(myClient);
            pendingState.incomingData = {
              // sessionPlayers: sessionPlayers,
              lolilol : "555",
            };
          }


          // const clientRoomAccess = portalRoom.createAccess(client, ["two_step_validated", {}]);
          const moveToConfig = portalRoom.getRoomLink(client).onMessage(["createAccess", {}, pendingState]);

          // const pendingIdentifier = client.id + t;
          const pendingIdentifier = moveToConfig.connectionConfig.identifier;
          toRoom.addPendingState(pendingIdentifier, pendingState);

          const commandAnswer = {
            command: single_use_command_name,
            // payload: "success",
            payload : moveToConfig,
          };
          myClient.sendCommandAnswer(commandAnswer);
        } catch(error) {

          const commandAnswer = {
            command: single_use_command_name,
            error : "error in createAccess(): " + error.message,
          };
          myClient.sendCommandAnswer(commandAnswer);

        }
      });

      commandLibrary.addSingleUseCommandHandler(command_handler);

      client.send("answer", {
          command : "two_step",
          payload : {
            command : single_use_command_name,
          }
      });
    }

    const command = "go_to_ssub_room" + toRoomNickname;
    const commandHandler = new CommandHandler(command, command, (myClient, message) => {
      myClient.sendMoveToRoom(portalRoomAccess);
    });
    this.commandLibrary.addCommandHandler(commandHandler);



    const TargetRoomInfo   = require("../../../my/TargetRoomInfo.js").TargetRoomInfo;
    const ConnectionConfig = require("../../../rooms/ConnectionConfig.js").ConnectionConfig;
    const MoveToConfig     = require("../../../rooms/MoveToConfig.js").MoveToConfig;

    const targetRoomInfo = new TargetRoomInfo(toRoomNickname, 1, portalRoom);

    const connectionConfig = new ConnectionConfig(targetRoomInfo.accessRoomPort, targetRoomInfo.accessType, targetRoomInfo.accessRoomName, targetRoomInfo.accessRoomId, targetRoomInfo.accessRoomPassphrase);

    // const moveToConfig = new MoveToConfig(name, targetRoomType, connectionConfig)
    const moveToConfig = new MoveToConfig(targetRoomInfo.name, 1, connectionConfig);

    fromRoom.state.moveToConfigs[targetRoomInfo.name] = moveToConfig;

    //debug
    //console.log("setting server.moveToConfigs[" + toRoomNickname + "]", JSON.stringify(moveToConfig));
    server.moveToConfigs[toRoomNickname] = moveToConfig;
  }


  prepareInstanceConfigSector(teamsConfig_prev, contentConfig_prev) {
    //console.log("prepareInstanceConfigSector");
    const server = this;

    //teamsConfig

    // const teamsConfig_clone = teamsConfig_prev.clone();
    const Clone_Schema = require("../../../utils/clone/Clone_Schema.js").Clone_Schema;
    const teamsConfig_clone = Clone_Schema.clone(teamsConfig_prev);
    //console.log("teamsConfig_clone", JSON.stringify(teamsConfig_clone));

    server.teamsConfigRoom.state.teamsConfig = teamsConfig_clone;
    server.teamsConfigRoom.teamsConfigWrapper.wrapAround(teamsConfig_clone);


    //contentConfig
    const contentConfig_clone = Clone_Schema.clone(contentConfig_prev);

    server.contentConfigRoom.state.contentConfig = contentConfig_clone;
  }

  suckInInstanceEndClients(myClients, destination) {
    console.log("suckInInstanceEndClients", myClients.length);

    const server = this;

    // var roomNickname;
    var moveToConfig;
    if(destination == "teamsConfig") {
      // roomNickname = "teamsConfigxxx";
      moveToConfig = server.moveToConfigs["teamsConfigxxx"];
    } else if(destination == "contentConfig") {
      // roomNickname = "contentConfigxxx";

      //submit teams config
      server.instanceConfigSector.teamsConfigRoom.submitTeamsConfig();

      moveToConfig = server.instanceConfigSector.moveToConfigs["contentConfigxxx"];
    }
    //TODO: from instanceSector to instanceSector
    // else if(destination == "instanceBegin") {
    //   // roomNickname = "instanceBeginxxx";
    //   moveToConfig = server.moveToConfigs["instanceBeginxxx"];
    // }

    Object.values(myClients).forEach((myClient, i) => {
      const roomConnection = myClient.clientRoomConnection;
      const options = {};
      server.suckIn(roomConnection, options, moveToConfig);
    });

  }

  suckIn(roomConnection, options, moveToConfig) {
    //console.log("MyServer_session", "suck_in");

    const server = this;

    const room       = roomConnection.room;
    const roomClient = roomConnection.roomClient;
    const roomState  = room.state;

    // const moveToConfig = server.moveToConfigs[dstRoomNickname];

    //console.log("moveToConfig");
    // console.debug("%o", moveToConfig);
    // server.roomFactory.logRooms();

    const roomId = moveToConfig.connectionConfig.roomId;

    const currentRoomsInfo = server.roomFactory.currentRoomsInfo();
    const roomExists = currentRoomsInfo[roomId] != null;

    if(!roomExists) {
      throw new Error("moveTo room does not exist");
    }

    const connectionConfig_auto = {};
    Object.assign(connectionConfig_auto, moveToConfig.connectionConfig);

    if(!connectionConfig_auto.data) {
      connectionConfig_auto.data = {};
    }
    connectionConfig_auto.data.auto = {
      autoWord: "session_sucked_in",
    };

    const moveToConfig_auto = {};
    Object.assign(moveToConfig_auto, moveToConfig);
    moveToConfig_auto.connectionConfig = connectionConfig_auto;

    const trapHole = {
      moveToConfig: moveToConfig_auto,
    };

    room.sendTrapHole(roomClient, trapHole);
  }



  ///recycle

  recycle_instanceConfigSector() {

    this.sub_instanceConfig.unsubscribe();

    //destroy previous
    //console.log("000 portalRooms", Object.keys(this.portalRooms));

    const portalRoom_in = this.getPortalRoomForSubRoom(this.teamsConfigRoom, "teamsConfigxxx");
    portalRoom_in.disconnect();
    this.removePortalRoom(portalRoom_in);

    // const portalRoom_out = this.getPortalRoomForSubRoom(this.instanceSector.instanceBeginRoom, "instanceBeginxxx");
    // //console.log("portalRoom_out", portalRoom_out);
    // portalRoom_out.disconnect();
    // this.removePortalRoom(portalRoom_out);

    //console.log("111 portalRooms", Object.keys(this.portalRooms));

    this.instanceConfigSector.terminate();


    //create new
    const server = this;
    //console.log("____A server.moveToConfigs", JSON.stringify(server.moveToConfigs));
    // //console.log("console.debug");
    // console.debug("%o", server.moveToConfigs);
    //console.log("server.moveToConfigs['teamsConfigxxx'].connectionConfig.roomId", server.moveToConfigs["teamsConfigxxx"].connectionConfig.roomId);
    // server.roomFactory.logRooms();


    //should be done when instanceEndRoom chooses 'go to config:<x>'
      //create new instanceConfigSector
    server.instanceConfigSector = server.createInstanceConfigSector(server.roomFactory);
    server.bindToInstanceConfigSector(server.instanceConfigSector);
    // server.roomFactory.logRooms();
    server.teamsConfigRoom   = server.instanceConfigSector.teamsConfigRoom;
    server.contentConfigRoom = server.instanceConfigSector.contentConfigRoom;

    server.connectSubRooms(server.sessionRoom, server.teamsConfigRoom, "teamsConfigxxx");

    //console.log("____B server.moveToConfigs", server.moveToConfigs);
    //console.log("server.moveToConfigs['teamsConfigxxx'].connectionConfig.roomId", server.moveToConfigs["teamsConfigxxx"].connectionConfig.roomId);

    // server.connectSubRooms(server.contentConfigRoom, server.instanceSector.instanceBeginRoom, "instanceBeginxxx");
    // //console.log("server.moveToConfigs['instanceBeginxxx'].connectionConfig.roomId", server.moveToConfigs["instanceBeginxxx"].connectionConfig.roomId);
  }

  bindToInstanceConfigSector(instanceConfigSector) {
    const server = this;

    server.sub_instanceConfig = instanceConfigSector.rx_instanceConfig.subscribe({
      next(data) {
        console.log("instanceConfigSector.rx_instanceConfig", "next", data);

        //recycle
        server.recycle_instanceSector();

        //configure
        const teamsConfigWrapper = data[0];
        console.log("teamsConfigWrapper", teamsConfigWrapper);
        const contentConfig      = data[1];
        console.log("contentConfig", contentConfig);


        server.instanceSector.instanceBeginRoom.configureWithTeamsConfigWrapper(teamsConfigWrapper);
        server.instanceSector.instanceEndRoom.configureWithTeamsConfigWrapper(teamsConfigWrapper);


        // server.instanceSector.teamsConfigWrapper = server.instanceConfigSector.teamsConfigRoom.teamsConfigWrapper;
        // server.instanceSector.contentConfig      = server.instanceConfigSector.contentConfigRoom.state.contentConfig;
        server.instanceSector.teamsConfigWrapper = teamsConfigWrapper;
        server.instanceSector.contentConfig      = contentConfig;



        //suckIn
        const toRoomNickname = "instanceBeginxxx";
        const moveToConfig   = server.moveToConfigs[toRoomNickname];

        const contentConfigRoom = server.instanceConfigSector.contentConfigRoom;
        const myClients = contentConfigRoom.getMyClientsInRoom();

        Object.values(myClients).forEach((myClient, i) => {

          const roomConnection = myClient.clientRoomConnection;
          const options = {};

          server.suckIn(roomConnection, options, moveToConfig);

        });
      },
      completed() {
        console.log("instanceConfigSector.rx_instanceConfig", "completed");
      }
    });
  }

  recycle_instanceSector() {

    this.sub_instance.unsubscribe();

    //destroy previous instance sector
    const portalRoom_in = this.getPortalRoomForSubRoom(this.instanceSector.instanceBeginRoom, "instanceBeginxxx");
    //console.log("portalRoom_in", portalRoom_in);
    portalRoom_in.disconnect();
    this.removePortalRoom(portalRoom_in);

    this.instanceSector.terminate();


    //create new instance sector
    this.instanceSector = this.createInstanceSector(this.roomFactory);
    this.bindToInstanceSector(this.instanceSector);
    this.instanceBeginRoom = this.instanceSector.instanceBeginRoom;

    this.connectSubRooms(this.contentConfigRoom, this.instanceSector.instanceBeginRoom, "instanceBeginxxx");
  }

  bindToInstanceSector(instanceSector) {
    const server = this;

    server.sub_instance = instanceSector.rx_sectorEvent.subscribe({
      next(sectorEvent) {
       console.log("instanceSector.rx_sectorEvent.subscribe", "next");

       if(sectorEvent == "instanceSector_allPlayersArePresent") {
         //recycle
         server.recycle_instanceConfigSector();

       } else if(sectorEvent.playAgain == true) {

         const destination = sectorEvent.destination;

         const teamsConfig_prev   = server.instanceSector.teamsConfigWrapper.teamsConfig;
         const contentConfig_prev = server.instanceSector.contentConfig;

         //configure
         server.prepareInstanceConfigSector(teamsConfig_prev, contentConfig_prev);


         //suckIn
         const myClients = sectorEvent.myClients;

         const nbMyClients  = Object.values(myClients).length;
         if(nbMyClients != 2) {
           // console.log("myClients", myClients);
           throw new Error("sectorEvent, nbMyClients != 2    (nbMyClients: " + nbMyClients + ")");
         }

         server.suckInInstanceEndClients(myClients, destination);

       } else {
         throw new Error("unknown sector event: ", sectorEvent);
       }
     },
     completed() {
       console.log("instanceSector.rx_sectorEvent", "completed");
     }
    });
  }




}
exports.MyServer_Session = MyServer_Session;
