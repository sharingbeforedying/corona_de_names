const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

// const MoveToConfig = require("./MoveToConfig.js").MoveToConfig;

/*
  This Schema definition is partial,
  it is completed when ClientState is instantiated by serverState
*/

class SR1RoomState extends Schema {
    constructor () {
        super();

        //serialized
        this.members = new ArraySchema();
        this.message_string = "";

    }
}
schema.defineTypes(SR1RoomState, {

  members: [ "string" ],

  message_string: "string",

});

exports.SR1RoomState = SR1RoomState;
