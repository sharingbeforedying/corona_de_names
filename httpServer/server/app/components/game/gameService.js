(function() {

class GameService {

  constructor() {

    //OBSERVER PATTERN

    this.observerCallbacks = [];

    this.onChange = function(callback){
      this.observerCallbacks.push(callback);
    };

    this.notifyObservers = function(){
      this.observerCallbacks.forEach((callback,i) => {callback();});
    };





    //INTERFACE

    this.getPlayerPSI = function(id) {
      console.log("implement me please");
    }

    this.getTeamPSI = function(id) {
      console.log("implement me please");
    }

    this.getGroupTeam = function(sessionTeam, groupPlayersMap) {
      console.log("implement me please");
    }

    this.isLocalPlayerId = function(playerId) {

    }

    this.isLocalTeamId = function(teamId) {

    }


    //state
      //group
    this.getGroupPlayerGroupsMap = function() {

    }

    this.getOtherGroupPlayerGroupsMap = function() {

    }

    this.getGroupPlayersMap = function() {

    }

    this.getLocalGroupPlayersMap = function() {

    }

      //session
    this.getSessionTeamsMap = function() {
      console.log("implement me please");
    }

    this.getSessionPlayersMap = function() {

    }

    this.getLocalSessionPlayersMap = function() {

    }

    this.getLocalSessionTeamsMap = function() {

    }


      //instance
    this.getInstanceTeamsMap = function() {

    }

    this.getInstancePlayersMap = function() {

    }

    this.hlp_fusion_subMaps = function(maps, subMapName) {

    };


    this.getLocalAvailableGroupPlayersMap = function() {

    }



    this.get_grid__position = function() {
      console.log("implement me please");
      return {};
    }

    this.get_grid__content = function() {
      console.log("implement me please");
      return {};
    }

    this.get_grid__game = function() {
      console.log("implement me please");
      return {};
    }

    this.get_local_activeTeamPSI = function() {
      console.log("implement me please");
      return {};
    }



    //"pure client"

    // this.getSessionTeam = function(teamId) {
    //   return this.getSessionTeamsMap()[teamId];
    // }
    //
    // this.instanceTeamForPositionType = function(posType) {
    //   console.log("instanceTeamForPositionType", posType);
    //
    //   const instanceTeamsMap = this.getInstanceTeamsMap();
    //   console.log("instanceTeamsMap", instanceTeamsMap);
    //
    //   const filtered = Object.values(instanceTeamsMap).filter(instanceTeam => instanceTeam.type == posType);
    //   if(filtered.length > 0) {
    //     return filtered.find(e => true);
    //   } else {
    //     return null;
    //   }
    // };
    //
    // this.sessionTeamForPositionType = function(posType) {
    //   const instanceTeam = this.instanceTeamForPositionType(posType);
    //   if(!instanceTeam) {
    //     return null;
    //   }
    //   return this.getSessionTeam(instanceTeam.id);
    // };
    //
    // this.colorForPositionType = function(posType) {
    //   var color = null;
    //
    //   // const sessionTeam = this.sessionTeamForPositionType(posType);
    //   // if(sessionTeam) {
    //   //   color = sessionTeam.color;
    //   // }
    //   // else
    //   {
    //     switch(posType) {
    //       case positionCellType.UNKNOWN:
    //         color = "#DDDDDD";
    //         break;
    //       case positionCellType.NEUTRAL:
    //         color = "#FFFFFF";
    //         break;
    //       case positionCellType.BLACK:
    //         color = "#000000";
    //         break;
    //       default:
    //         console.log("unknown posType", posType);
    //         color = "#DA6335";
    //         break;
    //     }
    //   }
    //
    //   return color;
    // };

    // this.get_teller_hint = function() {
    //   return this.getGameState().turn.tellerStep.playerAction.action;
    // }
    //
    // this.get_current_turn = function() {
    //   return this.getGameState().turn;
    // }

  }

  static gameService() {
    return new GameService();
  }
}

angular.module("awApp").factory('gameService', GameService.gameService);

})();
