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

const ContentGrid = require('../../../../../_game/game/instanceConfig/content/ContentGrid.js').ContentGrid;
const PositionGrid = require('../../../../../_game/game/instance/PositionGrid.js').PositionGrid;
const GameGrid     = require('../../../../../_game/game/instance/GameGrid.js').GameGrid;

class InstanceEndRoomState extends RoomState {
    constructor () {
        super(false, 191);
        // this.roomType = 3;

        // this.roomCommands["°°sendChatMessage°°"] = "chatMessage";

        //serialized
        this.name = "instanceEnd_name";

        this.allPlayersArePresent = false;


        this.gameoverType = 0;


        this.grid_content  =  null;
        this.grid_position =  null;
        this.grid_game     =  null;

    }

}
schema.defineTypes(InstanceEndRoomState, {

  name: "string",

  allPlayersArePresent: "boolean",


  gameoverType: "number",

  grid_content:  ContentGrid,
  grid_position: PositionGrid,
  grid_game:     GameGrid,

});

exports.InstanceEndRoomState = InstanceEndRoomState;
