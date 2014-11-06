//run: node test.js

var express = require("express"),
    http = require("http"),
    logger = require("../logger/logger.js"),
    redis = require("redis"),
    logger = require("../logger/logger.js"),
    client = redis.createClient(),
    crypto = require("crypto"),
    rooms = require("../chatterapp/rooms.js"),
    web = require("../chatterapp/websocket.js"),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 7777});

var testApp = express();
testApp.set('port', process.env.PORT || 2222);
testApp.use(logger.logErrors);

testApp.set('development', function(){
    testApp.use(express.errorHandler());
});


http.createServer(testApp).listen(testApp.get('port'), function(){
    var port = testApp.get('port');
    logger.logger.log("info", "Chatter server listening on port: " + port);
});



//begin our test suites
wss.on('connection', function(client) {

    //automatically create a room and subscribe
    client.id = crypto.randomBytes(5).toString('hex');

    client.on('message', function(message) {
        console.log('received: %s', message);
        web.parseMessage(client, message);
        
    });
    client.send('Hello, welcome to chatter 0.0.1!');
});


