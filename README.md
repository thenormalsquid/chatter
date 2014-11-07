Chatter
=========

Peer-based crypto group chat.


Version
----

0.0.1

Tech
-----------
* Flask - http and website (not implemented)
* node - web server and chatrooms
* nginx - reverse proxy and static site
* redis - persistent data store for chat rooms, and chat history
* postgres - db for user data, long term message store, and chat rooms (not implemented)

Installation
--------------

```
git clone git@github.com:thenormalsquid/chatter.git
npm install
```

##### Configure Plugins. Instructions in following config files:

*

Run:
```sh
node server.js
```

Testing:

* Creating a chat room
```
wscat -c ws://127.0.0.1:8888
'chatter create'
```

* Joining a chat room
```
wscat -c ws://127.0.0.1:8888
'chatter join <roomId>'
```

TODOS
=======
- flesh out ios app and connect
- encapsulate the client into an object - i find it weird to have a 'chat' method on the room object
- explore different assymetric keys
- flesh out flask
- hook in redis
- see trello for more todos




