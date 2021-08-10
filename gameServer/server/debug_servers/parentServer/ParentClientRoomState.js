const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

/*
  This Schema definition is partial,
  it is completed when ClientState is instantiated by serverState
*/

class ParentClientRoomState extends Schema {
    constructor () {
        super();

        //serialized
        this.name          = "parent_client_name";
        this.parentSpecial = "abc123";

        // this.availableCommands = new ArraySchema();
        // this.availableServers  = new MapSchema();
    }

}
schema.defineTypes(ParentClientRoomState, {
  name: "string",
  parentSpecial : "string",

  // availableCommands: [ "string" ],
  // availableServers : { map : "string" },
});

exports.ParentClientRoomState = ParentClientRoomState;
