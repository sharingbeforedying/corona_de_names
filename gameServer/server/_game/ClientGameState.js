const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const GroupPlayerGroup     = require("./game/group/GroupPlayerGroup.js").GroupPlayerGroup;
const Session              = require("./game/session/Session.js").Session;

class ClientGameState extends Schema {
    constructor () {
        super();

        this.gameName = "lolol";

        this.group   = null;
        this.session = null;
    }
}
schema.defineTypes(ClientGameState, {
  gameName : "string",

  group    : GroupPlayerGroup,
  session  : Session,
});

exports.ClientGameState = ClientGameState;
