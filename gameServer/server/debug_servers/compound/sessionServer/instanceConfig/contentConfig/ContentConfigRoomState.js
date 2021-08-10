const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const RoomState = require('../../../../../rooms/RoomState.js').RoomState;

const GroupPlayerGroup = require('../../../../../_game/game/group/GroupPlayerGroup.js').GroupPlayerGroup;
const SessionPlayer    = require('../../../../../_game/game/session/SessionPlayer.js').SessionPlayer;

const Gemini_Schema = require("../../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

const ContentConfig    = require('../../../../../_game/game/instanceConfig/content/ContentConfig.js').ContentConfig;

class ContentConfigRoomState extends RoomState {
    constructor () {
        super(false, 62);
        // this.roomType = 3;

        // this.roomCommands["°°sendChatMessage°°"] = "chatMessage";

        //serialized
        this.name = "content_config_name";

        this.contentConfig = new ContentConfig();
    }

}
schema.defineTypes(ContentConfigRoomState, {

  name: "string",

  contentConfig : ContentConfig,

});

exports.ContentConfigRoomState = ContentConfigRoomState;
