const schema = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;


const Utils = require('../../../utils/Utils.js').Utils;

const positionCellType = {
    UNKNOWN : -1,

    NEUTRAL: 0,
    RED:     1,
    BLUE:    2,
    BLACK:   3,
}

const gameCellEvalType = {
  // UNCHECKED : 0,
  // CHECKED   : 1,

  UNCHECKED :     0,
  EXAMINED :      1,
  CHARACTERIZED : 2,
}
exports.gameCellEvalType = gameCellEvalType;

class GameCellExamination extends Schema {
  constructor (turnIndex, examiner, playerId) {
      super();
      this.turnIndex = turnIndex;
      this.examiner  = examiner;
      this.playerId  = playerId;
  }
}
schema.defineTypes(GameCellExamination, {
  turnIndex : "number",
  examiner  : "string",
  playerId  : "string",
});
exports.GameCellExamination = GameCellExamination;

class GameCell extends Schema {
  constructor () {
      super();
      this.posType  = positionCellType.UNKNOWN;
      this.evalType = gameCellEvalType.UNCHECKED;
      this.color    = null;//

      this.examinations = new ArraySchema();
      // this.examinations = new MapSchema();
  }
}
schema.defineTypes(GameCell, {
  posType  : "number",
  evalType : "number",
  color    : "string",

  examinations : [ GameCellExamination ],
  // examinations: { map : GameCellExamination },
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

  //debug
  name : "string",
});
exports.GameGrid = GameGrid;
