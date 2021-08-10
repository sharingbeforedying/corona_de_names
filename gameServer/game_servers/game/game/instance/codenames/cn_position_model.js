const positionCellType = {
    UNINITIALIZED : -1,

    NEUTRAL: 0,
    RED:     1,
    BLUE:    2,
    BLACK:   3,
}

class CnpGridModel {

  constructor(nb_cells/*, identifier=null*/) {
    this.nb_items = nb_cells;
    //this.startingTeam = startingTeam;

    var configObj = CnpGridModel.configForNbItems(this.nb_items);

    //-------red always starts---------

    // if(startingTeamId == "id_red") {
      configObj.red += 1;
    // } else if(startingTeamId == "id_blue") {
    //   configObj.blue += 1;
    // } else {
    //   console.log("starting team is unknown");
    // }

    // if(!identifier) {
      this.items      = CnpGridModel.random_items_array(this.nb_items,configObj);
      this.identifier = CnpGridModel.identifier_for_array(this.items);
    // } else {
    //   this.identifier = identifier;
    //   this.items      = CnpGridModel.items_array_for_identifier(identifier);
    // }

    this.cellModels = this.items.map((type, index) => new CnpCellModel(type,index));

  }

  static configForNbItems(nb_items) {
    var outConfig = null;
    if(nb_items == 20) {
      outConfig = {
        blue:7,
        red:7,
        gameover:1,
      };
    } else if(nb_items == 25) {
      outConfig = {
        blue:8,
        red:8,
        gameover:1,
      };
    } else {
      console.log("unknown nb of items");
    }
    return outConfig;
  }

  static random_items_array(nb_items, configObj) {
    var arr = Array(nb_items);

    var red      = new Array(configObj.red).fill(positionCellType.RED);
    var blue     = new Array(configObj.blue).fill(positionCellType.BLUE);
    var gameover = new Array(configObj.gameover).fill(positionCellType.BLACK);

    var slot_is_empty = function(item) {
      return item == null;
    }

    arr = CnpGridModel.injectItemsInEmptySlots(blue, arr, slot_is_empty);
    arr = CnpGridModel.injectItemsInEmptySlots(red, arr, slot_is_empty);
    arr = CnpGridModel.injectItemsInEmptySlots(gameover, arr, slot_is_empty);

    arr = Array.from(arr.keys()).map(index => arr[index] ? arr[index] : positionCellType.NEUTRAL);

    console.log(JSON.stringify(arr));

    return arr;
  }

  static randomIndex(arr) {
    return Math.floor(Math.random()*arr.length);
  }


  static injectItemsInEmptySlots(items, dst_array, slot_is_empty) {
    return items.reduce((acc,x) => CnpGridModel.injectItemInEmptySlot(x, acc, slot_is_empty), dst_array);
  }

  static injectItemInEmptySlot(item, dst_array, slot_is_empty) {
    var outArray = dst_array;

    var index    = CnpGridModel.randomIndex(outArray);
    var slot_elt = outArray[index];

    while(!slot_is_empty(slot_elt)) {
      index    = CnpGridModel.randomIndex(outArray);
      slot_elt = outArray[index];
    }

    outArray[index] = item;

    return outArray;
  }


  //identifier

  static identifier_for_array(arr) {
    var base4_string  = arr.join('');
    var base10_number = parseInt(base4_string, 4);
    return base10_number;
  }

  static items_array_for_identifier(identifier) {
    var base4_string = grid_id.toString(4);
    base4_string = base4_string.padStart(this.nb_items,"0");

    var items = base4_string.split('').map(x => parseInt(x));

    console.log(JSON.stringify(items));
    return items;
  }

  static random_identifier(nb_items, nb_blue, nb_red, nb_gameover, nb_blue_red) {
    var arr = CnpGridModel.random_items_array(nb_items, nb_blue, nb_red, nb_gameover, nb_blue_red);
    return CnpGridModel.identifier_for_array(arr);
  }


}
exports.CnpGridModel = CnpGridModel;

class CnpCellModel {

  constructor(type,index) {
    this.type  = type;
    this.index = index;
  }

}
exports.CnpCellModel = CnpCellModel;
