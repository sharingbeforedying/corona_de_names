class CncuGridModel {

  constructor(nb_cells) {
    this.cellModels = contentCellModels.map(contentCellModel => new CncuCellModel(index));

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




class CncuCellModel {

  constructor(index) {
    this.index   = 0;
    this.type    = -1;
    this.content = null;
  }

}
