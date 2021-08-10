const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const RoomState = require('../../../../../rooms/RoomState.js').RoomState;

// const ChatRoomAvatar = require('./ChatRoomAvatar.js').ChatRoomAvatar;
// const ChatMessage    = require('./ChatMessage.js').ChatMessage;

// const GroupPlayerGroup = require('../../../../_game/game/group/GroupPlayerGroup.js').GroupPlayerGroup;
// const SessionPlayer    = require('../../../../_game/game/session/SessionPlayer.js').SessionPlayer;

const Gemini_Schema = require("../../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

class InstanceBeginRoomState extends RoomState {
    constructor () {
        super(false, 101);
        // this.roomType = 3;

        // this.roomCommands["°°sendChatMessage°°"] = "chatMessage";

        //serialized
        this.name = "instanceBegin_name";

        this.nb_players_in_room   = 0;
        this.allPlayersArePresent = false;

        // this.animators = new MapSchema();
        // this.players   = new MapSchema();
    }

}
schema.defineTypes(InstanceBeginRoomState, {

  name: "string",

  nb_players_in_room:   "number",
  allPlayersArePresent: "boolean",


  // animators : { map : GroupPlayerGroup },
  // players   : { map : SessionPlayer },

});

exports.InstanceBeginRoomState = InstanceBeginRoomState;
