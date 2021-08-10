const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const cnPlayerRole = {
    TELLER  : 0,
    GUESSER : 1,
}

class InstancePlayer extends Schema {
  constructor (id, role) {
      super();
      this.id   = id;

      this.role = role;
  }

  static teller(id) {
    return new InstancePlayer(id, cnPlayerRole.TELLER);

  }

  static guesser(id) {
    return new InstancePlayer(id, cnPlayerRole.GUESSER);
  }

}
schema.defineTypes(InstancePlayer, {
  id   : "string",

  role : "number",
});

exports.InstancePlayer = InstancePlayer;
