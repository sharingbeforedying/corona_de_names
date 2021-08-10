const schema = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const Utils = require('../../utils/Utils.js').Utils;

const flipCellType = {
    VERSO : 0,
    RECTO : 1,
}

class FlipCell extends Schema {
  constructor (type) {
      super();
      this.type = type;
  }
}
schema.defineTypes(FlipCell, {
  type : "number",
});

exports.FlipCell = FlipCell;

class FlipGrid extends Schema {
  constructor (nb_cells) {
      super();
      this.cells = new MapSchema();
      Utils.range(25).forEach((index, i) => {
        this.cells[index] = new FlipCell();
      });
  }
}
schema.defineTypes(FlipGrid, {
  cells : {map : FlipCell},
});

exports.FlipGrid = FlipGrid;
