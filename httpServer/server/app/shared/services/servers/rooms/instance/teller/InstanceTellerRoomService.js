// import { RoomConnectionService } from '../../RoomConnectionService.js';


import { AbsRoomService } from '../../AbsRoomService.js';

import { ClientCommand } from '../../../ClientCommand.js';

import { Observed } from '../../../Observed.js';

// import { Observable, of, from } from 'rxjs';
// import {map} from 'rxjs/operators';
// import Rx from "rxjs/Rx";
console.log("rxjs", rxjs);
const Rx = rxjs;

export class InstanceTellerRoomService extends AbsRoomService {

  constructor(room) {
    super(room);

    this.configureRoomCommandHandlers(room.state.roomCommands);
    this.configureMoveToCommandHandlers(room.state.moveToConfigs);

    room.onMessage("answer", (message) => {
      console.log("B message received from server");
      console.log(message);

      const commandAnswer = message.commandAnswer;
      if(commandAnswer != null) {
        const command = commandAnswer.command;
        if(command == "moveToNextRoom") {
          const moveToConfig = commandAnswer.payload;

          this.moveToHelper.moveTo(moveToConfig);
        }
      }

    });



    const rx_roomCommand_in = rxjs.fromEventPattern(
        (handler) => room.onMessage("room_command", handler)
    );
    this.rx_roomCommand_in = rx_roomCommand_in;



    //debug
    room.onMessage("something", (message) => {
      console.log("onMessage", "something", message);
    });


    const ReplaySubject = Rx.ReplaySubject;

    const rx_grid_game = new ReplaySubject(1);
    const grid_game = room.state.grid_game;
    console.log("initial grid_game", grid_game);
    rx_grid_game.next(grid_game);  //initial value
    this.rx_grid_game = rx_grid_game.asObservable();

    const rx_turn = new ReplaySubject(1);
    const turn = room.state.turn;
    console.log("initial turn", turn);
    rx_turn.next(turn);  //initial value
    this.rx_turn      = rx_turn.asObservable();

    const rx_gameInfo = new ReplaySubject(1);
    const gameInfo = room.state.gameInfo;
    console.log("initial gameInfo", gameInfo);
    rx_gameInfo.next(gameInfo);  //initial value
    this.rx_gameInfo  = rx_gameInfo.asObservable();


    room.state.onChange = (changes) => {
      changes.forEach(change => {
          console.log("room.state.onChange");
          console.log(change.field);
          console.log(change.previousValue);
          console.log(change.value);

          if(change.field == "grid_game") {
            const grid_game = room.state.grid_game;
            // this.observed_messages.notifyObservers(change.value);
            // this.observed_messages.notifyObservers(messageArray);
            rx_grid_game.next(grid_game);
          } else if(change.field == "turn") {
            const turn = room.state.turn;
            // this.observed_messages.notifyObservers(change.value);
            // this.observed_messages.notifyObservers(messageArray);
            rx_turn.next(turn);
          } else if(change.field == "gameInfo") {
            const turn = room.state.gameInfo;
            rx_gameInfo.next(gameInfo);
          }

      });
    };




    const rx_cell_change =  new Rx.Subject();
    room.state.grid_game.cells.onChange = (value, key) => {
      console.log("room.state.grid_game.cells.onChange", "changes", value, key);

      rx_cell_change.next({
        key: key,
        value: value,
      });
    };
    this.rx_cell_change = rx_cell_change.asObservable();

  }


}
