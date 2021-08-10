import { RoomConnectionService } from '../../RoomConnectionService.js';

export class ClientRoomService {

  constructor(room) {
    this.room = room;
  }

  do(clientCommand) {
    RoomConnectionService.sendCommand(this.room, clientCommand);
  }

  do_p(clientCommand) {
    return RoomConnectionService.sendCommand_p(this.room, clientCommand);
  }

}
