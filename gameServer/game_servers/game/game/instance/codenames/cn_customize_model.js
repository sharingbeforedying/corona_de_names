class CncuGridModel {

  constructor(gameCellModels) {
    this.cellModels = gameCellModels.map(gameCellModel => new CncuCellModel(gameCellModel));

    //this.json = (new TestJson()).json;
    this.json = null;

  }

/*
cell {
  index:
  type:
  content:
}
*/

  import_json(json) {
    console.log("import_json", json);
    this.json = json;

    var cells_obj = json["cells"];

    var gridModel = this;
    Object.keys(cells_obj).forEach(function(key,index) {
        var cellConfig = cells_obj[key];

        var cellModel = gridModel.cellModels[cellConfig.index];
        cellModel.configure(cellConfig);
    });

  }

  export_as_json() {
    var cell_dicts = this.cellModels.map(cellModel => cellModel.to_dict())
    var entries = cell_dicts.map(cell_dict => [cell_dict.index, cell_dict])
    var cells_obj = Object.fromEntries(entries);
    var grid_obj = {
      cells : cells_obj,
    };
    var json = JSON.stringify(grid_obj);
    //console.log(json);

    return json;
  }

}

/*
class TestJson {

  constructor() {
    this.json = {
      "cells" : {
        1 : {
          "imgSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAJCAIAAACExCpEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVChTY5DutMGDRqZ0pw0A4ZNOwQNf"
        },
        2 : {
          "imgSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAJCAIAAACExCpEAAAAAXNSR0IArsAAAAAAAAAAAAAAAAAxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVChTY5DutMGDRqZ0pw0A4ZNOwQNf"
        },
      },
    };
  }


}
*/


class CncuCellModel {

  constructor(gameCellModel) {
    this.gameCellModel = gameCellModel;

    this.cellConfig = {
      index: gameCellModel.getIndex(),
      type:"",
      content:"",
    };
  }

  getIndex() {
    return this.gameCellModel.getIndex();
  }

  to_dict() {
    return this.cellConfig;
  }

  configure(cellConfig) {
    console.log(cellConfig);

    this.cellConfig = cellConfig;

  }

}
