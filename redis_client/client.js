var redis = require("redis"),
    logger = require("./logger/logger.js"),
    client = redis.createClient();

client.on("error", function(err) {
    logger.logger.error(err);
    console.log("Error " + err);
});