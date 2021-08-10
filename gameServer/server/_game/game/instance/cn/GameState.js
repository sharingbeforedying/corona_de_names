const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const InstanceTeam = require('../InstanceTeam.js').InstanceTeam;
const GameTurn     = require('../GameTurn.js').GameTurn;

const PositionGrid = require('../PositionGrid.js').PositionGrid;
const GameGrid     = require('../GameGrid.js').GameGrid;

class GameState extends Schema {

    constructor() {
      super();

      this.turn           = null;

      // this.turns          = new ArraySchema();

      this.teams          = new MapSchema();

      this.position_grid__red  = null;
      this.position_grid__blue = null;

      this.position_grid__blank = null;

      // this.position_grid__goal  = null;



      // this.flip_grid     = null;
      this.game_grid     = null;

      this.game_grid__red  = null;
      this.game_grid__blue = null;


    }

}
schema.defineTypes(GameState, {

  turn           : GameTurn,
  // turns          : [ GameTurn ],

  teams          : { map : InstanceTeam },

  // flip_grid      : FlipGrid,
  position_grid__red  : PositionGrid,
  position_grid__blue : PositionGrid,

  position_grid__blank : PositionGrid,


  game_grid      : GameGrid,
  game_grid__red  : GameGrid,
  game_grid__blue : GameGrid,


});

exports.GameState = GameState;
