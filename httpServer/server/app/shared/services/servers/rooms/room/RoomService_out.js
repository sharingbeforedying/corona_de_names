class RoomService_out {
  constructor(room) {
    this.registerCommands(room);
  }

  registerCommands(room) {

    const cs = this;
    cs.interface = {};

    //group

    cs.interface.group_create = function() {
      room.send("client", ["cmd_group_create", {}]);
    };

    cs.interface.group_set_name = function(name) {
      room.send("client", ["cmd_group_set_name", {name: name}]);
    };

    cs.interface.group_createPlayer_loginProfile = function(profileCredentials) {
      room.send("client", ["cmd_group_createPlayer_loginProfile", {profileCredentials: profileCredentials}]);
    };

    cs.interface.group_createPlayer_createProfile = function(profileForm) {
      room.send("client", ["cmd_group_createPlayer_createProfile", {form: profileForm}]);
    };

    cs.interface.group_createPlayer_noProfile = function(noProfileForm) {
      room.send("client", ["cmd_group_createPlayer_noProfile", {form: noProfileForm}]);
    };


    cs.interface.group_removePlayer = function(groupPlayer) {
      const playerId = groupPlayer.id;
      room.send("client", ["cmd_group_removePlayer", {"playerId" : playerId}]);
    };

      //edit

    // cs.interface.group_setPlayerName = function(groupPlayer, name) {
    //   const playerId = groupPlayer.id;
    //   room.send("client", ["group_setPlayerName", {"playerId" : playerId, "name" : name}]);
    // };

    //session

    cs.interface.session_config_formModel_p = function() {

      return new Promise((resolve, reject) => {
        const command = "cmd_session_config_formModel";
        const data    = {};

        room.onMessage("answer", (message) => {
          console.log("message received from server");
          console.log(message);

          if(message.command == command) {
            if(message.error) {
              reject(message.error);
            } else {
              const formModel = message.payload;
              resolve(formModel);
            }
          }

        });

        room.send("client", [command, data]);
      });

    }

    cs.interface.session_create = function(form) {

      return new Promise((resolve, reject) => {
        const command = "cmd_session_create";
        const data    = {"form" : form};

        room.onMessage("answer", (message) => {
          console.log("message received from server");
          console.log(message);

          if(message.command == command) {
            if(message.error) {
              reject(message.error);
            } else {
              const session = message.payload;
              //decorate session object if necessary
              resolve(session);
            }
          }

        });

        room.send("client", [command, data]);
      })
      .then(session => {
        console.log("session_create() : success", session);
        gameRoomClientService_incoming.setCurrentSession(session);
      })
      .catch(error => {
        console.log("session_create() : error", error);
        gameRoomClientService_incoming.setServerError(error);
      });

    }

    cs.interface.session_join = function(session) {

      return new Promise((resolve, reject) => {
        const command = "cmd_session_join";
        const data    = {sId : session.id};

        room.onMessage("answer", (message) => {
          console.log("message received from server");
          console.log(message);

          if(message.command == command) {
            if(message.error) {
              reject(message.error);
            } else {
              const session = message.payload;
              //decorate session object if necessary
              resolve(session);
            }
          }

        });

        room.send("client", [command, data]);
      })
      .then(session => {
        console.log("session_join() : success", session);
        gameRoomClientService_incoming.setCurrentSession(session);
      })
      .catch(error => {
        console.log("session_join() : error", error);
        gameRoomClientService_incoming.setServerError(error);
      });

    }


    //instance_config

    cs.interface.instance_config_teams_joinTeam = function(team, freePlayer) {
      const session  = gameService.getCurrentSession();
      const sId      = session.id;
      const teamId   = team.id;
      const playerId = freePlayer.id;
      room.send("client", ["cmd_instance_config_teams_joinTeam", {"sId": sId, "teamId" : teamId, "playerId" : playerId,}]);
    };

    cs.interface.instance_config_teams_leaveTeam = function(team, teamPlayer) {
      const session  = gameService.getCurrentSession();
      const sId      = session.id;
      const teamId   = team.id;
      const playerId = teamPlayer.id;
      room.send("client", ["cmd_instance_config_teams_leaveTeam", {"sId": sId, "teamId" : teamId, "playerId" : playerId,}]);
    };

    cs.interface.instance_config_teams_teamPlayer_set_ready = function(teamPlayer, ready) {
      const session  = gameService.getCurrentSession();
      const sId      = session.id;
      const playerId = sessionTeamPlayer.id;
      room.send("client", ["cmd_instance_config_teams_teamPlayer_set_ready", {"sId": sId, "playerId" : playerId, "ready" : ready}]);
    };

    cs.interface.instance_config_teams_teamPlayer_set_role = function(teamPlayer, roleId) {
      const session  = gameService.getCurrentSession();
      const sId      = session.id;
      const playerId = sessionTeamPlayer.id;
      room.send("client", ["cmd_instance_config_teams_teamPlayer_set_role", {"sId": sId, "playerId" : playerId, "roleId" : roleId}]);
    };



    cs.interface.session_startGame = function(session) {
      const sId      = session.id;
      room.send("client", ["cmd_session_startGame", {"sId": sId,}]);
    };

    cs.interface.auto_role_in_team = function(role,teamId) {
      room.send("client", ["cmd_auto_role_in_team", {"role" : role, "teamId" : teamId}]);
    };

    cs.interface.auto_game = function(type, nb_cells, startingTeamId) {
      room.send("client", ["cmd_auto_game", {"type" : type, "nb_cells" : nb_cells, "startingTeamId" : startingTeamId}]);
    }




    cs.interface.instance_teller_submitHint = function(instancePlayer, word, number) {
      const playerId = instancePlayer.id;
      room.send("client", ["cmd_instance_teller_submitHint", {"playerId" : playerId, "word" : word, "number" : number}]);
    };

    cs.interface.instance_guesser_submitCellSelection = function(instancePlayer, cellIndex) {
      const playerId = instancePlayer.id;
      room.send("client", ["cmd_instance_guesser_submitCellSelection", {"playerId" : playerId, "cellIndex" : cellIndex}]);
    };

    cs.interface.instance_guesser_submitEndTurn = function(instancePlayer) {
      const playerId = instancePlayer.id;
      room.send("client", ["cmd_instance_guesser_submitEndTurn", {"playerId" : playerId}]);
    };
  }
}
