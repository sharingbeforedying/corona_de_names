class ItemSource {
  constructor() {
    this.items = [];
  }

  addItems(items) {
    this.items = this.items.concat(items);
    return this;
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



//exports
module.exports.ItemSource = ItemSource
