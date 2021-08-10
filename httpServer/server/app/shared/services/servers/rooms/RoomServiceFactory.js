import { AbsRoomServiceFactory } from './AbsRoomServiceFactory.js';

import { UniverseRoomService } from './universe/UniverseRoomService.js';

import { WelcomeRoomService } from './welcome/WelcomeRoomService.js';
import { PortalRoomService }  from './portal/PortalRoomService.js';
import { ClientRoomService }  from './client/ClientRoomService.js';

import { ChatRoomService }    from './chat/ChatRoomService.js';


//halls
import { A1RoomService }      from './debug/a1/A1RoomService.js';
import { C1RoomService }      from './debug/c1/C1RoomService.js';
import { SessionHallRoomService } from './halls/session/SessionHallRoomService.js';

//---
// import { SessionListRoomService } from './sessionList/SessionListRoomService.js';
import { SessionRoomService } from './session/SessionRoomService.js';

import { TeamsConfigRoomService } from './teamsConfig/TeamsConfigRoomService.js';
import { ContentConfigRoomService } from './contentConfig/ContentConfigRoomService.js';

import { InstanceBeginRoomService }   from './instance/begin/InstanceBeginRoomService.js';
import { InstanceTellerRoomService }  from './instance/teller/InstanceTellerRoomService.js';
import { InstanceGuesserRoomService } from './instance/guesser/InstanceGuesserRoomService.js';
import { InstanceEndRoomService }   from './instance/end/InstanceEndRoomService.js';




// import { MoveToHelper }  from '../MoveToHelper.js';

export class RoomServiceFactory extends AbsRoomServiceFactory {

  static roomServiceClassForRoomType(roomType) {
    console.log("roomServiceClass for roomType:", roomType);

    if(roomType == null) {
      throw new Error("roomType is null");
    }

    switch(roomType) {
      // case -1:
      //   return UniverseRoomService;
      //   break;

      case 0:
        return WelcomeRoomService;
        break;
      case 1:
        return PortalRoomService;
        break;
      case 2:
        return ClientRoomService;
        break;
      case 3:
        return ChatRoomService;
        break;

      case 21:
        return A1RoomService;
        break;
      case 22:
        return C1RoomService;
        break;
      case 23:
        return SessionHallRoomService;
        break;

      //sessionList
      // case 41:
      //   return SessionListRoomService;
      //   break;

      //session
      case 51:
        return SessionRoomService;
        break;

      //instance config
      case 61:
        return TeamsConfigRoomService;
        break;
      case 62:
        return ContentConfigRoomService;
        break;

      //instance
      case 101:
        return InstanceBeginRoomService;
        break;

      case 131:
        return InstanceTellerRoomService;
        break;
      case 141:
        return InstanceGuesserRoomService;
        break;

      case 191:
        return InstanceEndRoomService;
        break;

      default:
        throw new Error("unknwon roomServiceClass for roomType:", roomType);
        break;
    }
  }

  static roomServiceClassForRoom_p(room) {

    return new Promise((resolve, reject) => {

      room.onStateChange.once((state) => {

        try {
          const roomType = state.roomType;
          const roomServiceClass = this.roomServiceClassForRoomType(roomType);
          resolve(roomServiceClass);
        }
        catch(e) {
          reject(e);
        }

      });

    });

  }

  static createRoomService_p(room) {
    console.log("RoomServiceFactory", "createRoomService", "room", room);

    return this.roomServiceClassForRoom_p(room)
               .then(roomServiceClass => {
                 const roomService = new (roomServiceClass)(room);
                 // roomService.moveToHelper = new MoveToHelper(roomService, this, this.navigationService);
                 return roomService;
               });
  }

  static createUniverseRoomService(config) {
    const roomService = new UniverseRoomService(config);
    // roomService.moveToHelper = new MoveToHelper(roomService, this);
    return roomService;
  }

}
