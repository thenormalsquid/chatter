var redis = require("redis"),
    client = redis.createClient(),
    WebSocketServer = require('ws').Server,
    ws = new WebSocketServer({port: 8888});

ws.on('connection', function(ws){
    ws.on('message', function(message) {
        console.log('fgt: %s', message);
    });
    ws.send('connected');
});