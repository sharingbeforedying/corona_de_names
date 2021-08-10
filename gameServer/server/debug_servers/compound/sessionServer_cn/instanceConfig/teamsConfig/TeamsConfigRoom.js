const colyseus = require('colyseus');

const SharedRoom = require("../../../../../rooms/sharedRoom/SharedRoom.js").SharedRoom;

// const ChatRoomState = require("./ChatRoomState.js").ChatRoomState;
// const ChatRoomAvatar = require("./ChatRoomAvatar.js").ChatRoomAvatar;

// const onChange = require('on-change');
// const rxjs = require('rxjs');

const TeamsConfigRoomState = require("./TeamsConfigRoomState.js").TeamsConfigRoomState;

const CommandLibrary = require("../../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../../commands/CommandHandler.js").CommandHandler;

const Rx = require('rxjs');
const _rx_roomEvent   = new Rx.Subject();
const _rx_teamsConfig = new Rx.Subject();


const TeamsConfigWrapper = require('../../../../../_game/game/instanceConfig/teams/TeamsConfigWrapper.js').TeamsConfigWrapper;

exports.TeamsConfigRoom = class TeamsConfigRoom extends SharedRoom {

  constructor(presence) {
    super(presence);

    const state = new TeamsConfigRoomState();
    // console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

    this.commandLibrary = new CommandLibrary();

    this.rx_roomEvent    = _rx_roomEvent.asObservable();
    this.rx_teamsConfig = _rx_teamsConfig.asObservable();

    this.teamsConfigWrapper = new TeamsConfigWrapper(this.state.teamsConfig);

  }

  //room events : myClient

  onAddTetheredClient(tetheredClient) {
    super.onAddTetheredClient(tetheredClient);

    const client       = tetheredClient.client;
    const myClient     = tetheredClient.myClient;
    const incomingData = tetheredClient.incomingData;

    const clientRoomState = myClient.clientRoomConnection.room.state;

    if(!incomingData) {
      throw new Error("incomingData == null");
    }

    const sessionPlayers = incomingData.sessionPlayers;
    if(sessionPlayers) {

      // const teamPlayers = this.state.teamsConfig.getTeamPlayersMap();
      // const freePlayers = this.state.teamsConfig.freePlayers;

      const teamsConfigWrapper = this.teamsConfigWrapper;

      const teamPlayers = teamsConfigWrapper.getTeamPlayersMap();
      const freePlayers = teamsConfigWrapper.teamsConfig.freePlayers;

      Object.values(sessionPlayers).forEach((sessionPlayer, i) => {
        //check if sessionPlayers has a reserved seat
        const playerId = sessionPlayer.id;
        const already_inTeam = teamPlayers[playerId] != null;
        const already_inFree = freePlayers[playerId] != null;
        if(already_inTeam) {
          console.log("already_inTeam");
          //do nothing
        } else if(already_inFree) {
          console.log("already_inFree");
          //do nothing
        } else {
          // this.state.teamsConfig.addFreePlayer(sessionPlayer);
          teamsConfigWrapper.addFreePlayer(sessionPlayer);
        }
      });
    } else {
      throw new Error("sessionPlayers == null");
    }

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
    console.log("TeamsConfigRoom", "onMessage", this.roomName);

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

    // const eqpt = this;
    // const host = eqpt.host;

    // const teamsConfig = this.state.teamsConfig;  //don't do this, because handlers may not see the _latest_ teamsConfig
    const room = this;

    // const commandHandler = new CommandHandler(command, command, (myClient, message) => {
    const commandHandler__instance_config_teams_joinTeam = new CommandHandler("instance_config_teams_joinTeam", "instance_config_teams_joinTeam", (client, message) => {
      const [command, data] = message;

      const playerId = data.playerId;
      const teamId   = data.teamId;
      console.log("cmd_instance_config_teams_joinTeam:", playerId, teamId);

      // const teamsConfig = room.state.teamsConfig;
      // teamsConfig.joinTeam(teamId, playerId);
      const teamsConfigWrapper = room.teamsConfigWrapper;
      teamsConfigWrapper.joinTeam(teamId, playerId);
    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_teams_joinTeam);

    const commandHandler__instance_config_teams_leaveTeam = new CommandHandler("instance_config_teams_leaveTeam", "instance_config_teams_leaveTeam", (client, message) => {
      const [command, data] = message;

      const playerId = data.playerId;
      const teamId   = data.teamId;
      console.log("cmd_instance_config_teams_leaveTeam:", playerId, teamId);

      // const teamsConfig = room.state.teamsConfig;
      // teamsConfig.leaveTeam(teamId, playerId);
      const teamsConfigWrapper = room.teamsConfigWrapper;
      teamsConfigWrapper.leaveTeam(teamId, playerId);
    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_teams_leaveTeam);

    const commandHandler__instance_config_teams_teamPlayer_set_role = new CommandHandler("instance_config_teams_teamPlayer_set_role", "instance_config_teams_teamPlayer_set_role", (client, message) => {
      const [command, data] = message;

      const playerId = data.playerId;
      const roleId   = data.roleId;
      console.log("cmd_instance_config_teams_teamPlayer_set_role:", playerId, roleId);

      // const teamsConfig = room.state.teamsConfig;
      // teamsConfig.setTeamPlayerProperty(playerId, "role", roleId);
      const teamsConfigWrapper = room.teamsConfigWrapper;
      teamsConfigWrapper.setTeamPlayerProperty(playerId, "role", roleId);
    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_teams_teamPlayer_set_role);


    const commandHandler__instance_config_teams_teamPlayer_set_ready = new CommandHandler("instance_config_teams_teamPlayer_set_ready", "instance_config_teams_teamPlayer_set_ready", (client, message) => {
      const [command, data] = message;

      const playerId = data.playerId;
      const ready    = data.ready;
      console.log("cmd_instance_config_teams_teamPlayer_set_ready:", playerId, ready);

      // const teamsConfig = room.state.teamsConfig;
      // teamsConfig.setTeamPlayerProperty(playerId, "ready", ready);
      const teamsConfigWrapper = room.teamsConfigWrapper;
      teamsConfigWrapper.setTeamPlayerProperty(playerId, "ready", ready);
    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_teams_teamPlayer_set_ready);



    const commandHandler__instance_config_teams_submitTeamsConfig = new CommandHandler("instance_config_teams_submitTeamsConfig", "instance_config_teams_submitTeamsConfig", (client, message) => {
      const [command, data] = message;

      // console.log("submitTeamsConfig");
      // if(teamsConfig.acceptable) {
      //   console.log("teamsConfig.acceptable");
      //
      //   // super.onMessage(client, ["moveToNextRoom", {}]);
      //   this.getRoomLink(client).onMessage(["moveToNextRoom", {teamsConfig: teamsConfig}]);
      // } else {
      //   throw new Error("teamsConfig.acceptable == false");
      // }

      // const teamsConfig = room.state.teamsConfig;
      const teamsConfigWrapper = room.teamsConfigWrapper;
      const teamsConfig = teamsConfigWrapper.teamsConfig;

      //debug
      // this.getRoomLink(client).onMessage(["moveToNextRoom", {teamsConfig: teamsConfig}]);
      _rx_teamsConfig.next(teamsConfigWrapper);

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_teams_submitTeamsConfig);

  }

  sendCommandAnswer(client, commandAnswer) {
    console.log("TeamsConfigRoom", this.roomName, "sendCommandAnswer", commandAnswer);
    client.send("answer", { commandAnswer : commandAnswer });
  }


  submitTeamsConfig() {
    console.log("TeamsConfigRoom", "submitTeamsConfig");

    const teamsConfigWrapper = this.teamsConfigWrapper;
    _rx_teamsConfig.next(teamsConfigWrapper);
  }


}
