
exports.RoomGroup = class RoomGroup {

  constructor(arr_rooms) {
    this.arr_rooms = arr_rooms;
  }

  broadcast(type, message, options = null) {
    this.arr_rooms.forEach((room, i) => {
      room.broadcast(type, message, options);
    });
  }

}
