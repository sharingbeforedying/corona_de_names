const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const Action   = require('./Action.js').Action;

class GuesserEndTurn extends Action {

  constructor () {
      super(2);
  }

}
schema.defineTypes(GuesserEndTurn, {

});

exports.GuesserEndTurn = GuesserEndTurn;
