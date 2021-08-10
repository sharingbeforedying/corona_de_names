const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const TargetRoomInfo = require("./TargetRoomInfo.js").TargetRoomInfo;

class ServerInfo extends Schema {
  constructor (name, targetRoomInfo) {
      super();

      if(name != null) {
        this.name           = name;
      }

      if(targetRoomInfo != null) {
        this.targetRoomInfo = targetRoomInfo;
      }
  }
}
schema.defineTypes(ServerInfo, {
  name: "string",

  targetRoomInfo : TargetRoomInfo,
});
exports.ServerInfo = ServerInfo;
