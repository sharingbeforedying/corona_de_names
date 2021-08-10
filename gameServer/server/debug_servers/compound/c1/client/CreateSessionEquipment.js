const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const CommandLibrary = require("../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../commands/CommandHandler.js").CommandHandler;

// const GroupPlayerGroup = require("../../../../_game/game/group/GroupPlayerGroup.js").GroupPlayerGroup;
const SessionConfig = require("../../../../_game/game/session/SessionConfig.js").SessionConfig;
const FormModel     = require("../../../../utils/FormModel.js").FormModel;

exports.CreateSessionEquipment = class CreateSessionEquipment {

  constructor() {

    this.host           = null;   //host is a room

    this.initialState   = this.createInitialState();
    this.commandLibrary = this.createCommandLibrary();
  }

  createInitialState() {

    class CreateSessionEquipmentState extends Schema {
      constructor() {
        super();

        // this.group = null;
      }
    }
    schema.defineTypes(CreateSessionEquipmentState, {

      // group : GroupPlayerGroup,

    });

    // exports.GroupEquipmentState = GroupEquipmentState;

    const state = new CreateSessionEquipmentState();
    return state;
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
    const commandHandler__session_config_formModel = new CommandHandler("session_config_formModel", "session_config_formModel", (client, message) => {
      const [command, data] = message;

      const schemaInstance = SessionConfig.default();
      const types  = schemaInstance._schema;
      const values = schemaInstance;
      const formModel = new FormModel(types, values);
      // return formModel;

      // eqpt.host.sendCommandAnswer()

    });
    commandLibrary.addCommandHandler(commandHandler__session_config_formModel);

    const commandHandler__session_create = new CommandHandler("session_create", "session_create", (client, message) => {
      const [command, data] = message;

      const form = data.form;
      console.log("cmd_session_create:", form);

      const sId = clientId + "_" + form.name;

      /*
      const session = new Session(sId, form);
      gs.sessions[session.id] = session;

      const data_join = {sId : session.id};
      gs.cmd_session_join(clientId, command, data_join);

      return session;
      */
    });
    commandLibrary.addCommandHandler(commandHandler__session_create);


  }


}
