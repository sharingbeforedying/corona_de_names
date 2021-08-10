const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const RoomState = require('../../../../rooms/RoomState.js').RoomState;

// const ChatRoomAvatar = require('./ChatRoomAvatar.js').ChatRoomAvatar;
// const ChatMessage    = require('./ChatMessage.js').ChatMessage;

const GroupPlayerGroup = require('../../../../_game/game/group/GroupPlayerGroup.js').GroupPlayerGroup;
const SessionPlayer    = require('../../../../_game/game/session/SessionPlayer.js').SessionPlayer;

const Gemini_Schema = require("../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;


class SessionRoomState extends RoomState {
    constructor () {
        super(false, 51);
        // this.roomType = 3;

        // this.roomCommands["°°sendChatMessage°°"] = "chatMessage";

        //serialized
        this.name = "session_name";

        this.animators = new MapSchema();
        this.players   = new MapSchema();
    }

    // createPlayer(player, group) {
    //   console.log("Session::createPlayer", player, group);
    //
    //   // const groupIndex = this.groupsArray.entries().first(([index, value]) => value == null)[0] ;
    //   // this.groups.push(groupId);
    //
    //   const sessionPlayer = new SessionPlayer(player, group);
    //   this.players[sessionPlayer.id] = sessionPlayer;
    //
    //   // if(this.isConfiguringTeams()) {
    //     // this.instance_config.teams.addFreePlayer(sessionPlayer);
    //   // }
    // }

    createPlayer(player, group) {
      console.log("Session::createPlayer", player, group);

      // const groupIndex = this.groupsArray.entries().first(([index, value]) => value == null)[0] ;
      // this.groups.push(groupId);

      const sessionPlayer = new SessionPlayer(player, group);
      this.players[sessionPlayer.id] = sessionPlayer;

      // if(this.isConfiguringTeams()) {
        // this.instance_config.teams.addFreePlayer(sessionPlayer);
      // }

      return sessionPlayer;
    }

    removePlayer(playerId) {
      console.log("Session::removePlayer", playerId);


    }


    addAnimator(group) {
      this.animators[group.id] = Gemini_Schema.createEcho(group);
    }

    removeAnimator(group) {
      delete this.animators[group.id];
    }

}
schema.defineTypes(SessionRoomState, {

  name: "string",

  animators : { map : GroupPlayerGroup },
  players   : { map : SessionPlayer },

});

exports.SessionRoomState = SessionRoomState;
