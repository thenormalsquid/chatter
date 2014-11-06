//import all that we need
var express = require("express"),
    http = require("http"),
    crypto = require("crypto"),
    logger = require("./logger/logger.js"),
    rooms = require("./chatterapp/rooms.js"),
    sockParser = require("./chatterapp/websocket.js"),
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


//create the http server and run
http.createServer(app).listen(app.get('port'), function(){
    var port = app.get('port');
    logger.logger.log("info", "Chatter server listening on port: " + port);
});


//create a copy of the websocket server and add the modules
ws.on("connection", function(client){
    client.id = crypto.randomBytes(5).toString('hex');

    client.on("message", function(data){
        console.log(data);
        sockParser.parseMessage(client, data);
    });
    
    client.send('Hello, welcome to chatter 0.0.1!');
});