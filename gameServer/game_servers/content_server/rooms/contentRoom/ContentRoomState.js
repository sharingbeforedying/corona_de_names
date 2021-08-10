const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

// const ContentItem  = require('./ContentItem.js').ContentItem;
const ContentGrid  = require('./ContentGrid.js').ContentGrid;

class ContentRoomState extends Schema {

    constructor () {
        super();
        //not serialized
        // this.items = new MapSchema();

        // const grid = ContentGrid.debug(25);
        const grid = ContentGrid.remote(25);
        this.grid = grid;
    }

    /*Commands*/

    cmd_setImageAtIndex (sessionId, command, data) {
      const image = data.image;
      const index = data.index;

      // this.items[index].configureWithImage(image);
      // this.items[index].image = image;
      const cell = this.grid.cells[index];
      const item = cell.items[1];
      item.content = image;
    }

    cmd_setWordAtIndex (sessionId, command, data) {
      const word  = data.word;
      const index = data.index;

      // this.items[index].configureWithWord(word);
      // this.items[index].word = word;
      const cell = this.grid.cells[index];
      const item = cell.items[0];
      item.content = word;
    }

}
schema.defineTypes(ContentRoomState, {
  // items : { map : ContentItem },

  grid : ContentGrid,
});

exports.ContentRoomState = ContentRoomState;
