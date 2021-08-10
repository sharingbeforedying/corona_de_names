
class CommandHandler {
    constructor (id, name, handlerFunc) {
        this.id          = id;
        this.name        = name;
        this.handlerFunc = handlerFunc;
    }
}
exports.CommandHandler = CommandHandler;
