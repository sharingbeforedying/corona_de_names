const deasync = require('deasync');

class RoomFactory {

    constructor (gameServer, matchMaker, port) {
        this.gameServer = gameServer;
        this.matchMaker = matchMaker;

        this.port = port;
    }

    currentRoomsInfo() {
      const roomCaches = this.matchMaker.driver.find({});
      const rooms = roomCaches.map(roomCache => this.matchMaker.getRoomById(roomCache.roomId));
      const roomsInfoEntries = rooms.map(room => {
        const roomInfo = {
          ctor: room.constructor.name,
          name: room.roomName,
          id:   room.roomId,
        };
        return [room.roomId, roomInfo];
      });
      return Object.fromEntries(roomsInfoEntries);
    }

    logRooms() {
      const roomsInfo = this.currentRoomsInfo();
      console.log("RoomFactory", "roomsInfo", roomsInfo);
    }

    openRoom(roomName, roomClass, options) {
      console.log("RoomFactory", "openRoom", roomName, roomClass);

      // this.logRooms();

      /*return*/ this.gameServer.define(roomName, roomClass, options);

      // const optionsWithClose = Object.assign(options, {close : close});
      // this.gameServer.define(roomName, closableMixin(roomClass), optionsWithClose);

      // const closeFunc = (room) => this.closeRoom(room);
      // const closableMixin = Base => class extends Base {
      //   didDispose() {
      //     super.didDispose();
      //     console.log(Base.constructor.name, "closableMixin", "didDispose");
      //     closeFunc(this);
      //   }
      // };
      // this.gameServer.define(roomName, closableMixin(roomClass), options);
    }

    sync_matchMaker_createRoom(roomName, seatReservationOptions) {

      const a_createRoom = (roomName, seatReservationOptions, cb) => {
          this.matchMaker.createRoom(roomName, seatReservationOptions)
                         .then(roomCache => {
                           cb(null, roomCache);
                         })
                         .catch(error => {
                           cb(error, null);
                         });
      };

      /* conventional API signature : function(p1,...pn,function cb(error,result){})*/
      const asyncFunc = a_createRoom;

      const syncFunc = deasync(asyncFunc);
      return syncFunc(roomName, seatReservationOptions);
    }

    createRoom(roomName, roomClass, options, seatReservationOptions) {
      this.openRoom(roomName, roomClass, options);
      const roomCache = this.sync_matchMaker_createRoom(roomName, seatReservationOptions);
      const room = this.matchMaker.getRoomById(roomCache.roomId);

      room.$factory = this;

      console.log("RoomFactory", "did create", room.constructor.name, room.roomName, room.roomId);
      // this.logRooms();

      return room;
    }

    //this is done automatically by matchMaker
    // closeRoom(room) {
    //   console.log("roomFactory", "closeRoom", room.__proto__.name, room.roomName);
    //   // this.logRooms();
    //   this.matchMaker.removeRoomType(room.roomName);
    // }

}
exports.RoomFactory = RoomFactory;
