// src/utils/logger.js

const LoggerFactory = require('../middlewares/loggerManager');

const loggerType = process.env.LOGGER_TYPE || 'winston';

const logger = LoggerFactory.createLogger(loggerType);

module.exports = logger;