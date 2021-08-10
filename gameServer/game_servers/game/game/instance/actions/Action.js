const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const actionType = {
    TELLER_HINT        : 0,
    GUESSER_SELECTION  : 1,
    GUESSER_END_TURN   : 2,
}

class Action extends Schema {

  constructor (type) {
      super();
      this.type = type;
  }

}
schema.defineTypes(Action, {
  type: "number",
});

exports.Action = Action;
