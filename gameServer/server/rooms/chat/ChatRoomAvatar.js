const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

class ChatRoomAvatar extends Schema {
    constructor (id, name) {
        super();

        //serialized
        this.id   = id;
        this.name = name;
    }
}
schema.defineTypes(ChatRoomAvatar, {

  id:   "string",
  name: "string",

});

exports.ChatRoomAvatar = ChatRoomAvatar;
