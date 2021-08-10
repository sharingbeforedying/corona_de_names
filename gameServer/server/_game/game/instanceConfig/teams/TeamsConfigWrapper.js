const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const TeamsConfigFreePlayer = require('./TeamsConfigFreePlayer.js').TeamsConfigFreePlayer;

const TeamsConfigTeam       = require('./TeamsConfigTeam.js').TeamsConfigTeam;
const TeamsConfigTeamPlayer = require('./TeamsConfigTeamPlayer.js').TeamsConfigTeamPlayer;

const onChange = require('on-change');

const Utils = require('../../../../utils/Utils.js').Utils;

const TeamsConfig = require('./TeamsConfig.js').TeamsConfig;

const TeamsConfigTeamWrapper = require('./TeamsConfigTeamWrapper.js').TeamsConfigTeamWrapper;

class TeamsConfigWrapper {

    constructor(teamsConfig) {
      console.log("TeamsConfigWrapper()");
      // super();

      this.wrapAround(teamsConfig);
    }

    wrapAround(teamsConfig) {
      const wrapper = this;
      wrapper.teamsConfig = teamsConfig;

      //wrapper properties
      const teamWrappersEntries = Object.entries(teamsConfig.teams)
                            .map(([teamId, team]) => {
                              return [teamId, new TeamsConfigTeamWrapper(team)];
                            });
      const teamWrappers = Object.fromEntries(teamWrappersEntries);

      wrapper.watchedTeamWrappers = onChange(teamWrappers, function (path, value, previousValue) {
        console.log("watchedTeamWrappers.onChange");
        console.log('path:', path);
        console.log('value:', value);
        console.log('previousValue:', previousValue);

        wrapper.updateCanStart(teamsConfig);
      }, {ignoreKeys: ["$changes"]});
    }

    updateCanStart(teamsConfig) {
      const readyCount = Object.values(teamsConfig.teams).filter(team => team.ready).length;
      console.log("readyCount:", readyCount);
      teamsConfig.acceptable = readyCount > 1;
    }


    getOrderedTeamIds() {
      const teamsConfig = this.teamsConfig;

      const teamIds = Object.keys(teamsConfig.teamsOrder).sort().map(ord => teamsConfig.teamsOrder[ord]);
      return teamIds;
    }

    getOrderedTeamsIter() {
      const teamsConfig = this.teamsConfig;

      return this.getOrderedTeamIds()
                 .map(teamId => teamsConfig.teams[teamId]);
    }

    getOrderedTeamWrappersIter() {
      return this.getOrderedTeamIds()
                 .map(teamId => this.watchedTeamWrappers[teamId]);
    }

    addFreePlayer(sessionPlayer) {
      console.log("addFreePlayer", sessionPlayer);

      const teamsConfig = this.teamsConfig;

      const sessionFreePlayer = new TeamsConfigFreePlayer(sessionPlayer.id);
      teamsConfig.freePlayers[sessionFreePlayer.id] = sessionFreePlayer;
    }

    joinTeam(teamId, playerId) {
      console.log("joinTeam", teamId, playerId);

      const teamsConfig = this.teamsConfig;

      const sessionFreePlayer = teamsConfig.freePlayers[playerId];
      delete teamsConfig.freePlayers[playerId];

      const sessionTeamPlayer = new TeamsConfigTeamPlayer(sessionFreePlayer.id);
      this.watchedTeamWrappers[teamId].addPlayer(sessionTeamPlayer);
    }

    leaveTeam(teamId, playerId) {
      console.log("leaveTeam", teamId, playerId);

      const teamsConfig = this.teamsConfig;


      // console.log("before removePlayer");
      // console.log(JSON.stringify(this.watchedTeams[teamId].watchedPlayers));

      const sessionTeamPlayer = this.watchedTeamWrappers[teamId].removePlayer(playerId);
      console.log("sessionTeamPlayer", sessionTeamPlayer);

      // console.log("after removePlayer");
      // console.log(JSON.stringify(this.watchedTeams[teamId].watchedPlayers));

      const sessionFreePlayer = new TeamsConfigFreePlayer(sessionTeamPlayer.id);
      teamsConfig.freePlayers[playerId] = sessionFreePlayer;
    }

    changeTeam(srcTeamId, dstTeamId, playerId) {
      console.log("changeTeam", srcTeamId, dstTeamId, playerId);

      const sessionTeamPlayer = this.watchedTeamWrappers[srcTeamId].removePlayer(playerId);

      this.watchedTeamWrappers[dstTeamId] = sessionTeamPlayer;
    }

    admin_setTeamOrder(playerId, teamOrder) {
      //todo
    }

    getTeamPlayersMap() {
      //return Object.values(this.teams)
      return Object.values(this.watchedTeamWrappers)

                   //.map(team => team.players)
                   .map(teamWrapper => teamWrapper.watchedPlayers)

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

      return Object.values(this.watchedTeamWrappers)

                   .map(teamWrapper => {
                     const teamsConfigTeam = teamWrapper.teamsConfigTeam;

                     const richPlayersDict = Object.fromEntries(Object.entries(teamWrapper.watchedPlayers).map(([playerId, player]) => {
                       return [playerId, {
                         player: player,
                         team:   teamsConfigTeam,
                         teamOrder: getKeyByValue(this.teamsConfig.teamsOrder, teamsConfigTeam.id),
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
exports.TeamsConfigWrapper = TeamsConfigWrapper;
