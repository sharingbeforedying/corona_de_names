const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const TeamsConfigTeamPlayer = require('./TeamsConfigTeamPlayer.js').TeamsConfigTeamPlayer;

const onChange = require('on-change');

const TeamsConfigTeam = require('./TeamsConfigTeam.js').TeamsConfigTeam;

class TeamsConfigTeamWrapper {

  constructor (teamsConfigTeam) {
    console.log("TeamsConfigTeamWrapper()");
      // super();

      this.wrapAround(teamsConfigTeam);
  }

  wrapAround(teamsConfigTeam) {
    const wrapper = this;
    wrapper.teamsConfigTeam = teamsConfigTeam;


    //wrapper properties
    // wrapper.players = teamsConfigTeam.players;

    wrapper.watchedPlayers = onChange(teamsConfigTeam.players, function (path, value, previousValue) {
      console.log("TeamsConfigTeam::this.players.onChange");

      console.log('path:', path);
      console.log('value:', value);
      console.log('previousValue:', previousValue);

      wrapper.updateValid(teamsConfigTeam);
      wrapper.updateReady(teamsConfigTeam);
    }, {ignoreKeys: ["$changes"]});
  }

  updateValid(teamsConfigTeam) {
    console.log("TeamsConfigTeam", "updateValid");
    const ok_guesser = Object.values(teamsConfigTeam.players).some(player => player.role.id == 0);
    const ok_teller  = Object.values(teamsConfigTeam.players).some(player => player.role.id == 1);
    const valid = ok_guesser && ok_teller;
    console.log("valid", valid);
    teamsConfigTeam.valid = valid;
  }

  updateReady(teamsConfigTeam) {
    console.log("TeamsConfigTeam", "updateReady");
    const ready_guesser = Object.values(teamsConfigTeam.players).filter(player => player.role.id == 0).some(player => player.ready);
    const ready_teller  = Object.values(teamsConfigTeam.players).filter(player => player.role.id == 1).some(player => player.ready);
    const ready = ready_guesser && ready_teller;
    console.log("ready", ready);
    teamsConfigTeam.ready = ready;
  }

  addPlayer(sessionPlayer) {
    this.watchedPlayers[sessionPlayer.id] = sessionPlayer;
  }

  removePlayer(playerId) {
    const sessionPlayer = this.watchedPlayers[playerId];
    delete this.watchedPlayers[playerId];
    return sessionPlayer;
  }

  getSessionPlayerWithRole(role) {
    const tellers = Object.values(this.watchedPlayers).filter(player => player.role.id == role.id);
    let first = tellers.find(e => true);
    return first;
  }


}
exports.TeamsConfigTeamWrapper = TeamsConfigTeamWrapper;
