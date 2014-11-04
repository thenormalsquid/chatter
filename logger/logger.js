var winston = require('winston');

exports.logger = new (winston.Logger)({
  exitOnError: false,
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'logs/all-logs.log' })
  ],
  exceptionHandlers: [
    new (winston.transports.File)({ filename: 'logs/exceptions.log' })
  ]
});

//custom error logging for express
exports.logErrors = function logErrors(err, req, res, next) {
  logger.error(err.stack);
};



