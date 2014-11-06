var crypto = require("crypto"),
    redis = require("redis"),
    logger = require("../logger/logger.js"),
    ws = require("./websocket.js"),
    client = redis.createClient();

//when creating an instance of a room, we need to persist the room
//maybe in a set in redis
//we'll also have to persist clients per rooms

//this will be persisted as a set in redis
var rooms = [];

//create constructor for a room
function Room() {
    //on creation of a room, set the id in redis
    this.id = crypto.randomBytes(15).toString('hex');
    this.clients = [];
};

Room.prototype.getId = function getId(){
    //getter method for id to be used when
    //subscribing 
    return this.id;
};


Room.prototype.addClient = function addClient(client) {
    this.clients.push(client);
};


Room.prototype.create = function create() {
    //subscribe to the room channel's id
    var id = this.getId();
    client.set(id, 1);
    logger.logger.info('room ' + id + ' was created');
};


Room.prototype.broadcast = function broadcast(data) {
    //broadcast to all clients in this room
    var clients = this.clients,
        len = clients.length;

    for(var i = 0; i < len; i++){
        clients[i].send(data);
    }
};

Room.prototype.chat = function chat(client) {
    //add client to chat
    var me = this;

    client.on("message", function(data){
        me.broadcast("Client " + client.id.toString() + " % " + data);
    });
};

Room.prototype.join = function join(client) {
    //just adds a client id to the clients stack
    //for now

    var clients = this.clients,
        len = clients.length;

    var clientExistsInRoom = function(client){
        //check if the client exists already
        if(len > 0){      
            for(var i = 0; i < len; i++){
                var c = clients[i];
                return c.id === client.id;
            }
        } else {
            return false;
        }
    };

    if(!clientExistsInRoom(client)){
        this.addClient(client);
        var msg = client.id + " has joined the room.";

        logger.logger.info(msg);
        client.send("You have joined room: " + this.getId());
        this.broadcast(msg)
        this.chat(client);
    } else {
        logger.logger.info("error, client with id: " + client.id + " is already in this room.");
        this.chat(client);
    }
};

exports.createAndSubscribe = function(client){
    //create rooms and subscribe here
    var room = new Room();
    room.create();
    
    room.join(client);
    rooms.push(room);
};

exports.joinRoom = function(client, data){
    //we search through our temporary global room list
    // this will eventually be a set in redis
    var roomId = data.substring(13);
    for(var i = 0; i < rooms.length; i++){
        var room = rooms[i];
        if(room.id === roomId){
            room.join(client);
        } else {
            client.send("Room doesnt exist, create with: chatter create");
        }
    }
};