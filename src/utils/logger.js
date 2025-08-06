// this is singleton use use factory
import LoggerFactory from '../loggers/loggerManager.js';

import 'dotenv/config'; // Load environment variables

const loggerType = process.env.LOGGER_TYPE || 'winston';
const loggerOptions = {
    elasticsearch: process.env.ELASTICSEARCH_ENABLED === 'true', // Enable Elasticsearch based on env
};

const logger = LoggerFactory.createLogger(loggerType, loggerOptions);

export default logger;
