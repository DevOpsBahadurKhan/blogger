// src/loggers/console.logger.js

export default class ConsoleLogger {
  log(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta, // Structured fields like { userId: 1 }
    };

    console.log(JSON.stringify(logEntry)); // ✅ Consistent JSON output
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }
}
