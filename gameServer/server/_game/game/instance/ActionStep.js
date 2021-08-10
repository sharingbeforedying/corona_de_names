const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const PlayerAction = require('./PlayerAction.js').PlayerAction;
const ActionResult = require('./ActionResult.js').ActionResult;

class ActionStep extends Schema {

  constructor (playerAction, result) {
      super();
      this.playerAction = playerAction;
      this.result       = result;
  }

}
schema.defineTypes(ActionStep, {
  playerAction : PlayerAction,
  result       : ActionResult,
});

exports.ActionStep = ActionStep;
