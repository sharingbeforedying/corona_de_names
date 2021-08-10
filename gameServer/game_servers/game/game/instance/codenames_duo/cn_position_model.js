class CnpGridModel {

  constructor(nb_cells/*, identifier=null*/) {
    this.nb_items = nb_cells;
    //this.startingTeam = startingTeam;

    var configObj = CnpGridModel.configForNbItems(this.nb_items);

    // if(!identifier) {
      this.items      = CnpGridModel.random_items_array(this.nb_items,configObj);
      this.identifier = CnpGridModel.identifier_for_array(this.items);
    // } else {
    //   this.identifier = identifier;
    //   this.items      = CnpGridModel.items_array_for_identifier(identifier);
    // }

    this.cellModels = this.items.map((type, index) => new CnpCellModel(type,index));

    this.cellModels_red = this.items.map(item => {
      var outItem = item;
      switch(item) {
        case 0:
        outItem = 0;
        break;
        case 1:
        outItem = 1;
        break;
        case 2:
        outItem = 0;
        break;
        case 3:
        outItem = 3;
        break;
        case 4:
        outItem = 1;
        break;
        case 5:
        outItem = 3;
        break;
        case 6:
        outItem = 3;
        break;
        case 7:
        outItem = 1;
        break;
        case 8:
        outItem = 0;
        break;
        default:
          outItem = "jizejiozjeiofj";
          break;
      }
      return outItem;
    }).map((type, index) => new CnpCellModel(type,index));

    this.cellModels_blue  = this.items.map(item => {
      var outItem = item;
      switch(item) {
        case 0:
        outItem = 0;
        break;
        case 1:
        outItem = 0;
        break;
        case 2:
        outItem = 2;
        break;
        case 3:
        outItem = 3;
        break;
        case 4:
        outItem = 2;
        break;
        case 5:
        outItem = 2;
        break;
        case 6:
        outItem = 0;
        break;
        case 7:
        outItem = 3;
        break;
        case 8:
        outItem = 3;
        break;
        default:
          outItem = "jizejiozjeiofj";
          break;
      }
      return outItem;
    }).map((type, index) => new CnpCellModel(type,index));

    console.log(this.cellModels_blue);
    console.log(this.cellModels_red);

  }

  static configForNbItems(nb_items) {
    var outConfig = null;
    if(nb_items == 20) {
      outConfig = {
        blue:4,
        red:4,
        gameover:1,
        blue_red:2,
        red_g__blue:1,
        red_g__n:1,
        blue_g__red:1,
        blue_g__n:1,
      };
    } else if(nb_items == 25) {
      outConfig = {
        blue:5,
        red:5,
        gameover:1,
        blue_red:3,
        red_g__blue:1,
        red_g__n:1,
        blue_g__red:1,
        blue_g__n:1,
      };
    } else {
      console.log("unknown nb of items");
    }
    return outConfig;
  }

  static random_items_array(nb_items, configObj) {
    var arr = Array(nb_items);

    var red      = new Array(configObj.red).fill(1);
    var blue     = new Array(configObj.blue).fill(2);
    var gameover = new Array(configObj.gameover).fill(3);

    var blue_red = new Array(configObj.blue_red).fill(4);

    var red_g__blue = new Array(configObj.red_g__blue).fill(5);
    var red_g__n    = new Array(configObj.red_g__n).fill(6);

    var blue_g__red = new Array(configObj.blue_g__red).fill(7);
    var blue_g__n   = new Array(configObj.blue_g__n).fill(8);


    var slot_is_empty = function(item) {
      return item == null;
    }

    arr = CnpGridModel.injectItemsInEmptySlots(blue, arr, slot_is_empty);
    arr = CnpGridModel.injectItemsInEmptySlots(red, arr, slot_is_empty);
    arr = CnpGridModel.injectItemsInEmptySlots(gameover, arr, slot_is_empty);
    arr = CnpGridModel.injectItemsInEmptySlots(blue_red, arr, slot_is_empty);

    arr = CnpGridModel.injectItemsInEmptySlots(red_g__blue, arr, slot_is_empty);
    arr = CnpGridModel.injectItemsInEmptySlots(red_g__n, arr, slot_is_empty);
    arr = CnpGridModel.injectItemsInEmptySlots(blue_g__red, arr, slot_is_empty);
    arr = CnpGridModel.injectItemsInEmptySlots(blue_g__n, arr, slot_is_empty);

    arr = Array.from(arr.keys()).map(index => arr[index] ? arr[index] : 0);

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

class CnpCellModel {
  constructor(type,index) {
    this.type  = type;
    this.index = index;
  }
}

exports.CnpGridModel = CnpGridModel;
exports.CnpCellModel = CnpCellModel;
