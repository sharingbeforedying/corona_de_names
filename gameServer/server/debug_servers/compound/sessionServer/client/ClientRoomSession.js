const colyseus = require('colyseus');
// const ClientState  = require('./ClientState.js').ClientState;

// const LinkedRoom = require("../LinkedRoom.js").LinkedRoom;
// const SharedRoom = require("../sharedRoom/SharedRoom.js").SharedRoom;
const ClientRoom = require("../../../../rooms/client/ClientRoom.js").ClientRoom;

const CommandLibrary = require("../../../../commands/CommandLibrary.js").CommandLibrary;

exports.ClientRoomSession = class ClientRoomSession extends ClientRoom {

  constructor(presence) {
    super(presence);

    this.equipments     = {};
    this.commandLibrary = new CommandLibrary();

    // const groupEquipment = new GroupEquipment();
    // this.addEquipment("group", groupEquipment);
  }

  addEquipment(eqptName, eqpt) {

    eqpt.host = this;

    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;
    const MapSchema = schema.MapSchema;
    const ArraySchema = schema.ArraySchema;

    //merge state
    const roomState = this.state;
    // console.log("AA roomState._schema", roomState._schema);

    class StateXXX extends roomState.constructor {}
    schema.defineTypes(StateXXX, eqpt.initialState.constructor.prototype._schema);
    // console.log("BB StateXXX._schema", StateXXX._schema);

    const newState = new StateXXX();
    Object.assign(newState, roomState);
    Object.assign(newState, eqpt.initialState);

    //broadcast schema updates
    this.setState(newState);

    //merge command library
    Object.entries(eqpt.commandLibrary.commandHandlers).forEach(([commandName, commandHandler], i) => {
      this.commandLibrary.addCommandHandler(commandHandler);

      //add roomCommand in roomState
      this.state.roomCommands[commandName] = commandName;

    });




    this.equipments[eqptName] = eqpt;
  }

  onCreate(options) {
    super.onCreate(options);

    // const groupEquipment = new GroupEquipment();
    // this.addEquipment("group", groupEquipment);
  }

  onJoin(client, options) {
    super.onJoin(client, options);

    // const groupEquipment = new GroupEquipment();
    // this.addEquipment("group", groupEquipment);
  }

  handleMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("ClientRoomSession", "onMessage", this.roomName);

    const [command, data] = message;
    console.log("command", command);
    console.log("data", data);

    const handler = this.commandLibrary.getCommandHandler(command);

    if(handler) {
      // handler.handlerFunc(myClient, message);
      handler.handlerFunc(client, message);
    } else {
      console.log("unknown command", command, data);
    }


    super.handleMessage(client, message);
  }

  sendCommandAnswer(client, commandAnswer) {
    console.log("ClientRoom", this.roomName, "sendCommandAnswer", commandAnswer);
    client.send("answer", { commandAnswer : commandAnswer });
  }

}
