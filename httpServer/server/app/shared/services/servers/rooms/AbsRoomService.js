import { RoomConnectionService } from '../RoomConnectionService.js';

import { ClientCommand } from '../ClientCommand.js';

export class AbsRoomService {

  constructor(room) {
    this.room = room;

    this.moveToHelper = null; //this is set by factory

    this.roomCommandHandlers   = {};
    this.moveToCommandHandlers = {};

    // this.configureRoomCommandHandlers(room.state.roomCommands);
    // this.configureMoveToCommandHandlers(room.state.moveToConfigs);

    this.stateService   = {};
    this.commandService = {};
    this.moveToService  = {};

    if(room) {
      room.onMessage("answer", (message) => {
        console.log("auto listener: message received from server");
        console.log(message);

        const autoAnswer = message.autoAnswer;
        if(autoAnswer) {
          this.processAutoAnswer(autoAnswer);
        }

      });


      //TRYING TO UNDERSTAND
      room.onLeave((code) => {
        console.log("client left the room", code);
        console.log("room.name", room.name);
      });

      room.onError((code, message) => {
        console.log("oops, error ocurred:");
        console.log("room.roomName", room.roomName);
        console.log("code", code);
        console.log("message", message);
      });


    }
  }

  processAutoAnswer(autoAnswer) {
    const moveToConfig = autoAnswer.moveToConfig;
    this.moveToHelper.moveTo(moveToConfig);
  }

  configureRoomCommandHandlers(commandConfigs) {
    this.clearRoomCommandHandlers();

    const roomService = this;

    Object.entries(commandConfigs).forEach(([commandConfigName, commandConfig], i) => {

      this.addRoomCommandHandler(commandConfigName, (data) => {
        const commandName = commandConfig;
        const clientCommand = new ClientCommand(commandName, data);

        this.sendCommand(clientCommand);
        // return this.sendCommand_p(clientCommand);
      });

      roomService.commandService[commandConfigName] = function (data) {
        const clientCommand = new ClientCommand(commandConfigName, data);
        return roomService.processCommand_p(clientCommand);
      };

    });

  }

  configureMoveToCommandHandlers(moveToConfigs) {

    const roomService = this;

    Object.entries(moveToConfigs).forEach(([moveToConfigName, moveToConfig], i) => {

      const moveToNickname = "moveTo" + "_" + moveToConfig.name;

      this.addMoveToCommandHandler(moveToNickname, (data) => {

        console.log(moveToNickname, "data", data);

        const enrichedConnectionConfig = {};
        Object.assign(enrichedConnectionConfig, {data: data});
        Object.assign(enrichedConnectionConfig, moveToConfig.connectionConfig);

        const moddedMoveToConfig = {};
        Object.assign(moddedMoveToConfig, moveToConfig);
        moddedMoveToConfig.connectionConfig = enrichedConnectionConfig;

        this.moveToHelper.moveTo(moddedMoveToConfig);
      });

      roomService.moveToService[moveToNickname] = function (data) {
        const clientCommand = new ClientCommand(moveToNickname, data);
        return roomService.processCommand_p(clientCommand);
      };

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




  // state_p() {
  //
  //   const room = this.room;
  //
  //   return new Promise((resolve, reject) => {
  //
  //     try {
  //       console.log("A");
  //       room.onStateChange.once((state) => {
  //         resolve(state);
  //       });
  //     } catch(error) {
  //       console.log("B");
  //       reject(error);
  //     }
  //
  //   });
  // }


}
