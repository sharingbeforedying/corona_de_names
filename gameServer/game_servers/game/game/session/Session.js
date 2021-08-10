const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const SessionPlayer = require('./SessionPlayer.js').SessionPlayer;
const SessionConfig = require('./SessionConfig.js').SessionConfig;
// const SessionState      = require('./SessionState.js').SessionState;
// const sessionState  = require('./enums_session.js').sessionState;

// const GroupPlayerGroup = require('../group/GroupPlayerGroup.js').GroupPlayerGroup;


const InstanceConfig      = require('../instanceConfig/InstanceConfig.js').InstanceConfig;
const instanceConfigState = require('../instanceConfig/enums_instance_config.js').instanceConfigState;


const Game          = require('../instance/Game.js').Game;
const GameState     = require('../instance/GameState.js').GameState;

// const onChange = require('on-change');

const Utils = require('../../../utils/Utils.js').Utils;

class Session extends Schema {

  constructor(id, session_config_form) {
    console.log("Session()");
    super();

    //serialized
    this.id              = id;
    this.session_config  = SessionConfig.fromForm(session_config_form);

    this.players         = new MapSchema();
    // this.groups          = new MapSchema();

    this.instance_config = new InstanceConfig();
    this.moveToConfigState(instanceConfigState.TEAMS);

    this.gameState       = null;

    //not serialized
    // this.groupsArray = new Array(10);
    this.game        = null;

    // this._group = null;
  }

  // get group() {
  //   return this._group;
  // }

  moveToConfigState(instanceConfigState) {
    this.instance_config.moveTo(instanceConfigState);
  }

  isConfiguringTeams() {
    return this.instance_config.state == instanceConfigState.TEAMS;
  }

  createPlayer(player, group) {
    console.log("Session::createPlayer", player, group);

    // const groupIndex = this.groupsArray.entries().first(([index, value]) => value == null)[0] ;
    // this.groups.push(groupId);

    const sessionPlayer = new SessionPlayer(player, group);
    this.players[sessionPlayer.id] = sessionPlayer;

    // if(this.isConfiguringTeams()) {
      this.instance_config.teams.addFreePlayer(sessionPlayer);
    // }
  }

  removePlayer(playerId) {
    console.log("Session::removePlayer", playerId);


  }

  // addGroup(group) {
  //   // this.groups[group.id] = group;
  //   // console.log("this.groups", this.groups.toJSON());
  //
  //   this._group = group;
  //
  //   group.name += "_addGrup";
  // }

  // createGroup(group) {
  //   console.log("Session::createGroup", group);
  //
  //   const sessionGroup = new SessionGroup(group);
  //   this.groups[sessionGroup.id] = sessionGroup;
  //
  //   // if(this.state.type == sessionStateType.CONFIGURING) {
  //   //   this.instance_config.addFreePlayer(sessionPlayer);
  //   // }
  // }
  //
  // removeGroup(groupId) {
  //   console.log("Session::removeGroup", groupId);
  //
  //   // const sessionPlayer = new SessionPlayer(playerId);
  //   // this.players[playerId] = sessionPlayer;
  //   //
  //   // if(this.state.type == sessionStateType.CONFIGURING) {
  //   //   this.instance_config.addFreePlayer(sessionPlayer);
  //   // }
  // }

}
schema.defineTypes(Session, {
  id              : "string",

  session_config  : SessionConfig,

  // state           : "number",

  players         : {map : SessionPlayer},
  // groups          : {map : SessionPlayerGroup},
  // groups          : {map : GroupPlayerGroup},


  instance_config : InstanceConfig,

  gameState       : GameState,

  // spectators      : {map : SessionPlayer},

  // group           : GroupPlayerGroup,
});

exports.Session = Session;
