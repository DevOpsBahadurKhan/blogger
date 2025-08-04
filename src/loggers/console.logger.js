// src/loggers/console.logger.js

class ConsoleLogger {
  info(message) {
    console.info(`[INFO]: ${message}`);
  }

  warn(message) {
    console.warn(`[WARN]: ${message}`);
  }

  error(message) {
    console.error(`[ERROR]: ${message}`);
  }

  debug(message) {
    console.debug(`[DEBUG]: ${message}`);
  }
}

module.exports = ConsoleLogger;
