var expect = require('chai').expect,
    server = require('../chatterapp/server.js'),
    WS = require('./helpers/WebSocket.js');

function newConnection() {
  var sock = new WS();
  server.newConnection(sock);
  return sock;
}

describe("Chatter", function() {
  describe("end to end", function() {
    it("should let two people talk", function() {
      var user1 = newConnection();
      var user2 = newConnection();

      // No messages upon initial connect
      expect(user1.send.called).to.be.false;
      expect(user2.send.called).to.be.false;

      // User 1 creates a room
      user1.emit('message', 'chatter create');
      expect(user1.send.calledTwice); // Creation and joining messages.
      expect(user1.send.firstCall.calledWithMatch(/^Created channel .*$/));
      expect(user1.send.secondCall.calledWithMatch(/^.* has joined$/));
      // Unrelated user sees nothing
      expect(user2.send.called).to.be.false;

      //Get the channel name:
      //Third part of the "Created channel XXXX" message.
      var channel = user1.send.firstCall.args[0].split(' ')[2];

      user2.emit('message', 'chatter join ' + channel);
      user2.emit('message', 'hello world');
      user1.send.calledWithMatch(/hello world/); // saw hello world somewhere.
    });
  });
});
