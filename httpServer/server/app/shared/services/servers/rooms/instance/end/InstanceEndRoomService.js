// import { RoomConnectionService } from '../../RoomConnectionService.js';


import { AbsRoomService } from '../../AbsRoomService.js';

import { ClientCommand } from '../../../ClientCommand.js';

import { Observed } from '../../../Observed.js';

// import { Observable, of, from } from 'rxjs';
// import {map} from 'rxjs/operators';
// import Rx from "rxjs/Rx";
console.log("rxjs", rxjs);
const Rx = rxjs;

export class InstanceEndRoomService extends AbsRoomService {

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


    // const ReplaySubject = Rx.ReplaySubject;
    // const rx_teamsConfig = new ReplaySubject(1);
    //
    // const teamsConfig = room.state.teamsConfig;
    // console.log("initial teamsConfig", teamsConfig);
    // rx_teamsConfig.next(teamsConfig);  //initial value
    //
    // room.state.onChange = (changes) => {
    //   changes.forEach(change => {
    //       console.log(change.field);
    //       console.log(change.previousValue);
    //       console.log(change.value);
    //
    //       if(change.field == "teamsConfig") {
    //         const teamsConfig = room.state.teamsConfig;
    //         // this.observed_messages.notifyObservers(change.value);
    //         // this.observed_messages.notifyObservers(messageArray);
    //         rx_teamsConfig.next(teamsConfig);
    //       }
    //
    //   });
    // };
    // this.rx_teamsConfig = rx_teamsConfig.asObservable();


  }


}
