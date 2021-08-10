const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const Action   = require('./Action.js').Action;

class GuesserSelection extends Action {

  constructor (cellIndex) {
      super(1);
      this.cellIndex = cellIndex;
  }

}
schema.defineTypes(GuesserSelection, {
  cellIndex   : "number",
});

exports.GuesserSelection = GuesserSelection;
