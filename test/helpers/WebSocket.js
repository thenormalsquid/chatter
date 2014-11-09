var EE = require('events').EventEmitter,
    util = require('util'),
    sinon = require('sinon'),
    assert = require('assert');
/*
 * This module acts as a websocket connection.
 * This is used for testing purposes to let a test
 * simulate conections coming in.
 */
function WebSocket() {
  assert(this instanceof WebSocket);
  this.send = sinon.spy();
}
util.inherits(WebSocket, EE);

module.exports = WebSocket;
