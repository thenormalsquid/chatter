var ioc = require("ioc"),
    crypto = require('crypto'),
    Client = require("./client.js"),
    logger = require("../logger/logger.js").logger;


//TODO This should probably not be in server.js
function broadcast(clientList, message) {
  var idx;
  logger.debug("Sending " + message + " to " + clientList);
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
  logger.info("new client: " + client.id);
};

Server.prototype.handleJoin = function(client, args) {
  logger.info(client.id + " join " + args);
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
  logger.info(client.id + " create " + args);
  var roomId = crypto.randomBytes(10).toString('hex');
  this.rooms[roomId] = [];
  logger.debug("Created channel " + roomId + ": " + this);

  client.send("Created channel " + roomId);
  // join the room!
  this.handleJoin(client, [roomId]);
};

Server.prototype.handleSend = function(client, message) {
  logger.info("handle send:" + client.id +" " + message);
  logger.debug(this.clients);
  var roomsClientsIn = this.clients[client.id];

  for(c in roomsClientsIn) {
    var roomid = roomsClientsIn[c];
    broadcast(this.rooms[roomid], message);
  }
};

module.exports = new Server();
