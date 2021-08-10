const schema = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const Utils = require('../../../utils/Utils.js').Utils;

const positionCellType = {
    UNKNOWN : -1,

    NEUTRAL: 0,
    RED:     1,
    BLUE:    2,
    BLACK:   3,
}

const gameCellEvalType = {
  UNCHECKED : 0,
  CHECKED   : 1,
}

class GameCell extends Schema {
  constructor () {
      super();
      this.posType  = positionCellType.UNKNOWN;
      this.evalType = gameCellEvalType.UNCHECKED;
  }
}
schema.defineTypes(GameCell, {
  posType  : "number",
  evalType : "number",
});

exports.GameCell = GameCell;

class GameGrid extends Schema {
  constructor (nb_cells) {
      super();
      this.cells = new MapSchema();
      Utils.range(25).forEach((index, i) => {
        this.cells[index] = new GameCell();
      });
  }
}
schema.defineTypes(GameGrid, {
  cells : {map : GameCell},
});

exports.GameGrid = GameGrid;
