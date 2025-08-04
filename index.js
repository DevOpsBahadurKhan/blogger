const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const { connectDB } = require('./src/config/db.config');

// import routes
app.use('api', require('./src/routes/user.routes'));
app.use('/api', require('./src/routes/auth.routes'));
app.use(require('./src/middlewares/passportJWT')().initialize());
app.use(require('./src/middlewares/errorHandler'));

// Server start with DB connect
(async () => {
    await connectDB(); // DB connection + sync

    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
})();

