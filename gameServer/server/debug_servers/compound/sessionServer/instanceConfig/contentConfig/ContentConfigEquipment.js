const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const CommandLibrary = require("../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../commands/CommandHandler.js").CommandHandler;

// const GroupPlayerGroup = require("../../../../_game/game/group/GroupPlayerGroup.js").GroupPlayerGroup;
const SessionConfig = require("../../../../_game/game/session/SessionConfig.js").SessionConfig;
const FormModel     = require("../../../../utils/FormModel.js").FormModel;

exports.SessionEquipment = class SessionEquipment {

  constructor() {

    this.host           = null;   //host is a room

    this.initialState   = this.createInitialState();
    this.commandLibrary = this.createCommandLibrary();

    this.subEquipments  = this.createSubEquipments();
  }

  createInitialState() {

    class CreateSessionEquipmentState extends Schema {
      constructor() {
        super();

        this.session = null;
      }
    }
    schema.defineTypes(CreateSessionEquipmentState, {

      // group : GroupPlayerGroup,
      session : Session,

    });

    // exports.GroupEquipmentState = GroupEquipmentState;

    const state = new CreateSessionEquipmentState();
    return state;
  }

  createCommandLibrary() {
    const commandLibrary = new CommandLibrary();

    this.setupCommandHandlers(commandLibrary);

    return commandLibrary;
  }

  setupCommandHandlers(commandLibrary) {

    const eqpt = this;
    const host = eqpt.host;


    // const commandHandler = new CommandHandler(command, command, (myClient, message) => {
    const commandHandler__session_config_formModel = new CommandHandler("session_config_formModel", "session_config_formModel", (client, message) => {
      const [command, data] = message;

      const schemaInstance = SessionConfig.default();
      const types  = schemaInstance._schema;
      const values = schemaInstance;
      const formModel = new FormModel(types, values);
      // return formModel;

      // eqpt.host.sendCommandAnswer()

    });
    commandLibrary.addCommandHandler(commandHandler__session_config_formModel);

    const commandHandler__session_create = new CommandHandler("session_create", "session_create", (client, message) => {
      const [command, data] = message;

      const form = data.form;
      console.log("cmd_session_create:", form);

      const sId = clientId + "_" + form.name;

      /*
      const session = new Session(sId, form);
      gs.sessions[session.id] = session;

      const data_join = {sId : session.id};
      gs.cmd_session_join(clientId, command, data_join);

      return session;
      */
    });
    commandLibrary.addCommandHandler(commandHandler__session_create);


  }

  gs.commandHandlers.cmd_session_join = function(clientId, command, data) {
    console.log("cmd_session_join:", clientId);
    // const groupPlayerGroup = gs.groupPlayerGroups[clientId];
    var groupPlayerGroup = gs.groupPlayerGroups[clientId];
    const sId = data.sId;

    const session = gs.sessions[sId];

    // session.addGroup(groupPlayerGroup);

    Object.values(groupPlayerGroup.players).forEach((groupPlayer, i) => {
      session.createPlayer(groupPlayer, groupPlayerGroup);
    });

    groupPlayerGroup.name += "_join";
    // console.log("sessions", JSON.stringify(gs.sessions));
    // console.log("state.groups", JSON.stringify(gs.groups));

    return session;
  }

  gs.commandHandlers.cmd_session_leave = function(clientId, command, data) {
    console.log("cmd_session_leave:", clientId);
    const groupPlayerGroup = gs.groupPlayerGroups[clientId];
    const sId = data.sId;

    const session = gs.sessions[sId];
    Object.values(groupPlayerGroup.players).forEach((groupPlayer, i) => {
      session.removePlayer(groupPlayer.id);
    });

    return session;
  }


  //instance_config

  gs.commandHandlers.cmd_instance_config_teams_joinTeam = function(clientId, command, data) {
    const sId      = data.sId;
    const playerId = data.playerId;
    const teamId   = data.teamId;
    console.log("cmd_instance_config_teams_joinTeam:", sId, playerId, teamId);

    const session = gs.sessions[sId];
    session.instance_config.teams.joinTeam(teamId, playerId);
  }

  gs.commandHandlers.cmd_instance_config_teams_leaveTeam = function(clientId, command, data) {
    const sId      = data.sId;
    const playerId = data.playerId;
    const teamId   = data.teamId;
    console.log("cmd_instance_config_teams_leaveTeam:", sId, playerId, teamId);

    const session = gs.sessions[sId];
    session.instance_config.teams.leaveTeam(teamId, playerId);
  }

  gs.commandHandlers.cmd_instance_config_teams_teamPlayer_set_ready = function(clientId, command, data) {
    const sId      = data.sId;
    const playerId = data.playerId;
    const ready    = data.ready;
    console.log("cmd_instance_config_teams_teamPlayer_set_ready:", sId, playerId, ready);

    const session = gs.sessions[sId];
    session.instance_config.teams.setTeamPlayerProperty(playerId, "ready", ready);
  }

  gs.commandHandlers.cmd_instance_config_teams_teamPlayer_set_role = function(clientId, command, data) {
    const sId      = data.sId;
    const playerId = data.playerId;
    const roleId   = data.roleId;
    console.log("cmd_instance_config_teams_teamPlayer_set_role:", sId, playerId, roleId);

    const session = gs.sessions[sId];
    session.instance_config.teams.setTeamPlayerProperty(playerId, "role", roleId);
  }




  gs.commandHandlers.cmd_session_startGame = function(clientId, command, data) {
    const sId     = data.sId;
    const session = gs.sessions[sId];

    try {
      if(session_config.canStart) {

        session.game      = new Game(gs.session_config);
        session.gameState = gs.game.gameState;

      }
    } catch(e) {
      console.log(e);
    }
  }

  gs.commandHandlers.cmd_auto_role_in_team = function(clientId, command, data) {
    const teamId = data.teamId;
    const role   = data.role;

    //create player
    const nickname = "auto" + "_" + role + "_" + teamId;
    let groupPlayer = gs.cmd_group_createGroupPlayer(clientId, command, {nickname : nickname});

    //join team
    gs.commandHandlers.cmd_session_config_joinTeam(clientId, command, {playerId: groupPlayer.id, teamId: teamId});

    //set role
    gs.commandHandlers.cmd_session_config_setPlayerRole(clientId, command, {playerId: groupPlayer.id, role: role});

    //set ready
    gs.commandHandlers.cmd_session_config_setPlayerReady(clientId, command, {playerId: groupPlayer.id, ready: true});
  }

  gs.commandHandlers.cmd_auto_game = function(clientId, command, data) {
    const type           = data.type;
    const nb_cells       = data.nb_cells;
    const startingTeamId = data.startingTeamId;
  }



  ////////////

  createSubEquipments() {

  }


}
