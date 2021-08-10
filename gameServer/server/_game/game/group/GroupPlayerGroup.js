const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

const GroupPlayer = require("./GroupPlayer.js").GroupPlayer;

class GroupPlayerGroup extends Schema {
  constructor (id) {
      super();
      this.id      = id;
      this.name    = "my group";
      this.image   = null;

      this.players = new MapSchema();
  }

  // createPlayer() {
  //   const groupPlayerId = this.id + "_" + Object.keys(this.players).length;
  //   const groupPlayer = new GroupPlayer(groupPlayerId, this.id);
  //
  //   this.players[groupPlayer.id] = groupPlayer;
  //
  //   return groupPlayer;
  // }

  createPlayer() {
    console.log("GroupPlayerGroup", "createPlayer", "+++///+++");

    const groupPlayerId = this.id + "_" + Object.keys(this.players).length;
    const groupPlayer = new GroupPlayer(groupPlayerId);

    // groupPlayer.seedOfEvil = {};

    this.players[groupPlayer.id] = groupPlayer;   //may set a clone instead of the proposed setValue (when proxified) //right-value may mutate ...

    // return groupPlayer;
    return this.players[groupPlayer.id];

    // if(groupPlayer.seedOfEvil != {}) {
    //   return groupPlayer.seedOfEvil;
    // } else {
    //   return groupPlayer;
    // }
  }

  removePlayer(playerId) {
    delete this.players[playerId];
  }
}
schema.defineTypes(GroupPlayerGroup, {
  id     : "string",
  name   : "string",
  image  : "string",

  players: { map : GroupPlayer },
});
exports.GroupPlayerGroup = GroupPlayerGroup;
