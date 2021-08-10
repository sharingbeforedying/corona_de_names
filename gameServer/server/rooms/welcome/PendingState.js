const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

class PendingState extends Schema {
    constructor (id, clientId) {
        super();

        //serialized
        this.id       = id;

        this.type = 0;

        //not serialized
        this.consumeFunc = null;
    }

    roomName() {
      return "room_" + this.id.replace("pending_", "");
    }

    passphrase() {
      return "passphrase_" + this.id;
    }

    consume() {
      if(this.consumeFunc) {
        this.consumeFunc();
      } else {
        throw new Error("this.consumeFunc == null");
      }
    }
}
schema.defineTypes(PendingState, {
  id : "string",

  type : "number"
});

exports.PendingState = PendingState;
