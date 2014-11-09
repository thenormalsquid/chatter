var ws = require('ws'),
    server = require('./chatterapp/server.js');

wsServer = new ws.Server({port: process.env.PORT || 1344 });
wsServer.on("connection", server.newConnection.bind(server));
