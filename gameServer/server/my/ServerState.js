const schema      = require('@colyseus/schema');
const Schema      = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const TargetRoomInfo = require("./TargetRoomInfo.js").TargetRoomInfo;
const ServerInfo     = require("./ServerInfo.js").ServerInfo;

class ServerState extends Schema {
    constructor () {
        super();

        this.availableRooms   = new MapSchema();
        this.availableServers = new MapSchema();
    }
}
schema.defineTypes(ServerState, {
  availableRooms   : { map : TargetRoomInfo },
  availableServers : { map : ServerInfo },
});
exports.ServerState = ServerState;
