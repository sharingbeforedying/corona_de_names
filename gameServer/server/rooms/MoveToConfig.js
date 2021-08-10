const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const ConnectionConfig = require("./ConnectionConfig.js").ConnectionConfig;

class MoveToConfig extends Schema {
    constructor (name, targetRoomType, connectionConfig) {
        super();

        //serialized
        this.name             = name;
        this.targetRoomType   = targetRoomType;
        this.connectionConfig = connectionConfig;
    }
}
schema.defineTypes(MoveToConfig, {
  name             : "string",

  targetRoomType   : "number",
  connectionConfig : ConnectionConfig,
});

exports.MoveToConfig = MoveToConfig;
