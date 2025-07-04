const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

/*
  This Schema definition is partial,
  it is completed when ClientState is instantiated by serverState
*/

const RoomState = require('../../../../rooms/RoomState.js').RoomState;

class ClientRoomState_A1 extends RoomState {
    constructor () {
        super(true, 21);
        // this.roomType = 2;

        //serialized
        this.name       = "a1_client_name";
        this.special_a1 = "abc123";

        // this.availableCommands = new ArraySchema();
        // this.availableServers  = new MapSchema();
    }

}
schema.defineTypes(ClientRoomState_A1, {
  name: "string",
  special_a1 : "string",
});

exports.ClientRoomState_A1 = ClientRoomState_A1;
