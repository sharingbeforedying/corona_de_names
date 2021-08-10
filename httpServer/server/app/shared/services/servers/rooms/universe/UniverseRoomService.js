import { AbsRoomService } from '../AbsRoomService.js';

export class UniverseRoomService extends AbsRoomService {

  constructor(welcomeRooms) {
    super(null);

    this.registerWelcomeRooms(welcomeRooms);
  }

  registerWelcomeRooms(welcomeRooms) {
    Object.entries(welcomeRooms).forEach(([serverName, moveToConfig], i) => {

      const roomName = moveToConfig.connectionConfig.roomName;

      this.addMoveToCommandHandler("go_to" + "_" + serverName + "_" + "welcome_room" + "_" + roomName, (data) => {
        // this.connectTo_welcome(welcomeRoomAccess);
        console.log("UniverseRoomService", "uuuloliloluuu");
        this.moveToHelper.moveTo(moveToConfig);
      });

    });
  }


}
