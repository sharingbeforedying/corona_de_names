// import { RoomConnectionService } from '../../RoomConnectionService.js';

import { AbsRoomService } from '../AbsRoomService.js';

import { ClientCommand } from '../../ClientCommand.js';

export class ClientRoomService extends AbsRoomService {

  constructor(room) {
    super(room);

    // this.room = room;

    this.configureRoomCommandHandlers(room.state.roomCommands);

    this.addRoomCommandHandler("two_step_with_portal", (data) => {
      const clientCommand = new ClientCommand(data.singleUseCommandName, data.singleUseCommandData)
      return this.sendCommand_p(clientCommand);
    });


    this.configureMoveToCommandHandlers(room.state.moveToConfigs);



    // this.addRoomCommandHandler("single_use", (data) => {
    //   const clientCommand = new ClientCommand(data.singleUseCommandName, data.singleUseCommandData)
    //   return this.sendCommand_p(clientCommand);
    // });
  }


}
