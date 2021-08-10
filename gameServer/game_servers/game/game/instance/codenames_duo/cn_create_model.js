class GameCreationModel {

  constructor() {
    this.teams        = [new TeamModel("red", "red", 1), new TeamModel("blue", "blue", 2)];
    this.startingTeam = null;

    this.gridModel    = null;

    this.nb_max_turns  = 0;
    this.nb_max_errors = 0;

    this.type = "";
  }

    configure(type, nb_cells, nb_max_turns, nb_max_errors, startingTeam) {
      this.type = type;
      this.nb_cells = nb_cells;
      this.nb_max_turns  = nb_max_turns;
      this.nb_max_errors = nb_max_errors;
      this.startingTeam = startingTeam;

      //this.gridModel = new CncGridModel(this.nb_cells);

      //test
      //this.nb_max_turns  = 1;
      //this.nb_max_errors  = 0;
    }
}

class SessionConfig {

  static cells_range() {
    return [20,25];
  }

  static turns_range() {
    return [...Array(11).keys()].map(index => index + 1);
  }

  static errors_range() {
    return [...Array(9 + 1).keys()].map(index => index);
  }
}

class CncGridModel {
  constructor(nb_cells) {
    this.nb_cells = nb_cells;
    //this.cellModels = new Array(this.nb_items).fill(new CncCellModel());
    this.cellModels = [];
  }
}

class CncCellModel {
  constructor() {
    this.type    = "img";
    this.content = "url";
  }
}

class ItemSource {
  constructor() {
    this.items = [];
  }

  addItems(items) {
    this.items = this.items.concat(items);
  };


  getRandomItems(count) {
    var indexSet = this.getRandomIndexSet(count);
    return indexSet.map(index => this.items[index]);
  }

  getRandomIndex(length) {
    return Math.floor(Math.random() * length);
  };

  getRandomIndexSet(count) {
    var indexSet = [];

    var numberToPick = Math.min(count, this.items.length);

    for (var i = 0; i < numberToPick; i++) {
      var index = this.getRandomIndex(this.items.length);
      while(indexSet.includes(index)) {
        index = this.getRandomIndex(this.items.length);
      }
      indexSet.push(index);
    }

    return indexSet;
  };

}

class Item {
  constructor(type, content) {
    this.type    = type;
    this.content = content;
  }

  static image(imgSrc) {
    return new Item("image", imgSrc);
  }

  static word(word) {
    return new Item("word", word);
  }
}
