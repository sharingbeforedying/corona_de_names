const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const TeamsConfigTeamPlayer = require('./TeamsConfigTeamPlayer.js').TeamsConfigTeamPlayer;

const onChange = require('on-change');

class TeamsConfigTeam extends Schema {
  constructor (id, color, name="") {
      super();
      this.id = id;

      this.color   = color;
      this.name    = name;

      // this.roles = new ArraySchema();
      // this.roles.push("teller");
      // this.roles.push("guesser");

      this.players = new MapSchema();
      this.valid   = false;
      this.ready   = false;
  }

  static create_redTeam() {
    return new TeamsConfigTeam("id_red", "red", "red team");
  }

  static create_blueTeam() {
    return new TeamsConfigTeam("id_blue", "blue", "blue team");
  }

}

schema.defineTypes(TeamsConfigTeam, {
  id      : "string",

  color   : "string",
  name    : "string",

  // roles   : [ "string" ],

  players : {map : TeamsConfigTeamPlayer},

  valid   : "boolean",
  ready   : "boolean",

});

exports.TeamsConfigTeam = TeamsConfigTeam;
