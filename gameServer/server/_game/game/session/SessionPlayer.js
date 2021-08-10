const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const GroupPlayer      = require('../group/GroupPlayer.js').GroupPlayer;
const GroupPlayerGroup = require('../group/GroupPlayerGroup.js').GroupPlayerGroup;

const Gemini_Schema = require("../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

class SessionPlayer extends Schema {
  constructor (groupPlayer, groupPlayerGroup) {
      super();
      this.id               = groupPlayer.id;

      // this.groupPlayer      = Gemini_Schema.createGemini(groupPlayer);
      // this.groupPlayerGroup = Gemini_Schema.createGemini(groupPlayerGroup);

      this.groupPlayer      = Gemini_Schema.createEcho(groupPlayer);
      this.groupPlayerGroup = Gemini_Schema.createEcho(groupPlayerGroup);

      // groupPlayerGroup.name += "_lol";

      this.wins   = 0;
      this.losses = 0;
  }

  win() {
    this.wins += 1;
  }

  lose() {
    this.losses += 1;
  }

}
schema.defineTypes(SessionPlayer, {
  id      :  "string",

  groupPlayer      : GroupPlayer,
  groupPlayerGroup : GroupPlayerGroup,

  wins   :  "number",
  losses :  "number",

});

exports.SessionPlayer = SessionPlayer;
