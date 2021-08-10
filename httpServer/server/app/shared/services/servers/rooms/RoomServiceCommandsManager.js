import { RoomConnectionService } from '../RoomConnectionService.js';

import { ClientCommand } from '../ClientCommand.js';

import { MoveToHelper } from '../MoveToHelper.js';

export class RoomServiceCommandsManager {

  constructor() {

    this.roomCommandHandlers   = {};
    this.moveToCommandHandlers = {};

    // this.moveToHelper = new MoveToHelper(this, {});
  }

  configureRoomCommandHandlers(commandConfigs) {
    this.clearRoomCommandHandlers();

    commandConfigs.forEach((commandConfig, i) => {

      this.addRoomCommandHandler(commandConfig.name, (data) => {
        const clientCommand = new ClientCommand(commandConfig.name, data);
        this.sendCommand(clientCommand);
      });

    });

  }

  configureMoveToCommandHandlers(moveToConfigs) {

    moveToConfigs.forEach((moveToConfig, i) => {

      this.addMoveToCommandHandler("moveTo" + "_" + moveToConfig.name, (data) => {

        this.moveToHelper.moveTo(moveToConfig);

      });

    });

  }

  //Commands

  addRoomCommandHandler(commandName, commandHandler) {
    console.log("addRoomCommandHandler", commandName);
    this.roomCommandHandlers[commandName] = commandHandler;
  }

  clearRoomCommandHandlers() {
    console.log("clearRoomCommandHandlers");
    this.roomCommandHandlers = {};
  }

  addMoveToCommandHandler(commandName, commandHandler) {
    console.log("addMoveToCommandHandler", commandName);
    this.moveToCommandHandlers[commandName] = commandHandler;
  }

  clearMoveToCommandHandlers() {
    console.log("clearMoveToCommandHandlers");
    this.moveToCommandHandlers = {};
  }

  // processCommand_p(command) {
  //   console.log("RoomService", "processCommand_p", command);
  //   const commandHandler = this.roomCommandHandlers[command.name];
  //   if(commandHandler) {
  //     console.log("commandHandler", commandHandler);
  //     return commandHandler(command.data);
  //   } else {
  //     throw new Error("command", command.name, "not found");
  //   }
  // }

  processCommand_p(clientCommand) {
    console.log("RoomService", "processCommand_p", clientCommand);

    console.log("this.roomCommandHandlers",   this.roomCommandHandlers);
    console.log("this.moveToCommandHandlers", this.moveToCommandHandlers);


    var commandHandler;
    commandHandler = this.roomCommandHandlers[clientCommand.name];
    if(!commandHandler) {
      commandHandler = this.moveToCommandHandlers[clientCommand.name];
    }

    console.log("commandHandler", commandHandler);

    if(commandHandler) {
      console.log("commandHandler", commandHandler);
      return (commandHandler)(clientCommand.data);
    } else {
      throw new Error("command", clientCommand.name, "not found");
    }
  }


  sendCommand(clientCommand) {
    RoomConnectionService.sendCommand(this.room, clientCommand);
  }

  sendCommand_p(clientCommand) {
    return RoomConnectionService.sendCommand_p(this.room, clientCommand);
  }



}
