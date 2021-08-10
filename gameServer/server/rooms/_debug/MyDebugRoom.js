const colyseus = require('colyseus');
const MyDebugState  = require('./MyDebugState.js').MyDebugState;

exports.MyDebugRoom = class extends colyseus.Room {

  constructor(presence) {
    super();

    //const state = new MyDebugState();
    const state = MyDebugState.using_schema2();
    console.log("state", state);
    try {
      this.setState(state);
    } catch(e) {
      console.log(e);
    }

  }

  onCreate (options) {
    console.log("onCreate");
  }

  onJoin (client, options) {
    console.log("onJoin");
  }

  handleMessage (client, message) {
    console.log("onMessage");

    //this.state.
  }

  onLeave (client, consented) {
    console.log("onLeave");
  }

  onDispose() {
    console.log("onDispose");
  }

}
