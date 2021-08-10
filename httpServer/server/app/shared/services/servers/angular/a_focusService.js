import { FocusService } from "../FocusService.js";

(function() {

  const _focusService = new FocusService();

  angular.module("awApp").service('focusService', function(navigationService) {

    this.rx_roomServiceWithFocus = _focusService.rx_roomServiceWithFocus;

    navigationService.onMovedToRoom((roomService) => {

      if(roomService.room.state.roomType == /*51*/ 22) {
        console.log("setting sessionClientRoomService");
        _focusService.sessionClientRoomService = roomService;
      }

      if("focusOnMePlz" in roomService.room.state) {
        console.log("focusOnMePlz", "in", roomService.room.state);
        _focusService.watchRoomService(roomService);

        // //deeper into the dirty code
        // //{
        // if(!_focusService.debug__got_my_screen) {
        //   _focusService.forceFocusOn(roomService);
        // } else {
        //   //ignored
        // }
        // _focusService.debug__got_my_screen = true;
        // //}

        const focusOnMePlz = roomService.room.state.focusOnMePlz;
        if(focusOnMePlz) {
          _focusService.forceFocusOn(roomService);
        }

      } else {
        _focusService.forceFocusOn(roomService);
      }

    });

  });

})();
