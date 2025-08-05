// src/middlewares/logger.js

import ConsoleLogger from '../loggers/console.logger.js';
import WinstonLogger from '../loggers/winston.logger.js';


export default class Logger {
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


