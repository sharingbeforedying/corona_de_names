const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const Action   = require('./actions/Action.js').Action;

class PlayerAction extends Schema {

  constructor (playerId, action) {
      super();
      this.playerId = playerId;
      this.action   = action;
  }

}
schema.defineTypes(PlayerAction, {
  playerId : "string",
  action   : Action,
});

exports.PlayerAction = PlayerAction;
