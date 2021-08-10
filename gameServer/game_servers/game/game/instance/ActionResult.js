const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class ActionResult extends Schema {

  constructor (value) {
      super();
      this.value = value;
  }

}
schema.defineTypes(ActionResult, {
  value : "string",
});

exports.ActionResult = ActionResult;
