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

      // const redTeam  = TeamsConfigTeam.create_redTeam();
      const sessionTeam1 = new TeamsConfigTeam("ssT1", "#ff33cc", "M-KILLERS");
      this.teams[sessionTeam1.id]  = sessionTeam1;

      // const blueTeam = TeamsConfigTeam.create_blueTeam();
      const sessionTeam2 = new TeamsConfigTeam("ssT2", "#00ccff", "C-MOTHERFUCKERS");
      this.teams[sessionTeam2.id] = sessionTeam2;



      this.teamsOrder = new MapSchema();
      this.teamsOrder[1] = sessionTeam1.id;
      this.teamsOrder[2] = sessionTeam2.id;

      this.acceptable = false;
    }

}
schema.defineTypes(TeamsConfig, {

  freePlayers     : {map : TeamsConfigFreePlayer},

  teams           : {map : TeamsConfigTeam},
  teamsOrder      : {map : "string"},

  acceptable       : "boolean",

});

exports.TeamsConfig = TeamsConfig;
