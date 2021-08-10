const colyseus = require('colyseus');

// const LinkedRoom = require("../LinkedRoom.js").LinkedRoom;

// const onChange = require('on-change');

exports.RoomEquipment = class RoomEquipment {

  constructor() {

    this.states = {};


  }

  //injection

  static prepareRoomForEquipments(room) {
    room.equipments = {};

    //room.onMessage =
  }

  static installEquipment(room, roomEquipment) {

  }

}
