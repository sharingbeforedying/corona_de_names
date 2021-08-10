const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const PendingState = require('./PendingState.js').PendingState;

const RoomState = require('../RoomState.js').RoomState;

class PortalRoomState extends RoomState {
    constructor () {
        super(false, 1);
        // this.roomType = 1;

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
schema.defineTypes(PortalRoomState, {

  pending : {map : PendingState},

});

exports.PortalRoomState = PortalRoomState;
