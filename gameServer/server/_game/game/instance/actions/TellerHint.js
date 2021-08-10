const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const Action   = require('./Action.js').Action;

class TellerHint extends Action {

  constructor (word, number) {
      super(0);
      this.word   = word;
      this.number = number;
  }

}
schema.defineTypes(TellerHint, {
  word     : "string",
  number   : "number",
});

exports.TellerHint = TellerHint;
