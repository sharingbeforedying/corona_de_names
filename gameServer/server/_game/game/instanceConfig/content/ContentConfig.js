const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

// const onChange = require('on-change');
// const Utils = require('../../../../utils/Utils.js').Utils;

const ContentGrid  = require('./ContentGrid.js').ContentGrid;
const ContentItem  = require('./ContentItem.js').ContentItem;

class ContentConfig extends Schema {

    constructor() {
      console.log("ContentConfig()");
      super();
      this.x    = "x";
      this.name = "contentConfig789";

      this.version = "0.1";

      // const grid = ContentGrid.remote(25);
      const grid = ContentGrid.debug(25);
      // const grid = new ContentGrid(25);
      this.grid = grid;
    }


    setImageAtIndex (index, image) {
      console.log("ContentConfig", "setImageAtIndex", index/*, image*/);

      // this.items[index].configureWithImage(image);
      // this.items[index].image = image;
      const cell = this.grid.cells[index];
      if(cell) {
        const item = cell.items[1];
        item.content = image;
      }
    }

    setWordAtIndex (index, word) {
      console.log("ContentConfig", "setWordAtIndex", index, word);

      // this.items[index].configureWithWord(word);
      // this.items[index].word = word;
      const cell = this.grid.cells[index];
      if(cell) {
        const item = cell.items[0];
        item.content = word;
      }
    }

    setAudioAtIndex (index, audio) {
      console.log("ContentConfig", "setAudioAtIndex", index/*, audio*/);

      // this.items[index].configureWithWord(word);
      // this.items[index].word = word;
      const cell = this.grid.cells[index];

      if(cell) {
        try {
          const item = cell.items[2];
          item.content = audio;
        } catch(error) {
          //create item: audio
          cell.items[2] = ContentItem.audio(audio);
        }
      }
    }

}
schema.defineTypes(ContentConfig, {
  x    : "string",
  name : "string",

  version: "string",


  grid : ContentGrid,

});

exports.ContentConfig = ContentConfig;
