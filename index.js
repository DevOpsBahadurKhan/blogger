const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const { connectDB } = require('./src/config/db.config');

const logger = require('./src/utils/logger');

// import routes
app.use('/api', require('./src/routes/user.routes'));
app.use('/api', require('./src/routes/auth.routes'));
app.use(require('./src/middlewares/passportJWT')().initialize());
app.use(require('./src/middlewares/errorHandler'));

const loadAccessControl = require('./src/utils/accessControl');



// Server start with DB connect
(async () => {
    await connectDB(); // DB connection + sync
    const ac = await loadAccessControl();
    global.ac = ac; // or inject it into verifyAccess
    app.listen(PORT, () => {
        logger.info(`🚀 Server running at http://localhost:${PORT}`);
    });
})();

