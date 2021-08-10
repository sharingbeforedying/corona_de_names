
import { gameServerIP } from './GameServerInfo.js';

export class RoomConnectionService {

  static createPrivateRoom_p(connectionConfig) {
    console.log("RoomConnectionService", "createPrivateRoom_p", connectionConfig);

    const roomPort   = connectionConfig.roomPort;
    const client = new Colyseus.Client("ws://" + gameServerIP + ":" + roomPort);

    const roomName   = connectionConfig.roomName;
    // const passphrase = connectionConfig.passphrase;
    // return client.create(roomName, {passphrase : passphrase})
    return client.create(roomName, connectionConfig)
        .then(room => {
            console.log("create private room success", room);
            return room;
         })
         .catch(e => {
            console.error("create private room error", e);
            throw e;
         });
  };

  static joinPublicRoom_p(connectionConfig) {
    console.log("RoomConnectionService", "joinPublicRoom_p", connectionConfig);

    const roomPort = connectionConfig.roomPort;
    // const client   = new Colyseus.Client("ws://localhost:" + roomPort);
    const client = new Colyseus.Client("ws://" + gameServerIP + ":" + roomPort);


    const roomName   = connectionConfig.roomName;
    // const passphrase = connectionConfig.passphrase;
    // return client.join(roomName, {passphrase : passphrase})
    return client.join(roomName, connectionConfig)
        .then(room => {
            console.log("join public room success", room.roomName);
            return room;
         })
         .catch(e => {
            console.error("join public room success", e);
            throw e;
         });
  };

  static joinPrivateRoom_p(connectionConfig) {
    console.log("RoomConnectionService", "joinPrivateRoom_p", connectionConfig);

    const roomPort = connectionConfig.roomPort;
    // const client   = new Colyseus.Client("ws://localhost:" + roomPort);
    const client = new Colyseus.Client("ws://" + gameServerIP + ":" + roomPort);


    const roomId     = connectionConfig.roomId;
    // const passphrase = connectionConfig.passphrase;
    // return client.joinById(roomId, {passphrase : passphrase})
    return client.joinById(roomId, connectionConfig)
        .then(room => {
            console.log("joined private room success", room.roomName);
            return room;
         })
         .catch(e => {
            console.error("join private room error", e);
            throw e;
         });
  };

  /////

  // static transaction_id = 0; // /!\ do not use it or you will provoke "fields are not currently supported" on the tablet

  static nextMessage_p(room) {
    console.log("RoomConnectionService", "nextMessage_p", room);

    return new Promise((resolve, reject) => {
      room.onMessage("answer", (message) => {
        console.log("nextMessage_p", name, message);
        resolve([room, message]);
      });
    });
  }

  static sendCommand(room, clientCommand) {
    console.log("RoomConnectionService", "sendCommand", room, clientCommand);

    const command = clientCommand.name;
    const data    = clientCommand.data;
    room.send("client", [command, data]);
  }

  static sendCommand_p(room, clientCommand) {
    console.log("RoomConnectionService", "sendCommand_p", room, clientCommand);

    return new Promise((resolve, reject) => {

      const command = clientCommand.name;

      // const transaction_id = this.transaction_id;
      // this.transaction_id += 1;

      // room.onMessage(transaction_id, (message) => {
      room.onMessage("answer", (message) => {
        console.log("message received from server");
        console.log(message);

        const commandAnswer = message.commandAnswer;

        if(commandAnswer && commandAnswer.command == command) {
          console.log("received message seems to be command answer for command", command, message);
          if(commandAnswer.error) {
            reject(commandAnswer.error);
          } else {
            resolve(commandAnswer.payload);
          }
        } else {
            console.log("received message was not command answer for command", command, message);
            const error = new Error("received message was not command answer" + message);
            // reject(error);
        }

      });

      this.sendCommand(room, clientCommand);
    })
    .catch(error => {
      console.log(room.roomName, "sendCommand_p : error", error);
      throw error;
    });
  }

}
