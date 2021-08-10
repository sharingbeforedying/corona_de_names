import { RoomServiceFactory } from './RoomServiceFactory.js';

import { MoveToHelper }  from '../MoveToHelper.js';

export class NavRoomServiceFactory {

  constructor(navigationService) {
    this.navigationService = navigationService;

    this.currentClientRoomService = null;
  }

  roomServiceClassForRoomType(roomType) {
    return RoomServiceFactory.roomServiceClassForRoomType(roomType);
  }

  createRoomService_p(room) {
    console.log("NavRoomServiceFactory", "createRoomService");

    const navigationService = this.navigationService;

    return RoomServiceFactory.roomServiceClassForRoom_p(room)
               .then(roomServiceClass => new (roomServiceClass)(room))
               .then(roomService => {
                 console.log("roomService", roomService);

                 const clientRoomService = navigationService.currentClientRoomService;
                 console.log("navigationService.currentClientRoomService", navigationService.currentClientRoomService);
                 roomService.moveToHelper = new MoveToHelper(clientRoomService, this, navigationService);

                 console.log("roomService.room.state", roomService.room.state);
                 const state = roomService.room.state;
                 if(state.isClientRoomState) {
                   console.log("isClientRoomState == true");
                   navigationService.currentClientRoomService = roomService;
                 } else {
                   console.log("isClientRoomState == false");
                 }

                 return roomService;
               });
  }

  createUniverseRoomService(config) {
    const roomService = RoomServiceFactory.createUniverseRoomService(config);
    roomService.moveToHelper = new MoveToHelper(null, this, this.navigationService);

    this.navigationService.moveForwardTo(roomService);

    return roomService;
  }




  // currentClientRoomService_p() {
  //   console.log("NavRoomServiceFactory" ,"parentClientRoomService");
  //   const parentClientRoomService = navigationService.navigationStack.reverse().find((roomService) => {
  //     console.log("roomService", roomService.constructor.name);
  //     if(roomService.state) { //to do: state_p
  //       console.log("roomService.state != null");
  //       const isClientRoomService = roomService.isClientRoomState;
  //       console.log("isClientRoomService:", isClientRoomService);
  //       return isClientRoomService;
  //     } else {
  //       console.log("roomService.state == null");
  //       return false;
  //     }
  //   });
  // }

}
