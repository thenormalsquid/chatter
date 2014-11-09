//run this in conjunction with test.js

var WebSocket = require('ws');
var rooms = require('../chatterapp/rooms.js');

var client = new WebSocket('ws://localhost:7777');

client.on('open', function(){
    client.send('chatter create');
});
