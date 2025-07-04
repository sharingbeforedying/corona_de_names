const schema = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;

const Utils = require('../../../utils/Utils.js').Utils;

// const positionCellType = {
//     UNINITIALIZED : -1,
//
//     NEUTRAL: 0,
//     RED:     1,
//     BLUE:    2,
//     BLACK:   3,
// }
// exports.positionCellType = positionCellType;

class PositionCell extends Schema {
  constructor (type = -1) {
      super();
      this.type = type;
      this.color = null; //
  }
}
schema.defineTypes(PositionCell, {
  type  : "number",
  color : "string",
});

exports.PositionCell = PositionCell;

class PositionGrid extends Schema {
  constructor (nb_cells) {
      super();
      this.cells = new MapSchema();
      Utils.range(25).forEach((index, i) => {
        this.cells[index] = new PositionCell();
      });
  }

  // static default_grid() {
  //   const posGrid = new PositionGrid();
  //
  //   Object.keys(posGrid.cells).forEach((cellIndex, i) => {
  //     const cell = posGrid.cells[cellIndex];
  //     if(cellIndex % 5 == 0) {
  //       cell.type = positionCellType.RED;
  //     } else if(cellIndex % 2 == 0) {
  //       cell.type = positionCellType.BLUE;
  //     } else if(cellIndex == 13) {
  //       cell.type = positionCellType.BLACK;
  //     } else {
  //       cell.type = positionCellType.NEUTRAL;
  //     }
  //   });
  //
  //   return posGrid;
  // }
}
schema.defineTypes(PositionGrid, {
  cells : {map : PositionCell},
});

exports.PositionGrid = PositionGrid;
