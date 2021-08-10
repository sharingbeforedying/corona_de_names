const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

class ConnectionConfig extends Schema {
    constructor (roomPort, accessType, roomName, roomId, passphrase) {
        super();

        this.roomPort   = roomPort;

        //serialized
        this.accessType = accessType;

        this.roomName   = roomName;
        this.roomId     = roomId;
        this.passphrase = passphrase;
    }
}
schema.defineTypes(ConnectionConfig, {
  roomPort   : "number",

  accessType : "number",  //public, private, private-two-step

  roomName   : "string",
  roomId     : "string",
  passphrase : "string",
});

exports.ConnectionConfig = ConnectionConfig;
