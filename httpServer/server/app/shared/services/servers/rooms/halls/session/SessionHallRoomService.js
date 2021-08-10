// import { RoomConnectionService } from '../../RoomConnectionService.js';


import { AbsRoomService } from '../../AbsRoomService.js';

import { ClientCommand } from '../../../ClientCommand.js';

import { Observed } from '../../../Observed.js';

// import { Observable, of, from } from 'rxjs';
// import {map} from 'rxjs/operators';
// import Rx from "rxjs/Rx";
console.log("rxjs", rxjs);
const Rx = rxjs;

export class SessionHallRoomService extends AbsRoomService {

  constructor(room) {
    super(room);

    this.configureRoomCommandHandlers(room.state.roomCommands);

    this.addRoomCommandHandler("two_step_with_portal", (data) => {
      const clientCommand = new ClientCommand(data.singleUseCommandName, data.singleUseCommandData)
      return this.sendCommand_p(clientCommand);
    });
    this.configureMoveToCommandHandlers(room.state.moveToConfigs);


    room.onMessage("answer", (message) => {
      console.log("B message received from server");
      console.log(message);

      //sucked-in
      const trapHole = message.trapHole;
      if(trapHole) {
        console.log("trapHole received", trapHole);
        const moveToConfig = trapHole.moveToConfig;
        this.moveToHelper.moveTo(moveToConfig);
      }

    });

  }


}
