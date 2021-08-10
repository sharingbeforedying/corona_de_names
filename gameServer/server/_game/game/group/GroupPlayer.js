const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class GroupPlayer extends Schema {
  constructor (id, groupId) {
      super();
      this.id      = id;

      this.name  = "";
      this.image = "";
  }
}
schema.defineTypes(GroupPlayer, {
  id:    "string",

  name:  "string",
  image: "string",
});

exports.GroupPlayer = GroupPlayer;
