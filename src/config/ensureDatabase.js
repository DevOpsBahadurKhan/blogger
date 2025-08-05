import mysql from 'mysql2/promise'; // ✅ ES module import

// Create DB if not exists using mysql2
const createDatabaseIfNotExists = async (DB_HOST, DB_USER, DB_PASS, DB_NAME) => {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`📁 Database '${DB_NAME}' ensured.`);
        await connection.end();
    } catch (err) {
        console.error('❌ Failed to create database:', err.message);
        process.exit(1);
    }
};

export default createDatabaseIfNotExists;
