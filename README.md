Chatter
=========

Chatter is an encrypted chat room server and app.

 
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
npm install hiredis redis
npm install -g ws
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



