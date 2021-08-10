// import { Observed } from './Observed.js';
const Rx = rxjs;

// import { ClientCommand } from './ClientCommand.js';

// import { InstanceTellerRoomService }  from './rooms/instance/teller/InstanceTellerRoomService.js';
// import { InstanceGuesserRoomService } from './rooms/instance/guesser/InstanceGuesserRoomService.js';

export class FocusService {

  constructor() {

    this.sessionClientRoomService = null;

    // this.watchedRoomServices = [];
    // this.watchedRoomServices = {};

    this.rx_roomServiceWithFocus = new Rx.Subject();
  }

  forceFocusOn(roomService) {
    this.rx_roomServiceWithFocus.next(roomService);
  }

  watchRoomService(roomService) {
    // if(this.watchedRoomServices.includes(roomService)) {
    //     //already watched
    // } else {
    //   this.watchedRoomServices.push(roomService);
    // }

    const room = roomService.room;

    room.onStateChange((state) => {
      console.log("FocusService::watchRoomService", "onStateChange", state);
      if(state.focusOnMePlz) {
        console.log("state.focusOnMePlz == true");
        this.rx_roomServiceWithFocus.next(roomService);
      } else {
        console.log("state.focusOnMePlz == false");
      }
    });

  }

}
