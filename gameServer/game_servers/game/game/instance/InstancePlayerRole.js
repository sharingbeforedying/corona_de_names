const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

const cnPlayerRole = {
    TELLER  : 0,
    GUESSER : 1,
}

class InstancePlayerRole extends Schema {
  constructor (id, name) {
      super();
      this.id    = id;
      this.name  = name;
  }

  static rolesMap() {
    const outMap = new MapSchema();

    outMap[cnPlayerRole.TELLER]  = new InstancePlayerRole(cnPlayerRole.TELLER,  "Teller");
    outMap[cnPlayerRole.GUESSER] = new InstancePlayerRole(cnPlayerRole.GUESSER, "Guesser");

    return outMap;
  }

  copy() {
    return new InstancePlayerRole(this.id, this.name);
  }

}
schema.defineTypes(InstancePlayerRole, {
  id   : "number",
  name : "string",
});

exports.InstancePlayerRole = InstancePlayerRole;
