import { ServerService } from "../ServerService.js";

(function() {

  const _serverService = ServerService.getSharedInstance();
  const _navigationService = _serverService.navigationService;

  angular.module("awApp").service('navigationService', function() {

    this.onMovedToRoom = _navigationService.onMovedToRoom.bind(_navigationService);

    this.getCurrentRoomService = () => _navigationService.getCurrentRoomService();

    this.getRoomService = (roomServiceName) => _navigationService.getRoomService(roomServiceName);


    //pool
    // this.getRoomId   = (roomServiceClassname) => _navigationService.getRoomId(roomServiceClassname);
    this.getRoomService = (roomServiceName) => _navigationService.getRoomService(roomServiceName);
    this.getFromPool    = (roomName) => _navigationService.getFromPool(roomName);

    //debug
    this.navigationStack = _navigationService.navigationStack;

  });





  // angular.module("awApp").run(function(navigationService) {
  //   // serverService.enter();
  //   console.log("run", "currentRoomService", navigationService.getCurrentRoomService());
  // });

})();
