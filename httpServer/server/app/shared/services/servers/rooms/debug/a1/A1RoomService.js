// import { RoomConnectionService } from '../../RoomConnectionService.js';


import { AbsRoomService } from '../../AbsRoomService.js';

import { ClientCommand } from '../../../ClientCommand.js';

import { Observed } from '../../../Observed.js';

// import { Observable, of, from } from 'rxjs';
// import {map} from 'rxjs/operators';
// import Rx from "rxjs/Rx";
console.log("rxjs", rxjs);
const Rx = rxjs;

export class A1RoomService extends AbsRoomService {

  constructor(room) {
    super(room);

    this.configureRoomCommandHandlers(room.state.roomCommands);




    this.addRoomCommandHandler("two_step_with_portal", (data) => {
      const clientCommand = new ClientCommand(data.singleUseCommandName, data.singleUseCommandData)
      return this.sendCommand_p(clientCommand);
    });
    this.configureMoveToCommandHandlers(room.state.moveToConfigs);




    // room.state.messageArray.onChange((changes) => {
    //
    // });

    // const Subject = Rx.Subject;
    // const rx_messages = new Subject();

    // const BehaviorSubject = Rx.BehaviorSubject;
    // const rx_messages = new BehaviorSubject();

    const ReplaySubject = Rx.ReplaySubject;
    const rx_group = new ReplaySubject(1);

    const group = room.state.group;
    console.log("initial group", group);
    rx_group.next(group);  //initial value

    room.state.onChange = (changes) => {
      console.log("A1RoomService", "room.state.onChange", room.state);

      changes.forEach(change => {

          if(change.field == "group") {
            const group = room.state.group;
            rx_group.next(group);
          }

      });
    };
    this.rx_group = rx_group.asObservable();

    // this.testRx();

    // rx_messages.subscribe({
    //   next(x) { console.log('xxx got value ' + x); },
    //   error(err) { console.error('something wrong occurred: ' + err); },
    //   complete() { console.log('done'); }
    // });
  }

  ////callbacks

  onChatMessagesChange(callback) {
    this.observed_messages.registerObserverCallback(callback);
  }


}
