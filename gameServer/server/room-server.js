const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');
const monitor = require("@colyseus/monitor").monitor;
// const socialRoutes = require("@colyseus/social/express").default;


const debug = require('./debug.js').debug;
debug();


const port = process.env.PORT || 2567;
const app = express()

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new colyseus.Server({
  server: server,
});


const RoomFactory = require("./rooms/RoomFactory").RoomFactory;
const MyServer    = require("./my/MyServer").MyServer;

const roomFactory = new RoomFactory(gameServer, colyseus.matchMaker, port);
// const myServerConfig = {
//   roomFactory : roomFactory,
// };
// const myServer = new MyServer(myServerConfig);

/*
const childServer = new MyServer({
  roomFactory : roomFactory,

  isChildServer : true,
});
const parentServer = new MyServer({
  roomFactory : roomFactory,

  isChildServer : false,
  childServers : {"child1" : childServer},

  //configure facade here ?
  // welcomeRoomName: "welcome_room",
});
*/


const MyServer_C1    = require("./debug_servers/compound/c1/MyServer_C1").MyServer_C1;
const server_c1 = new MyServer_C1({
  roomFactory : roomFactory,

  // isChildServer : true,

  has_welcomeRoom : false,
  // portal_rooms : ["portal1, portal2"],

});
const MyServer_A1 = require("./debug_servers/compound/a1/MyServer_A1").MyServer_A1;
const server_a1 = new MyServer_A1({
  roomFactory : roomFactory,

  // isChildServer : false,

  has_welcomeRoom : true,
  welcomeRoomConfig : {
    name       : "welcome_room_a1",
    passphrase : "i_have_token_a_shower",
  },

  // portal_rooms : [],

  // componentServers : {
  //   "c1" : server_c1,
  // },

});
server_a1.connectToComponentServer(server_c1, "c1", "a1");





/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the require statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
