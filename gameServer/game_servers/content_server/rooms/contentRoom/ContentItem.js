const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const contentItemType = {
    WORD:  0,
    IMAGE: 1,

    AUDIO: 2,
    VIDEO: 3,
}

class ContentItem extends Schema {
  constructor (type, content = null) {
      super();
      this.type    = type;
      this.content = content;
  }

  static word(word) {
    return new ContentItem(contentItemType.WORD, word);
  }

  static image(image) {
    return new ContentItem(contentItemType.IMAGE, image);
  }

}
schema.defineTypes(ContentItem, {
  type   : "number",
  content: "string",
});

exports.ContentItem = ContentItem;
