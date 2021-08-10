const colyseus = require('colyseus');
// const ClientState  = require('./ClientState.js').ClientState;

const SharedRoom  = require('../../sharedRoom/SharedRoom.js').SharedRoom;

const PlayRoomState = require('./PlayRoomState.js').PlayRoomState;

exports.PlayRoom = class PlayRoom extends SharedRoom {

  constructor(presence) {
    super();
  }

  onCreate (options) {
    super.onCreate(options);

    this.setState(new PlayRoomState());
  }

  onJoin (client, options) {
    super.onJoin(client, options);
    this.state.connected += 1;
  }

  // onMessage (client, message) {
  //   super.onMessage(client, message);
  //
  // }

  onLeave (client, consented) {
    super.onLeave(client, options);
    this.state.connected -= 1;
  }

  // onDispose() {
  //   super.onDispose();
  //
  // }


}
