class NumberPickerModel {

  constructor(min,max, initial, numberDidUpdate) {
    this.min = min;
    this.max = max;
    this.number = initial;

    this.numberDidUpdate = numberDidUpdate;
  }

  updateWith(updateFunction) {
    const prev = this.number;
    updateFunction();
    this.checkUpdate(prev, this.number);
  }

  checkUpdate(prev, val) {
    if(val != prev) {
      this.numberDidUpdate(val);
    }
  }




  inc() {
    this.updateWith(() => {
      this.number = Math.min(this.number + 1,this.max);
    });
  }

  dec() {
    this.updateWith(() => {
      this.number = Math.max(this.number - 1,this.min);
    });
  }

}
