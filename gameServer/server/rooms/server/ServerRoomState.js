const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

// const PendingState = require("../../utils/gemini/Gemini_Schema.js");
// const ClientState  = require("../client/ClientState").ClientState;
//
// const createEcho = require("../../utils/gemini/Gemini_Schema.js").Gemini_Schema.createEcho;

class ServerRoomState extends Schema {
    constructor () {
        super();

        this.name = "server_state";
        // this.pending = new MapSchema();
    }
}
schema.defineTypes(ServerRoomState, {
  name: "string",
  // pending : {map : PendingState},
});
exports.ServerRoomState = ServerRoomState;
