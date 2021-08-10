
class RoomConnection {
    constructor (room, roomClient) {

        this.id = room.roomId + "_" + roomClient.id;

        this.room       = room;
        this.roomClient = roomClient;
    }

    close() {
      console.log("RoomConnection", this.id, "close");
      this.roomClient.leave();

      //single room have autoDispose so this is unnecessary:
      // //disconnect if single room
      // if(this.room.maxClients == 1) {
      //   this.room.disconnect();
      // }
    }
}
exports.RoomConnection = RoomConnection;
