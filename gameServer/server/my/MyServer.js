const PendingState = require('../rooms/welcome/PendingState.js').PendingState;
const RoomLink     = require('../rooms/RoomLink.js').RoomLink;

const ServerState  = require("./ServerState.js").ServerState;
const MyClient     = require('./MyClient.js').MyClient;

const CommandLibrary = require('../commands/CommandLibrary.js').CommandLibrary;
const CommandHandler = require('../commands/CommandHandler.js').CommandHandler;

const Gemini_Schema = require("../utils/gemini/Gemini_Schema.js").Gemini_Schema;

class MyServer {

  /*
  *  overridable : {
  *   createWelcomeRoom(),  ->WelcomeRoom, PendingState ...
  *
  *   openClientRoom(),       ->ClientRoom
  *   createClientRoomState() ->ClientRoomState
  *
  *
  *   createServerRoom()    ->ServerRoom, ...
  *  }
  *  to_implement : {
  *   createSharedRooms(),
  *   setupSingleRoomOpeners(),
  *
  *   onMyClientJoin,
  *   onMyClientMessage,
  *   onMyClientLeave,
  *
  *  }
  */

  constructor(config) {

    this.id = config.id;
    this.serverState = this.createServerState();

    // this.isChildServer = config.isChildServer;
    this.componentServers = {};

    this.myClients = {};

    this.roomFactory = config.roomFactory;

    if(config.has_welcomeRoom) {
      const welcomeRoomConfig = config.welcomeRoomConfig;
      this.welcomeRoom = this.createWelcomeRoom(this.roomFactory, welcomeRoomConfig);  //overridable
    }
    this.portalRooms = {};


    this.clientRooms = {};
    this.serverRoom  = this.createServerRoom(this.roomFactory);

    ///////////////////

    // this.shared_rooms = this.createSharedRooms(this.roomFactory); //to implement
    //
    // this.single_rooms = {};
    // this.setupSingleRoomOpeners(this.roomFactory);                //to implement

    this.chatRoom = this.createChatRoom(this.roomFactory);

    this.preexisting_rooms = this.createPreexistingRooms(this.roomFactory); //to implement

    this.on_demand_rooms = {};
    this.setupOnDemandRoomOpeners(this.roomFactory);                        //to implement


    ///////////////////

    this.commandLibrary = new CommandLibrary();

    const childServers = config.childServers;
    if(childServers) {
      //console.log("childServers", childServers);
      Object.keys(childServers).forEach((childServerName, i) => {
        const childServer = childServers[childServerName];
        if(childServer.isChildServer) {
          this.addChildServer(childServerName, childServer);
        } else {
          throw new Error("configuration error: child is not a child")
        }
      });
    }

  }

  createServerState() {
    const serverState = new ServerState();

    // return serverState;
    return Gemini_Schema.createSource(serverState);
  }

  addMyClient(myClient, clientRoomConnection) {
    this.myClients[clientRoomConnection.id] = myClient;
  }

  getMyClient(clientRoomConnection) {
    return this.myClients[clientRoomConnection.id];
  }

  removeMyClient(clientRoomConnection) {
    delete this.myClients[clientRoomConnection.id];
  }



  createServerRoom(roomFactory) {
    const ServerRoom = require("../rooms/server/ServerRoom").ServerRoom;
    roomFactory.createRoom("server_room", ServerRoom, {
     passphrase: "server_server_server"
    }, {});
  }

  clientRoomClass() {
    const ClientRoom = require("../rooms/client/ClientRoom").ClientRoom;
    return ClientRoom;
  }

  // clientRoomType() {
  //   return 2;
  // }

  openClientRoom(roomFactory, pendingState) {
    const clientRoomClass = this.clientRoomClass();
    roomFactory.openRoom(pendingState.roomName(), ClientRoom, {
      pendingState: pendingState,
      createRoomLink : (roomConnection) => {
        //console.log("ClientRoom", "createRoomLink", roomConnection.id);
        // roomFactory.logRooms();

        const clienRoomLink = new RoomLink(roomConnection, this.clientRoomLinkEventHandlers(roomConnection));

        const myClient      = this.createMyClient(clienRoomLink);
        this.myClients[myClient.id] = myClient;

        return clienRoomLink;
      },
      onDispose: (clientRoom) => {
        //console.log("ClientRoom", "onDispose", clientRoom);
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
      name             : "www_clientRoom_www",

      targetRoomType   : 2,
      connectionConfig : clientRoomAccess,
    };

    return moveToConfig;
  }

  createWelcomeRoom(roomFactory, welcomeRoomConfig) {

    const welcomeRoomName       = welcomeRoomConfig.name;
    const welcomeRoomPassphrase = welcomeRoomConfig.passphrase;

    const welcomeRoomClass = require("../rooms/welcome/WelcomeRoom").WelcomeRoom;

    return roomFactory.createRoom(welcomeRoomName, welcomeRoomClass, {
      passphrase: welcomeRoomPassphrase,
      createRoomLink : (roomConnection) => {
        //console.log("WelcomeRoom", "createRoomLink", roomConnection.id);
        const welcomeRoomLink = new RoomLink(roomConnection, this.welcomeRoomLinkEventHandlers(roomConnection));
        return welcomeRoomLink;
      },
    }, {});
  }

  //pending mgmt

  createPendingState(roomConnection, options) {
    //TODO: sophisticated pending states
    const id = "pending_" + roomConnection.roomClient.id;
    return new PendingState(id);
  }

  //client mgmt

  createMyClient(clientRoomConnection) {
    const myClient = new MyClient(clientRoomConnection);
    // clientState.gameState = createEcho(this.gameState.createClientGameState(clientRoom.roomId));
    return myClient;
  }

  createClientRoomState() {
    const ClientRoomState = require('../rooms/client/ClientRoomState').ClientRoomState;

    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;
    const MapSchema = schema.MapSchema;

    schema.defineTypes(ClientRoomState, {
      // serverState   : this.serverState.constructor,

      // availableRooms   : { map : "string" },
      availableServers : { map : "string" },
    });

    const clientRoomState = new ClientRoomState();
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

  moveClientToRoom(myClient, dstRoom) {

    const clientRoom = myClient.getClientRoom();
    const passphrase = clientRoom.roomName + dstRoom.roomName;

    dstRoom.addPendingClient(myClient, passphrase);

    const roomAccess = {
      roomPort:   dstRoom.$factory.port,
      roomId:     dstRoom.roomId,
      passphrase: passphrase,
    };
    myClient.sendMoveToRoom(roomAccess);
  }

  //welcomeRoomLink handlers

  welcomeRoomLinkEventHandlers(roomConnection) {
    return {
      onJoin :        this.welcome_join(roomConnection),
      onMessage :     this.welcome_message(roomConnection),
      onLeave :       this.welcome_leave(roomConnection),
      onRoomDispose : this.welcome_roomDispose(roomConnection),
    }
  }

  welcome_join(roomConnection) {
    return (options) => {
      //console.log("welcome_join");
      const pendingState = this.createPendingState(roomConnection, options);

      return pendingState;
    };
  }

  welcome_message(roomConnection) {
    return (message) => {
      //console.log("welcome_message");

      const [command, data, pendingState] = message;

      //console.log("command", command);

      if(command == "createAccess") {
        return this.openClientRoom(this.roomFactory, pendingState);
        // throw new Error("welcome test error 666");
      } else {
        //console.log("welcome_message", "unknown command");
      }

    };
  }

  welcome_leave(roomConnection) {
    return (consented) => {
      //console.log("welcome_leave");
    };
  }

  welcome_roomDispose(roomConnection) {
    return () => {
      //console.log("welcome_roomDispose", "oh...");
    };
  }


  //clientRoomLink handlers

  clientRoomLinkEventHandlers(roomConnection) {
    return {
      onJoin :        this.client_join(roomConnection),
      onMessage :     this.client_message(roomConnection),
      onLeave :       this.client_leave(roomConnection),
      onRoomDispose : this.client_roomDispose(roomConnection),
    }
  }

  client_join(roomConnection) {
    return (options) => {
      //console.log("client_join");
      const pendingState = options.pendingState;

      // this.welcomeRoom.removePendingState(pendingState);
      pendingState.consume();

      const myClient = this.createMyClient(roomConnection);
      this.addMyClient(myClient, roomConnection);

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

      const clientRoomState = this.createClientRoomState(incomingClientRoomState);
      myClient.setClientRoomState(clientRoomState);

      this.onMyClientJoin(myClient, options);
    };
  }

  client_message(roomConnection) {
    return (message) => {
      //console.log("client_message");
      const myClient = this.getMyClient(roomConnection);
      this.onMyClientMessage(myClient, message);
    };
  }

  client_leave(roomConnection) {
    return (consented) => {
      //console.log("client_leave");
      //this hook is useless
    };
  }

  client_roomDispose(roomConnection) {
    return () => {
      //console.log("client_roomDispose", "oh...");

      const myClient = this.getMyClient(roomConnection);
      const consented = false;
      this.onMyClientLeave(myClient, consented);
      myClient.closeAllConnections();
      this.removeMyClient(myClient);
    };
  }


  /////////////////


  //myClient handlers

  onMyClientJoin(myClient, options) {
    //console.log("onMyClientJoin");
    //console.log("+++override me please+++");

    /*
    * for example, moveClientToRoom(this.roomX)
    */
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

  createChatRoom(roomFactory) {
    //console.log("createChatRoom");
    //console.log("+++override me please+++");
    return null;
  }



  createPreexistingRooms(roomFactory) {
    //console.log("createPreexistingRooms");
    //console.log("+++override me please+++");
  }

  setupOnDemandRoomOpeners(roomFactory) {

  }



  createPortalRoomForSubRoom(subRoom, subRoomNickname, roomFactory) {
    //console.log("createPortalRoomForSubRoom", subRoomNickname);

    const myServer = this;

    const portalRoomName = this.portalRoomNameForSubRoom(subRoom, subRoomNickname);

    const portalRoomClass  = require("../rooms/portal/PortalRoom").PortalRoom;
    // const portalRoomName   = "portal_room__default";
    const portalPassphrase = "i_have_washed_my_feet__portalsub";

    function portalRoomLinkEventHandlers(roomConnection) {
      return {
        onJoin :        (portal_join/*.bind(myServer)*/)(roomConnection),
        onMessage :     (portal_message/*.bind(myServer)*/)(roomConnection),
        onLeave :       (myServer.portal_leave.bind(myServer))(roomConnection),
        onRoomDispose : (myServer.portal_roomDispose.bind(myServer))(roomConnection),
      }
    }

    function createPendingState(roomConnection, options) {
      //TODO: sophisticated pending states
      const id = "pending_" + roomConnection.roomClient.id;
      return new PendingState(id);
    }

    function portal_join(roomConnection) {
      return (options) => {
        //console.log("portal_join");
        const pendingState = createPendingState(roomConnection, options);

        // const roomClient = roomConnection.roomClient;
        // subRoom.addPendingState(roomClient, pendingState);

        return pendingState;
      };
    }

    function portal_message(roomConnection) {
      return (message) => {
        //console.log("portal_message");

        const [command, data, pendingState] = message;

        //console.log("command", command);

        if(command == "createAccess") {
          // this.openClientRoom(this.roomFactory, pendingState);
          // throw new Error("welcome test error 666");

          // const roomClient = roomConnection.roomClient;
          // subRoom.addPendingState(roomClient, pendingState);

          var d = new Date();
          var t = d.getTime();
          const pendingIdentifier = roomConnection.id + subRoom.roomId + t;

          //send sub room access
          const subRoomAccess = {
            roomPort   : subRoom.$factory.port,
            // roomName   : roomName,
            roomId     : subRoom.roomId,
            passphrase : subRoom.passphrase,
            identifier : pendingIdentifier,
          };

          const moveToConfig = {
            name             : "psub_subRoom_psub",

            // targetRoomType   : 3,
            targetRoomType   : subRoom.state.roomType,
            connectionConfig : subRoomAccess,
          };

          return moveToConfig;

        } else {
          //console.log("portal_message", "unknown command");
        }

      };
    }

    return roomFactory.createRoom(portalRoomName, portalRoomClass, {
      passphrase: portalPassphrase,
      createRoomLink : (roomConnection) => {
        //console.log("PortalRoom", "createRoomLink", roomConnection.id);
        const portalRoomLink = new RoomLink(roomConnection, portalRoomLinkEventHandlers(roomConnection));
        return portalRoomLink;
      },
    }, {});
  }

  portalRoomNameForSubRoom(subRoom, subRoomNickname) {
    return "portal_to_sub_room_" + subRoomNickname;
  }

  getPortalRoomForSubRoom(subRoom, subRoomNickname) {
    //console.log("getPortalRoomForSubRoom", subRoomNickname);

    const portalRoomName = this.portalRoomNameForSubRoom(subRoom, subRoomNickname);
    const portalRoom = this.portalRooms[portalRoomName];
    if(!portalRoom) {
      this.portalRooms[portalRoomName] = this.createPortalRoomForSubRoom(subRoom, subRoomNickname, this.roomFactory);
    }
    return this.portalRooms[portalRoomName];
  }

  removePortalRoom(portalRoom) {
    delete this.portalRooms[portalRoom.roomName];
  }

  connectToSubRoom(subRoom, subRoomNickname) {
    //console.log("connectToSubRoom", subRoom.roomName, subRoomNickname);

    //setup two step

    const portalRoom       = this.getPortalRoomForSubRoom(subRoom, subRoomNickname);
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

          // const clientRoomAccess = portalRoom.createAccess(client, ["two_step_validated", {}]);
          const moveToConfig = portalRoom.getRoomLink(client).onMessage(["createAccess", {}, pendingState]);

          // const pendingIdentifier = client.id + t;
          const pendingIdentifier = moveToConfig.connectionConfig.identifier;
          subRoom.addPendingState(pendingIdentifier, pendingState);

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

    const command = "go_to_sub_room" + subRoomNickname;
    const commandHandler = new CommandHandler(command, command, (myClient, message) => {
      myClient.sendMoveToRoom(portalRoomAccess);
    });
    this.commandLibrary.addCommandHandler(commandHandler);


    // //console.log("portalRoom", portalRoom);

    const TargetRoomInfo = require("./TargetRoomInfo.js").TargetRoomInfo;
    const targetRoomInfo = new TargetRoomInfo(subRoomNickname, 1, portalRoom);

    //console.log("targetRoomInfo", JSON.stringify(targetRoomInfo));
    this.serverState.availableRooms[subRoomNickname] = targetRoomInfo;
  }





  /////////////

  //compound servers

  // portalRoomLinkEventHandlers(roomConnection) {
  //   return {
  //     onJoin :        this.portal_join(roomConnection),
  //     onMessage :     this.portal_message(roomConnection),
  //     onLeave :       this.portal_leave(roomConnection),
  //     onRoomDispose : this.portal_roomDispose(roomConnection),
  //   }
  // }

  // portal_join(roomConnection) {
  //   return (options) => {
  //     //console.log("portal_join");
  //     const pendingState = this.createPendingState(roomConnection, options);
  //
  //     return pendingState;
  //   };
  // }

  // portal_message(roomConnection) {
  //   return (message) => {
  //     //console.log("portal_message");
  //
  //     const [command, data, pendingState] = message;
  //
  //     //console.log("command", command);
  //
  //     if(command == "createAccess") {
  //       this.openClientRoom(this.roomFactory, pendingState);
  //       // throw new Error("welcome test error 666");
  //
  //       //send client room access
  //       //TODO: use targetRoom port instead of portalRoom port
  //       // const roomPort = pendingState.roomPort();
  //       const roomPort = roomConnection.room.$factory.port;
  //
  //       const roomName = pendingState.roomName();
  //       //console.log("roomName", roomName);
  //       const passphrase = pendingState.passphrase();
  //       //console.log("passphrase", passphrase);
  //
  //       const clientRoomAccess = {
  //         roomPort   : roomPort,
  //         roomName   : roomName,
  //         passphrase : passphrase
  //       };
  //
  //       return clientRoomAccess;
  //
  //
  //     } else {
  //       //console.log("portal_message", "unknown command");
  //     }
  //
  //   };
  // }

  portal_leave(roomConnection) {
    return (consented) => {
      //console.log("portal_leave");
    };
  }

  portal_roomDispose(roomConnection) {
    return () => {
      //console.log("portal_roomDispose", "oh...");
    };
  }

  createPortalRoomForIncomingServer(incomingServer, incomingServerNickname, componentServerNickname, roomFactory) {
    //console.log("createPortalRoomForIncomingServer", incomingServerNickname);

    const myServer = this;

    const portalRoomName = this.portalRoomNameForIncomingServer(incomingServer, incomingServerNickname, componentServerNickname);

    const portalRoomClass  = require("../rooms/portal/PortalRoom").PortalRoom;
    // const portalRoomName   = "portal_room__default";
    const portalPassphrase = "i_have_token_a_shower__portal";

    function portalRoomLinkEventHandlers(roomConnection) {
      return {
        onJoin :        (portal_join.bind(myServer))(roomConnection),
        onMessage :     (portal_message.bind(myServer))(roomConnection),
        onLeave :       (myServer.portal_leave.bind(myServer))(roomConnection),
        onRoomDispose : (myServer.portal_roomDispose.bind(myServer))(roomConnection),
      }
    }

    function portal_join(roomConnection) {
      return (options) => {
        //console.log("portal_join");
        //console.log("options", options);
        const pendingState = this.createPendingState(roomConnection, options);

        return pendingState;
      };
    }

    function portal_message(roomConnection) {
      return (message) => {
        //console.log("portal_message");

        const [command, data, pendingState] = message;

        //console.log("command", command);

        if(command == "createAccess") {
          this.openClientRoom(this.roomFactory, pendingState);
          // throw new Error("welcome test error 666");

          //send client room access
          //TODO: use targetRoom port instead of portalRoom port
          // const roomPort = pendingState.roomPort();
          const roomPort = roomConnection.room.$factory.port;

          const roomName = pendingState.roomName();
          //console.log("roomName", roomName);
          const passphrase = pendingState.passphrase();
          //console.log("passphrase", passphrase);

          const clientRoomAccess = {
            roomPort   : roomPort,
            roomName   : roomName,
            passphrase : passphrase
          };

          const moveToConfig = {
            name             : "ppp_clientRoom_ppp",

            targetRoomType   : 2,
            // targetRoomType   : myServer.clientRoomType(),

            connectionConfig : clientRoomAccess,
          };

          return moveToConfig;


        } else {
          //console.log("portal_message", "unknown command");
        }

      };
    }

    return roomFactory.createRoom(portalRoomName, portalRoomClass, {
      passphrase: portalPassphrase,
      createRoomLink : (roomConnection) => {
        //console.log("PortalRoom", "createRoomLink", roomConnection.id);
        const portalRoomLink = new RoomLink(roomConnection, portalRoomLinkEventHandlers(roomConnection));
        return portalRoomLink;
      },
    }, {});
  }

  portalRoomNameForIncomingServer(incomingServer, incomingServerNickname, componentServerNickname) {
    return "portal_from_" + incomingServerNickname + "_to_" + componentServerNickname;
  }

  getPortalRoomForIncomingServer(incomingServer, incomingServerNickname, componentServerNickname) {
    //console.log("getPortalRoomForIncomingServer", incomingServerNickname);

    const portalRoomName = this.portalRoomNameForIncomingServer(incomingServer, incomingServerNickname, componentServerNickname);
    const portalRoom = this.portalRooms[portalRoomName];
    if(!portalRoom) {
      this.portalRooms[portalRoomName] = this.createPortalRoomForIncomingServer(incomingServer, incomingServerNickname, componentServerNickname, this.roomFactory);
    }
    return this.portalRooms[portalRoomName];
  }

  portalRoomAccess(portalRoom) {
    const roomAccess = {
      roomPort:   portalRoom.$factory.port,
      roomId:     portalRoom.roomId,
      passphrase: portalRoom.passphrase,
    };
    return roomAccess;
  }


  connectToComponentServer(componentServer, componentServerNickname, incomingServerNickname) {
    //console.log("connectToComponentServer", incomingServerNickname, "->", componentServerNickname);

    this.componentServers[componentServer.id] = componentServer;

    // childServer.parentServer = this;

    //setup two step

    // const welcomeRoom    = childServer.welcomeRoom;
    const portalRoom       = componentServer.getPortalRoomForIncomingServer(this, incomingServerNickname, componentServerNickname);
    const portalRoomAccess = componentServer.portalRoomAccess(portalRoom);

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

          // const clientRoomAccess = portalRoom.createAccess(client, ["two_step_validated", {}]);
          const moveToConfig = portalRoom.getRoomLink(client).onMessage(["createAccess", {}, pendingState]);

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

    const command = "connect_to_component_server__" + componentServerNickname;
    const commandHandler = new CommandHandler(command, command, (myClient, message) => {
      myClient.sendMoveToRoom(portalRoomAccess);
    });
    this.commandLibrary.addCommandHandler(commandHandler);




    //create portal command for client room
      //broadcast to all clients
      // or
      //put an echo in every clientRoomState
    // this.clientRoomState.availableServers[name] = command;

    // const welcomeRoom = childServer.welcomeRoom;
    // const roomName       = portalRoom.roomName;
    // const roomId         = portalRoom.roomId;
    // const roomPassphrase = portalRoom.passphrase;

    //console.log("portalRoom", portalRoom);

    const TargetRoomInfo = require("./TargetRoomInfo.js").TargetRoomInfo;
    const targetRoomInfo = new TargetRoomInfo(componentServerNickname + '_clientRoom', 1, portalRoom);

    const ServerInfo = require("./ServerInfo.js").ServerInfo;
    const serverInfo = new ServerInfo(componentServerNickname, targetRoomInfo);

    //console.log("serverInfo", JSON.stringify(serverInfo));
    this.serverState.availableServers["portal to " + componentServerNickname] = serverInfo;
  }


}
exports.MyServer = MyServer;
