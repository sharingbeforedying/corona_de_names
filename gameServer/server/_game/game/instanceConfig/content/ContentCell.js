const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

const ContentItem  = require('./ContentItem.js').ContentItem;

class ContentCell extends Schema {
  constructor () {
      super();
      this.items = new MapSchema();

      const item_word  = ContentItem.word("");
      this.items[item_word.type] = item_word;

      const item_image  = ContentItem.image("");
      this.items[item_image.type] = item_image;

      // const item_audio  = ContentItem.audio("");
      // this.items[item_audio.type] = item_audio;
  }
}
schema.defineTypes(ContentCell, {
  items : {map : ContentItem},
});

exports.ContentCell = ContentCell;
