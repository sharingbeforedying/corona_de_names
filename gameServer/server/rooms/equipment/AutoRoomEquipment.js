const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const CommandLibrary = require("../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../commands/CommandHandler.js").CommandHandler;


// const GroupPlayerGroup = require("../../../../_game/game/group/GroupPlayerGroup.js").GroupPlayerGroup;

exports.AutoRoomEquipment = class AutoRoomEquipment {

  constructor() {
    
    this.host           = null;   //host is a room

    this.initialState   = this.createInitialState();
    this.commandLibrary = this.createCommandLibrary();
  }

  createInitialState() {

    // class GroupEquipmentState extends Schema {
    //   constructor() {
    //     super();
    //
    //     this.group = null;
    //   }
    // }
    // schema.defineTypes(GroupEquipmentState, {
    //
    //   group : GroupPlayerGroup,
    //
    // });
    //
    // // exports.GroupEquipmentState = GroupEquipmentState;
    //
    // const state = new GroupEquipmentState();
    // return state;

    return null;
  }

  createCommandLibrary() {
    const commandLibrary = new CommandLibrary();

    this.setupCommandHandlers(commandLibrary);

    return commandLibrary;
  }

  setupCommandHandlers(commandLibrary) {

    const eqpt = this;
    const host = eqpt.host;


    // const commandHandler = new CommandHandler(command, command, (myClient, message) => {
    const commandHandler__group_create = new CommandHandler("group_create", "group_create", (client, message) => {
      const [command, data] = message;

      const Gemini_Schema = require("../../../../utils/gemini/Gemini_Schema.js").Gemini_Schema;

      const group = new GroupPlayerGroup(client.id);

      // eqpt.state.group = group;
      // eqpt.host.state.group = group;
      eqpt.host.state.group = Gemini_Schema.createSource(group);

      eqpt.host.state.name = "789789789789789---111";

      console.log("JSON.stringify(eqpt.host.state)", JSON.stringify(eqpt.host.state));
    });
    commandLibrary.addCommandHandler(commandHandler__group_create);


  }


}
