export class Observed {
  constructor() {
    this.observerCallbacks = [];

    //register an observer
    this.registerObserverCallback = function(callback){
      this.observerCallbacks.push(callback);
    };

    //call this when you know 'foo' has been changed
    this.notifyObservers = function(...params) {
      this.observerCallbacks.forEach((callback,i) => {callback(...params);});
    };
  }
}
