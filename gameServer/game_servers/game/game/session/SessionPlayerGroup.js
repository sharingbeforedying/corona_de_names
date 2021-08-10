const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

const SessionPlayer = require("./SessionPlayer.js").SessionPlayer;

class SessionPlayerGroup extends Schema {

  constructor (playerGroup) {
      super();
      this.id      = playerGroup.id;
      this.name    = playerGroup.name;

      this.players = new MapSchema();
      Object.values(playerGroup.players).forEach((groupPlayer, i) => {
        const sessionPlayer = new SessionPlayer(groupPlayer);
        this.players[sessionPlayer.id] = sessionPlayer;
      });

  }

}
schema.defineTypes(SessionPlayerGroup, {
  id   : "string",
  name : "string",
  players: { map : SessionPlayer },
});
exports.SessionPlayerGroup = SessionPlayerGroup;
