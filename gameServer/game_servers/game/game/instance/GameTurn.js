const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const ActionStep  = require('./ActionStep.js').ActionStep;

const gameTurnType = {
    NORMAL : 0,
    BONUS  : 1,
}

class GameTurn extends Schema {

    constructor(index, teamId, tellerId, guesserId, type) {
      super();

      this.index          = index;

      this.type           = type;

      this.teamId         = teamId;
      this.tellerId       = tellerId;
      this.guesserId      = guesserId;

      this.activePlayerId = null;


      this.tellerStep     = null;
      this.guesserSteps   = new ArraySchema();

      this.canEndTurn     = false;

    }

}
schema.defineTypes(GameTurn, {

  index          : "number",

  type           : "number",

  teamId         : "string",
  tellerId       : "string",
  guesserId      : "string",

  activePlayerId : "string",

  tellerStep     : ActionStep,
  guesserSteps   : [ ActionStep ],

  canEndTurn     : "boolean",

});

exports.GameTurn = GameTurn;
