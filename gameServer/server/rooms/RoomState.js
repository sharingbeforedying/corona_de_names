const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const MoveToConfig = require("./MoveToConfig.js").MoveToConfig;

class RoomState extends Schema {
    constructor (isClientRoomState, roomType) {
        super();

        this.isClientRoomState = isClientRoomState;
        this.roomType          = roomType;

        this.roomCommands  = new MapSchema();
        this.moveToConfigs = new MapSchema();
    }
}
schema.defineTypes(RoomState, {
  isClientRoomState : "boolean",
  roomType :          "number",

  roomCommands  : {map : "string"},
  moveToConfigs : {map : MoveToConfig},
});

exports.RoomState = RoomState;
