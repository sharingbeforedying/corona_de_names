(function () {

angular.module("awApp").service('gameRoomClientService_incoming', function(gameService) {
  console.log("gameRoomClientService_incoming");




  //DI:
  console.log("gameRoomClientService_incoming", "interface injection");
  console.log("gameRoomClientService_incoming", "interface", Object.keys(this.interface));
  Object.keys(this.interface).forEach((fkey, i) => {
    gameService[fkey] = this.interface[fkey];
  });

  this.registerObserverCallback((serviceName) => {
    gameService.notifyObservers();
  });

});








angular.module("awApp").service('gameRoomClientService_outgoing', function(gameRoomClientService_incoming, gameService) {
  console.log("gameRoomClientService_outgoing");

    //DI:
    console.log("gameRoomClientService_outgoing", "interface injection");
    console.log("gameRoomClientService_outgoing", "interface", Object.keys(this.interface));
    Object.keys(this.interface).forEach((fkey, i) => {
      gameService[fkey] = this.interface[fkey];
    });
  };


});

angular.module("awApp").service('gameRoomClientService', function(gameRoomClientService_incoming, gameRoomClientService_outgoing) {
  console.log('gameRoomClientService');

  this.bindToRoom = function(room) {

    //in




  }

});

//initialize the service(s)
angular.module("awApp").run(function (gameRoomClientService) {
  console.log("run");
  //this will induce the dependency injections
});

})();
