//Usage:
//PORT=1234 HOST=localhost node client.js
var host = process.env.HOST || "127.0.0.1";
var port = process.env.PORT || 8888;

var WebSocket = require('ws');
var ws = new WebSocket("ws://" + host + ":" + port);

ws.on('open', function () {});
ws.on('error', console.log.bind(console));
ws.on('close', function() {
  console.log('closed');
  process.exit(0);
});

ws.on('message', function (message){
  console.log('>', message);
});

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    ws.send(chunk.trim());
  }
});

process.stdin.on('end', function () {
  process.stdout.write('end');
});
