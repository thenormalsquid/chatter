//create an instance of a web socket server
var r = require('./rooms.js');

var onJoinCmd = function(client, data){
    if(data.indexOf("chatter join") > -1){
        r.joinRoom(client, data);
        console.log("woo join");
    }
};

exports.parseMessage = function(client, data){
    //parse message and call the necessary response
    console.log(data.indexOf("chatter join") > -1);
    switch(data){
        case "chatter create":
            r.createAndSubscribe(client);
            break;
        default:
            onJoinCmd(client, data);
            console.log('wut');
    };
}