const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

/*
  This Schema definition is partial,
  it is completed when ClientState is instantiated by serverState
*/

const RoomState = require('../../../rooms/RoomState.js').RoomState;

class ClientRoomState_Play extends RoomState {
    constructor () {
        super(true, 200);
        // this.roomType = 2;

        //serialized
        this.name       = "a1_client_name";
        this.special_a1 = "abc123";

        // this.availableCommands = new ArraySchema();
        // this.availableServers  = new MapSchema();
    }

}
schema.defineTypes(ClientRoomState_Play, {
  name: "string",
  special_a1 : "string",
});

exports.ClientRoomState_Play = ClientRoomState_Play;
