const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const ClientGameState  = require("./ClientGameState.js").ClientGameState;


const FormModel            = require("../utils/FormModel.js").FormModel;

const GroupPlayer          = require("./game/group/GroupPlayer.js").GroupPlayer;
const GroupPlayerGroup     = require("./game/group/GroupPlayerGroup.js").GroupPlayerGroup;

const SessionConfig        = require("./game/session/SessionConfig.js").SessionConfig;
const Session              = require("./game/session/Session.js").Session;


//const Action           = require("../game/model/actions/Action.js").Action;
const TellerHint       = require("./game/instance/actions/TellerHint.js").TellerHint;
const GuesserSelection = require("./game/instance/actions/GuesserSelection.js").GuesserSelection;
const GuesserEndTurn   = require("./game/instance/actions/GuesserEndTurn.js").GuesserEndTurn;

const PlayerAction     = require("./game/instance/PlayerAction.js").PlayerAction;


const createGemini = require("../utils/gemini/Gemini_Schema.js").Gemini_Schema.createGemini;
const createEcho   = require("../utils/gemini/Gemini_Schema.js").Gemini_Schema.createEcho;



class ServerGameState extends Schema {
    constructor () {
        super();

        this.initializeCommandHandlers();

        //serialized
        this.groupPlayerGroups = new MapSchema();
        this.sessions          = new MapSchema();

        this.clients           = new MapSchema();
    }

    createClientGameState(clientId) {
      const clientGameState = new ClientGameState();
      this.clients[clientId] = clientGameState;
      return clientGameState;
    }

    //group

    createGroup(clientId) {
      const group = new GroupPlayerGroup(clientId);
      this.groupPlayerGroups[clientId] = group;

      this.clients[clientId].group = createGemini(group);
    }

    getGroup(clientId) {
      //create group if needed
      // var group = this.groupPlayerGroups[clientId];
      // if(!group) {
      //   group = createGroup(clientId);
      // }
      // return group;

      return this.groupPlayerGroups[clientId];
    }

    removeGroup(clientId) {
      delete this.groupPlayerGroups[clientId];
    }

    createGroupPlayer(clientId) {
      const group = this.getGroup(clientId);
      return group.createPlayer();
    }

    removeGroupPlayer(clientId, playerId) {
      try {

        const group = this.getGroup(clientId);
        group.removePlayer(playerId);

        //delete group if empty
        // const nbPlayers = Object.values(group.players).length;
        // if(nbPlayers == 0) {
        //   this.removeGroup(clientId);
        // }

      } catch(e) {
        console.log(e);
      }

    }

    getAllGroupPlayers() {
      return Object.values(this.groupPlayerGroups).reduce((acc, grp) => acc.concat(Object.values(grp.players)), []);
    }




    /*Commands*/

    initializeCommandHandlers() {

      const gs = this;

      gs.commandHandlers = {};

      //group

      gs.commandHandlers.cmd_group_create = function(clientId, command, data) {
        gs.createGroup(clientId);
      }

      gs.commandHandlers.cmd_group_set_name = function(clientId, command, data) {
        const name = data.name;

        var group = gs.getGroup(clientId);
        group.name = name;

        // console.log("state.groups", JSON.stringify(gs.groups));
        console.log("sessions", JSON.stringify(gs.sessions));
      }

      gs.commandHandlers.cmd_group_createPlayer_loginProfile = function(clientId, command, data) {
        const profileCredentials = data.profileCredentials;

        var group = gs.getGroup(clientId);

        //TODO:login
        const groupPlayer = group.createPlayer();
        groupPlayer.name = "login789";

        group.name = "test789789789";

        return groupPlayer;
      }


      gs.commandHandlers.cmd_group_createPlayer_createProfile = function(clientId, command, data) {
        const profileForm = data.profileForm;

        //create profile

        //cmd_group_addPlayer_withProfile

        const group = gs.getGroup(clientId);
        const groupPlayer = group.createPlayer();
        groupPlayer.name = "create852";

        return groupPlayer;
      }


      gs.commandHandlers.cmd_group_createPlayer_noProfile = function(clientId, command, data) {
        const noProfileForm = data.form;

        var group = gs.getGroup(clientId);
        const groupPlayer = group.createPlayer();
        groupPlayer.name = noProfileForm.name;
        // groupPlayer.img  = noProfileForm.img;

        group.name = "test123";

        return groupPlayer;
      }


      gs.commandHandlers.cmd_group_removePlayer = function(clientId, command, data) {
        const playerId = data.playerId;
        gs.removeGroupPlayer(clientId, playerId);
      }

      gs.commandHandlers.cmd_group_setGroupPlayerName = function(clientId, command, data) {
        const playerId = data.playerId;
        const name     = data.name;
        console.log("setGroupPlayerName:", playerId, name);
        gs.hlp_setGroupPlayerProperty(clientId, playerId, "name", name);
      }

      gs.hlp_setGroupPlayerProperty = function(clientId, playerId, property, value) {
        console.log("hlp_setPlayerProperty:", playerId, property, value);
        const group  = gs.groupPlayerGroups[clientId];
        //console.log("group", group.toJSON());
        const groupPlayer = group.players[playerId];
        //console.log("groupPlayer", groupPlayer.toJSON());
        if(groupPlayer) {
          groupPlayer[property] = value;
        } else {
          console.log("could not find groupPlayer matching playerId:", playerId);
        }
      }

      //session

      gs.commandHandlers.cmd_session_config_formModel = function(clientId, command, data) {
        console.log("cmd_session_config_formModel");

        const schemaInstance = SessionConfig.default();
        const types  = schemaInstance._schema;
        const values = schemaInstance;
        const formModel = new FormModel(types, values);
        return formModel;
      }

      gs.commandHandlers.cmd_session_create = function(clientId, command, data) {
        const form = data.form;
        console.log("cmd_session_create:", form);

        const sId = clientId + "_" + form.name;

        const session = new Session(sId, form);
        gs.sessions[session.id] = session;

        const data_join = {sId : session.id};
        gs.cmd_session_join(clientId, command, data_join);

        return session;
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


      //game

      gs.commandHandlers.cmd_instance_teller_submitHint = function(clientId, command, data) {
        console.log("cmd_instance_teller_submitHint");
        const srcId  = data.playerId;
        const action = new TellerHint(data.word, data.number);

        const playerAction = new PlayerAction(srcId, action);

        gs.game.manageTellerAction(playerAction);
      }

      gs.commandHandlers.cmd_instance_guesser_submitCellSelection = function(clientId, command, data) {
        console.log("cmd_instance_guesser_submitCellSelection");
        const srcId  = data.playerId;
        const action = new GuesserSelection(data.cellIndex);

        const playerAction = new PlayerAction(srcId, action);

        gs.game.manageGuesserSelection(playerAction);
      }

      gs.commandHandlers.cmd_instance_guesser_submitEndTurn = function(clientId, command, data) {
        console.log("cmd_instance_guesser_submitEndTurn");
        const srcId  = data.playerId;
        const action = new GuesserEndTurn();

        const playerAction = new PlayerAction(srcId, action);

        gs.game.manageGuesserEndTurn(playerAction);
      }

    }

}
schema.defineTypes(ServerGameState, {
  groupPlayerGroups : { map : GroupPlayerGroup },

  sessions           : { map : Session },

  clients : ClientGameState,
});

exports.ServerGameState = ServerGameState;
