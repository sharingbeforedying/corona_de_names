class RoomService_in {
  constructor(room) {
    this.listenToChanges(room);
  }

  this.data = {};

  this.listenToChanges = function(room) {

    const localId = room.sessionId;
    this.data["localId"] = localId;

    const cs_incoming = this;
    const changesProcesser = new ChangesProcesser(room, cs_incoming);
    room.state.onChange = (changes) => {
      changesProcesser.logChanges(changes)
                      .processChanges_group(changes)
                      .processChanges_session(changes)
                      .notifyObservers(changes);
    };

  };

  this.listenToMessages = function(room) {

  };


  //processing

  class ChangesProcesser {

    constructor(room, cs_incoming) {
      this.room        = room;
      this.cs_incoming = cs_incoming;

      this.specificListeners = {};
    }

    listenIfExists(predicate, name, listenStart, listenStop) {
      if(predicate) {
        console.log("predicate == true");
        const listener = this.specificListeners[name];
        if(!listener) {
          console.log("listenStart");
          this.specificListeners[name] = true;
          listenStart();
        }
      } else {
        console.log("predicate == false");
        console.log("listenStop");
        this.specificListeners[name] = false;
        listenStop();
      }
    }

    listenDynamic(name, schemaGetter, evtProvider_create, evtProvider_change) {
      this.listenIfExists(schemaGetter(), name, () => {

        schemaGetter().onChange = (changes) => {
          console.log(name, ".onChange", changes);
          const schema = schemaGetter();
          this.cs_incoming.data[name] = schema;
          evtProvider_change.notifyObservers(schema);
        };

        console.log(name, ".onCreate");
        const schema = schemaGetter();
        this.cs_incoming.data[name] = schema;
        evtProvider_create.notifyObservers(schema);

      }, () => {
        const schema = schemaGetter();
        this.cs_incoming.data[name] = schema;
        evtProvider_change.notifyObservers(schema);
        // getter().onChange = null;
      });
    }

    logChanges(changes) {
      changes.forEach(change => {
          // console.log(change.field);
          // console.log(change.previousValue);
          // console.log(change.value);

          console.log("room.state.onChange", change.field, change.value);
      });

      return this;
    }

    processChanges_group(changes) {

      changes.forEach(change => {
        if(change.field == "group") {
          const group = change.value.toJSON();

          this.setGroup(group);
        }
      });

      return this;
    }

    // processChanges_groupPlayerGroup_local(changes) {
    //
    //   const room               = this.room;
    //   const name               = "groupPlayerGroup_local";
    //   const schemaGetter       = () => room.state.groupPlayerGroups[this.cs_incoming.data.localId];
    //   const evtProvider_create = this.cs_incoming.stateEventProvider_create__group_local;
    //   const evtProvider_change = this.cs_incoming.stateEventProvider_change__group_local;
    //
    //   this.listenDynamic(name, schemaGetter, evtProvider_create, evtProvider_change);
    //
    //   return this;
    // }

    processChanges_session(changes) {

      changes.forEach(change => {
        if(change.field == "session") {
          const session = change.value.toJSON();

          this.cs_incoming.data["session"] = session;

        }

      });

      return this;
    }

    notifyObservers(changes) {
      this.cs_incoming.notifyObservers();

      return this;
    }

  }


  //OBSERVER PATTERN

  this.observerCallbacks = [];

  //register an observer
  this.registerObserverCallback = function(callback){
    this.observerCallbacks.push(callback);
  };

  //call this when you know 'foo' has been changed
  this.notifyObservers = function() {
    const serviceName = "gameRoomClientService_incoming";
    this.observerCallbacks.forEach((callback,i) => {callback(serviceName);});
  };


  //state change

  class StateEventProvider {
    constructor() {
      this.observerCallbacks = [];
    }

    onChange(callback) {
      this.observerCallbacks.push(callback);
    }

    notifyObservers(obj) {
      const serviceName = "gameRoomClientService_incoming";
      this.observerCallbacks.forEach((callback,i) => {callback(obj);});
    }
  }

  this.stateEventProvider_create__group    = new StateEventProvider("create__group");
  this.stateEventProvider_change__group    = new StateEventProvider("change__group");

  this.stateEventProvider_change__session_list    = new StateEventProvider("change__session_list");
  this.stateEventProvider_change__session_current = new StateEventProvider("change__session_current");
  this.stateEventProvider_change__game_start      = new StateEventProvider("change__game_start");
  this.stateEventProvider_change__game_phase      = new StateEventProvider("change__game_phase");

  this.stateEventProvider_create__session  = new StateEventProvider("create__session");
  this.stateEventProvider_change__session  = new StateEventProvider("change__session");


  this.setGroup = function(group) {
    if(!this.data["group"]) {
      this.data["group"] = group;
      this.stateEventProvider_create__group.notifyObservers(group);
    } else {
      this.data["group"] = group;
      this.stateEventProvider_change__group.notifyObservers(group);
    }
  }

  this.setSession = function(session) {
    if(!this.data["session"]) {
      this.data["session"] = session;
      this.stateEventProvider_create__session.notifyObservers(session);
    } else {
      this.data["session"] = session;
      this.stateEventProvider_change__session.notifyObservers(session);
    }
  }

  this.setServerError = function(error) {
    this.data["serverError"] = error;
  }



  /*
  this.manageChanges_sessionConfig = function(localId, session_config) {
    console.log("state.session_config has changed");
    console.log("session_config:", session_config);

    this.data["session_config"] = session_config;

    this.data["local_availableGroupPlayersMap"] = this.interface.getLocalAvailableGroupPlayersMap();

    this.data["session_teamsMap"]   = this.interface.getSessionTeamsMap();
    this.data["session_playersMap"] = this.interface.getSessionPlayersMap();

    this.data["local_session_playersMap"] = this.interface.getLocalSessionPlayersMap()
    this.data["local_session_teamsMap"]   = this.interface.getLocalSessionTeamsMap();

    console.log("manageChanges_sessionConfig", "this.data", this.data);
  };

  this.manageChanges_gameState = function(localId, gameState) {
    console.log("state.gameState has changed");
    console.log("gameState:", gameState);

    this.data["gameState"] = gameState;

    this.data["activeTeamPSI"]   = this.interface.getTeamPSI(this.interface.getActiveTeamId());
    this.data["activePlayerPSI"] = this.interface.getPlayerPSI(this.interface.getActivePlayerId());

    if(this.interface.isLocalTeamId(this.interface.getActiveTeamId())) {
      this.data["local_activeTeamPSI"] = this.data["activeTeamPSI"];
    } else {
      console.log("not local team");
    }

    if(this.interface.isLocalPlayerId(this.interface.getActivePlayerId())) {
      this.data["local_activePlayerPSI"] = this.data["activePlayerPSI"];
    } else {
      console.log("not local player");
    }

    console.log("manageChanges_gameState", "this.data", this.data);
  };
  */




  //INTERFACE
  const cs = this;
  cs.interface = {}

  cs.interface.getLocalId = function() {
    return cs.data["localId"];
  }

  cs.interface.getPlayerPSI = function(id) {
    const groupPlayer   = cs.interface.getGroupPlayersMap()[id];
    const sessionPlayer  = cs.interface.getSessionPlayersMap()[id];
    const instancePlayer = cs.interface.getInstancePlayersMap()[id];
    return {
      group:   groupPlayer,
      session:  sessionPlayer,
      instance: instancePlayer,
    };
  }

  cs.interface.getTeamPSI = function(id) {
    const groupPlayersMap = cs.interface.getGroupPlayersMap();
    const sessionTeam      = cs.interface.getSessionTeamsMap()[id];
    const instanceTeam     = cs.interface.getInstanceTeamsMap()[id];
    const groupPlayersInTeam = cs.interface.getGroupTeam(sessionTeam, groupPlayersMap);
    return {
      group:   groupPlayersInTeam,
      session:  sessionTeam,
      instance: instanceTeam,
    };
  }

  cs.interface.getGroupTeam = function(sessionTeam, groupPlayersMap) {
    return {
      id : sessionTeam.id,
      players: Object.fromEntries(Object.values(sessionTeam.players).map(sessionPlayer => [sessionPlayer.id, groupPlayersMap[sessionPlayer.id]])),
    };
  }

  cs.interface.isLocalPlayerId = function(playerId) {
    return cs.interface.getLocalGroupPlayersMap()[playerId] != null;
  }

  cs.interface.isLocalTeamId = function(teamId) {
    return cs.interface.getLocalSessionTeamsMap()[teamId] != null;
  }

  cs.interface.getActiveTeamId = function() {
    return cs.data["gameState"].turn.teamId;
  }

  cs.interface.getActivePlayerId = function() {
    return cs.data["gameState"].turn.activePlayerId;
  }


  //state
    //group
  cs.interface.getGroupPlayerGroupsMap = function() {
    return cs.data["groupPlayerGroupsMap"];
  }

  cs.interface.getOtherGroupPlayerGroupsMap = function() {
    return cs.data["other_groupPlayerGroupsMap"];
  }

  cs.interface.getGroupPlayersMap = function() {
    const groupPlayerGroupsMap = cs.interface.getGroupPlayerGroupsMap();
    return cs.interface.hlp_fusion_subMaps(groupPlayerGroupsMap, "players");
  }

  cs.interface.getLocalGroup = function() {
    // return cs.data["groupPlayerGroup_local"];
    return cs.data["group"];
  }

  cs.interface.getLocalGroupPlayersMap = function() {
    var out = null;
    const groupPlayerGroup = cs.data["groupPlayerGroup_local"];
    if(groupPlayerGroup) {
      out = groupPlayerGroup.players;
    }
    return out;
  }

    //session
  cs.interface.getSessionsMap = function() {
    return cs.data["sessionsMap"] ? cs.data["sessionsMap"] : {};
  }

  cs.interface.getSessionTeamsMap = function() {
    const session_config = cs.data["session_config"]
    var teamsMap;
    if (session_config) {
      teamsMap = session_config.teams;
    } else {
      teamsMap = {};
    }
    //console.log("getSessionTeamsMap", teamsMap);
    return teamsMap;
  }

  cs.interface.getSessionPlayersMap = function() {
    const sessionTeamsMap = cs.interface.getSessionTeamsMap();
    return cs.interface.hlp_fusion_subMaps(sessionTeamsMap, "players");
  }

  cs.interface.getLocalSessionPlayersMap = function() {
    const sessionPlayersMap = cs.interface.getSessionPlayersMap();

    const localGroupPlayersMap = cs.interface.getLocalGroupPlayersMap();

    const localSessionPlayersMap = Object.fromEntries(Object.entries(sessionPlayersMap).filter(([playerId,sessionPlayer]) => localGroupPlayersMap[playerId] != null));
    return localSessionPlayersMap;
  }

  cs.interface.getLocalSessionTeamsMap = function() {
    const localSessionPlayersMap = cs.interface.getLocalSessionPlayersMap();

    const sessionTeamsMap = cs.interface.getSessionTeamsMap();

    const localSessionTeamsMap = Object.fromEntries(Object.values(localSessionPlayersMap).map(sessionPlayer => [sessionPlayer.teamId, sessionTeamsMap[sessionPlayer.teamId]]));
    return localSessionTeamsMap;
  }


    //instance
  cs.interface.getInstanceTeamsMap = function() {
    const teamsMap = cs.data["gameState"].teams;
    //console.log("getInstanceTeamsMap", teamsMap);
    return teamsMap;
  }

  cs.interface.getInstancePlayersMap = function() {
    const instanceTeamsMap = cs.interface.getInstanceTeamsMap();
    return cs.interface.hlp_fusion_subMaps(instanceTeamsMap, "players");
  }

  cs.interface.hlp_fusion_subMaps = function(maps, subMapName) {
    const submapsArray = Object.values(maps).map(map => map[subMapName]);
    const fusionMap = submapsArray.reduce((acc, subMap) => Object.assign(acc, subMap), {});
    return fusionMap;
  };


  // cs.interface.getLocalAvailableGroupPlayersMap = function() {
  //   //console.log("Object.entries({})", Object.entries({}));
  //   //console.log("Object.fromEntries([])", Object.fromEntries([]));
  //   console.log("this", this);
  //
  //   const localGroupPlayersMap = cs.interface.getLocalGroupPlayersMap();
  //   console.log("localGroupPlayersMap", localGroupPlayersMap);
  //   if(!localGroupPlayersMap) {
  //     return {};
  //   }
  //   if(Object.entries(localGroupPlayersMap).length == 0) {
  //    return {};
  //   }
  //
  //   const sessionPlayersMap = cs.interface.getSessionPlayersMap();
  //   console.log("sessionPlayersMap", sessionPlayersMap);
  //
  //   const entries = Object.entries(localGroupPlayersMap);
  //   console.log("entries", entries);
  //   const filteredEntries = entries.filter(([playerId, groupPlayer]) => sessionPlayersMap[playerId] == null)
  //   return Object.fromEntries(filteredEntries);
  // }

  cs.interface.get_local_activePlayerPSI = function() {
    return cs.data["local_activePlayerPSI"];
  }

  cs.interface.get_local_activeTeamPSI = function() {
    return cs.data["local_activeTeamPSI"];
  }


  cs.interface.get_grid__position = function() {
    console.log("g_rcs.get_grid__position");
    return cs.data["gameState"].position_grid;
  }

  cs.interface.get_grid__game = function() {
    return cs.data["gameState"].game_grid;
  }

  cs.interface.getGameState = function() {
    return cs.data["gameState"];
  }

  cs.interface.getCurrentSession = function() {
    return cs.data["currentSession"];
  }

  cs.interface.getServerError = function() {
    return cs.data["serverError"];
  }

  cs.interface.stateEventProvider_create__group    = cs.stateEventProvider_create__group;
  cs.interface.stateEventProvider_change__group    = cs.stateEventProvider_change__group;

  cs.interface.stateEventProvider_change__session_list    = cs.stateEventProvider_change__session_list;
  cs.interface.stateEventProvider_change__session_current = cs.stateEventProvider_change__session_current;
  cs.interface.stateEventProvider_change__game_start      = cs.stateEventProvider_change__game_start;
  cs.interface.stateEventProvider_change__game_phase      = cs.stateEventProvider_change__game_phase;

  cs.interface.stateEventProvider_create__session = cs.stateEventProvider_create__session;
  cs.interface.stateEventProvider_change__session = cs.stateEventProvider_change__session;

}
