const colyseus = require('colyseus');

const SharedRoom = require("../../../../../rooms/sharedRoom/SharedRoom.js").SharedRoom;

const CommandLibrary = require("../../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../../commands/CommandHandler.js").CommandHandler;

// const onChange = require('on-change');
// const rxjs = require('rxjs');

const InstanceGuesserRoomState = require("./InstanceGuesserRoomState.js").InstanceGuesserRoomState;

exports.InstanceGuesserRoom = class SessionRoom extends SharedRoom {

  constructor(presence) {
    super(presence);

    const state = new InstanceGuesserRoomState();
    // console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

    this.myClientsData = {};

    this.commandLibrary = new CommandLibrary();
  }

  getSessionPlayersForMyClient(myClient) {
    return this.myClientsData[myClient.id];
  }

  //room events : myClient

  // onAddTetheredClient(tetheredClient) {
  //   super.onAddTetheredClient(tetheredClient);
  //
  //   const client       = tetheredClient.client;
  //   const myClient     = tetheredClient.myClient;
  //   const incomingData = tetheredClient.incomingData;
  //
  // }

  onChangeTetheredClient(tetheredClient) {
    super.onChangeTetheredClient(tetheredClient);

    // const clientRoomState = myClient.clientRoomConnection.room.state;
    //
    // const roomAvatar = new ChatRoomAvatar(myClient.id, clientRoomState.name);
    // this.state.members[myClient.id] = roomAvatar;
  }

  onRemoveTetheredClient(tetheredClient) {
    super.onRemoveTetheredClient(tetheredClient);

    //send 'x has left' to all
    // this.state.cmd_chatLeave(myClient);
    // delete this.state.members[myClient.id];
    console.log("oh no", please.crash.here);


  }

  //room events : std

  handleMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("InstanceGuesserRoom", "onMessage", this.roomName);

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


  /////

  setupPlayer(instancePlayer) {
    this.state.player = instancePlayer;
  }

  setupGrid_content(grid) {
    this.state.grid_content = grid;
  }

  setupGrid_position(grid) {
    this.state.grid_position = grid;
  }

  setupGrid_game(grid) {
    this.state.grid_game = grid;
  }


  //////

  setupCommandLibrary(game) {
    this.setupCommandHandlers(this.commandLibrary, game);

    Object.entries(this.commandLibrary.commandHandlers).forEach(([commandName, commandHandler], i) => {
      this.state.roomCommands[commandName] = commandName;
    });
  }

  setupCommandHandlers(commandLibrary, game) {

    const GuesserSelection = require("../../../../../_game/game/instance/actions/GuesserSelection.js").GuesserSelection;
    const GuesserEndTurn   = require("../../../../../_game/game/instance/actions/GuesserEndTurn.js").GuesserEndTurn;

    const PlayerAction = require("../../../../../_game/game/instance/PlayerAction.js").PlayerAction;

    // const eqpt = this;
    // const host = eqpt.host;

    // const commandHandler = new CommandHandler(command, command, (myClient, message) => {
    const commandHandler__instance_guesser_submitCellSelection = new CommandHandler("instance_guesser_submitCellSelection", "instance_guesser_submitCellSelection", (client, message) => {
      const [command, data] = message;

      console.log("cmd_instance_guesser_submitCellSelection");
      const srcId  = data.playerId;
      const action = new GuesserSelection(data.cellIndex);

      const playerAction = new PlayerAction(srcId, action);

      game.manageGuesserSelection(playerAction);
    });
    commandLibrary.addCommandHandler(commandHandler__instance_guesser_submitCellSelection);


    const commandHandler__instance_guesser_submitEndTurn = new CommandHandler("instance_guesser_submitEndTurn", "instance_guesser_submitEndTurn", (client, message) => {
      const [command, data] = message;

      console.log("cmd_instance_guesser_submitEndTurn");
      const srcId  = data.playerId;
      const action = new GuesserEndTurn();

      const playerAction = new PlayerAction(srcId, action);

      game.manageGuesserEndTurn(playerAction);
    });
    commandLibrary.addCommandHandler(commandHandler__instance_guesser_submitEndTurn);

  }

  sendCommandAnswer(client, commandAnswer) {
    console.log("TeamsConfigRoom", this.roomName, "sendCommandAnswer", commandAnswer);
    client.send("answer", { commandAnswer : commandAnswer });
  }

}
