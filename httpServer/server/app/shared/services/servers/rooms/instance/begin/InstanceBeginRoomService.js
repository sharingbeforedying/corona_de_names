// import { RoomConnectionService } from '../../RoomConnectionService.js';


import { AbsRoomService } from '../../AbsRoomService.js';

import { ClientCommand } from '../../../ClientCommand.js';

import { Observed } from '../../../Observed.js';

// import { Observable, of, from } from 'rxjs';
// import {map} from 'rxjs/operators';
// import Rx from "rxjs/Rx";
console.log("rxjs", rxjs);
const Rx = rxjs;

export class InstanceBeginRoomService extends AbsRoomService {

  constructor(room) {
    super(room);

    this.configureRoomCommandHandlers(room.state.roomCommands);
    this.configureMoveToCommandHandlers(room.state.moveToConfigs);

    room.onMessage("answer", (message) => {
      console.log("B message received from server");
      console.log(message);

      const commandAnswer = message.commandAnswer;
      if(commandAnswer) {
        const command = commandAnswer.command;
        if(command == "moveToNextRoom") {
          const moveToConfig = commandAnswer.payload;

          this.moveToHelper.moveTo(moveToConfig);
        }
      }

      //sucked-in
      const trapHole = message.trapHole;
      if(trapHole) {
        const moveToConfig = trapHole.moveToConfig;
        this.moveToHelper.moveTo(moveToConfig);
      }

    });



    const ReplaySubject = Rx.ReplaySubject;
    const rx_state = new ReplaySubject(1);

    const state = room.state;
    console.log("initial state", state);
    rx_state.next(state);  //initial value

    room.state.onChange = (changes) => {
      rx_state.next(room.state);
    };
    this.rx_state = rx_state.asObservable();


  }


}
