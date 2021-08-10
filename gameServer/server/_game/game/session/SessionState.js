const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

const sessionState = require('./enums_session.js').sessionState;

class SessionState extends Schema {
  constructor (id, name) {
      super();
      this.id    = id;
      this.name  = name;
  }

  static configuring() {
    return new SessionState(sessionState.CONFIGURING, "CONFIGURING");
  }

  static playing() {
    return new SessionState(sessionState.PLAYING, "PLAYING");
  }

  static sessionStatesMap() {
    const outMap = new MapSchema();

    outMap[sessionState.CONFIGURING] = new SessionState(sessionState.CONFIGURING, "CONFIGURING");
    outMap[sessionState.PLAYING]     = new SessionState(sessionState.PLAYING, "PLAYING");

    return outMap;
  }

  copy() {
    return new SessionState(this.id, this.name);
  }

}
schema.defineTypes(SessionState, {
  id   : "number",
  name : "string",
});

exports.SessionState = SessionState;
