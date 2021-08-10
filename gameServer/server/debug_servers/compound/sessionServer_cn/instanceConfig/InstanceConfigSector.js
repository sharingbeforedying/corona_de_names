const PendingState = require('../../../../rooms/welcome/PendingState.js').PendingState;
const RoomLink     = require('../../../../rooms/RoomLink.js').RoomLink;

const CommandLibrary = require("../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../commands/CommandHandler.js").CommandHandler;


const Gemini_Schema = require("../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

const TeamsConfig   = require('../../../../_game/game/instanceConfig/teams/TeamsConfig.js').TeamsConfig;
const ContentConfig = require('../../../../_game/game/instanceConfig/content/ContentConfig.js').ContentConfig;

const Rx = require('rxjs');
const Rx_operators = require('rxjs/operators');

exports.InstanceConfigSector = class InstanceConfigSector {

  constructor(sectorConfig) {

    this.roomFactory = sectorConfig.roomFactory;

    this.equipments  = {};
    this.rooms       = {};
    this.portalRooms = {};

    this.commandLibrary = sectorConfig.hostCommandLibrary;

    this.host = sectorConfig.host;



    this.contentConfigRoom = this.createContentConfigRoom(this.roomFactory);
    this.contentConfigRoom.setupCommandLibrary(this);

    this.teamsConfigRoom   = this.createTeamsConfigRoom(this.roomFactory);
    this.teamsConfigRoom.setupCommandLibrary(this);


    //debug
    this.moveToConfigs = {};

    this.connectSubRooms(this.teamsConfigRoom, this.contentConfigRoom, "contentConfigxxx");

    this.instanceConfig = null;

    const rx_teamsConfig   = this.teamsConfigRoom.rx_teamsConfig;
    const rx_contentConfig = this.contentConfigRoom.rx_contentConfig;
    //TODO: zip may not be the best function for the job
    this.rx_instanceConfig = Rx.zip(rx_teamsConfig, rx_contentConfig)
                               .pipe(Rx_operators.take(1));

    this.rx_instanceConfig.subscribe({
      next(instanceConfig) {
        console.log("debug sub", "instanceConfig", instanceConfig);
      },
    });

  }

  terminate() {
    this.moveToConfigs = null;

    const subs = [
      this.sub_auto_T2G2,
      this.sub_auto_P1P2,
      this.sub_suckIn_when_submit,
    ];
    subs.forEach((sub, i) => {
      if(sub) {
        sub.unsubscribe();
      }
    });


    Object.values(this.portalRooms).forEach((portalRoom, i) => {
      portalRoom.disconnect();
    });

    this.teamsConfigRoom.disconnect();
    this.contentConfigRoom.disconnect();
  }

  regenerate() {
    // this.moveToConfigs = null;
    //
    // Object.values(this.portalRooms).forEach((portalRoom, i) => {
    //   portalRoom.disconnect();
    // });
    //
    // this.teamsConfigRoom.disconnect();
    // this.contentConfigRoom.disconnect();
  }

  createTeamsConfigRoom(roomFactory) {

    const sector = this;
    // const suite = this;

    function roomLinkEventHandlers(roomConnection) {
      return {
        onJoin :        room_join(roomConnection),
        onMessage :     room_message(roomConnection),
        onLeave :       room_leave(roomConnection),
        onRoomDispose : room_roomDispose(roomConnection),
      }
    }

    //auto
    const rx_auto_T2 = new Rx.Subject();
    const rx_auto_G2 = new Rx.Subject();
    const rx_auto_T2G2 = Rx.zip(rx_auto_T2, rx_auto_G2);

    this.sub_auto_T2G2 = rx_auto_T2G2.subscribe(
      (data) => {
        // sector.teamsConfigRoom.autoT2G2();
        sector.teamsConfigRoom.submitTeamsConfig();
      }
    );

    const rx_auto_P1 = new Rx.Subject();
    const rx_auto_P2 = new Rx.Subject();
    const rx_auto_P1P2 = Rx.zip(rx_auto_P1, rx_auto_P2);

    this.sub_auto_P1P2 = rx_auto_P1P2.subscribe(
      (data) => {
        // sector.teamsConfigRoom.autoT2G2();
        sector.teamsConfigRoom.submitTeamsConfig();
      }
    );

    var isActivated_rx_submit = false;
    function activateRxSubmit(teamsConfigRoom) {
      isActivated_rx_submit = true;

      sector.sub_suckIn_when_submit = teamsConfigRoom.rx_teamsConfig.subscribe(
        (data) => {
          console.log("rx_teamsConfig", "data", data);
          const teamsConfigWrapper = data;



          const toRoomNickname = "contentConfigxxx";

          // const onChange = require('on-change');
          // const myClients = onChange.target(sector.teamsConfigRoom.tetheredClients);
          const myClients = sector.teamsConfigRoom.getMyClientsInRoom();


          Object.values(myClients).forEach((myClient, i) => {

            const roomConnection = myClient.clientRoomConnection;
            const options = {};

            sector.suckIn(roomConnection, options, toRoomNickname);

          });
      });
    }


    function room_join(roomConnection) {

      const teamsConfigRoom = roomConnection.room;

      return (options) => {

        if(!isActivated_rx_submit) {
          activateRxSubmit(teamsConfigRoom);
        }

        console.log("teamsConfig_join");
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

        const incomingData = pendingState.incomingData;

        teamsConfigRoom.addTetheredClient(roomClient, incomingMyClient, incomingData);




        //auto
        if(options.data && options.data.auto) {
          // const portalRoom = roomConnection.room;
          // const client     = roomConnection.roomClient;

          const autoWord = options.data.auto.autoWord;
          if(autoWord) {

            const room       = roomConnection.room;
            const roomClient = roomConnection.roomClient;
            const roomState  = room.state;

            var moveToContentConfig = false;
            var newAutoWord         = null;

            var suckInEveryone_std      = false;
            var suckInEveryone_duo      = false;


            //auto teams
            function configurePlayer(player, team, role, ready) {
              //join
              {
                const message = ["instance_config_teams_joinTeam", {
                  playerId: player.id,
                  teamId: team.id,
                }];
                room.handleMessage(roomClient, message);
              }

              //role
              {
                const message = ["instance_config_teams_teamPlayer_set_role", {
                  playerId: player.id,
                  roleId: role.id,
                }];
                room.handleMessage(roomClient, message);
              }

              //ready
              {
                const message = ["instance_config_teams_teamPlayer_set_ready", {
                  playerId: player.id,
                  ready: ready,
                }];
                room.handleMessage(roomClient, message);
              }
            }

            if(autoWord == "teamsConfig") {
              console.log("arrived to destination :)");

              // const autoAnswer = {
              //   end_of_travel: true,
              // };
              //
              // room.sendAutoAnswer(roomClient, autoAnswer);
            } else if(autoWord == "autoTeller_2") {

              // const teamsConfig = roomState.teamsConfig;
              const teamsConfigWrapper = room.teamsConfigWrapper;
              const teamsConfig = teamsConfigWrapper.teamsConfig;


              const players = Object.values(teamsConfig.freePlayers);
              const teams   = Object.values(teamsConfig.teams);
              const roles   = teamsConfigWrapper.dirtyGetRoles();
              configurePlayer(players[0], teams[0], roles[0], true);
              configurePlayer(players[1], teams[1], roles[0], true);

              // if(!teamsConfigRoom.debug) {
              //   teamsConfigRoom.debug = {};
              //   teamsConfigRoom.debug.auto = {};
              // }
              // teamsConfigRoom.debug.auto.autoTeller_2 = {
              //   client: roomClient,
              //   auto: options.data.auto,
              // };
              //
              // teamsConfigRoom.done_autoTeller_2 = true;
              // if(teamsConfigRoom.done_autoGuesser_2) {
              //   // newAutoWord = "T_and_G";
              //   suckInEveryone_std = true;
              // }

              rx_auto_T2.next({
                roomConnection: roomConnection,
                options: options,
              });

            } else if(autoWord == "autoGuesser_2") {

              // const teamsConfig = roomState.teamsConfig;
              const teamsConfigWrapper = room.teamsConfigWrapper;
              const teamsConfig = teamsConfigWrapper.teamsConfig;

              const players = Object.values(teamsConfig.freePlayers);
              const teams   = Object.values(teamsConfig.teams);
              const roles   = teamsConfigWrapper.dirtyGetRoles();
              configurePlayer(players[0], teams[0], roles[1], true);
              configurePlayer(players[1], teams[1], roles[1], true);

              // if(!teamsConfigRoom.debug) {
              //   teamsConfigRoom.debug = {};
              //   teamsConfigRoom.debug.auto = {};
              // }
              // teamsConfigRoom.debug.auto.autoGuesser_2 = {
              //   client: roomClient,
              //   auto: options.data.auto,
              // };
              //
              // teamsConfigRoom.done_autoGuesser_2 = true;
              // if(teamsConfigRoom.done_autoTeller_2) {
              //   // newAutoWord = "T_and_G";
              //   suckInEveryone_std = true;
              // }

              rx_auto_G2.next({
                roomConnection: roomConnection,
                options: options,
              });

            }
            else if(autoWord == "instanceBegin") {

              // const teamsConfig = roomState.teamsConfig;
              const teamsConfigWrapper = room.teamsConfigWrapper;
              const teamsConfig = teamsConfigWrapper.teamsConfig;

              const players = Object.values(teamsConfig.freePlayers);
              const teams   = Object.values(teamsConfig.teams);
              const roles   = teamsConfigWrapper.dirtyGetRoles();
              configurePlayer(players[0], teams[0], roles[0], true);
              configurePlayer(players[1], teams[0], roles[1], true);
              configurePlayer(players[2], teams[1], roles[0], true);
              configurePlayer(players[3], teams[1], roles[1], true);

              moveToContentConfig = true;
            }

            //autoDuo_instanceBegin
            else if(autoWord == "autoDuo" + "_" + "instanceBegin" + "_" + "P1" ||
                    autoWord == "autoDuo" + "_" + "contentConfig" + "_" + "P1") {

              // const teamsConfig = roomState.teamsConfig;
              const teamsConfigWrapper = room.teamsConfigWrapper;
              const teamsConfig = teamsConfigWrapper.teamsConfig;

              const players = Object.values(teamsConfig.freePlayers);
              const teams   = Object.values(teamsConfig.teams);
              const roles   = teamsConfigWrapper.dirtyGetRoles();
              configurePlayer(players[0], teams[0], roles[0], true);
              configurePlayer(players[1], teams[1], roles[1], true);

              // if(!teamsConfigRoom.debug) {
              //   teamsConfigRoom.debug = {};
              //   teamsConfigRoom.debug.auto = {};
              // }
              // teamsConfigRoom.debug.auto.autoDuo_P1 = {
              //   client: roomClient,
              //   auto: options.data.auto,
              // };
              //
              // teamsConfigRoom.done_autoDuo_P1 = true;
              // if(teamsConfigRoom.done_autoDuo_P2) {
              //   // newAutoWord = "T_and_G";
              //   suckInEveryone_duo = true;
              // }

              rx_auto_P1.next({
                roomConnection: roomConnection,
                options: options,
              });

            } else if(autoWord == "autoDuo" + "_" + "instanceBegin" + "_" + "P2" ||
                      autoWord == "autoDuo" + "_" + "contentConfig" + "_" + "P2") {

              // const teamsConfig = roomState.teamsConfig;
              const teamsConfigWrapper = room.teamsConfigWrapper;
              const teamsConfig = teamsConfigWrapper.teamsConfig;

              const players = Object.values(teamsConfig.freePlayers);
              const teams   = Object.values(teamsConfig.teams);
              const roles   = teamsConfigWrapper.dirtyGetRoles();
              configurePlayer(players[0], teams[0], roles[1], true);
              configurePlayer(players[1], teams[1], roles[0], true);

              // if(!teamsConfigRoom.debug) {
              //   teamsConfigRoom.debug = {};
              //   teamsConfigRoom.debug.auto = {};
              // }
              // teamsConfigRoom.debug.auto.autoDuo_P2 = {
              //   client: roomClient,
              //   auto: options.data.auto,
              // };
              //
              // teamsConfigRoom.done_autoDuo_P2 = true;
              // if(teamsConfigRoom.done_autoDuo_P1) {
              //   // newAutoWord = "T_and_G";
              //   suckInEveryone_duo = true;
              // }

              rx_auto_P2.next({
                roomConnection: roomConnection,
                options: options,
              });

            }


            if(moveToContentConfig) {

              const moveToConfig = roomState.moveToConfigs["contentConfigxxx"];



              const connectionConfig_auto = {};
              Object.assign(connectionConfig_auto, moveToConfig.connectionConfig);

              if(!connectionConfig_auto.data) {
                connectionConfig_auto.data = {};
              }
              connectionConfig_auto.data.auto = options.data.auto;

              if(newAutoWord) {
                connectionConfig_auto.data.auto.autoWord = newAutoWord;
              }

              const moveToConfig_auto = {};
              Object.assign(moveToConfig_auto, moveToConfig);
              moveToConfig_auto.connectionConfig = connectionConfig_auto;



              const autoAnswer = {
                moveToConfig: moveToConfig_auto,
              };

              room.sendAutoAnswer(roomClient, autoAnswer);
            }

            // if(suckInEveryone_std) {
            //
            //   function suckIn(roomClient, auto) {
            //
            //     const moveToConfig = roomState.moveToConfigs["contentConfigxxx"];
            //
            //
            //
            //     const connectionConfig_auto = {};
            //     Object.assign(connectionConfig_auto, moveToConfig.connectionConfig);
            //
            //     if(!connectionConfig_auto.data) {
            //       connectionConfig_auto.data = {};
            //     }
            //     connectionConfig_auto.data.auto = auto;
            //
            //     // if(newAutoWord) {
            //     //   connectionConfig_auto.data.auto.autoWord = newAutoWord;
            //     // }
            //
            //     const moveToConfig_auto = {};
            //     Object.assign(moveToConfig_auto, moveToConfig);
            //     moveToConfig_auto.connectionConfig = connectionConfig_auto;
            //
            //     const trapHole = {
            //       moveToConfig: moveToConfig_auto,
            //     };
            //
            //     //need to send a custom trapHole to every client
            //     room.sendTrapHole(roomClient, trapHole);
            //   }
            //
            //   const autoTeller_2  = teamsConfigRoom.debug.auto.autoTeller_2;
            //   suckIn(autoTeller_2.client, autoTeller_2.auto);
            //   const autoGuesser_2 = teamsConfigRoom.debug.auto.autoGuesser_2;
            //   suckIn(autoGuesser_2.client, autoGuesser_2.auto);
            //
            // }
            //
            // if(suckInEveryone_duo) {
            //
            //   function suckIn(roomClient, auto) {
            //
            //     const moveToConfig = roomState.moveToConfigs["contentConfigxxx"];
            //
            //
            //
            //     const connectionConfig_auto = {};
            //     Object.assign(connectionConfig_auto, moveToConfig.connectionConfig);
            //
            //     if(!connectionConfig_auto.data) {
            //       connectionConfig_auto.data = {};
            //     }
            //     connectionConfig_auto.data.auto = auto;
            //
            //     // if(newAutoWord) {
            //     //   connectionConfig_auto.data.auto.autoWord = newAutoWord;
            //     // }
            //
            //     const moveToConfig_auto = {};
            //     Object.assign(moveToConfig_auto, moveToConfig);
            //     moveToConfig_auto.connectionConfig = connectionConfig_auto;
            //
            //     const trapHole = {
            //       moveToConfig: moveToConfig_auto,
            //     };
            //
            //     //need to send a custom trapHole to every client
            //     room.sendTrapHole(roomClient, trapHole);
            //   }
            //
            //   const autoDuo_P1  = teamsConfigRoom.debug.auto.autoDuo_P1;
            //   suckIn(autoDuo_P1.client, autoDuo_P1.auto);
            //   const autoDuo_P2 = teamsConfigRoom.debug.auto.autoDuo_P2;
            //   suckIn(autoDuo_P2.client, autoDuo_P2.auto);
            //
            // }


          } else {
            throw new Error("autoWord == null");
          }

        }

      };
    }

    function room_message(roomConnection) {
      return (message) => {
        console.log("teamsConfig_message");

        const [command, data] = message;
        console.log("command", command);
        console.log("data", data);

        // const handler = this.commandLibrary.getCommandHandler(command);
        //
        // if(handler) {
        //   handler.handlerFunc(myClient, message);
        // } else {
        //   console.log("unknown command", command, data);
        // }

        if(command == "moveToNextRoom") {
          console.log("moveToNextRoom");

          // const teamsConfig = data;
          //
          // //configure nextRoom with data
          // sector.contentConfigRoom.configureWithData(teamsConfig);
          //
          // // send next room's portal room connectionConfig to client
          // const toRoomNickname = "contentConfigxxx";
          // const fromRoom       = roomConnection.room;
          // const moveToConfig   = fromRoom.state.moveToConfigs[toRoomNickname];
          //
          // console.log("moveToConfig", moveToConfig);
          //
          // //reveal moveToConfig
          // const commandAnswer = {
          //   command: command,
          //   // payload: "success",
          //   payload : moveToConfig,
          // };
          // fromRoom.sendCommandAnswer(roomConnection.roomClient, commandAnswer);

          // const toRoomNickname = "contentConfigxxx";
          //
          // const onChange = require('on-change');
          // const myClients = onChange.target(sector.teamsConfigRoom.tetheredClients);
          //
          // Object.values(myClients).forEach((myClient, i) => {
          //
          //   const roomConnection = myClient.clientRoomConnection;
          //   const options = {};
          //
          //   sector.suckIn(roomConnection, options, toRoomNickname);
          //
          // });
        }

      };
    }

    function room_leave(roomConnection) {
      return (consented) => {
        console.log("teamsConfig_leave");
        //this hook is useless
      };
    }

    function room_roomDispose(roomConnection) {
      return () => {
        console.log("teamsConfig_roomDispose", "oh...");
      };
    }

    const roomName = "teamsConfig_room_c1";
    const roomClass = require("./teamsConfig/TeamsConfigRoom.js").TeamsConfigRoom;

    const roomPassphrase = "lets_enter_teamsConfig";

    return roomFactory.createRoom(roomName, roomClass, {
      passphrase: roomPassphrase,
      createRoomLink : (roomConnection) => {
        console.log("TeamsConfigRoom", "createRoomLink", roomConnection.id);
        const roomLink = new RoomLink(roomConnection, roomLinkEventHandlers(roomConnection));
        return roomLink;
      },
    }, {});
  }


  createContentConfigRoom(roomFactory) {

    const sector = this;

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

      const contentConfigRoom = roomConnection.room;

      return (options) => {
        console.log("contentConfig_join");
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
        contentConfigRoom.addTetheredClient(roomClient, incomingMyClient);

        //ugly
        // const server = sector.host;
        // if(server) {
        //   if(!server.instanceSector.instanceBeginRoom.teamsConfig) {
        //     // const teamsConfig = server.teamsConfigRoom.state.teamsConfig;
        //     const teamsConfigWrapper = server.teamsConfigRoom.teamsConfigWrapper;
        //     server.instanceSector.instanceBeginRoom.configureWithTeamsConfigWrapper(teamsConfigWrapper);
        //   }
        // }



        //auto
        if(options.data && options.data.auto) {
          // const portalRoom = roomConnection.room;
          // const client     = roomConnection.roomClient;

          const autoWord = options.data.auto.autoWord;
          if(autoWord) {

            if(autoWord.startsWith("autoDuo_contentConfig")) {
              console.log("arrived at destination");
            }

            // if(autoWord == "instanceBegin" || autoWord == "T_and_G") {
            // if(autoWord) {
            else {

              // const room       = roomConnection.room;
              // const roomClient = roomConnection.roomClient;
              // const roomState  = room.state;
              //
              //
              //
              // const moveToConfig = roomState.moveToConfigs["instanceBeginxxx"];
              //
              // const connectionConfig_auto = {};
              // Object.assign(connectionConfig_auto, moveToConfig.connectionConfig);
              //
              // if(!connectionConfig_auto.data) {
              //   connectionConfig_auto.data = {};
              // }
              // connectionConfig_auto.data.auto = options.data.auto;
              //
              // const moveToConfig_auto = {};
              // Object.assign(moveToConfig_auto, moveToConfig);
              // moveToConfig_auto.connectionConfig = connectionConfig_auto;
              //
              //
              //
              // const autoAnswer = {
              //   moveToConfig: moveToConfig_auto,
              // };
              //
              // room.sendAutoAnswer(roomClient, autoAnswer);
            }

          } else {
            throw new Error("autoWord == null");
          }

        }

      };
    }

    function room_message(roomConnection) {
      return (message) => {
        console.log("contentConfig_message");

        const [command, data] = message;
        console.log("command", command);
        console.log("data", data);

        // const handler = this.commandLibrary.getCommandHandler(command);
        //
        // if(handler) {
        //   handler.handlerFunc(myClient, message);
        // } else {
        //   console.log("unknown command", command, data);
        // }

        // const instanceConfig = new InstanceConfig();



        //configure nextRoom with data
        // server.instanceRoom.configureWithData(instanceConfig);

        // send next room's portal room connectionConfig to client
        // const toRoomNickname = "instanceBeginxxx";
        // const fromRoom       = roomConnection.room;
        // const moveToConfig   = fromRoom.state.moveToConfigs[toRoomNickname];
        //
        // console.log("moveToConfig", moveToConfig);
        //
        // //reveal moveToConfig
        // const commandAnswer = {
        //   command: command,
        //   // payload: "success",
        //   payload : moveToConfig,
        // };
        // fromRoom.sendCommandAnswer(roomConnection.roomClient, commandAnswer);

        // const toRoomNickname = "instanceBeginxxx";
        //
        // const onChange = require('on-change');
        // const myClients = onChange.target(sector.contentConfigRoom.tetheredClients);
        //
        // Object.values(myClients).forEach((myClient, i) => {
        //
        //   const roomConnection = myClient.clientRoomConnection;
        //   const options = {};
        //
        //   sector.suckIn(roomConnection, options, toRoomNickname);
        //
        // });

      };
    }

    function room_leave(roomConnection) {
      return (consented) => {
        console.log("contentConfig_leave");
        //this hook is useless
      };
    }

    function room_roomDispose(roomConnection) {
      return () => {
        console.log("contentConfig_roomDispose", "oh...");
      };
    }

    const roomName = "contentConfig_room_c1";
    const roomClass = require("./contentConfig/ContentConfigRoom.js").ContentConfigRoom;

    const roomPassphrase = "lets_enter_contentConfig";

    return roomFactory.createRoom(roomName, roomClass, {
      passphrase: roomPassphrase,
      createRoomLink : (roomConnection) => {
        console.log("ContentConfigRoom", "createRoomLink", roomConnection.id);
        const roomLink = new RoomLink(roomConnection, roomLinkEventHandlers(roomConnection));
        return roomLink;
      },
    }, {});
  }





  connectSubRooms(fromRoom, toRoom, toRoomNickname) {

    const sector = this;

    console.log("connectSubRooms", fromRoom.roomName, toRoom.roomName, toRoomNickname);

    //setup two step

    const portalRoom       = this.getPortalRoomForSubRoom(toRoom, toRoomNickname);
    const portalRoomAccess = this.portalRoomAccess(portalRoom);

    const commandLibrary = this.commandLibrary;

    portalRoom.twoStepOnJoin = (client, options) => {

      var d = new Date();
      var t = d.getTime();
      const single_use_command_name = "single_use_" + client.id + "_" + t;

      const command_handler = new CommandHandler(single_use_command_name, single_use_command_name, (myClient, message) => {
        console.log(single_use_command_name, "handlerFunc");
        try{
          const pendingState = portalRoom.getPendingState(client);
          pendingState.incomingMyClient = myClient;

          // if(fromRoom == server.sessionRoom) {
          //   const sessionRoom    = fromRoom;
          //   const sessionPlayers = sessionRoom.getSessionPlayersForMyClient(myClient);
          //   pendingState.incomingData = {
          //     sessionPlayers: sessionPlayers,
          //   };
          // }
          //
          // if(fromRoom == server.teamsConfigRoom) {
          //   const teamsConfigRoom = fromRoom;
          //   // const sessionPlayers = sessionRoom.getSessionPlayersForMyClient(myClient);
          //   pendingState.incomingData = {
          //     // sessionPlayers: sessionPlayers,
          //     lolilol : "555",
          //   };
          // }


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



    const TargetRoomInfo   = require("../../../../my/TargetRoomInfo.js").TargetRoomInfo;
    const ConnectionConfig = require("../../../../rooms/ConnectionConfig.js").ConnectionConfig;
    const MoveToConfig     = require("../../../../rooms/MoveToConfig.js").MoveToConfig;

    const targetRoomInfo = new TargetRoomInfo(toRoomNickname, 1, portalRoom);

    const connectionConfig = new ConnectionConfig(targetRoomInfo.accessRoomPort, targetRoomInfo.accessType, targetRoomInfo.accessRoomName, targetRoomInfo.accessRoomId, targetRoomInfo.accessRoomPassphrase);

    // const moveToConfig = new MoveToConfig(name, targetRoomType, connectionConfig)
    const moveToConfig = new MoveToConfig(targetRoomInfo.name, 1, connectionConfig);

    fromRoom.state.moveToConfigs[targetRoomInfo.name] = moveToConfig;

    //debug
    sector.moveToConfigs[toRoomNickname] = moveToConfig;
  }



  createPortalRoomForSubRoom(subRoom, subRoomNickname, roomFactory) {
    console.log("createPortalRoomForSubRoom", subRoomNickname);

    const myServer = this;

    const portalRoomName = this.portalRoomNameForSubRoom(subRoom, subRoomNickname);

    const portalRoomClass  = require("../../../../rooms/portal/PortalRoom").PortalRoom;
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
        console.log("portal_join");
        const pendingState = createPendingState(roomConnection, options);

        // const roomClient = roomConnection.roomClient;
        // subRoom.addPendingState(roomClient, pendingState);

        return pendingState;
      };
    }

    function portal_message(roomConnection) {
      return (message) => {
        console.log("portal_message");

        const [command, data, pendingState] = message;

        console.log("command", command);

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
          console.log("portal_message", "unknown command");
        }

      };
    }

    return roomFactory.createRoom(portalRoomName, portalRoomClass, {
      passphrase: portalPassphrase,
      createRoomLink : (roomConnection) => {
        console.log("PortalRoom", "createRoomLink", roomConnection.id);
        const portalRoomLink = new RoomLink(roomConnection, portalRoomLinkEventHandlers(roomConnection));
        return portalRoomLink;
      },
    }, {});
  }

  portalRoomNameForSubRoom(subRoom, subRoomNickname) {
    return "portal_to_sub_room_" + subRoomNickname;
  }

  getPortalRoomForSubRoom(subRoom, subRoomNickname) {
    console.log("getPortalRoomForSubRoom", subRoomNickname);

    const portalRoomName = this.portalRoomNameForSubRoom(subRoom, subRoomNickname);
    const portalRoom = this.portalRooms[portalRoomName];
    if(!portalRoom) {
      this.portalRooms[portalRoomName] = this.createPortalRoomForSubRoom(subRoom, subRoomNickname, this.roomFactory);
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
  //     console.log("portal_join");
  //     const pendingState = this.createPendingState(roomConnection, options);
  //
  //     return pendingState;
  //   };
  // }

  // portal_message(roomConnection) {
  //   return (message) => {
  //     console.log("portal_message");
  //
  //     const [command, data, pendingState] = message;
  //
  //     console.log("command", command);
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
  //       console.log("roomName", roomName);
  //       const passphrase = pendingState.passphrase();
  //       console.log("passphrase", passphrase);
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
  //       console.log("portal_message", "unknown command");
  //     }
  //
  //   };
  // }

  portal_leave(roomConnection) {
    return (consented) => {
      console.log("portal_leave");
    };
  }

  portal_roomDispose(roomConnection) {
    return () => {
      console.log("portal_roomDispose", "oh...");
    };
  }


  suckIn(roomConnection, options, dstRoomNickname) {
    const sector = this;

    const room       = roomConnection.room;
    const roomClient = roomConnection.roomClient;
    const roomState  = room.state;

    const moveToConfig = sector.moveToConfigs[dstRoomNickname];
    if(moveToConfig == null) {
      throw new Error("moveToConfig == null");
    }

    const roomId = moveToConfig.connectionConfig.roomId;

    const currentRoomsInfo = sector.roomFactory.currentRoomsInfo();
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
      autoWord: "instanceBegin_sucked_in",
    };

    const moveToConfig_auto = {};
    Object.assign(moveToConfig_auto, moveToConfig);
    moveToConfig_auto.connectionConfig = connectionConfig_auto;

    const trapHole = {
      moveToConfig: moveToConfig_auto,
    };

    room.sendTrapHole(roomClient, trapHole);
  }



}
