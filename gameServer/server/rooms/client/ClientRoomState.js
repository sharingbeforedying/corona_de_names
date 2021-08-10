const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const MoveToConfig = require("./MoveToConfig.js").MoveToConfig;

/*
  This Schema definition is partial,
  it is completed when ClientState is instantiated by serverState
*/

class ClientRoomState extends Schema {
    constructor () {
        super();

        //serialized
        this.name = "client_name";

        // this.availableCommands = new ArraySchema();
        // this.availableServers  = new MapSchema();


          //later
        // this.<gameState> = null;
    }

}
schema.defineTypes(ClientRoomState, {
  name: "string",

  // availableCommands: [ "string" ],
  // availableServers : { map : "string" },

    //later
  //<gameState> : <ClientGameState>
  roomCommands  : {map : "string"},
  moveToConfigs : {map : MoveToConfig},

});

exports.ClientRoomState = ClientRoomState;
