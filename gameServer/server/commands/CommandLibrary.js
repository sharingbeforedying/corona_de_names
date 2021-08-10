
class CommandLibrary {
    constructor () {
        this.commandHandlers = {};
    }

    addCommandHandler(commandHandler) {
      this.commandHandlers[commandHandler.name] = commandHandler;
    }

    addSingleUseCommandHandler(commandHandler) {
      const nativeHandlerFunc = commandHandler.handlerFunc;
      const commandLibrary = this;
      const newHandlerFunc = (myClient, message) => {
        commandLibrary.removeCommandHandler(commandHandler);
        nativeHandlerFunc(myClient, message);
      }
      commandHandler.handlerFunc = newHandlerFunc;

      this.addCommandHandler(commandHandler);
    }

    removeCommandHandler(commandHandler) {
      delete this.commandHandlers[commandHandler.name];
    }

    ///

    getCommandHandler(commandName) {
      //console.log("getCommandHandler", commandName);
      //console.log("this.commandHandlers", this.commandHandlers);
      return this.commandHandlers[commandName];
    }
}
exports.CommandLibrary = CommandLibrary;
