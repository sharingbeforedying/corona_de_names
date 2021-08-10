const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const ChatRoomAvatar = require('./ChatRoomAvatar.js').ChatRoomAvatar;

class ChatMessage extends Schema {
    constructor (dateString, sender, text) {
        super();

        //serialized
        this.sender     = sender;
        this.dateString = dateString;
        this.text       = text;
    }
}
schema.defineTypes(ChatMessage, {

  sender: ChatRoomAvatar,

  dateString: "string",
  text:       "string",

});

exports.ChatMessage = ChatMessage;
