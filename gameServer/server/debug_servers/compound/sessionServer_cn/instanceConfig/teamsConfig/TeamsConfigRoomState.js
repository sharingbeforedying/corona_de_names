const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const RoomState = require('../../../../../rooms/RoomState.js').RoomState;

// const ChatRoomAvatar = require('./ChatRoomAvatar.js').ChatRoomAvatar;
// const ChatMessage    = require('./ChatMessage.js').ChatMessage;

const GroupPlayerGroup = require('../../../../../_game/game/group/GroupPlayerGroup.js').GroupPlayerGroup;
const SessionPlayer    = require('../../../../../_game/game/session/SessionPlayer.js').SessionPlayer;

const Gemini_Schema = require("../../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

const TeamsConfig    = require('../../../../../_game/game/instanceConfig/teams/TeamsConfig.js').TeamsConfig;

class TeamsConfigRoomState extends RoomState {
    constructor () {
        super(false, 61);
        // this.roomType = 3;

        // this.roomCommands["°°sendChatMessage°°"] = "chatMessage";

        //serialized
        this.name = "teams_config_name";

        // this.teamsConfig = new TeamsConfig();
        this.teamsConfig = new TeamsConfig();
    }

}
schema.defineTypes(TeamsConfigRoomState, {

  name: "string",

  teamsConfig : TeamsConfig,

});

exports.TeamsConfigRoomState = TeamsConfigRoomState;
