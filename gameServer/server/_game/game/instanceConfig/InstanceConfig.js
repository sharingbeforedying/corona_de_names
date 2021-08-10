const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const instanceConfigState  = require('./enums_instance_config.js').instanceConfigState;

const TeamsConfig   = require('./teams/TeamsConfig.js').TeamsConfig;
const ContentConfig = require('./content/ContentConfig.js').ContentConfig;

const onChange = require('on-change');

const Utils = require('../../../utils/Utils.js').Utils;

class InstanceConfig extends Schema {

    constructor() {
      console.log("InstanceConfig()");
      super();

      this.state   = instanceConfigState.UNKNOWN;

      this.teams   = new TeamsConfig();
      this.content = new ContentConfig();
    }

    moveTo(state) {
      switch(state) {
        case instanceConfigState.TEAMS:
          // this.teams =
          this.state = state;
          break;
        case instanceConfigState.CONTENT:
          // this.content =
          this.state = state;
          break;
        default:
          console.log("moveTo", "unknown state:", state, "ignored");
          break;
      }
    }

}
schema.defineTypes(InstanceConfig, {

  state           : "number",

  teams           : TeamsConfig,
  content         : ContentConfig,

});

exports.InstanceConfig = InstanceConfig;
