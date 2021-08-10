const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const CommandLibrary = require("../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../commands/CommandHandler.js").CommandHandler;


const GroupPlayerGroup = require("../../../../_game/game/group/GroupPlayerGroup.js").GroupPlayerGroup;

exports.GroupEquipment = class GroupEquipment {

  constructor() {

    this.host           = null;   //host is a room

    this.initialState   = this.createInitialState();
    this.commandLibrary = this.createCommandLibrary();
  }

  createInitialState() {

    class GroupEquipmentState extends Schema {
      constructor() {
        super();

        this.group = null;
      }
    }
    schema.defineTypes(GroupEquipmentState, {

      group : GroupPlayerGroup,

    });

    // exports.GroupEquipmentState = GroupEquipmentState;

    const state = new GroupEquipmentState();
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

    const commandHandler__group_set_name = new CommandHandler("group_set_name", "group_set_name", (client, message) => {
      const [command, data] = message;

      const name = data.name;

      // const group = eqpt.state.group;
      const group = eqpt.host.state.group;


      group.name = name;
    });
    commandLibrary.addCommandHandler(commandHandler__group_set_name);

    const commandHandler__group_set_image_p = new CommandHandler("group_set_image_p", "group_set_image_p", (client, message) => {
      const [command, data] = message;

      const image = data.image;

      // const group = eqpt.state.group;
      const group = eqpt.host.state.group;


      group.image = image;
    });
    commandLibrary.addCommandHandler(commandHandler__group_set_image_p);


    const commandHandler__group_createPlayer_loginProfile = new CommandHandler("group_createPlayer_loginProfile", "group_createPlayer_loginProfile", (client, message) => {
      const [command, data] = message;

      const profileCredentials = data.profileCredentials;

      // const group = eqpt.state.group;
      const group = eqpt.host.state.group;


      //TODO:login
      const groupPlayer = group.createPlayer();
      groupPlayer.name = "login789";

      group.name = "test789789789";

      return groupPlayer;

    });
    commandLibrary.addCommandHandler(commandHandler__group_createPlayer_loginProfile);

    const commandHandler__group_createPlayer_createProfile = new CommandHandler("group_createPlayer_createProfile", "group_createPlayer_createProfile", (client, message) => {
      const [command, data] = message;

      const profileForm = data.profileForm;

      //create profile

      //cmd_group_addPlayer_withProfile
      // const group = eqpt.state.group;
      const group = eqpt.host.state.group;


      const groupPlayer = group.createPlayer();
      groupPlayer.name = "create852";

      return groupPlayer;
    });
    commandLibrary.addCommandHandler(commandHandler__group_createPlayer_createProfile);

    const commandHandler__group_createPlayer_noProfile = new CommandHandler("group_createPlayer_noProfile", "group_createPlayer_noProfile", (client, message) => {
      const [command, data] = message;

      const noProfileForm = data.form;
      console.log("JSON.stringify(noProfileForm)", JSON.stringify(noProfileForm));

      // const group = eqpt.state.group;
      const group = eqpt.host.state.group;


      const groupPlayer = group.createPlayer();
      console.log("1 JSON.stringify(groupPlayer)", JSON.stringify(groupPlayer));
      console.log("1 groupPlayer.lolilol", groupPlayer.lolilol);


      groupPlayer.name = noProfileForm.name;
      // groupPlayer.img  = noProfileForm.img;

      Object.entries(group.players).forEach(([groupPlayerId, groupPlayer], i) => {
        console.log("2 JSON.stringify(groupPlayer)", JSON.stringify(groupPlayer));
        console.log("2 groupPlayer.lolilol", groupPlayer.lolilol);

        // groupPlayer.name = noProfileForm.name;
      });

      console.log("noProfileForm.name", noProfileForm.name);

      // group.name = "test123";

      return groupPlayer;
    });
    commandLibrary.addCommandHandler(commandHandler__group_createPlayer_noProfile);



    const commandHandler__group_setPlayerName = new CommandHandler("group_setPlayerName", "group_setPlayerName", (client, message) => {
      const [command, data] = message;

      const playerId = data.playerId;
      const name     = data.name;
      console.log("setGroupPlayerName:", playerId, name);

      // const group = eqpt.state.group;
      const group = eqpt.host.state.group;


      const groupPlayer = group.players[playerId];
      //console.log("groupPlayer", groupPlayer.toJSON());
      if(groupPlayer) {
        groupPlayer[property] = value;
      } else {
        console.log("could not find groupPlayer matching playerId:", playerId);
      }

    });
    commandLibrary.addCommandHandler(commandHandler__group_setPlayerName);



    const commandHandler__group_removePlayer = new CommandHandler("group_removePlayer", "group_removePlayer", (client, message) => {
      const [command, data] = message;

      const playerId = data.playerId;

      try {

        // const group = eqpt.state.group;
        const group = eqpt.host.state.group;


        group.removePlayer(playerId);

        //delete group if empty
        // const nbPlayers = Object.values(group.players).length;
        // if(nbPlayers == 0) {
        //   this.removeGroup(clientId);
        // }

      } catch(e) {
        console.log(e);
      }

    });
    commandLibrary.addCommandHandler(commandHandler__group_removePlayer);
  }


  // createGroup(clientId) {
  //   const group = new GroupPlayerGroup(clientId);
  //   this.groupPlayerGroups[clientId] = group;
  //
  //   this.clients[clientId].group = createGemini(group);
  // }


}
