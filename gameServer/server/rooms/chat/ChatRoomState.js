const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const RoomState = require('../RoomState.js').RoomState;

const ChatRoomAvatar = require('./ChatRoomAvatar.js').ChatRoomAvatar;
const ChatMessage    = require('./ChatMessage.js').ChatMessage;

class ChatRoomState extends RoomState {
    constructor () {
        super(false, 3);
        // this.roomType = 3;

        this.roomCommands["°°sendChatMessage°°"] = "chatMessage";


        //serialized
        this.members        = new MapSchema();

        this.message_string = "";
        this.messageArray   = new ArraySchema();


        this.roomAvatar     = new ChatRoomAvatar("chatRoom007", "chatRoomAvatar");
    }

    cmd_chatMessage(myClient, text) {
      const member = this.members[myClient.id];

      this._chatMessage(member, text);
    }

    cmd_chatLeave(myClient) {
      const member = this.members[myClient.id];
      const text   = member.name + " has left";
      this._chatMessage(this.roomAvatar, text);

      // delete this.members[myClient.id];
    }

    _chatMessage(sender, text) {
      const date       = new Date();
      const dateString = date.toString();

      const chatMessage = new ChatMessage(dateString, sender, text);
      this.messageArray.push(chatMessage);
    }
}
schema.defineTypes(ChatRoomState, {

  members: {map : ChatRoomAvatar },

  message_string: "string",
  messageArray: [ ChatMessage ],

});

exports.ChatRoomState = ChatRoomState;
