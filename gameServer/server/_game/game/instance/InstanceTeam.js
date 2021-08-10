const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const InstancePlayer = require('./InstancePlayer.js').InstancePlayer;

const onChange = require('on-change');

class InstanceTeam extends Schema {
  constructor (id, color, tellerIds, guesserIds) {
      super();
      this.id    = id;
      this.color = color;

      this.type  = null;    //

      // this.tellers  = new ArraySchema();
      this.tellers = [];
      tellerIds.forEach((gamePlayerId, i) => {
        this.tellers.push(InstancePlayer.teller(gamePlayerId));
      });

      // this.guessers = new ArraySchema();
      this.guessers = [];
      guesserIds.forEach((gamePlayerId, i) => {
        this.guessers.push(InstancePlayer.guesser(gamePlayerId));
      });

      console.log("this.tellers", this.tellers);
      console.log("this.guessers", this.guessers);

      this.players = new MapSchema();
      this.tellers.forEach((player, i) => {
        console.log("player", player.id, player.role);
        this.players[player.id] = player;
      });
      this.guessers.forEach((player, i) => {
        console.log("player", player.id, player.role);
        this.players[player.id] = player;
      });

      console.log("this.players", this.players);

  }

  getNbOfPlayers() {
    // return this.tellers.length + this.guessers.length;
    return this.players.length;
  }

}
schema.defineTypes(InstanceTeam, {
  id       : "string",
  color    : "string",

  type     : "number",

  //tellers  : [ InstancePlayer ],
  //guessers : [ InstancePlayer ],

  players  : { map : InstancePlayer },

});

exports.InstanceTeam = InstanceTeam;
