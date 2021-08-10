const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

/*
  This Schema definition is partial,
  it is completed when ClientState is instantiated by serverState
*/

const RoomState = require('../../../../rooms/RoomState.js').RoomState;

class ClientRoomState_Session extends RoomState {
    constructor () {
        super(true, 23);
        // this.roomType = 2;

        //serialized
        this.name       = "session_client_name";
        this.special_session = "azerty963";

        // this.availableCommands = new ArraySchema();
        // this.availableServers  = new MapSchema();
    }

}
schema.defineTypes(ClientRoomState_Session, {
  name: "string",
  special_session : "string",
});

exports.ClientRoomState_Session = ClientRoomState_Session;
