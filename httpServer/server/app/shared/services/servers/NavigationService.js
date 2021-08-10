import { Observed } from './Observed.js';

import { ClientCommand } from './ClientCommand.js';

import { InstanceTellerRoomService }  from './rooms/instance/teller/InstanceTellerRoomService.js';
import { InstanceGuesserRoomService } from './rooms/instance/guesser/InstanceGuesserRoomService.js';

export class NavigationService {

  // constructor(roomService) {
  //   console.log("NavigationService", roomService);
  constructor() {

    this.navigationStack = [];

    this.observed_currentRoomService = new Observed();

    // this.commandHandlers = {};
    //back ?

    // this.moveForwardTo(roomService);
    // console.log("this.getCurrentRoomService()", this.getCurrentRoomService());

    //pool
    this.pool = {};
  }

  addToPool(roomService) {
    const room = roomService.room;
    const roomId = room.id;

    if(this.pool[roomId]) {
        //already being watched
        // throw new Error("roomService is already being watched");
        console.log("roomService is already being watched");
    } else {
      this.pool[roomId] = roomService;
    }
  }

  logPool() {
    console.log("logPool()");
    Object.entries(this.pool).map(([roomId, roomService]) => {
      console.log(roomId, roomService.constructor.name);
    })
  }

  getFromPool(roomId) {
    console.log("getFromPool", roomId);
    this.logPool();
    // const roomId = room.roomId;
    return this.pool[roomId];
  }

  removeFromPool(roomService) {
    const room   = roomService.room;
    const roomId = room.id;
    delete this.pool[roomId];
  }

  watchRoomService(roomService) {

    const room = roomService.room;
    const roomId = room.id;

    room.onLeave((code) => {
      console.log("FocusService", "client left the room");
      console.log("code", code);

      this.removeFromPool(roomService);

      // this.rx_roomServiceWithFocus.next(this.sessionClientRoomService);
    });

    room.onError((code, message) => {
      console.log("FocusService", "room.onError");
      console.log("code", code);
      console.log(message);

      this.removeFromPool(roomService);
    });
  }

  moveForwardTo(roomService) {
    this.navigationStack.push(roomService);

    if(roomService.room) {
      console.log("NavigationService", "moveForwardTo", roomService.room.id);
      this.addToPool(roomService);
      this.watchRoomService(roomService);
    }

    this.observed_currentRoomService.notifyObservers(this.getCurrentRoomService());
  }

  goBack() {
    this.navigationStack.pop();
    this.observed_currentRoomService.notifyObservers(this.getCurrentRoomService());
  }

  getCurrentRoomService() {
    return this.navigationStack[this.navigationStack.length - 1];
  }

  getRoomService(roomServiceName) {
    var outRoomService = null;

    console.log("roomServiceName", roomServiceName);

    if(roomServiceName == "guesser") {
      // return this.navigationStack[this.navigationStack.length - 1];
      outRoomService = this.navigationStack.find(roomService => {
        if(roomService.room) {
          console.log("roomService.room.state.roomType", roomService.room.state.roomType);
          return roomService.room && (roomService.room.state.roomType == 141);
        }
        return false;
      });
    }
    else if(roomServiceName == "teller") {
      // return this.navigationStack[this.navigationStack.length - 1];
      outRoomService = this.navigationStack.find(roomService => {
        if(roomService.room) {
          console.log("roomService.room.state.roomType", roomService.room.state.roomType);
          return roomService.room && (roomService.room.state.roomType == 131);
        }
        return false;
      });
    }

    console.log("outRoomService", outRoomService);

    return outRoomService;
  }

  ////callbacks

  onMovedToRoom(callback) {
    this.observed_currentRoomService.registerObserverCallback(callback);
  }

}
