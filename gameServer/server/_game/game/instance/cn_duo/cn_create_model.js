class GameCreationModel {

  constructor(orderedInstanceTeams, nb_cells, nb_max_turns, nb_max_errors) {
    // this.teams        = [new TeamModel("red", "red", 1), new TeamModel("blue", "blue", 2)];
    // this.startingTeam = null;
    this.nb_cells = nb_cells;
    this.teams    = orderedInstanceTeams;

    this.nb_max_turns  = nb_max_turns;
    this.nb_max_errors = nb_max_errors;

    this.gridModel    = null;

    // this.type = "";
  }

  static default(orderedInstanceTeams, nb_cells) {
    const nb_max_turns__default  = 9;
    //debug
    // const nb_max_turns__default  = 1;
    // const nb_max_turns__default  = 2;

    const nb_max_errors__default = 9;

    const gameCreationModel = new GameCreationModel(orderedInstanceTeams, nb_cells, nb_max_turns__default, nb_max_errors__default);

    this.gridModel = CncGridModel.default(nb_cells);

    return gameCreationModel;
  }
}
exports.GameCreationModel = GameCreationModel;

// class SessionConfig {
//
//   static cells_range() {
//     return [20,25];
//   }
//
//   static turns_range() {
//     return [...Array(11).keys()].map(index => index + 1);
//   }
//
//   static errors_range() {
//     return [...Array(9 + 1).keys()].map(index => index);
//   }
// }

class CncGridModel {
  constructor(nb_cells) {
    this.nb_cells = nb_cells;
    //this.cellModels = new Array(this.nb_items).fill(new CncCellModel());
    this.cellModels = [];
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
  constructor() {
    this.type    = "img";
    this.content = "url";
  }
}
exports.CncCellModel = CncCellModel;


// class ItemSource {
//   constructor() {
//     this.items = [];
//   }
//
//   addItems(items) {
//     this.items = this.items.concat(items);
//   };
//
//
//   getRandomItems(count) {
//     var indexSet = this.getRandomIndexSet(count);
//     return indexSet.map(index => this.items[index]);
//   }
//
//   getRandomIndex(length) {
//     return Math.floor(Math.random() * length);
//   };
//
//   getRandomIndexSet(count) {
//     var indexSet = [];
//
//     var numberToPick = Math.min(count, this.items.length);
//
//     for (var i = 0; i < numberToPick; i++) {
//       var index = this.getRandomIndex(this.items.length);
//       while(indexSet.includes(index)) {
//         index = this.getRandomIndex(this.items.length);
//       }
//       indexSet.push(index);
//     }
//
//     return indexSet;
//   };
//
// }
//
// class Item {
//   constructor(type, content) {
//     this.type    = type;
//     this.content = content;
//   }
//
//   static image(imgSrc) {
//     return new Item("image", imgSrc);
//   }
//
//   static word(word) {
//     return new Item("word", word);
//   }
// }
