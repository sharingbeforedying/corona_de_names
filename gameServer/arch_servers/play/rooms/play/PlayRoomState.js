const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

class PlayRoomState extends Schema {
    constructor () {
        super();

        //serialized
        this.name = "playRoom_name";

        this.connected = 0;

          //later
        // this.<gameState> = null;
    }

}
schema.defineTypes(PlayRoomState, {
  name: "string",

  connected: "number",

    //later
  //<gameState> : <ClientGameState>
});

exports.PlayRoomState = PlayRoomState;
