class GameCreationModel {

  constructor(orderedInstanceTeams, nb_cells) {
    this.nb_cells = nb_cells;
    this.teams = orderedInstanceTeams;

    this.gridModel = null;
  }

  static default(orderedInstanceTeams, nb_cells) {
    const gameCreationModel = new GameCreationModel(orderedInstanceTeams, nb_cells);

    this.gridModel = CncGridModel.default(nb_cells);

    return gameCreationModel;
  }

}
exports.GameCreationModel = GameCreationModel;

class CncGridModel {
  constructor(nb_cells) {
    this.nb_cells = nb_cells;
    this.cellModels = new Array(this.nb_items).fill(new CncCellModel());
  }

  static default(nb_cells) {
    const gridModel = new CncGridModel();

    gridModel.cellModels.forEach((cell, i) => {
      cell.type = 0;
    });

    return gridModel;
  }
}
exports.CncGridModel = CncGridModel;

class CncCellModel {
  constructor(type=null) {
    this.type = null;
  }
}
exports.CncCellModel = CncCellModel;
