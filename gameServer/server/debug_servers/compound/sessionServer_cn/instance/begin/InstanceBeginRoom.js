const colyseus = require('colyseus');

const SharedRoom = require("../../../../../rooms/sharedRoom/SharedRoom.js").SharedRoom;

const CommandLibrary = require("../../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../../commands/CommandHandler.js").CommandHandler;

const InstanceBeginRoomState = require("./InstanceBeginRoomState.js").InstanceBeginRoomState;

const Rx = require('rxjs');
const _rx_roomEvent = new Rx.Subject();

exports.InstanceBeginRoom = class SessionRoom extends SharedRoom {

  constructor(presence) {
    super(presence);

    const state = new InstanceBeginRoomState();
    // console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

    this.tetheredClientsData = {};
    // this.myClientsData = {};

    this.commandLibrary = new CommandLibrary();

    this.rx_roomEvent = _rx_roomEvent.asObservable();

    //quick and dirty ?
    this.teamsConfigWrapper = null;
  }

  configureWithTeamsConfigWrapper(teamsConfigWrapper) {
    console.log("InstanceBeginRoomState", "configureWithTeamsConfigWrapper");
    this.teamsConfigWrapper = teamsConfigWrapper;
  }

  // getMyClientDataForMyClient(myClient) {
  //   return this.myClientsData[myClient.id];
  // }

  //room events : myClient

  onAddTetheredClient(tetheredClient) {
    super.onAddTetheredClient(tetheredClient);

    const client       = tetheredClient.client;
    const myClient     = tetheredClient.myClient;
    const incomingData = tetheredClient.incomingData;

    const tetheredClientData = {};

    // const clientRoomState = myClient.clientRoomConnection.room.state;
    //
    // const roomAvatar = new ChatRoomAvatar(myClient.id, clientRoomState.name);
    // this.state.members[myClient.id] = roomAvatar;

    const clientRoomState = myClient.clientRoomConnection.room.state;

    console.log("InstanceBeginRoom", "onAddTetheredClient");
    console.log("teamsConfigWrapper:", JSON.stringify(this.teamsConfigWrapper));
    console.log("clientRoomState:", JSON.stringify(clientRoomState));

    //teamsConfig.teams.players
    //clientRoomState.group.players
    const teamsConfigWrapper = this.teamsConfigWrapper;
    const group              = clientRoomState.group;

    const teamsConfigPlayers = teamsConfigWrapper.getRichTeamPlayersMap();

    const arr_incomingPlayersInfo = Object.entries(group.players)
                                .filter(([playerId, groupPlayer]) => {
                                  return teamsConfigPlayers[playerId] != null;
                                })
                                .map(([playerId, groupPlayer]) => {
                                  return {
                                    groupPlayer: groupPlayer,
                                    teamConfigPlayer: teamsConfigPlayers[playerId],
                                  };
                                });

    arr_incomingPlayersInfo.forEach((incomingPlayerInfo, i) => {
      const playerId = incomingPlayerInfo.groupPlayer.id;
      const instanceBeginRoomPlayer = incomingPlayerInfo.teamConfigPlayer;

      tetheredClientData[playerId] = instanceBeginRoomPlayer;
    });

    this.tetheredClientsData[client.id] = tetheredClientData;


    // if(!this.myClientsData[myClient.id]) {
    //   this.myClientsData[myClient.id] = {};
    // }
    // this.myClientsData[myClient.id][client.id] = tetheredClientData;




    const nb_players_joining = Object.values(tetheredClientData).length;
    console.log("nb_players_joining", nb_players_joining);
    this.state.nb_players_in_room += nb_players_joining;

    this.state.allPlayersArePresent = this.checkAllPlayersArePresent();

    // if(this.state.allPlayersArePresent) {
    //   _rx_roomEvent.next("instanceBeginRoom_allPlayersArePresent");
    // }
  }

  checkAllPlayersArePresent() {
    const teamsConfigWrapper = this.teamsConfigWrapper;
    const teamsConfigPlayers = teamsConfigWrapper.getRichTeamPlayersMap();

    const playersInRoom = Object.values(this.tetheredClientsData).reduce((acc, x) => {
      var arr = acc;
      const tetheredClientData = x;
      arr.push(...Object.keys(tetheredClientData));
      return arr;
    }, []);

    const filteredPlayers = playersInRoom.filter(playerId => teamsConfigPlayers[playerId] != null);

    const allPresent = Object.values(teamsConfigPlayers).length == filteredPlayers.length;  //toctou flaw here

    console.log("allPresent:", allPresent);
    return allPresent;
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


  //room events : std

  handleMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("InstanceTellerRoom", "onMessage", this.roomName);

    const [command, data] = message;
    console.log("command", command);
    console.log("data", data);

    const handler = this.commandLibrary.getCommandHandler(command);

    if(handler) {
      // handler.handlerFunc(myClient, message);
      handler.handlerFunc(client, message);
    } else {
      console.log("unknown command", command, data);
    }


    super.handleMessage(client, message);
  }

  /////

  setupCommandLibrary(sector) {
    this.setupCommandHandlers(this.commandLibrary, sector);

    Object.entries(this.commandLibrary.commandHandlers).forEach(([commandName, commandHandler], i) => {
      this.state.roomCommands[commandName] = commandName;
    });
  }

  setupCommandHandlers(commandLibrary, sector) {
    const room = this;

    const commandHandler__instance_begin_submitStart = new CommandHandler("instance_begin_submitStart", "instance_begin_submitStart", (client, message) => {
      const [command, data] = message;

      if(room.state.allPlayersArePresent) {

        //this is ugly, this event triggers instanceConfigSector's destruction
        _rx_roomEvent.next("instanceBeginRoom_allPlayersArePresent");

        console.log("cmd_instance_begin_submitStart");
        sector.manageStartGame();
      } else {
        console.log("players not yet all present: ignore");
      }

    });
    commandLibrary.addCommandHandler(commandHandler__instance_begin_submitStart);

  }

}
