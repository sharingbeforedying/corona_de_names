
class MyClient {
    constructor (clientRoomConnection) {

      this.id = clientRoomConnection.id;
      this.clientRoomConnection = clientRoomConnection;

      this.roomConnections_shared = {};
      this.roomConnections_single = {};
      // this.addRoomConnection_single(clientRoomConnection);

      // this.parentMyClient = null;
      // this.childMyClients = [];
    }

    //shared room
    addRoomConnection_shared(roomConnection) {
      this.roomConnections_shared[roomConnection.id] = roomConnection;
    }

    removeRoomConnection_shared(roomConnection) {
      delete this.roomConnections_shared[roomConnection.id];
    }

    //single room
    addRoomConnection_single(roomConnection) {
      this.roomConnections_single[roomConnection.id] = roomConnection;
    }

    removeRoomConnection_single(roomConnection) {
      delete this.roomConnections_single[roomConnection.id];
    }


    ///

    getClientRoom() {
      return this.clientRoomConnection.room;
    }

    setClientRoomState(clientRoomState) {
      const clientRoom = this.clientRoomConnection.room;
      clientRoom.setState(clientRoomState);
    }

    sendMoveToRoom(roomAccess) {
      const clientRoom = this.clientRoomConnection.room;
      const client     = this.clientRoomConnection.roomClient;
      clientRoom.sendMoveToRoom(client, roomAccess);
    }

    getAllConnections() {
      const shared = Object.values(this.roomConnections_shared);
      const single = Object.values(this.roomConnections_single);
      return [].concat(shared, single);
    }

    closeAllConnections() {
      console.log("MyClient", this.id, "closeAllConnections");

      this.getAllConnections()
      .forEach((roomConnection, i) => {
        roomConnection.close();
      });

    }


    sendCommandAnswer(commandAnswer) {
      const clientRoom = this.clientRoomConnection.room;
      const client     = this.clientRoomConnection.roomClient;
      clientRoom.sendCommandAnswer(client, commandAnswer);
    }



}
exports.MyClient = MyClient;
