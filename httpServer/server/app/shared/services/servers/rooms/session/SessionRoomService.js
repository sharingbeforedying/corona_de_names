// import { RoomConnectionService } from '../../RoomConnectionService.js';


import { AbsRoomService } from '../AbsRoomService.js';

import { ClientCommand } from '../../ClientCommand.js';

import { Observed } from '../../Observed.js';

// import { Observable, of, from } from 'rxjs';
// import {map} from 'rxjs/operators';
// import Rx from "rxjs/Rx";
console.log("rxjs", rxjs);
const Rx = rxjs;

export class SessionRoomService extends AbsRoomService {

  constructor(room) {
    super(room);

    this.configureRoomCommandHandlers(room.state.roomCommands);
    this.configureMoveToCommandHandlers(room.state.moveToConfigs);

    this.observed_messages = new Observed();

    // room.state.messageArray.onChange((changes) => {
    //
    // });

    // const Subject = Rx.Subject;
    // const rx_messages = new Subject();

    // const BehaviorSubject = Rx.BehaviorSubject;
    // const rx_messages = new BehaviorSubject();

    const ReplaySubject = Rx.ReplaySubject;
    const rx_messages = new ReplaySubject(1);

    const messageArray = room.state.messageArray;
    console.log("initial message array", messageArray);
    rx_messages.next(messageArray);  //initial value

    room.state.onChange = (changes) => {
      changes.forEach(change => {
          console.log(change.field);
          console.log(change.previousValue);
          console.log(change.value);

          if(change.field == "messageArray") {
            const messageArray = room.state.messageArray;
            // this.observed_messages.notifyObservers(change.value);
            // this.observed_messages.notifyObservers(messageArray);
            rx_messages.next(messageArray);
          }

      });
    };
    this.rx_messages = rx_messages.asObservable();

    // this.testRx();

    // rx_messages.subscribe({
    //   next(x) { console.log('xxx got value ' + x); },
    //   error(err) { console.error('something wrong occurred: ' + err); },
    //   complete() { console.log('done'); }
    // });
  }

  testRx() {
    // import { Observable } from 'rxjs';
    const Observable = Rx.Observable;

    const observable = new Observable(subscriber => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);
      setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
      }, 1000);
    });

    console.log('just before subscribe');
    observable.subscribe({
      next(x) { console.log('got value ' + x); },
      error(err) { console.error('something wrong occurred: ' + err); },
      complete() { console.log('done'); }
    });
    console.log('just after subscribe');



    const Subject = Rx.Subject;

    const subject = new Subject();
    subject.next(10);
    subject.error(new Error("lolilol"));

    subject.subscribe({
      next(x) { console.log('got value ' + x); },
      error(err) { console.error('something wrong occurred: ' + err); },
      complete() { console.log('done'); }
    });

  }

  ////callbacks

  onChatMessagesChange(callback) {
    this.observed_messages.registerObserverCallback(callback);
  }


}
