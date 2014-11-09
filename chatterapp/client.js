var ioc = require('ioc'),
    crypto = require('crypto'),
    assert = require('assert'),
    logger = require('../logger/logger.js').logger;

/*
 * Client represents an individual connected to the server.
 */
function Client (ws) {
  assert(this instanceof Client); // Don't forget to use 'new'

  this.sock = ws;
  this.id = crypto.randomBytes(5).toString('hex');

  ws.on("message", this.handleMessage.bind(this));
}

Client.prototype.handleMessage = function (message) {
  logger.info(this.id +" RECV \"" + message + "\"");
  if (message.indexOf("chatter ") === 0) {
    // possibly a chatter command.

    var parts = message.split(" ");
    parts.shift(); // 'chatter'
    var cmd = parts.shift(); // cmd is first arg
    switch(cmd) {
      case "join":
      case "create":
        var name = "chatter " + cmd;
        assert(ioc.isRegistered(name));
        ioc.resolve(name, this, parts); // callback(client, [space delimited args])
        return;
    }
  }

  logger.debug("before chattersend");
  ioc.resolve("chatter send", this, message);

};

Client.prototype.send = function(message) {
  logger.info(this.id + " SEND \"" + message + "\"");
  this.sock.send(message);
};

module.exports = Client;
