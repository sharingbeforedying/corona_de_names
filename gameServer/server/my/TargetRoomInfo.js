const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

class TargetRoomInfo extends Schema {
  constructor (name, accessType, accessRoom) {
      super();

      if(name != null) {
        this.name                 = name;
      }

      if(accessType != null) {
        this.accessType           = accessType;
      }

      if(accessRoom != null) {
        this.accessRoomPort       = accessRoom.$factory.port;
        this.accessRoomName       = accessRoom.roomName;
        this.accessRoomId         = accessRoom.roomId;
        this.accessRoomPassphrase = accessRoom.passphrase;
      }
  }
}
schema.defineTypes(TargetRoomInfo, {
  name: "string",

  accessType : "number",

  accessRoomPort:       "number",
  accessRoomName:       "string",
  accessRoomId:         "string",
  accessRoomPassphrase: "string",
});
exports.TargetRoomInfo = TargetRoomInfo;
