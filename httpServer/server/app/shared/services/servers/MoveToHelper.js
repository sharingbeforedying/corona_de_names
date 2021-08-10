import { AbsMoveToHelper } from './AbsMoveToHelper.js';

import { RoomConnectionService } from './RoomConnectionService.js';

// import { ServerService } from './ServerService.js';
// const navigationService = ServerService.getSharedInstance().navigationService;

import { ClientCommand } from './ClientCommand.js';

export class MoveToHelper extends AbsMoveToHelper {

  constructor(clientRoomService, roomServiceFactory, navigationService) {
    super();
    this.clientRoomService = clientRoomService;

    this.roomServiceFactory = roomServiceFactory;
    this.navigationService  = navigationService;
  }

  moveTo(moveToConfig) {
    console.log("MoveToHelper::moveTo", moveToConfig);

    const roomServiceClass = this.roomServiceFactory.roomServiceClassForRoomType(moveToConfig.targetRoomType);
    if(!roomServiceClass) {
      throw new Error("roomServiceClass == null for targetRoomType:", targetRoomType);
    }

    switch(moveToConfig.targetRoomType) {
      case 0:
        // this.moveToWelcomeRoom(moveToConfig);
        this.connectTo_welcome(moveToConfig.connectionConfig);
        break;
      case 1:
        // this.moveToPortalRoom(moveToConfig);
        this.connectTo_portal(moveToConfig.connectionConfig);
        break;
      case 2:
      case 21:
      case 22:
      case 23:
        // this.moveToClientRoom(moveToConfig);
        this.connectTo_client(moveToConfig.connectionConfig);
        break;

      case 3:
      case 41:
      case 51:
      case 61:
      case 62:
      case 101:
      case 131:
      case 141:
      case 191:
        // this.moveToClientRoom(moveToConfig);
        this.connectTo_subRoom(moveToConfig.connectionConfig);
        break;

      default:
        throw new Error("unknwon moveToConfig.targetRoomType:", moveToConfig.targetRoomType);
        break;
    }

  }

  // moveToWelcomeRoom(moveToConfig) {
  //   this.connectTo_welcome(roomServiceClass, moveToConfig.connectionConfig);
  // }
  //
  // moveToPortalRoom(moveToConfig) {
  //   this.connectTo_portal(roomServiceClass, moveToConfig.connectionConfig);
  // }
  //
  // moveToClientRoom(moveToConfig) {
  //   this.connectTo_client(roomServiceClass, moveToConfig.connectionConfig);
  // }






  connectTo_welcome(welcomeRoomConnectionConfig) {
    console.log(this.constructor.name, "connectTo_welcome", welcomeRoomConnectionConfig);

    const roomServiceFactory = this.roomServiceFactory;
    const navigationService  = this.navigationService;

    return RoomConnectionService.joinPublicRoom_p(welcomeRoomConnectionConfig)
                         .then(room => {
                           console.log(this.constructor.name, "welcome_room:", room);
                           // this.removeRoomAccess(room.roomId);
                           return roomServiceFactory.createRoomService_p(room);
                         })
                         .then(roomService => {
                           navigationService.moveForwardTo(roomService);
                         });
  }

  connectTo_portal(portalRoomConnectionConfig) {
    console.log(this.constructor.name, "connectTo_portal", portalRoomConnectionConfig);

    const roomServiceFactory = this.roomServiceFactory;
    const navigationService  = this.navigationService;

    // const clientRoomService  = this.clientRoomService;

    RoomConnectionService.joinPrivateRoom_p(portalRoomConnectionConfig)
                         .then(room => {
                           console.log(this.constructor.name, "portal_room:", room);
                           // const roomService = moveToHelper.roomServiceFactory.createRoomService(room);
                           return roomServiceFactory.createRoomService_p(room);
                         })
                         .then(roomService => {
                           //listen to next room message
                           return RoomConnectionService.nextMessage_p(roomService.room)
                                    .then(([room, message]) => {
                                      return [roomService, message];
                                    });
                         })
                         .then(([portalRoomService, message]) => {
                           console.log("message", message);

                           const command = message.command;

                           if(command == "two_step") {

                             // const parentServerService = this.parentServerService;
                             const singleUseCommandName = message.payload.command;
                             console.log("singleUseCommandName", singleUseCommandName);

                             const moveToNickname = "moveToClient";
                             portalRoomService.addMoveToCommandHandler(moveToNickname, () => {

                               // const commandName = clientRoomService.connectToComponentServerCommandName();
                               const clientCommand = new ClientCommand("two_step_with_portal", {
                                 singleUseCommandName : singleUseCommandName,
                                 singleUseCommandData : {},
                               });

                               const clientRoomService = portalRoomService.moveToHelper.clientRoomService;

                               return clientRoomService.processCommand_p(clientCommand)
                                                       .catch(error => {
                                                         console.log("clientRoomService", "clientCommand error", clientCommand, error);
                                                       })
                                           .then(clientRoomMoveToConfig => {
                                              console.log("yoyoyoyoyoyo", clientRoomMoveToConfig);

                                              // console.log("portalRoomConnectionConfig", portalRoomConnectionConfig);

                                              const is_auto = portalRoomConnectionConfig.data && portalRoomConnectionConfig.data.auto;
                                              if(is_auto) {

                                                const clientRoomConnectionConfig_auto = {};
                                                Object.assign(clientRoomConnectionConfig_auto, clientRoomMoveToConfig.connectionConfig);

                                                if(!clientRoomConnectionConfig_auto.data) {
                                                  clientRoomConnectionConfig_auto.data = {};
                                                }
                                                clientRoomConnectionConfig_auto.data.auto = portalRoomConnectionConfig.data.auto;

                                                const clientRoomMoveToConfig_auto = {};
                                                Object.assign(clientRoomMoveToConfig_auto, clientRoomMoveToConfig);
                                                clientRoomMoveToConfig_auto.connectionConfig = clientRoomConnectionConfig_auto;

                                                portalRoomService.moveToHelper.moveTo(clientRoomMoveToConfig_auto);
                                              } else {

                                                portalRoomService.moveToHelper.moveTo(clientRoomMoveToConfig);
                                              }

                                           });
                             });

                             portalRoomService.moveToService[moveToNickname] = function (data) {
                               const clientCommand = new ClientCommand(moveToNickname, data);
                               return portalRoomService.processCommand_p(clientCommand);
                             };

          //                    portalRoomService.addMoveToCommandHandler("moveToClient_auto", () => {
          //
          //                      // const commandName = clientRoomService.connectToComponentServerCommandName();
          //                      const clientCommand = new ClientCommand("two_step_with_portal", {
          //                        singleUseCommandName : singleUseCommandName,
          //                        singleUseCommandData : {},
          //                      });
          //
          //                      const clientRoomService = portalRoomService.moveToHelper.clientRoomService;
          //
          //                      return clientRoomService.processCommand_p(clientCommand)
          //                                              .catch(error => {
          //                                                console.log("clientRoomService", "clientCommand error", clientCommand, error);
          //                                              })
          //                                  .then(clientRoomMoveToConfig => {
          //                                    console.log("yoyoyoyoyoyo", clientRoomMoveToConfig);
          //
          //                                    // portalRoomService.commandHandler_moveTo_client(clientRoomConnectionConfig);
          //
          // /*the only difference*/
          //                                    if(portalRoomConnectionConfig.auto) {
          //                                      clientRoomMoveToConfig.auto = portalRoomConnectionConfig.auto;
          //                                    } else {
          //                                      throw new Error("moveToClient_auto, portalRoomConnectionConfig.auto == null");
          //                                    }
          //
          //                                    portalRoomService.moveToHelper.moveTo(clientRoomMoveToConfig);
          //                                  });
          //                    });

                             return portalRoomService;

                           } else {
                             console.log("OHHHHHHHHHHHHHHHHHHHH");
                             throw new Error("two_step message was expected but received:", message);
                           }

                        })
                        .then(roomService => {
                          navigationService.moveForwardTo(roomService);
                        });

  }

  connectTo_client(clientRoomConnectionConfig) {
    console.log(this.constructor.name, "connectTo_client", clientRoomConnectionConfig);

    const roomServiceFactory = this.roomServiceFactory;
    const navigationService  = this.navigationService;

    return RoomConnectionService.createPrivateRoom_p(clientRoomConnectionConfig)
            .then(room => {
              console.log(this.constructor.name, "client_room:", room);
              console.log(this.constructor.name, "client_room.state:", room.state);

              return roomServiceFactory.createRoomService_p(room);
            })
            .then(roomService => {
              navigationService.moveForwardTo(roomService);
            })
            .catch(error => {
              console.log(this.constructor.name, "connect", error);
            });

  }

  connectTo_subRoom(subRoomConnectionConfig) {
    console.log(this.constructor.name, "connectTo_subRoom", subRoomConnectionConfig);

    const roomServiceFactory = this.roomServiceFactory;
    const navigationService  = this.navigationService;

    // const clientRoomService  = this.roomService;

    RoomConnectionService.joinPrivateRoom_p(subRoomConnectionConfig)
                         .then(room => {
                           console.log(this.constructor.name, "sub_room:", room);
                           // const roomService = moveToHelper.roomServiceFactory.createRoomService(room);
                           return roomServiceFactory.createRoomService_p(room);
                         })
                        .then(roomService => {
                          navigationService.moveForwardTo(roomService);
                        });
  }


}

// .then(connectionConfig => {
//   console.log("go_to_my_room() : success", connectionConfig);
//   //this will induce dependency injection
//   // clientRoomClientService.connect(connectionConfig);
//   return connectionConfig;
// })
// .catch(error => {
//   console.log("go_to_my_room() : error", error);
//   //welcomeRoomClientService_incoming.setServerError(error);
//   throw error;
// });
