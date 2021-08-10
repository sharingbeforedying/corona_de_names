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

      const teams_config = this;
      this.watchedTeams = onChange(this.teams, function (path, value, previousValue) {
        console.log("SessionConfig::this.teams.onChange");
        console.log('path:', path);
      	console.log('value:', value);
      	console.log('previousValue:', previousValue);

        teams_config.updateCanStart();
      }, {ignoreKeys: ["$changes"]});

      this.acceptable = false;

      // this.nb_cells = 25;
    }

    updateCanStart() {
      const readyCount = Object.values(this.teams).filter(team => team.ready).length;
      console.log("readyCount:", readyCount);
      this.acceptable = readyCount > 1;
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

      // console.log("before removePlayer");
      // console.log(JSON.stringify(this.watchedTeams[teamId].watchedPlayers));

      const sessionTeamPlayer = this.watchedTeams[teamId].removePlayer(playerId);
      console.log("sessionTeamPlayer", sessionTeamPlayer);

      // console.log("after removePlayer");
      // console.log(JSON.stringify(this.watchedTeams[teamId].watchedPlayers));

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
                     // Utils.extendObj(acc, playersDict);
                     return Object.assign(acc, playersDict);

                     // return acc;
                   }, {});
    }

    getRichTeamPlayersMap() {

      function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }

      return Object.values(this.watchedTeams)

                   .map(team => {
                     const richPlayersDict = Object.fromEntries(Object.entries(team.watchedPlayers).map(([playerId, player]) => {
                       return [playerId, {
                         player: player,
                         team: team,
                         teamOrder: getKeyByValue(this.teamsOrder, team.id),
                       }];
                     }));
                     return richPlayersDict;
                   })

                   .reduce((acc, playersDict) => {
                     return Object.assign(acc, playersDict);
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

    dirtyGetRoles() {
      const InstancePlayerRole = require('../../instance/InstancePlayerRole.js').InstancePlayerRole;
      return Object.values(InstancePlayerRole.rolesMap());
    }

}
schema.defineTypes(TeamsConfig, {

  freePlayers     : {map : TeamsConfigFreePlayer},

  teams           : {map : TeamsConfigTeam},
  teamsOrder      : {map : "string"},

  acceptable       : "boolean",

  // nb_cells        : "number",
});

exports.TeamsConfig = TeamsConfig;
