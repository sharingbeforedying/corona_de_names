import { UniverseRoomService } from './shared/services/servers/rooms/universe/UniverseRoomService.js';

import { WelcomeRoomService } from './shared/services/servers/rooms/welcome/WelcomeRoomService.js';
import { PortalRoomService }  from './shared/services/servers/rooms/portal/PortalRoomService.js';
import { ClientRoomService }  from './shared/services/servers/rooms/client/ClientRoomService.js';

import { ChatRoomService }  from './shared/services/servers/rooms/chat/ChatRoomService.js';

import { A1RoomService }  from './shared/services/servers/rooms/debug/a1/A1RoomService.js';
import { C1RoomService }  from './shared/services/servers/rooms/debug/c1/C1RoomService.js';
import { SessionHallRoomService } from './shared/services/servers/rooms/halls/session/SessionHallRoomService.js';

import { SessionRoomService }  from './shared/services/servers/rooms/session/SessionRoomService.js';

import { TeamsConfigRoomService }  from './shared/services/servers/rooms/teamsConfig/TeamsConfigRoomService.js';
import { ContentConfigRoomService }  from './shared/services/servers/rooms/contentConfig/ContentConfigRoomService.js';

import { InstanceBeginRoomService }   from './shared/services/servers/rooms/instance/begin/InstanceBeginRoomService.js';
import { InstanceTellerRoomService }  from './shared/services/servers/rooms/instance/teller/InstanceTellerRoomService.js';
import { InstanceGuesserRoomService } from './shared/services/servers/rooms/instance/guesser/InstanceGuesserRoomService.js';
import { InstanceEndRoomService }   from './shared/services/servers/rooms/instance/end/InstanceEndRoomService.js';



(function() {

angular.module('awApp').run(function($state, /*gameService,*/ navigationService, focusService) {

  // gameService.onChange(() => {
  //
  //   const currentState = $state.$current;
  //   console.log("currentState", currentState);
  //
  //   const sessionsMap = gameService.getSessionsMap();
  //   console.log("sessionsMap", sessionsMap);
  //
  //   const sessions = Object.values(sessionsMap);
  //   if(sessions.length > 0) {
  //     const session = sessions.find(e => true);
  //
  //     moveTo("session.current", {session : session});
  //   }
  //
  // });

  // gameService.stateEventProvider_change__pending.onChange(obj => {
  //   console.log("gameService.stateEventProvider_change__pending.onChange", obj);
  //   reloadIfCurrent("welcome", {});
  // });
  //
  // gameService.stateEventProvider_create__client.onChange(obj => {
  //   console.log("gameService.stateEventProvider_create__client.onChange", obj);
  //
  //   moveToIfNotCurrent("home", {});
  //
  //   //group
  //
  //   gameService.stateEventProvider_create__group.onChange(obj => {
  //     console.log("gameService.stateEventProvider_create__group.onChange", obj);
  //     reloadIfCurrent("home", {});
  //   });
  //
  //   gameService.stateEventProvider_change__group.onChange(obj => {
  //     console.log("gameService.stateEventProvider_change__group.onChange", obj);
  //     reloadIfCurrent("home", {});
  //   });

    //session

    // gameService.stateEventProvider_create__session_current.onChange(session => {
    //   console.log("gameService.stateEventProvider_create__session_current.onChange", session);
    //
    //   syncWithSessionState(session);
    // });
    //
    // gameService.stateEventProvider_change__session_current.onChange(session => {
    //   console.log("gameService.stateEventProvider_change__session_current.onChange", session);
    //
    //   syncWithSessionState(session);
    // });
    //
    // function syncWithSessionState(session) {
    //   // if(session.state == 0) {
    //     switch(session.instance_config.state) {
    //       case 0:
    //         moveToIfNotCurrent("session.current.config.teams", {teamsConfig : session.instance_config.teams});
    //         break;
    //       case 1:
    //         moveToIfNotCurrent("session.current.config.content", {contentConfig :session.instance_config.content});
    //         break;
    //       case 10:
    //         moveToIfNotCurrent("session.current.config.complete", {instance_config : session.instance_config});
    //         break;
    //       default:
    //         break;
    //     }
    //   // } else if(session.state == 1) {
    //   //   moveToIfNotCurrent("session.current.game", session);
    //   // }
    // }



  // });

  // serverService.onWelcomed(() => {
  //   moveToIfNotCurrent("welcome", {});
  // });
  //
  // serverService.onConnected(() => {
  //   moveToIfNotCurrent("serverFace", {});
  // });





  function stateNameForRoomService(roomService) {
    var stateName;
    if(roomService instanceof UniverseRoomService) {
      stateName = "universe";
    }

    else if(roomService instanceof WelcomeRoomService) {
      stateName = "welcome";
    }
    else if(roomService instanceof PortalRoomService) {
      stateName = "portal";
    }

    else if(roomService instanceof ClientRoomService) {
      stateName = "client";
    }

    else if(roomService instanceof ChatRoomService) {
      stateName = "chat";
    }

    else if(roomService instanceof SessionRoomService) {
      stateName = "sessionMain";
    }

    else if(roomService instanceof TeamsConfigRoomService) {
      stateName = "teamsConfig";
    }

    else if(roomService instanceof ContentConfigRoomService) {
      stateName = "contentConfig";
    }

    else if(roomService instanceof InstanceBeginRoomService) {
      stateName = "instanceBegin";
    }

    else if(roomService instanceof InstanceTellerRoomService) {
      stateName = "instanceTeller";
    }

    else if(roomService instanceof InstanceGuesserRoomService) {
      stateName = "instanceGuesser";
    }

    else if(roomService instanceof InstanceEndRoomService) {
      stateName = "instanceEnd";
    }


    else if(roomService instanceof A1RoomService) {
      stateName = "a1";
    }

    else if(roomService instanceof C1RoomService) {
      stateName = "c1";
    }

    else if(roomService instanceof SessionHallRoomService) {
      stateName = "sessionHall";
    }




    // else if(roomService instanceof CR1RoomService) {
    //   stateName = "cr1";
    // }

    else {
      throw new Error("unknown room service :", roomService.constructor)
    }

    return stateName;
  }

  const startingRoomService = navigationService.getCurrentRoomService();
  console.log("startingRoomService", startingRoomService);
  const stateName = stateNameForRoomService(startingRoomService);
  moveToIfNotCurrent(stateName, {roomService : startingRoomService});

  // navigationService.onMovedToRoom((roomService) => {
  //   console.log("onMovedToRoom", roomService);
  //   const stateName = stateNameForRoomService(roomService);
  //   moveToIfNotCurrent(stateName, {roomService : roomService});
  // });

  focusService.rx_roomServiceWithFocus.subscribe({
    next(roomService) {
      //debug
      const navStack = navigationService.navigationStack;
      console.log("navStack.length", navStack.length);

      console.log('rx_roomServiceWithFocus', 'next', roomService);
      const stateName = stateNameForRoomService(roomService);
      moveToIfNotCurrent(stateName, {roomService : roomService});
    },
    error(err) { console.error('rx_roomServiceWithFocus', 'something wrong occurred: ' + err); },
    complete() { console.log('rx_roomServiceWithFocus', 'done'); }
  });

  // serverService.onConnected(() => {
  //   moveToIfNotCurrent("serverFace", {});
  // });


  // serverService.onMoveToRoom(() => {
  //   // moveToIfNotCurrent("home", {});
  // });
  //
  // serverService.onMoveToChildServer(() => {
  //   // moveToIfNotCurrent("home", {});
  // });






  ////////////////

  function reloadOrMoveTo(stateName, params) {
    console.log("stateDictator", "reloadIfCurrent", stateName, params);
    const currentState = $state.$current;
    if(currentState.name == stateName) {
      console.log("reload");
      $state.reload();
    } else {
      console.log("moveTo");
      $state.go(stateName, params);
    }
  }

  function reloadIfCurrent(stateName, params) {
    console.log("stateDictator", "reloadIfCurrent", stateName, params);
    const currentState = $state.$current;
    if(currentState.name == stateName) {
      console.log("reload");
      $state.reload();
    } else {
      console.log("ignored");
    }
  }

  function moveToIfNotCurrent(stateName, params) {
    console.log("stateDictator", "moveIfNotCurrent", stateName, params);
    const currentState = $state.$current;
    if(currentState.name != stateName) {
      console.log("move");
      moveTo(stateName, params);
    } else if(currentState.params.roomService && currentState.params.roomService != params.roomService) {
      console.log("same state name, different params");
      moveTo(stateName, params);
    } else {
      console.log("ignored");
    }
  }

  function moveError(state, error) {
    console.log("stateDictator", "moveError", stateName, params);
    // _moveTo(state.name, params);
    $state.reload(error);
  }

  function moveTo(stateName, params) {
    console.log("stateDictator", "moveTo", stateName, params);
    $state.go(stateName, params);
  }


});

})();
