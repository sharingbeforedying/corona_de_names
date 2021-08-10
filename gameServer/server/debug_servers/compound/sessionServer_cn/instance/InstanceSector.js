const PendingState = require('../../../../rooms/welcome/PendingState.js').PendingState;
const RoomLink     = require('../../../../rooms/RoomLink.js').RoomLink;

const CommandLibrary = require("../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../commands/CommandHandler.js").CommandHandler;


const Gemini_Schema = require("../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

const TeamsConfig   = require('../../../../_game/game/instanceConfig/teams/TeamsConfig.js').TeamsConfig;
const ContentConfig = require('../../../../_game/game/instanceConfig/content/ContentConfig.js').ContentConfig;

const Game_cn    = require('../../../../_game/game/instance/cn/Game.js').Game;
// const Game_cnduo = require('../../../../_game/game/instance/cn_duo/Game.js').Game;

const Rx = require('rxjs');
const Rx_operators = require('rxjs/operators');
const _rx_sectorEvent = new Rx.Subject();

exports.InstanceSector = class InstanceSector {

  constructor(sectorConfig) {

    this.roomFactory = sectorConfig.roomFactory;

    this.equipments  = {};
    this.rooms       = {};
    this.portalRooms = {};

    this.commandLibrary = sectorConfig.hostCommandLibrary;

    this.host = sectorConfig.host;

    this.rx_sectorEvent = _rx_sectorEvent.asObservable();



    this.instanceTellerRoom_1 = this.createInstanceTellerRoom(this.roomFactory);
    this.instanceTellerRoom_2 = this.createInstanceTellerRoom(this.roomFactory);

    this.instanceGuesserRoom_1 = this.createInstanceGuesserRoom(this.roomFactory);
    this.instanceGuesserRoom_2 = this.createInstanceGuesserRoom(this.roomFactory);

    // this.instanceGuesserRoom = this.createInstanceGuesserRoom(this.roomFactory);
    this.instanceBeginRoom = this.createInstanceBeginRoom(this.roomFactory);
    this.instanceBeginRoom.setupCommandLibrary(this);
    this.instanceBeginRoom.rx_roomEvent.subscribe(
      data => {
        console.log("instanceBeginRoom.rx_roomEvent.subscribe", "data", data);
        _rx_sectorEvent.next("instanceSector_allPlayersArePresent");
      }
    );

    this.instanceEndRoom = this.createInstanceEndRoom(this.roomFactory);
    this.instanceEndRoom.setupCommandLibrary(this);

    //debug
    this.moveToConfigs = {};

    this.connectSubRooms(this.instanceBeginRoom, this.instanceTellerRoom_1, "instanceTellerxxx_1");
    this.connectSubRooms(this.instanceBeginRoom, this.instanceTellerRoom_2, "instanceTellerxxx_2");
    this.connectSubRooms(this.instanceBeginRoom, this.instanceGuesserRoom_1, "instanceGuesserxxx_1");
    this.connectSubRooms(this.instanceBeginRoom, this.instanceGuesserRoom_2, "instanceGuesserxxx_2");

    // this.connectSubRooms(this.instanceTellerRoom_1, this.instanceEndRoom, "instanceEndxxx_T1");
    // this.connectSubRooms(this.instanceTellerRoom_2, this.instanceEndRoom, "instanceEndxxx_T2");
    // this.connectSubRooms(this.instanceGuesserRoom_1, this.instanceEndRoom, "instanceEndxxx_G1");
    // this.connectSubRooms(this.instanceGuesserRoom_2, this.instanceEndRoom, "instanceEndxxx_G2");
    this.connectSubRooms(this.instanceTellerRoom_1, this.instanceEndRoom, "instanceEndxxx_P1");
    this.connectSubRooms(this.instanceTellerRoom_2, this.instanceEndRoom, "instanceEndxxx_P2");

    this.game = null;


    //dirty code:
    this.teamsConfigWrapper = null;
    this.contentConfig      = null;

    //TODO: avoid observable1.subscribe(x => subject2.next(x)), prefer more subtle plumbing
    this.subs = this.instanceEndRoom.rx_roomEvent.pipe(Rx_operators.take(1)).subscribe(
      (roomEvent) => {
        _rx_sectorEvent.next(roomEvent);
      }
    );

  }

  terminate() {
    this.subs.unsubscribe();
    // _rx_sectorEvent.complete();

    this.moveToConfigs = null;

    Object.values(this.portalRooms).forEach((portalRoom, i) => {
      portalRoom.disconnect();
    });

    this.instanceBeginRoom.disconnect();

    this.instanceTellerRoom_1.disconnect();
    this.instanceTellerRoom_2.disconnect();
    this.instanceGuesserRoom_1.disconnect();
    this.instanceGuesserRoom_2.disconnect();

    this.instanceEndRoom.disconnect();
  }

  manageStartGame() {
    console.log("InstanceSector", "manageStartGame");

    const teamsConfigWrapper = this.teamsConfigWrapper;
    const contentConfig      = this.contentConfig;

    //create game
    this.createGame(teamsConfigWrapper, contentConfig);

    //suck-in players
    this.dispatchPlayers();

  }

  dispatchPlayers() {
    console.log("dispatchPlayers");

    const sector = this;

    const srcRoom = this.instanceBeginRoom;
    const onChange = require('on-change');
    const instanceBeginTetheredClients = onChange.target(srcRoom.tetheredClients);
    const arr_richTetheredClients = Object.values(instanceBeginTetheredClients).map(tetheredClient => {
      const tetheredClientData = srcRoom.tetheredClientsData[tetheredClient.client.id];
      return {
        tetheredClient:     tetheredClient,
        tetheredClientData: tetheredClientData,
      };
    });

    function roomNicknameForRoleAndTeam(role, team, teamOrder) {
      var roomNickname;

      const cnPlayerRole = require('../../../../_game/game/instance/InstancePlayerRole.js').cnPlayerRole;

      switch(role.id) {
        case cnPlayerRole.TELLER:
          roomNickname = "instanceTellerxxx";
          break;
        case cnPlayerRole.GUESSER:
          roomNickname = "instanceGuesserxxx";
          break;
        default:
          throw new Error("unknown player role id", role.id);
          break;
      }

      roomNickname += "_" + teamOrder;

      return roomNickname;
    }

    arr_richTetheredClients.forEach((richTetheredClient, i) => {

      const tetheredClient     = richTetheredClient.tetheredClient;
      const tetheredClientData = richTetheredClient.tetheredClientData;

      const client                  = tetheredClient.client;
      const myClient                = tetheredClient.myClient;

      const instanceBeginRoomPlayers = Object.values(tetheredClientData);

      instanceBeginRoomPlayers.forEach((instanceBeginRoomPlayer, i) => {
        const role      = instanceBeginRoomPlayer.player.role;
        const team      = instanceBeginRoomPlayer.team;
        const teamOrder = instanceBeginRoomPlayer.teamOrder;

        const roomConnection = myClient.clientRoomConnection;
        const options        = {};
        const roomNickname   = roomNicknameForRoleAndTeam(role, team, teamOrder);

        sector.suckIn(roomConnection, options, roomNickname);
      });

    });
  }


  regroupPlayers() {
    console.log("regroupPlayers");

    const sector = this;

    const srcRooms = [
      this.instanceTellerRoom_1,
      this.instanceTellerRoom_2,
      this.instanceGuesserRoom_1,
      this.instanceGuesserRoom_2,
    ];

    const myClientsDict = srcRooms.reduce((acc, srcRoom) => {
      const myClients = srcRoom.getMyClientsInRoom();
      return Object.assign(acc, myClients);
    }, {});

    Object.values(myClientsDict).forEach((myClient, i) => {
      const roomConnection = myClient.clientRoomConnection;
      const options        = {};
      const roomNickname   = "instanceEndxxx_P1"; //"tout le monde dans le même trou" ?

      sector.suckIn(roomConnection, options, roomNickname);
    });

    // //P1
    // {
    //   const srcRoom   = this.instanceTellerRoom_1;
    //
    //   const myClient  = Object.values(myClients).find(e=>true);
    //
    //   const roomConnection = myClient.clientRoomConnection;
    //   const options        = {};
    //   const roomNickname   = "instanceEndxxx_P1";
    //
    //   sector.suckIn(roomConnection, options, roomNickname);
    // }
    //
    // //P2
    // {
    //   const srcRoom   = this.instanceTellerRoom_2;
    //   const myClients = srcRoom.getMyClientsInRoom();
    //   const myClient  = Object.values(myClients).find(e=>true);
    //
    //   const roomConnection = myClient.clientRoomConnection;
    //   const options        = {};
    //   const roomNickname   = "instanceEndxxx_P2";
    //
    //   sector.suckIn(roomConnection, options, roomNickname);
    // }

  }

  createGame(teamsConfigWrapper, contentConfig) {
    const sector = this;

    this.teamsConfigWrapper = teamsConfigWrapper;
    this.contentConfig      = contentConfig;

    // const game = new Game_cn(teamsConfig);
    const game = new Game_cn(teamsConfigWrapper);

    this.game = game;
    // this.instanceBeginRoom.state.lol = "lol";

    // this.instanceTellerRoom.state.lol = "lol";
    this.instanceTellerRoom_1.setupCommandLibrary(game);
    this.instanceTellerRoom_2.setupCommandLibrary(game);
    this.instanceGuesserRoom_1.setupCommandLibrary(game);
    this.instanceGuesserRoom_2.setupCommandLibrary(game);

    {
        //debug
      sector.instanceTellerRoom_1.state.name  = "teller1";
      sector.instanceGuesserRoom_1.state.name = "guesser1";
      sector.instanceTellerRoom_2.state.name  = "teller2";
      sector.instanceGuesserRoom_2.state.name = "guesser2";

      const Rx           = require('rxjs');
      const Rx_operators = require('rxjs/operators');
      console.log("Rx_operators", Rx_operators);

      const filter = Rx_operators.filter;

      // const rx_teller1 = game.rx_tellerPhase.pipe(filter((value, index) => index % 2 == 0));
      // const rx_teller2 = game.rx_tellerPhase.pipe(filter((value, index) => index % 2 == 1));
      //
      // const rx_guesser1 = game.rx_guesserPhase.pipe(filter((value, index) => index % 2 == 0));
      // const rx_guesser2 = game.rx_guesserPhase.pipe(filter((value, index) => index % 2 == 1));

      // const partition = Rx_operators.partition;
      //
      // const [rx_teller1, rx_teller2]   = game.rx_tellerPhase.pipe(partition((value, index) => {
      //   console.log("rx_tellerPhase", "partition", "index", index);
      //   return index % 2 == 0;
      // }));
      // const [rx_guesser1, rx_guesser2] = game.rx_guesserPhase.pipe(partition((value, index) => {
      //   console.log("rx_guesserPhase", "partition", "index", index);
      //   return index % 2 == 0;
      // }));

      // console.log("teamsConfigWrapper", teamsConfigWrapper);
      const teamsConfigWrapper_teamWrappersIter = teamsConfigWrapper.getOrderedTeamWrappersIter();
      const teamsConfig_teamWrapper1 = teamsConfigWrapper_teamWrappersIter[0];
      const teamsConfig_teamWrapper2 = teamsConfigWrapper_teamWrappersIter[1];

      const roles = teamsConfigWrapper.dirtyGetRoles();
      const role_teller  = roles[0];
      const role_guesser = roles[1];

      //debug
      // const teller1 = teamsConfig_teamWrapper1.getSessionPlayerWithRole(role_teller);
      // console.log("teller1", teller1);

      const id_teller1  = teamsConfig_teamWrapper1.getSessionPlayerWithRole(role_teller).id;
      const id_guesser1 = teamsConfig_teamWrapper1.getSessionPlayerWithRole(role_guesser).id;

      const id_teller2  = teamsConfig_teamWrapper2.getSessionPlayerWithRole(role_teller).id;
      const id_guesser2 = teamsConfig_teamWrapper2.getSessionPlayerWithRole(role_guesser).id;

      console.log("id_teller1",  id_teller1);
      console.log("id_guesser1", id_guesser1);
      console.log("id_teller2",  id_teller2);
      console.log("id_guesser2", id_guesser2);

      // const rx_teller1 = game.rx_tellerPhase.pipe(filter((playerId, index) => {
      //   console.log("playerId", playerId);
      //   return playerId == id_teller1;
      // }));
      // const rx_teller2 = game.rx_tellerPhase.pipe(filter((playerId, index) => {
      //   console.log("playerId", playerId);
      //   return playerId == id_teller2;
      // }));
      //
      // const rx_guesser1 = game.rx_guesserPhase.pipe(filter((playerId, index) => {
      //   console.log("playerId", playerId);
      //   return playerId == id_guesser1;
      // }));
      // const rx_guesser2 = game.rx_guesserPhase.pipe(filter((playerId, index) => {
      //   console.log("playerId", playerId);
      //   return playerId == id_guesser2;
      // }));

      const rx_teller1 = game.rx_tellerPhase.pipe(filter((turn, index) => {
        const tellerId = turn.tellerId;
        return tellerId == id_teller1;
      }));
      const rx_teller2 = game.rx_tellerPhase.pipe(filter((turn, index) => {
        const tellerId = turn.tellerId;
        return tellerId == id_teller2;
      }));

      const rx_guesser1 = game.rx_guesserPhase.pipe(filter((turn, index) => {
        const guesserId = turn.guesserId;
        return guesserId == id_guesser1;
      }));
      const rx_guesser2 = game.rx_guesserPhase.pipe(filter((turn, index) => {
        const guesserId = turn.guesserId;
        return guesserId == id_guesser2;
      }));

      rx_teller1.subscribe({
        next(x) {
          console.log("rx_teller1", "next");
          sector.instanceTellerRoom_1.state.focusOnMePlz  = true;
          sector.instanceGuesserRoom_1.state.focusOnMePlz = false;
          sector.instanceTellerRoom_2.state.focusOnMePlz  = false;
          sector.instanceGuesserRoom_2.state.focusOnMePlz = false;
        }
      });

      rx_guesser1.subscribe({
        next(x) {
          console.log("rx_guesser1", "next");
          sector.instanceTellerRoom_1.state.focusOnMePlz  = false;
          sector.instanceGuesserRoom_1.state.focusOnMePlz = true;
          sector.instanceTellerRoom_2.state.focusOnMePlz  = false;
          sector.instanceGuesserRoom_2.state.focusOnMePlz = false;
        }
      });

      rx_teller2.subscribe({
        next(x) {
          console.log("rx_teller2", "next");
          sector.instanceTellerRoom_1.state.focusOnMePlz  = false;
          sector.instanceGuesserRoom_1.state.focusOnMePlz = false;
          sector.instanceTellerRoom_2.state.focusOnMePlz  = true;
          sector.instanceGuesserRoom_2.state.focusOnMePlz = false;
        }
      });

      rx_guesser2.subscribe({
        next(x) {
          console.log("rx_guesser2", "next");
          sector.instanceTellerRoom_1.state.focusOnMePlz  = false;
          sector.instanceGuesserRoom_1.state.focusOnMePlz = false;
          sector.instanceTellerRoom_2.state.focusOnMePlz  = false;
          sector.instanceGuesserRoom_2.state.focusOnMePlz = true;
        }
      });


      //quick and dirty : more horror
      game.rx_tellerPhase.subscribe({
        next(turn) {
          console.log("rx_tellerPhase", "next");
          sector.instanceTellerRoom_1.state.turn  = turn.createEcho();
          sector.instanceGuesserRoom_1.state.turn = turn.createEcho();
          sector.instanceTellerRoom_2.state.turn  = turn.createEcho();
          sector.instanceGuesserRoom_2.state.turn = turn.createEcho();
        }
      });

      game.rx_guesserPhase.subscribe({
        next(turn) {
          console.log("rx_guesserPhase", "next");
          sector.instanceTellerRoom_1.state.turn  = turn.createEcho();
          sector.instanceGuesserRoom_1.state.turn = turn.createEcho();
          sector.instanceTellerRoom_2.state.turn  = turn.createEcho();
          sector.instanceGuesserRoom_2.state.turn = turn.createEcho();

          sendSomething("guesser_phase");
        }
      });




      // game.rx_contractCompleted.subscribe({
      //   next(turn) {
      //     console.log("rx_contractCompleted", "next");
      //     sector.instanceTellerRoom_1.state.turn  = turn.createEcho();
      //     sector.instanceGuesserRoom_1.state.turn = turn.createEcho();
      //     sector.instanceTellerRoom_2.state.turn  = turn.createEcho();
      //     sector.instanceGuesserRoom_2.state.turn = turn.createEcho();
      //   }
      // });

      game.rx_gameOver.subscribe({
        next(gameOverInfo) {
          console.log("rx_gameOver", "next", gameOverInfo);
          sector.instanceEndRoom.state.gameOverInfo = gameOverInfo;

          sector.instanceEndRoom.state.gameoverType = gameOverInfo.type;

          //suck-in
          sector.regroupPlayers();

        }
      });


      //debug
      function sendSomething(something) {
        console.log("sendSomething", something);

        const player_rooms = [
          sector.instanceTellerRoom_1,
          sector.instanceGuesserRoom_1,
          sector.instanceTellerRoom_2,
          sector.instanceGuesserRoom_2,
        ];
        player_rooms.forEach((room, i) => {
          console.log("broadcast");
          // room.broadcast("room_command", {room_command: "playAudio", data: audio});
          // room.broadcast("audio", audio);
          // room.broadcast("audio", "lolilol");

          const clients = room.clients;
          console.log("clients.length", clients.length);
          clients.forEach((client, i) => {
            // client.send("room_command", {room_command: "playAudio", data: audio});
            client.send("something", {something: something});
          });

        });
      }


      // game.rx_selection_valid.subscribe({
      //   next(cellIndex) {
      //     console.log("rx_selection_valid", "next", cellIndex);
      //
      //     // sendSomething(cellIndex);
      //     sendAudio(cellIndex);
      //
      //     function sendAudio(cellIndex) {
      //       const contentConfig = sector.contentConfig;
      //       const cell_content  = contentConfig.grid.cells[cellIndex];
      //       const item_audio    = cell_content.items[2];
      //       if(item_audio != null) {
      //         const audio = item_audio.content;
      //         console.log("audio.length", audio.length);
      //         roomCommand_playAudio(audio);
      //       }
      //
      //       function roomCommand_playAudio(audio) {
      //         const player_rooms = [
      //           sector.instanceTellerRoom_1,
      //           sector.instanceGuesserRoom_1,
      //           sector.instanceTellerRoom_2,
      //           sector.instanceGuesserRoom_2,
      //         ];
      //         player_rooms.forEach((room, i) => {
      //           console.log("broadcast");
      //           // room.broadcast("room_command", {room_command: "playAudio", data: audio});
      //           // room.broadcast("audio", audio);
      //           // room.broadcast("audio", "lolilol");
      //
      //           const clients = room.clients;
      //           console.log("clients.length", clients.length);
      //           clients.forEach((client, i) => {
      //             client.send("room_command", {room_command: "playAudio", data: audio});
      //             // client.send("answer", "lol");
      //           });
      //
      //         });
      //       }
      //     }
      //
      //
      //   },
      // });

    }

    {
      const team = game.instanceTeamList[0];

      const teller = team.tellers[0];
      this.instanceTellerRoom_1.setupPlayer(teller);

      this.instanceTellerRoom_1.setupGrid_content(contentConfig.grid);

      this.instanceTellerRoom_1.setupGrid_position(game.gameState.position_grid__red.createEcho());

        //debug
        // this.instanceTellerRoom_1.state.grid_position__goal = game.gameState.position_grid__goal.createEcho();

      const game_grid_echo1 = game.gameState.game_grid.createEcho();
      this.instanceTellerRoom_1.setupGrid_game(game_grid_echo1);

      // this.instanceTellerRoom_1.state.gameInfo = game.gameState.gameInfo.createEcho();



      const guesser = team.guessers[0];
      this.instanceGuesserRoom_1.setupPlayer(guesser);

      this.instanceGuesserRoom_1.setupGrid_content(contentConfig.grid);

      // this.instanceGuesserRoom_1.setupGrid_position(game.gameState.position_grid);
      this.instanceGuesserRoom_1.setupGrid_position(game.gameState.position_grid__blank.createEcho());

      const game_grid_echo2 = game.gameState.game_grid.createEcho();
      this.instanceGuesserRoom_1.setupGrid_game(game_grid_echo2);

        //debug
        // this.instanceGuesserRoom_1.state.grid_position__goal = game.gameState.position_grid__goal.createEcho();

      // this.instanceGuesserRoom_1.state.gameInfo = game.gameState.gameInfo.createEcho();

    }

    {
      const team = game.instanceTeamList[1];

      const teller = team.tellers[0];
      this.instanceTellerRoom_2.setupPlayer(teller);

      this.instanceTellerRoom_2.setupGrid_content(contentConfig.grid);

      // var position_grid = game.gameState.position_grid__blue;
      this.instanceTellerRoom_2.setupGrid_position(game.gameState.position_grid__blue.createEcho());

        //debug
        // this.instanceTellerRoom_2.state.grid_position__goal = game.gameState.position_grid__goal.createEcho();

      const game_grid_echo1 = game.gameState.game_grid.createEcho();
      this.instanceTellerRoom_2.setupGrid_game(game_grid_echo1);

      // this.instanceTellerRoom_2.state.gameInfo = game.gameState.gameInfo.createEcho();



      const guesser = team.guessers[0];
      this.instanceGuesserRoom_2.setupPlayer(guesser);

      this.instanceGuesserRoom_2.setupGrid_content(contentConfig.grid);

      this.instanceGuesserRoom_2.setupGrid_position(game.gameState.position_grid__blank.createEcho());


      const game_grid_echo2 = game.gameState.game_grid.createEcho();
      this.instanceGuesserRoom_2.setupGrid_game(game_grid_echo2);

        //debug
        // this.instanceGuesserRoom_2.state.grid_position__goal = game.gameState.position_grid__goal.createEcho();

      // this.instanceGuesserRoom_2.state.gameInfo = game.gameState.gameInfo.createEcho();

    }

    {
      this.instanceEndRoom.state.grid_content  = contentConfig.grid;
      this.instanceEndRoom.state.grid_position = game.gameState.position_grid__origin;
      this.instanceEndRoom.state.grid_game     = game.gameState.game_grid;
    }

    //start game
    game.gameModel.startGame();
  }

  setupEventListeners() {

  }

  createInstanceBeginRoom(roomFactory) {

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

      const instanceRoom = roomConnection.room;

      return (options) => {
        console.log("instanceBeginRoom_join");
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
        instanceRoom.addTetheredClient(roomClient, incomingMyClient);

        // sector.auto(roomConnection, options, "instanceTellerxxx_1");
        // sector.autoVer2(roomConnection, options);

      };
    }

    function room_message(roomConnection) {
      return (message) => {
        console.log("instanceBeginRoom_message");

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

        // if(command == "moveToNextRoom") {
        //   console.log("moveToNextRoom");
        //
        //   const teamsConfig = data;
        //
        //   //configure nextRoom with data
        //   server.contentConfigRoom.configureWithData(teamsConfig);
        //
        //   // send next room's portal room connectionConfig to client
        //   const toRoomNickname = "contentConfigxxx";
        //   const fromRoom = roomConnection.room;
        //   const moveToConfig   = fromRoom.state.moveToConfigs[toRoomNickname];
        //
        //   console.log("moveToConfig", moveToConfig);
        //
        //   //reveal moveToConfig
        //
        // }

      };
    }

    function room_leave(roomConnection) {
      return (consented) => {
        console.log("instanceBeginRoom_leave");
        //this hook is useless
      };
    }

    function room_roomDispose(roomConnection) {
      return () => {
        console.log("instanceBeginRoom_roomDispose", "oh...");
      };
    }

    const roomName = "instanceBegin_room_c1";
    const roomClass = require("./begin/InstanceBeginRoom.js").InstanceBeginRoom;

    const roomPassphrase = "lets_enter_instanceBegin";

    return roomFactory.createRoom(roomName, roomClass, {
      passphrase: roomPassphrase,
      createRoomLink : (roomConnection) => {
        console.log("InstanceBeginRoom", "createRoomLink", roomConnection.id);
        const roomLink = new RoomLink(roomConnection, roomLinkEventHandlers(roomConnection));
        return roomLink;
      },
    }, {});
  }

  createInstanceTellerRoom(roomFactory) {

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

      const instanceRoom = roomConnection.room;

      return (options) => {
        console.log("instanceTellerRoom_join");
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
        instanceRoom.addTetheredClient(roomClient, incomingMyClient);


        // if(!sector.teller1){
        //   sector.auto(roomConnection, options, "instanceGuesserxxx_1");
        //   sector.teller1 = true;
        // } else {
        //   sector.auto(roomConnection, options, "instanceGuesserxxx_2");
        // }

      };
    }

    function room_message(roomConnection) {
      return (message) => {
        console.log("instanceTellerRoom_message");

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

        // if(command == "moveToNextRoom") {
        //   console.log("moveToNextRoom");
        //
        //   const teamsConfig = data;
        //
        //   //configure nextRoom with data
        //   server.contentConfigRoom.configureWithData(teamsConfig);
        //
        //   // send next room's portal room connectionConfig to client
        //   const toRoomNickname = "contentConfigxxx";
        //   const fromRoom = roomConnection.room;
        //   const moveToConfig   = fromRoom.state.moveToConfigs[toRoomNickname];
        //
        //   console.log("moveToConfig", moveToConfig);
        //
        //   //reveal moveToConfig
        //
        // }

      };
    }

    function room_leave(roomConnection) {
      return (consented) => {
        console.log("instanceTellerRoom_leave");
        //this hook is useless
      };
    }

    function room_roomDispose(roomConnection) {
      return () => {
        console.log("instanceTellerRoom_roomDispose", "oh...");
      };
    }

    const roomName = "instanceTeller_room_c1";
    const roomClass = require("./teller/InstanceTellerRoom.js").InstanceTellerRoom;

    const roomPassphrase = "lets_enter_instanceTeller";

    return roomFactory.createRoom(roomName, roomClass, {
      passphrase: roomPassphrase,
      createRoomLink : (roomConnection) => {
        console.log("InstanceTellerRoom", "createRoomLink", roomConnection.id);
        const roomLink = new RoomLink(roomConnection, roomLinkEventHandlers(roomConnection));
        return roomLink;
      },
    }, {});
  }

  createInstanceGuesserRoom(roomFactory) {

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

      const instanceRoom = roomConnection.room;

      return (options) => {
        console.log("instanceGuesserRoom_join");
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
        instanceRoom.addTetheredClient(roomClient, incomingMyClient);


        // if(!sector.guesser1){
        //   sector.auto(roomConnection, options, "instanceTellerxxx_2");
        //   sector.guesser1 = true;
        // }

      };
    }

    function room_message(roomConnection) {
      return (message) => {
        console.log("instanceGuesserRoom_message");

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

        // if(command == "moveToNextRoom") {
        //   console.log("moveToNextRoom");
        //
        //   const teamsConfig = data;
        //
        //   //configure nextRoom with data
        //   server.contentConfigRoom.configureWithData(teamsConfig);
        //
        //   // send next room's portal room connectionConfig to client
        //   const toRoomNickname = "contentConfigxxx";
        //   const fromRoom = roomConnection.room;
        //   const moveToConfig   = fromRoom.state.moveToConfigs[toRoomNickname];
        //
        //   console.log("moveToConfig", moveToConfig);
        //
        //   //reveal moveToConfig
        //
        // }

      };
    }

    function room_leave(roomConnection) {
      return (consented) => {
        console.log("instanceGuesserRoom_leave");
        //this hook is useless
      };
    }

    function room_roomDispose(roomConnection) {
      return () => {
        console.log("instanceGuesserRoom_roomDispose", "oh...");
      };
    }

    const roomName = "instanceGuesserRoom_room_c1";
    const roomClass = require("./guesser/InstanceGuesserRoom.js").InstanceGuesserRoom;

    const roomPassphrase = "lets_enter_instanceGuesser";

    return roomFactory.createRoom(roomName, roomClass, {
      passphrase: roomPassphrase,
      createRoomLink : (roomConnection) => {
        console.log("InstanceGuesserRoom", "createRoomLink", roomConnection.id);
        const roomLink = new RoomLink(roomConnection, roomLinkEventHandlers(roomConnection));
        return roomLink;
      },
    }, {});
  }

  createInstanceEndRoom(roomFactory) {

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

      const instanceRoom = roomConnection.room;

      return (options) => {
        console.log("instanceEndRoom_join");
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
        instanceRoom.addTetheredClient(roomClient, incomingMyClient);

        // sector.auto(roomConnection, options, "instanceTellerxxx_1");
        // sector.autoVer2(roomConnection, options);

      };
    }

    function room_message(roomConnection) {
      return (message) => {
        console.log("instanceEndRoom_message");

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

        // if(command == "moveToNextRoom") {
        //   console.log("moveToNextRoom");
        //
        //   const teamsConfig = data;
        //
        //   //configure nextRoom with data
        //   server.contentConfigRoom.configureWithData(teamsConfig);
        //
        //   // send next room's portal room connectionConfig to client
        //   const toRoomNickname = "contentConfigxxx";
        //   const fromRoom = roomConnection.room;
        //   const moveToConfig   = fromRoom.state.moveToConfigs[toRoomNickname];
        //
        //   console.log("moveToConfig", moveToConfig);
        //
        //   //reveal moveToConfig
        //
        // }

      };
    }

    function room_leave(roomConnection) {
      return (consented) => {
        console.log("instanceEndRoom_leave");
        //this hook is useless
      };
    }

    function room_roomDispose(roomConnection) {
      return () => {
        console.log("instanceEndRoom_roomDispose", "oh...");
      };
    }

    const roomName = "instanceEnd_room_c1";
    const roomClass = require("./end/InstanceEndRoom.js").InstanceEndRoom;

    const roomPassphrase = "lets_enter_instanceEnd";

    return roomFactory.createRoom(roomName, roomClass, {
      passphrase: roomPassphrase,
      createRoomLink : (roomConnection) => {
        console.log("InstanceEndRoom", "createRoomLink", roomConnection.id);
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

  ///auto

  // auto(roomConnection, options, dstRoomNickname) {
  //
  //   const sector = this;
  //
  //   //auto
  //   if(options.data && options.data.auto) {
  //     // const portalRoom = roomConnection.room;
  //     // const client     = roomConnection.roomClient;
  //
  //     const autoWord = options.data.auto.autoWord;
  //     if(autoWord) {
  //
  //       if(autoWord == "instanceBegin") {
  //
  //         const room       = roomConnection.room;
  //         const roomClient = roomConnection.roomClient;
  //         const roomState  = room.state;
  //
  //
  //         //config forwarding
  //         if(!sector.game) {
  //           const teamsConfig   = server.teamsConfigRoom.state.teamsConfig;
  //           const contentConfig = server.contentConfigRoom.state.contentConfig;
  //
  //           sector.createGame(teamsConfig, contentConfig);
  //         }
  //
  //
  //
  //
  //
  //         // const moveToConfig = roomState.moveToConfigs[dstRoomNickname];
  //         const moveToConfig = sector.moveToConfigs[dstRoomNickname];
  //
  //         const connectionConfig_auto = {};
  //         Object.assign(connectionConfig_auto, moveToConfig.connectionConfig);
  //
  //         if(!connectionConfig_auto.data) {
  //           connectionConfig_auto.data = {};
  //         }
  //         connectionConfig_auto.data.auto = options.data.auto;
  //
  //         const moveToConfig_auto = {};
  //         Object.assign(moveToConfig_auto, moveToConfig);
  //         moveToConfig_auto.connectionConfig = connectionConfig_auto;
  //
  //
  //
  //         const autoAnswer = {
  //           moveToConfig: moveToConfig_auto,
  //         };
  //
  //         room.sendAutoAnswer(roomClient, autoAnswer);
  //       }
  //
  //     } else {
  //       throw new Error("autoWord == null");
  //     }
  //
  //   }
  // }

  autoVer2(roomConnection, options) {
    console.log("autoVer2");

    const sector = this;

    //auto
    if(options.data && options.data.auto) {
      // const portalRoom = roomConnection.room;
      // const client     = roomConnection.roomClient;

      const autoWord = options.data.auto.autoWord;
      console.log("autoWord", autoWord);
      if(autoWord) {

        if(autoWord == "autoTeller_2") {

          sector.suckIn(roomConnection, options, "instanceTellerxxx_1");
          sector.suckIn(roomConnection, options, "instanceTellerxxx_2");

        }

        if(autoWord == "autoGuesser_2") {

          sector.suckIn(roomConnection, options, "instanceGuesserxxx_1");
          sector.suckIn(roomConnection, options, "instanceGuesserxxx_2");

        }

      } else {
        throw new Error("autoWord == null");
      }

    }
  }

  suckIn(roomConnection, options, dstRoomNickname) {
    const sector = this;

    const room       = roomConnection.room;
    const roomClient = roomConnection.roomClient;
    const roomState  = room.state;

    const moveToConfig = sector.moveToConfigs[dstRoomNickname];

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
