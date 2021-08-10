const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const InstanceTeam = require('./InstanceTeam.js').InstanceTeam;
const GameTurn     = require('./GameTurn.js').GameTurn;

const PositionGrid = require('./PositionGrid.js').PositionGrid;
const GameGrid     = require('./GameGrid.js').GameGrid;

class GameState extends Schema {

    constructor() {
      super();

      this.turn           = null;

      // this.turns          = new ArraySchema();

      this.teams          = new MapSchema();

      this.position_grid = null;
      // this.flip_grid     = null;
      this.game_grid     = null;

    }

}
schema.defineTypes(GameState, {

  position_grid  : PositionGrid,

  turn           : GameTurn,
  // turns          : [ GameTurn ],

  teams          : { map : InstanceTeam },

  // flip_grid      : FlipGrid,
  game_grid      : GameGrid,

});

exports.GameState = GameState;
