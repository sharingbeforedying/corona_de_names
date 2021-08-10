
class RoomService {

  constructor(room, RoomService_in, RoomService_out) {
    this.room = room;

    this.in  = new RoomService_in(room);
    this.out = new RoomService_out(room);
  }

}
