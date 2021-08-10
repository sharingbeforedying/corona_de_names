const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class TeamsConfigFreePlayer extends Schema {
  constructor (id) {
      super();
      this.id     = id;
  }
}
schema.defineTypes(TeamsConfigFreePlayer, {
  id        :  "string",
});

exports.TeamsConfigFreePlayer = TeamsConfigFreePlayer;
