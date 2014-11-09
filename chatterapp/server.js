var ioc = require("ioc"),
    crypto = require('crypto'),
    Client = require("./client.js")
    ;


//TODO This should probably not be in server.js
function broadcast(clientList, message) {
  var idx;
  console.log("Sending " + message + " to " + clientList);
  for(idx in clientList) {
    if (clientList[idx] !== undefined) {
      clientList[idx].send(message);
    }
  }
}
/* Server handles maintaining all of the client connections.
 */
function Server() {
  ioc.register("chatter join", this.handleJoin.bind(this));
  ioc.register("chatter create", this.handleCreate.bind(this));
  ioc.register("chatter send", this.handleSend.bind(this));
  this.rooms = {}; // Map of roomId to list of clients
  this.clients = {}; // Map of clientid to list of channels
}

Server.prototype.newConnection = function(connection) {
  var client = new Client(connection);
  this.clients[client.id] = [];

  console.log("new client: " + client.id);
};

Server.prototype.handleJoin = function(client, args) {
  console.log(client.id + " join " + args);
  var room = this.rooms[args[0]];

  if (room === undefined) {
    client.send("Invalid room.");
    return;
  }

  room.push(client);
  this.clients[client.id].push(args[0]);

  broadcast(room, client.id + " has joined.");
};

Server.prototype.handleCreate = function(client, args) {
  console.log(client.id + " create " + args);
  var roomId = crypto.randomBytes(10).toString('hex');
  this.rooms[roomId] = [];
  console.log("Created channel " + roomId + ": " + this);
  // join the room!
  this.handleJoin(client, [roomId]);
};

Server.prototype.handleSend = function(client, message) {
  console.log("handle send:" + client.id +" " + message);
  console.log(this.clients);
  var roomsClientsIn = this.clients[client.id];

  for(c in roomsClientsIn) {
    var roomid = roomsClientsIn[c];
    broadcast(this.rooms[roomid], message);
  }
};

module.exports = new Server();
