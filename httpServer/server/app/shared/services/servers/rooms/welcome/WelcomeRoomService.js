import { AbsRoomService } from '../AbsRoomService.js';

import { ClientCommand } from '../../ClientCommand.js';

export class WelcomeRoomService extends AbsRoomService {

  constructor(room) {
    super(room);

    this.configureRoomCommandHandlers(room.state.roomCommands);
  }

  configureRoomCommandHandlers(commandConfigs) {
    this.clearRoomCommandHandlers();

    console.log("commandConfigs", commandConfigs);
    Object.keys(commandConfigs).forEach((commandName, i) => {

      this.addRoomCommandHandler(commandName, (data) => {
        const clientCommand = new ClientCommand(commandName, data);
        this.sendCommand_p(clientCommand)
            .then(moveToConfig => {
              this.moveToHelper.moveTo(moveToConfig);
            });
      });

    });

  }


}
