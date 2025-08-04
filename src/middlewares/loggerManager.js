// src/middlewares/logger.js

const ConsoleLogger = require('../loggers/console.logger');
const WinstonLogger = require('../loggers/winston.logger');

class Logger {
    static createLogger(type = 'console') {
        switch (type.toLowerCase()) {
            case 'winston':
                return new WinstonLogger();
            case 'console':
            default:
                return new ConsoleLogger();
        }
    }
}

module.exports = Logger;
