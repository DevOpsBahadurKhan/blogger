// src/loggers/winston.logger.js
import { createLogger, transports, format } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch'; // Use real client here
import 'dotenv/config';

export default class WinstonLogger {
  constructor(options = {}) {
    const loggerTransports = [
      new transports.Console(),
      new transports.File({ filename: 'logs/app.log' }),
    ];

    // ✅ Proper Elasticsearch client instance
    if (options.elasticsearch) {
      const esClient = new Client({
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
        // Optional auth
        // auth: {
        //   username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        //   password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
        // },
      });

      const esTransport = new ElasticsearchTransport({
        level: 'debug',
        index: 'app-logs',
        client: esClient, // ✅ Correctly passed
        bufferLimit: 100,
        flushInterval: 2000,
      });

      esTransport.on('error', (error) => {
        console.error('[Winston-Elasticsearch] Error:', error.message);
      });

      loggerTransports.push(esTransport);
    }

    this.logger = createLogger({
      level: 'debug',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      transports: loggerTransports,
    });
  }

  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
}
