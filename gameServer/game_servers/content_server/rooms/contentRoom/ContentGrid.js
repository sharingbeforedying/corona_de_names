const schema = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const Utils = require('../../utils/Utils.js').Utils;

const ContentItem  = require('./ContentItem.js').ContentItem;
const ContentCell  = require('./ContentCell.js').ContentCell;

const Debug  = require('./debug/Debug.js').Debug;

const ImageProvider = require('./remote/ImageProvider.js').ImageProvider;

class ContentGrid extends Schema {
  constructor (nb_cells) {
      super();
      this.cells = new MapSchema();
      Utils.range(25).forEach((index, i) => {
        this.cells[index] = new ContentCell();
      });
  }

  static debug(nb_cells) {
    const grid = new ContentGrid();

    Utils.range(25).forEach((index, i) => {
      grid.cells[index] = Debug.contentCell(index);
    });

    return grid;
  }

  static remote(nb_cells) {
    console.log("ContentGrid::remote", nb_cells);

    const grid = new ContentGrid();

    const imageProvider = new ImageProvider();

    let images;
    try {
      images = imageProvider.randomImage_array(nb_cells);
    } catch (err) {
      console.log('imageProvider error', err);
    }

    Utils.range(25).forEach((index, i) => {
      const cell = new ContentCell();

      const word = "word" + index;
      const item_word = new ContentItem(0, word);
      cell.items[0] = item_word;

      const image = images[index];
      const item_image = new ContentItem(1, image);
      cell.items[1] = item_image;

      grid.cells[index] = cell;
    });

    console.log("done preparing grid");

    return grid;
  }
}
schema.defineTypes(ContentGrid, {
  cells : {map : ContentCell},
});

exports.ContentGrid = ContentGrid;
