import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.config.js';
import logger from './src/utils/logger.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import passportJWT from './src/middlewares/passportJWT.js';
import errorHandler from './src/middlewares/errorHandler.js';
import loadAccessControl from './src/utils/accessControl.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware & Routes
app.use(passportJWT().initialize());
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use(errorHandler);

// Server start with DB connect
(async () => {
    await connectDB();
    const ac = await loadAccessControl();
    global.ac = ac;

    app.listen(PORT, () => {
        logger.info(`🚀 Server running at http://localhost:${PORT}`);
    });
})();
