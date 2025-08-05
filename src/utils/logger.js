import LoggerFactory from '../middlewares/loggerManager.js';

const loggerType = process.env.LOGGER_TYPE || 'winston';

const logger = LoggerFactory.createLogger(loggerType);

export default logger;
