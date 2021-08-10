import { ServerService } from '../ServerService.js';

import { RoomConnectionService } from '../RoomConnectionService.js';

import { WelcomeRoomService } from './rooms/WelcomeRoomService.js';
import { ClientRoomService }  from './rooms/ClientRoomService.js';

import { ClientCommand } from '../ClientCommand.js';

export class ChildServerService extends ServerService {

  constructor(name) {
    super(name);

    this.parentServerService = null; //set by parentServerService
  }

  commandHandler_enter() {

    const welcomeRoomName = "child_welcome_room";
    const roomId          = this.parentServerService.getChildServerWelcomeRoomId(welcomeRoomName);

    const welcomeRoomConnectionConfig = {
      roomPort: 2567,
      roomName: welcomeRoomName,
      roomId: roomId,
      passphrase : "i_have_token_a_shower__portal",
    };

    RoomConnectionService.joinPrivateRoom_p(welcomeRoomConnectionConfig)
                         .then(room => {
                           console.log(this.constructor.name, "welcome_room:", room);
                           this.welcomeRoomService = new WelcomeRoomService(room);
                           this.observed_welcomed.notifyObservers();
                           // this.notifyNewRoom();

                           //listen to next room message
                           return RoomConnectionService.nextMessage_p(room);

                         })
                         .then(([room, message]) => {
                           console.log("message", message);

                           const command = message.command;

                           if(command == "two_step") {

                             const parentServerService = this.parentServerService;

                             const singleUseCommand = message.payload.command;
                             const clientCommand = new ClientCommand(parentServerService.connectToChildServerCommandName(), {
                               // childServerService : this,
                               singleUseCommand   : singleUseCommand
                             });
                             return parentServerService.do_p(clientCommand);

                           } else {
                             console.log("OHHHHHHHHHHHHHHHHHHHH");
                             throw new Error("two_step message was expected but received:", message);
                           }
                         })
                         .then(clientRoomConnectionConfig => {
                           console.log("yoyoyoyoyoyo", clientRoomConnectionConfig);

                           this.connect(clientRoomConnectionConfig);
                         });

  }

}
