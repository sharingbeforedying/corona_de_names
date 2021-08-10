const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const ActionStep  = require('../ActionStep.js').ActionStep;

class SuddenDeathGameTurn extends Schema {

    constructor(index) {
      super();

      this.index          = index;

      this.activePlayerIds = new MapSchema();

      // this.tellerStep     = null;
      this.guesserSteps   = new ArraySchema();

      this.canEndTurn     = false;

      this.contractCompleted = false;

    }

}
schema.defineTypes(SuddenDeathGameTurn, {

  index          : "number",

  activePlayerIds : {map : "boolean"},

  // tellerStep     : ActionStep,
  guesserSteps   : [ ActionStep ],

  canEndTurn     : "boolean",

  contractCompleted : "boolean",


});

exports.SuddenDeathGameTurn = SuddenDeathGameTurn;
