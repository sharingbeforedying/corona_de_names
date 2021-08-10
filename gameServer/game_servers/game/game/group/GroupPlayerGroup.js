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

  createPlayer() {
    // console.log("GroupPlayerGroup", "createPlayer", "+++///+++");
    if(this.log) {
      this.log(this.lolol);
      console.log(this.stop.here);
    } else {
      console.log(this.stop.there);  
    }

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

    // const newGroupPlayer = this.players[groupPlayer.id];
    // return newGroupPlayer;

    // const groupPlayers = this.players;
    // const newGroupPlayer = groupPlayers[groupPlayer.id];
    // return newGroupPlayer;
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
