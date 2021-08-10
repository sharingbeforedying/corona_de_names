const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const TeamsConfigFreePlayer = require('./TeamsConfigFreePlayer.js').TeamsConfigFreePlayer;

const TeamsConfigTeam       = require('./TeamsConfigTeam.js').TeamsConfigTeam;
const TeamsConfigTeamPlayer = require('./TeamsConfigTeamPlayer.js').TeamsConfigTeamPlayer;

const onChange = require('on-change');

const Utils = require('../../../../utils/Utils.js').Utils;

class TeamsConfig extends Schema {

    constructor() {
      console.log("TeamsConfig()");
      super();

      this.freePlayers = new MapSchema();


      this.teams = new MapSchema();
      // const redTeam  = SessionTeam.create_redTeam();
      const sessionTeam1 = new TeamsConfigTeam("ssT1", "#ff33cc", "M-KILLERS");
      this.teams[sessionTeam1.id]  = sessionTeam1;
      // const blueTeam = SessionTeam.create_blueTeam();
      const sessionTeam2 = new TeamsConfigTeam("ssT2", "#00ccff", "C-MOTHERFUCKERS");
      this.teams[sessionTeam2.id] = sessionTeam2;

      this.teamsOrder = new MapSchema();
      this.teamsOrder[1] = sessionTeam1.id;
      this.teamsOrder[2] = sessionTeam2.id;

      // const session_config = this;
      this.watchedTeams = onChange(this.teams, function (path, value, previousValue) {
        console.log("SessionConfig::this.teams.onChange");
        console.log('path:', path);
      	console.log('value:', value);
      	console.log('previousValue:', previousValue);

        // session_config.updateCanStart();
      }, {ignoreKeys: ["$changes"]});

      this.canStart = false;

      // this.nb_cells = 25;
    }

    updateCanStart() {
      const readyCount = Object.values(this.teams).filter(team => team.ready).length;
      console.log("readyCount:", readyCount);
      this.canStart = readyCount > 1;
    }


    getOrderedTeamsIter() {
      const teamIds = Object.keys(this.teamsOrder).sort().map(ord => this.teamsOrder[ord]);
      return teamIds.map(teamId => this.teams[teamId]);
    }

    addFreePlayer(sessionPlayer) {
      console.log("addFreePlayer", sessionPlayer);

      const sessionFreePlayer = new TeamsConfigFreePlayer(sessionPlayer.id);
      this.freePlayers[sessionFreePlayer.id] = sessionFreePlayer;
    }

    joinTeam(teamId, playerId) {
      console.log("joinTeam", teamId, playerId);

      const sessionFreePlayer = this.freePlayers[playerId];
      delete this.freePlayers[playerId];

      const sessionTeamPlayer = new TeamsConfigTeamPlayer(sessionFreePlayer.id);
      this.watchedTeams[teamId].addPlayer(sessionTeamPlayer);
    }

    leaveTeam(teamId, playerId) {
      console.log("leaveTeam", teamId, playerId);

      const sessionTeamPlayer = this.watchedTeams[teamId].removePlayer(playerId);

      const sessionFreePlayer = new TeamsConfigFreePlayer(sessionTeamPlayer.id);
      this.freePlayers[playerId] = sessionFreePlayer;
    }

    changeTeam(srcTeamId, dstTeamId, playerId) {
      console.log("changeTeam", srcTeamId, dstTeamId, playerId);

      const sessionTeamPlayer = this.watchedTeams[srcTeamId].removePlayer(playerId);

      this.watchedTeams[dstTeamId] = sessionTeamPlayer;
    }

    admin_setTeamOrder(playerId, teamOrder) {
      //todo
    }

    getTeamPlayersMap() {
      //return Object.values(this.teams)
      return Object.values(this.watchedTeams)

                   //.map(team => team.players)
                   .map(team => team.watchedPlayers)

                   .reduce((acc, playersDict) => {
                     //console.log("acc", acc);
                     //console.log("playersDict", playersDict);

                     //acc.assign(playersDict);
                     Utils.extendObj(acc, playersDict);

                     return acc;
                   }, {});
    }

    getTeamPlayer(playerId) {

      const teamPlayersMap = this.getTeamPlayersMap();
      //console.log("playersMap", playersMap);
      const teamPlayer = teamPlayersMap[playerId];
      //console.log("player", player);
      return teamPlayer;
    }

    setTeamPlayerProperty(playerId, propName, value) {
      const teamPlayer = this.getTeamPlayer(playerId);
      if(teamPlayer) {
        if(propName == "role") {
          const roleId = value;
          teamPlayer.updateRole(roleId);
        } else {
          console.log("setTeamPlayerProperty", playerId, propName, value);
          teamPlayer[propName] = value;
        }

      } else {
        console.log("setTeamPlayerProperty", "error", "teamPlayer not found", playerId);
      }
    }

}
schema.defineTypes(TeamsConfig, {

  freePlayers     : {map : TeamsConfigFreePlayer},

  teams           : {map : TeamsConfigTeam},
  teamsOrder      : {map : "string"},

  canStart        : "boolean",

  // nb_cells        : "number",
});

exports.TeamsConfig = TeamsConfig;
