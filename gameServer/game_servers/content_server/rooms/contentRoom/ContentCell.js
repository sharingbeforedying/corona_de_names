const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

const ContentItem  = require('./ContentItem.js').ContentItem;

class ContentCell extends Schema {
  constructor () {
      super();
      this.items = new MapSchema();
  }
}
schema.defineTypes(ContentCell, {
  items : {map : ContentItem},
});

exports.ContentCell = ContentCell;
