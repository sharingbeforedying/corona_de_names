const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

/*
  This Schema definition is partial,
  it is completed when ClientState is instantiated by serverState
*/

const RoomState = require('../../../../rooms/RoomState.js').RoomState;

class ClientRoomState_C1 extends RoomState {
    constructor () {
        super(true, 22);
        // this.roomType = 2;

        //serialized
        this.name       = "a1_client_name";
        this.special_c1 = "abc123";

        // this.availableCommands = new ArraySchema();
        // this.availableServers  = new MapSchema();
    }

}
schema.defineTypes(ClientRoomState_C1, {
  name: "string",
  special_c1 : "string",
});

exports.ClientRoomState_C1 = ClientRoomState_C1;
