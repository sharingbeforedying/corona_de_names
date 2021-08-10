import { AbsRoomService } from '../AbsRoomService.js';

import { ClientCommand } from '../../ClientCommand.js';

export class PortalRoomService extends AbsRoomService {

  constructor(room) {
    super(room);

    // this.configureRoomCommandHandlers(room.state.roomCommands);

    // if auto: moveToClient

  }

  processAutoAnswer(autoAnswer) {
    // const moveToConfig = autoAnswer.moveToConfig;
    // this.moveToHelper.moveTo(moveToConfig);

    // this.moveToService.moveToClient_auto(/*autoAnswer*/);
    this.moveToService.moveToClient(/*autoAnswer*/);
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
