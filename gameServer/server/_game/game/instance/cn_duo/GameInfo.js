const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

// const ActionStep  = require('./ActionStep.js').ActionStep;

class GameInfo extends Schema {

    constructor(remainingTurns, remainingErrors, remainingCells) {
      super();

      this.remainingTurns  = remainingTurns;
      this.remainingErrors = remainingErrors;

      this.isSuddenDeath   = false;

      this.remainingCells = remainingCells;

      this.gameOver = null; //TODO: create a GameEnd schema win, lose, draw etc.

    }

}
schema.defineTypes(GameInfo, {

  remainingTurns  : "number",
  remainingErrors : "number",

  isSuddenDeath   : "boolean",

  remainingCells : "number",

  gameOver       : "string",
});

exports.GameInfo = GameInfo;
