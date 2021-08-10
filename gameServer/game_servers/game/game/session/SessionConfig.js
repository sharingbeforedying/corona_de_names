const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

class SessionConfig extends Schema {

  constructor() {
    console.log("SessionConfig()");
    super();

    //serialized
    this.name        = "session_name";
    this.password    = "session_password";

    this.description = "1 2 3 4 5 6 7 8 9";

    this.gameType = 0;
  }

  static default() {
    const sessionConfig = new SessionConfig();

    return sessionConfig;
  }

  static fromForm(form) {
    const sessionConfig = new SessionConfig();

    // Object.entries(form).forEach(([key, value], i) => {
    //
    // });
    Object.assign(sessionConfig, form);

    return sessionConfig;
  }

}
schema.defineTypes(SessionConfig, {
  name            : "string",
  password        : "string",

  description     : "string",

  gameType        : "number",
});

exports.SessionConfig = SessionConfig;
