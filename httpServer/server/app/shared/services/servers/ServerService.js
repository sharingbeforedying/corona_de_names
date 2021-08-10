// import { RoomServiceFactory } from "./rooms/RoomServiceFactory.js";

import { NavigationService } from "./NavigationService.js";
import { NavRoomServiceFactory } from "./rooms/NavRoomServiceFactory.js";

export const ServerService = (function () {
    var instance;

    class ServerService_ {

      //lol; // this will kill app on tablet

      constructor(welcomeRooms) {
        console.log("ServerService_()", welcomeRooms);

        const navigationService   = new NavigationService();
        console.log("ServerService_", "a");

        const roomFactory         = new NavRoomServiceFactory(navigationService);
        // const moveToHelper        = new MoveToHelper(roomFactory, navigationService);
        console.log("ServerService_", "b");

        const universeRoomService = roomFactory.createUniverseRoomService(welcomeRooms);

        this.navigationService = navigationService;
      }
    }

    function createInstance() {
      console.log("createInstance");

      const welcomeRoomAccess_a1 = {
        roomPort:    2567,
        roomName:    "welcome_room_a1",
        passphrase : "i_have_token_a_shower",
      };

      const moveToConfig_w_a1 = {
        name: "w_a1",
        targetRoomType : 0,
        connectionConfig : welcomeRoomAccess_a1,
      };

      const welcomeRooms = {
        "a1" : moveToConfig_w_a1,
      };

      var object = new ServerService_(welcomeRooms);
      return object;
    }

    return {
        getSharedInstance: function () {
            if (!instance) {
              instance = createInstance();
            }
            return instance;
        }
    };
})();
