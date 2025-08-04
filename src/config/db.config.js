require('dotenv').config();
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

const createDatabaseIfNotExists = require('./ensureDatabase');

//Initialize Sequelize
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

        await sequelize.sync({ alter: false, force: false }); 
        logger.info('📦 All models synchronized (auto-migrated).');
    } catch (error) {
        logger.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
