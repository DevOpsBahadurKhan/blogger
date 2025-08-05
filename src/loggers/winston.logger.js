// src/loggers/winston.logger.js

import { createLogger, transports, format } from 'winston';

const winstonLogger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

export default class WinstonLogger {
  info(message) {
    winstonLogger.info(message);
  }

  warn(message) {
    winstonLogger.warn(message);
  }

  error(message) {
    winstonLogger.error(message);
  }

  debug(message) {
    winstonLogger.debug(message);
  }
}
