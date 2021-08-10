const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const InstanceTeam = require('../InstanceTeam.js').InstanceTeam;
const GameTurn     = require('../GameTurn.js').GameTurn;

const PositionGrid = require('../PositionGrid.js').PositionGrid;
const GameGrid     = require('../GameGrid.js').GameGrid;

const GameInfo            = require('./GameInfo.js').GameInfo;
const SuddenDeathGameTurn = require('./SuddenDeathGameTurn.js').SuddenDeathGameTurn;

class GameState extends Schema {

    constructor() {
      super();

      this.turn            = null;
      this.suddenDeathTurn = null;

      // this.turns          = new ArraySchema();

      this.teams          = new MapSchema();

      this.position_grid__origin = null;

      this.position_grid__goal  = null;

      this.position_grid__red  = null;
      this.position_grid__blue = null;

      // this.flip_grid     = null;
      this.game_grid     = null;

      this.gameInfo = new GameInfo(-1,-1,-1);

    }

}
schema.defineTypes(GameState, {

  position_grid__origin  : PositionGrid,

  position_grid__goal  : PositionGrid,

  position_grid__red  : PositionGrid,
  position_grid__blue : PositionGrid,

  turn            : GameTurn,
  suddenDeathTurn : SuddenDeathGameTurn,
  // turns          : [ GameTurn ],

  teams          : { map : InstanceTeam },

  // flip_grid      : FlipGrid,
  game_grid      : GameGrid,

  gameInfo : GameInfo,

});

exports.GameState = GameState;
