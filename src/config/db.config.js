import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
import createDatabaseIfNotExists from './ensureDatabase.js';

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

// Initialize Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false,
});

// Connect & Sync
const connectDB = async () => {
    try {
        await createDatabaseIfNotExists(DB_HOST, DB_USER, DB_PASS, DB_NAME);

        await sequelize.authenticate();
        logger.info('✅ Database connected!');

        await sequelize.sync({ alter: true, force: false });
        logger.info('📦 All models synchronized (auto-migrated).');
    } catch (error) {
        logger.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

export { sequelize, connectDB };
