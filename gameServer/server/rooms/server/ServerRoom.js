const colyseus = require('colyseus');
const ServerRoomState  = require('./ServerRoomState.js').ServerRoomState;

exports.ServerRoom = class extends colyseus.Room {

  constructor(presence) {
    super(presence);
    //this.players = []
    //this.state   = 0

    try {
      this.setState(new ServerRoomState());
    } catch(e) {
      console.log(e);
    }

  }

  onCreate (options) {
    //console.log("onCreate", options);
    console.log("onCreate");

    //todo:
    //this.state.cmd_room_on_create() //-> admin
  }

  onJoin (client, options) {
    //console.log("onJoin",client,options);
    console.log("onJoin");

    //todo:
    //this.state.cmd_room_on_join() //-> greet
  }

  handleMessage (client, message) {
    //console.log("onMessage",client,message);
    console.log("onMessage");

    const sessionId = client.sessionId;
    const [command, data] = message;

    console.log("sessionId", sessionId);
    console.log("command", command);
    console.log("data", data);

    //group
    if (command == "group_create") {
      this.state.cmd_group_create(sessionId, command, data);
    } else if (command == "group_set_name") {
      this.state.cmd_group_set_name(sessionId, command, data);
    }

    else if (command == "group_createPlayer_loginProfile") {
      this.state.cmd_group_createPlayer_loginProfile(sessionId, command, data);
    } else if (command == "group_createPlayer_createProfile") {
      this.state.cmd_group_createPlayer_createProfile(sessionId, command, data);
    } else if (command == "group_createPlayer_noProfile") {
      this.state.cmd_group_createPlayer_noProfile(sessionId, command, data);
    }

    else if (command == "group_setPlayerName") {
      this.state.cmd_group_setGroupPlayerName(sessionId, command, data);
    }

    else if (command == "group_removePlayer") {
      this.state.cmd_group_removePlayer(sessionId, command, data);
    }

    //session
    else if (command == "session_config_formModel") {
      try {
        const formModel = this.state.cmd_session_config_formModel(sessionId, command, data);
        client.send("answer", { command : command, payload : formModel });
      } catch(error) {
        client.send("answer", { command : command, error: error });
      }
    }

    else if (command == "session_create") {
      try {
        const session = this.state.cmd_session_create(sessionId, command, data);
        client.send("answer", { command : command, payload : session });
      } catch(error) {
        client.send("answer", { command : command, error: error });
      }
    } else if (command == "session_join") {
      try {
        const session = this.state.cmd_session_join(sessionId, command, data);
        client.send("answer", { command : command, payload : session });
      } catch(error) {
        client.send("answer", { command : command, error: error });
      }
    }

      //instance_config
    else if (command == "instance_config_teams_joinTeam") {
      this.state.cmd_instance_config_teams_joinTeam(sessionId, command, data);
    } else if (command == "instance_config_teams_leaveTeam") {
      this.state.cmd_instance_config_teams_leaveTeam(sessionId, command, data);
    }

    else if (command == "instance_config_teams_teamPlayer_set_ready") {
      this.state.cmd_instance_config_teams_teamPlayer_set_ready(sessionId, command, data);
    } else if (command == "instance_config_teams_teamPlayer_set_role") {
      this.state.cmd_instance_config_teams_teamPlayer_set_role(sessionId, command, data);
    }



    else if (command == "session_startGame") {
      this.state.cmd_session_startGame(sessionId, command, data);
    }



    //auto
    else if (command == "auto_role_in_team") {
      this.state.cmd_auto_role_in_team(sessionId, command, data);
    } else if (command == "auto_game") {
      this.state.cmd_auto_game(sessionId, command, data);
    }


    //instance
    else if (command == "instance_teller_submitHint") {
      this.state.cmd_instance_teller_submitHint(sessionId, command, data);
    } else if (command == "instance_guesser_submitCellSelection") {
      this.state.cmd_instance_guesser_submitCellSelection(sessionId, command, data);
    } else if (command == "instance_guesser_submitEndTurn") {
      this.state.cmd_instance_guesser_submitEndTurn(sessionId, command, data);
    }

    else {
      console.log("unknown command:", command);
    }
  }

  onLeave (client, consented) {
    //console.log("onLeave", client, consented);
    console.log("onLeave");

    this.state.client_leave(client);

    //todo:
    //this.state.cmd_room_on_leave()  //->tell all someone left + update players + update game config ...
  }

  onDispose() {
    console.log("onDispose");
  }





}
