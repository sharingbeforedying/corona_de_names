const colyseus = require('colyseus');

const SharedRoom = require("../../../../../rooms/sharedRoom/SharedRoom.js").SharedRoom;

// const ChatRoomState = require("./ChatRoomState.js").ChatRoomState;
// const ChatRoomAvatar = require("./ChatRoomAvatar.js").ChatRoomAvatar;

// const onChange = require('on-change');
// const rxjs = require('rxjs');

const ContentConfigRoomState = require("./ContentConfigRoomState.js").ContentConfigRoomState;

const CommandLibrary = require("../../../../../commands/CommandLibrary.js").CommandLibrary;
const CommandHandler = require("../../../../../commands/CommandHandler.js").CommandHandler;

const Rx = require('rxjs');
const Rx_operators = require('rxjs/operators');
const _rx_roomEvent     = new Rx.Subject();
const _rx_contentConfig = new Rx.Subject();

const Utils = require('../../../../../utils/Utils.js').Utils;

const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;


exports.ContentConfigRoom = class ContentConfigRoom extends SharedRoom {

  constructor(presence) {
    super(presence);

    const state = new ContentConfigRoomState();
    // console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

    this.commandLibrary = new CommandLibrary();

    this.rx_roomEvent     = _rx_roomEvent.asObservable();
    this.rx_contentConfig = _rx_contentConfig.asObservable();

  }

  configureWithData(teamsConfig) {
    console.log(this.constructor.name, "configureWithData");

  }

  //room events : myClient

  // onAddTetheredClient(tetheredClient) {
  //   super.onAddTetheredClient(tetheredClient);
  //
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


  }


  //room events : std

  handleMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("ContentConfigRoom", "onMessage", this.roomName);

    const [command, data] = message;
    console.log("command", command);
    // console.log("data", data);

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

  setupCommandLibrary(sector) {
    this.setupCommandHandlers(this.commandLibrary, sector);

    Object.entries(this.commandLibrary.commandHandlers).forEach(([commandName, commandHandler], i) => {
      this.state.roomCommands[commandName] = commandName;
    });
  }

  // if(command == "createContentItem") {
  //   this.state.cmd_createContentItem(sessionId, command, data);
  // } else if(command == "removeContentItem") {
  //   this.state.cmd_removeContentItem(sessionId, command, data);
  // } else
  //
  // if(command == "setImageAtIndex") {
  //   this.state.cmd_setImageAtIndex(sessionId, command, data);
  // } else if(command == "setWordAtIndex") {
  //   this.state.cmd_setWordAtIndex(sessionId, command, data);
  // }

  setupCommandHandlers(commandLibrary, sector) {

    // const eqpt = this;
    // const host = eqpt.host;
    // const contentConfig = this.state.contentConfig;
    const room = this;

      //contentConfig

    const commandHandler__instance_config_contentConfig_mutate_set_name = new CommandHandler("instance_config_contentConfig_mutate_set_name", "instance_config_contentConfig_mutate_set_name", (client, message) => {
      const [command, data] = message;

      const name = data.name;

      const contentConfig = room.state.contentConfig;
      contentConfig.name = name;

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_contentConfig_mutate_set_name);

      //whole

    const commandHandler__instance_config_content_contentConfig_mutate_whole = new CommandHandler("instance_config_content_contentConfig_mutate_whole", "instance_config_content_contentConfig_mutate_whole", (client, message) => {
      const [command, data] = message;

      const incomingContentConfig = data.contentConfig;

      const contentConfig = room.state.contentConfig;
      contentConfig.name = incomingContentConfig.name;

      Object.entries(incomingContentConfig.grid.cells).forEach(([cellIndex, cell], i) => {
        const word = cell.items[0].content;
        contentConfig.setWordAtIndex(cellIndex, word);

        const image = cell.items[1].content;
        contentConfig.setImageAtIndex(cellIndex, image);

        try {
          const audio = cell.items[2].content;
          contentConfig.setAudioAtIndex(cellIndex, audio);

        } catch(err) {
          console.log("no audio");
        }
      });

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentConfig_mutate_whole);

      //grid

    const commandHandler__instance_config_content_contentGrid_shuffle = new CommandHandler("instance_config_content_contentGrid_shuffle", "instance_config_content_contentGrid_shuffle", (client, message) => {
      const [command, data] = message;

      const contentConfig = room.state.contentConfig;

      const cellsOrder_prev = contentConfig.grid.cellsOrder;

      const indexes_prev = Object.values(cellsOrder_prev);

      function shuffle(a) {
          var j, x, i;
          for (i = a.length - 1; i > 0; i--) {
              j = Math.floor(Math.random() * (i + 1));
              x = a[i];
              a[i] = a[j];
              a[j] = x;
          }
          return a;
      }
      const indexes_shuffled = shuffle(indexes_prev.slice());

      const permutationMap = Object.fromEntries(Utils.range(indexes_prev.length).map(i => {
        const srcIndex  = indexes_prev[i];
        const dstIndex  = indexes_shuffled[i];
        return [srcIndex, dstIndex];
      }));
      console.log("permutationMap", permutationMap);


      const cellsOrder = new MapSchema();
      Object.keys(cellsOrder_prev).forEach((cellIndex_prev, i) => {
        const cellId = cellsOrder_prev[cellIndex_prev];

        const dstCellIndex = permutationMap[cellIndex_prev];
        cellsOrder[dstCellIndex] = cellId;
      });

      contentConfig.grid.cellsOrder = cellsOrder;


      //debug
      // const tmp = contentConfig.grid.cellsOrder[1];
      // contentConfig.grid.cellsOrder[1] = contentConfig.grid.cellsOrder[0];
      // contentConfig.grid.cellsOrder[0] = tmp;

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentGrid_shuffle);

    const commandHandler__instance_config_content_contentGrid_random_words = new CommandHandler("instance_config_content_contentGrid_random_words", "instance_config_content_contentGrid_random_words", (client, message) => {
      const [command, data] = message;

      console.log("random_words", client.id);

      const contentConfig = room.state.contentConfig;
      const cells = contentConfig.grid.cells;
      const nb_cells = Object.values(cells).length;

      const WordProvider = require('../../../../../_game/game/instanceConfig/content/providers/local/WordProvider.js').WordProvider;
      const ContentItem  = require('../../../../../_game/game/instanceConfig/content/ContentItem.js').ContentItem;

      const wordProvider = new WordProvider();

      try {
        const words = wordProvider.randomWord_array(nb_cells);
        console.log("words", words);

        Utils.range(nb_cells).forEach((index, i) => {
          const cell = cells[index];
          const word = words[index];

          const item_word = ContentItem.word(word);
          cell.items[0] = item_word;

        });

      } catch (err) {
        console.log('wordProvider error', err);
      }

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentGrid_random_words);

    const commandHandler__instance_config_content_contentGrid_random_images = new CommandHandler("instance_config_content_contentGrid_random_images", "instance_config_content_contentGrid_random_images", (client, message) => {
      const [command, data] = message;

      console.log("random_images", client.id);

      const contentConfig = room.state.contentConfig;
      const cells = contentConfig.grid.cells;
      const nb_cells = Object.values(cells).length;

      const ImageProvider = require('../../../../../_game/game/instanceConfig/content/providers/remote/ImageProvider.js').ImageProvider;
      const ContentItem   = require('../../../../../_game/game/instanceConfig/content/ContentItem.js').ContentItem;

      const imageProvider = new ImageProvider();

      try {
        const images = imageProvider.randomImage_array(nb_cells);

        Utils.range(nb_cells).forEach((index, i) => {
          const cell = cells[index];
          const image = images[index];

          const item_image = ContentItem.image(image);
          cell.items[1] = item_image;

        });

      } catch (err) {
        console.log('imageProvider error', err);
      }



    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentGrid_random_images);

      //cell

    const commandHandler__instance_config_content_contentCell_mutate_set_word = new CommandHandler("instance_config_content_contentCell_mutate_set_word", "instance_config_content_contentCell_mutate_set_word", (client, message) => {
      const [command, data] = message;

      const index = data.index;
      const word  = data.word;

      const contentConfig = room.state.contentConfig;
      contentConfig.setWordAtIndex(index, word);

      // contentConfig.name += "_w";

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentCell_mutate_set_word);

    // const commandHandler = new CommandHandler(command, command, (myClient, message) => {
    const commandHandler__instance_config_content_contentCell_mutate_set_image = new CommandHandler("instance_config_content_contentCell_mutate_set_image", "instance_config_content_contentCell_mutate_set_image", (client, message) => {
      const [command, data] = message;

      const index = data.index;
      const image = data.image;

      const contentConfig = room.state.contentConfig;
      contentConfig.setImageAtIndex(index, image);

      // contentConfig.name += "_i";
    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentCell_mutate_set_image);

    const commandHandler__instance_config_content_contentCell_mutate_set_audio = new CommandHandler("instance_config_content_contentCell_mutate_set_audio", "instance_config_content_contentCell_mutate_set_audio", (client, message) => {
      const [command, data] = message;

      const index = data.index;
      const audio = data.audio;

      const contentConfig = room.state.contentConfig;
      contentConfig.setAudioAtIndex(index, audio);

      // contentConfig.name += "_i";
    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentCell_mutate_set_audio);

    const commandHandler__instance_config_content_contentCell_random_word = new CommandHandler("instance_config_content_contentCell_random_word", "instance_config_content_contentCell_random_word", (client, message) => {
      const [command, data] = message;

      const index = data.index;
      console.log("random_word", client.id, index);

      const contentConfig = room.state.contentConfig;
      const cell = contentConfig.grid.cells[index];

      const WordProvider = require('../../../../../_game/game/instanceConfig/content/providers/local/WordProvider.js').WordProvider;
      const ContentItem  = require('../../../../../_game/game/instanceConfig/content/ContentItem.js').ContentItem;

      const wordProvider = new WordProvider();

      try {

        const words = wordProvider.randomWord_array(1);
        const word  = words.find(e => true);

        const item_word = ContentItem.word(word);
        cell.items[0] = item_word;

      } catch (err) {
        console.log('wordProvider error', err);
      }

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentCell_random_word);


    const commandHandler__instance_config_content_contentCell_random_image = new CommandHandler("instance_config_content_contentCell_random_image", "instance_config_content_contentCell_random_image", (client, message) => {
      const [command, data] = message;

      const index = data.index;

      console.log("random_image", client.id, index);

      const contentConfig = room.state.contentConfig;
      const cell = contentConfig.grid.cells[index];

      const ImageProvider = require('../../../../../_game/game/instanceConfig/content/providers/remote/ImageProvider.js').ImageProvider;
      const ContentItem   = require('../../../../../_game/game/instanceConfig/content/ContentItem.js').ContentItem;

      const imageProvider = new ImageProvider();

      try {
        // const image = imageProvider.randomImage();
        const images = imageProvider.randomImage_array(1);
        const image  = images.find(e => true);

        const item_image = ContentItem.image(image);
        cell.items[1] = item_image;

      } catch (err) {
        console.log('imageProvider error', err);
      }

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_contentCell_random_image);

      //submit

    const commandHandler__instance_config_content_submitContentConfig = new CommandHandler("instance_config_content_submitContentConfig", "instance_config_content_submitContentConfig", (client, message) => {
      const [command, data] = message;

      console.log("submitContentConfig");
      // if(contentConfig.acceptable) {
      //   console.log("contentConfig.acceptable");
      //
      //   // super.onMessage(client, ["moveToNextRoom", {}]);
      //   this.getRoomLink(client).onMessage(["moveToNextRoom", {contentConfig: contentConfig}]);
      // } else {
      //   throw new Error("contentConfig.acceptable == false");
      // }

      //debug
      // this.getRoomLink(client).onMessage(["moveToNextRoom", {contentConfig: contentConfig}]);

      const contentConfig = room.state.contentConfig;

        //debug
      _rx_contentConfig.pipe(Rx_operators.take(1)).subscribe({
        next(contentConfig) {
          console.log("debug sub", "contentConfig", contentConfig);
        },
      });

      _rx_contentConfig.next(contentConfig);

    });
    commandLibrary.addCommandHandler(commandHandler__instance_config_content_submitContentConfig);

  }

  sendCommandAnswer(client, commandAnswer) {
    console.log("ContentConfigRoom", this.roomName, "sendCommandAnswer", commandAnswer);
    client.send("answer", { commandAnswer : commandAnswer });
  }


}
