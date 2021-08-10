const schema = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const Utils = require('../../../../utils/utils.js').Utils;

const ContentItem  = require('./ContentItem.js').ContentItem;
const ContentCell  = require('./ContentCell.js').ContentCell;

const Debug  = require('./debug/Debug.js').Debug;

const ImageProvider = require('./providers/remote/ImageProvider.js').ImageProvider;

class ContentGrid extends Schema {
  constructor (nb_cells) {
      super();
      this.cells = new MapSchema();
      this.cellsOrder = new MapSchema();
      Utils.range(25).forEach((index, i) => {
        this.cells[index] = new ContentCell();
        this.cellsOrder[index] = "" + index;
      });
  }

  static debug(nb_cells) {
    const grid = new ContentGrid(nb_cells);

    Utils.range(nb_cells).forEach((index, i) => {
      grid.cells[index] = Debug.contentCell(index);
    });

    return grid;
  }

  static remote(nb_cells) {
    console.log("ContentGrid::remote", nb_cells);

    const grid = new ContentGrid(nb_cells);

    const imageProvider = new ImageProvider();

    try {
      const images = imageProvider.randomImage_array(nb_cells);

      Utils.range(nb_cells).forEach((index, i) => {
        const cell = new ContentCell();

        // const word = "word" + index;
        const word = "";
        const item_word = new ContentItem(0, word);
        cell.items[0] = item_word;

        const image = images[index];
        const item_image = new ContentItem(1, image);
        cell.items[1] = item_image;

        grid.cells[index] = cell;
      });

    } catch (err) {
      console.log('imageProvider error', err);
    }

    console.log("done preparing grid");

    return grid;
  }
}
schema.defineTypes(ContentGrid, {
  cells : {map : ContentCell},

  cellsOrder: {map: "string"},
});

exports.ContentGrid = ContentGrid;
