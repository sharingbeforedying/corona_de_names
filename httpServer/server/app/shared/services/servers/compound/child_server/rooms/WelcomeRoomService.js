export class WelcomeRoomService {

  constructor(room) {
    this.room = room;
  }

  go_to_my_room_p() {

    const room = this.room;

    return new Promise((resolve, reject) => {
      const command = "go_to_my_room";
      const data    = {};

      // room.onMessage.once((message) => {
      room.onMessage("answer", (message) => {
        console.log("message received from server");
        console.log(message);

        if(message.command == command) {
          if(message.error) {
            reject(message.error);
          } else {
            resolve(message.payload);
          }
        }

      });

      room.send("client", [command, data]);
    })
    .then(connectionConfig => {
      console.log("go_to_my_room() : success", connectionConfig);
      //this will induce dependency injection
      // clientRoomClientService.connect(connectionConfig);
      return connectionConfig;
    })
    .catch(error => {
      console.log("go_to_my_room() : error", error);
      //welcomeRoomClientService_incoming.setServerError(error);
      throw error;
    });

  }

}
