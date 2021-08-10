
class RoomLink {
  /*
    forwards room events for a specific room client
  */
    constructor (roomConnection, eventHandlers = {
      onJoin    : (options) => {},
      onMessage : (message) => {},
      onLeave   : (consented) => {},
      onRoomDispose : () => {},

    }) {
      this.roomConnection = roomConnection;

      // this.eventHandlers  = eventHandlers;
      this.onJoin        = eventHandlers.onJoin;
      this.onMessage     = eventHandlers.onMessage;
      this.onLeave       = eventHandlers.onLeave;
      this.onRoomDispose = eventHandlers.onRoomDispose;
    }

}
exports.RoomLink = RoomLink;
