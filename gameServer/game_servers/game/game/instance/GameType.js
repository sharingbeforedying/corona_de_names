const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

const cnGameType = {
    COMP  : 0,
    COOP  : 1,
}

class GameType extends Schema {
  constructor (id, name) {
      super();
      this.id    = id;
      this.name  = name;
  }

  static gameTypesMap() {
    const outMap = new MapSchema();

    outMap[cnGameType.COMP] = new GameType(cnGameType.COMP, "COMP");
    outMap[cnGameType.COOP] = new GameType(cnGameType.COOP, "COOP");

    return outMap;
  }

  copy() {
    return new GameType(this.id, this.name);
  }

}
schema.defineTypes(GameType, {
  id   : "number",
  name : "string",
});

exports.GameType = GameType;
