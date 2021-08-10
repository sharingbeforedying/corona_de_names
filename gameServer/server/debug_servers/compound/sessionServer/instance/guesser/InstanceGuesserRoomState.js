const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const RoomState = require('../../../../../rooms/RoomState.js').RoomState;

const Gemini_Schema  = require("../../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

const InstancePlayer = require('../../../../../_game/game/instance/InstancePlayer.js').InstancePlayer;

const ContentGrid = require('../../../../../_game/game/instanceConfig/content/ContentGrid.js').ContentGrid;
const PositionGrid = require('../../../../../_game/game/instance/PositionGrid.js').PositionGrid;
const GameGrid     = require('../../../../../_game/game/instance/GameGrid.js').GameGrid;

const GameTurn     = require('../../../../../_game/game/instance/GameTurn.js').GameTurn;

const GameInfo     = require('../../../../../_game/game/instance/cn_duo/GameInfo.js').GameInfo;


class InstanceGuesserRoomState extends RoomState {
    constructor () {
        super(false, 141);
        // this.roomType = 141;
        this.focusOnMePlz = false;

        // this.roomCommands["°°sendChatMessage°°"] = "chatMessage";

        //serialized
        this.name = "instanceGuesser_name";

        this.player = null;

        this.grid_content  =  null;
        this.grid_position =  null;
        this.grid_game     =  null;

        this.turn          = null;
        this.gameInfo      = null;

        //debug
        this.grid_position__goal =  null;

    }

}
schema.defineTypes(InstanceGuesserRoomState, {
  focusOnMePlz: "boolean",

  name: "string",

  player: InstancePlayer,

  grid_content:  ContentGrid,
  grid_position: PositionGrid,
  grid_game:     GameGrid,

  turn: GameTurn,
  gameInfo : GameInfo,


  grid_position__goal: PositionGrid,


});

exports.InstanceGuesserRoomState = InstanceGuesserRoomState;
