//import all that we need
var express = require("express"),
    redis = require("redis"),
    crypto = require("crypto"),
    http = require("http"),
    logger = require("./logger/logger.js"),
    client = redis.createClient(),
    WebSocketServer = require('ws').Server,
    ws = new WebSocketServer({port: 8888});

//create our express app
var app = express();

//express configurations
app.set('port', process.env.PORT || 3000);
app.use(logger.logErrors);
// app.use(app.router);

app.set('development', function(){
    app.use(express.errorHandler());
});

ws.on('connection', function(ws){
    ws.on('message', function(message) {
        console.log('fgt: %s', message);
    });
    ws.send('connected');
});

//create the http server and run
http.createServer(app).listen(app.get('port'), function(){
    var port = app.get('port');
    logger.logger.log("info", "Chatter server listening on port: " + port);
});
