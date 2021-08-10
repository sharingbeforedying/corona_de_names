const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const PendingState = require('./PendingState.js').PendingState;

const RoomState = require('../RoomState.js').RoomState;

class WelcomeRoomState extends RoomState {
    constructor () {
        super(false, 0);
        // this.roomType = 0;

        this.pending = new MapSchema();

        // this.roomCommands = new MapSchema();
        this.roomCommands["go_to_my_room"] = "lolilol";
    }

    createPendingState(client) {
      const pendingState = new PendingState(client.sessionId);
      this.pending[pendingState.id] = pendingState;
    }

    getPendingState(client) {
      return this.pending[client.sessionId];
    }

    removePendingState(client) {
      delete this.pending[client.sessionId];
    }
}
schema.defineTypes(WelcomeRoomState, {

  pending : {map : PendingState},

});

exports.WelcomeRoomState = WelcomeRoomState;
