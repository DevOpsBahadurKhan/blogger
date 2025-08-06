// src/loggers/loggerManager.js

import ConsoleLogger from './console.logger.js';
import WinstonLogger from './winston.logger.js';

export default class LoggerFactory {
  static createLogger(type = 'console', options = {}) {
    switch (type.toLowerCase()) {
      case 'console':
        return new ConsoleLogger();
      case 'winston':
        return new WinstonLogger(options);
      default:
        return new ConsoleLogger();
    }
  }
}
