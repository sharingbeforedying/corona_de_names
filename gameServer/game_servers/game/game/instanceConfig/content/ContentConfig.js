const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema   = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const onChange = require('on-change');

const Utils = require('../../../../utils/Utils.js').Utils;

class ContentConfig extends Schema {

    constructor() {
      console.log("ContentConfig()");
      super();
      this.x = "x";
    }

}
schema.defineTypes(ContentConfig, {
  x : "string",
});

exports.ContentConfig = ContentConfig;
