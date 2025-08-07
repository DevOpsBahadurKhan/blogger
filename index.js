// Load environment variables
import 'dotenv/config';
import express from 'express';

import { connectDB } from './src/config/db.config.js';
import logger from './src/utils/logger.js';
import userRoutes from './src/routes/user.routes.js';
import postRoutes from './src/routes/post.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import passportJWT from './src/middlewares/passportJWT.js';
import errorHandler from './src/middlewares/errorHandler.js';
import loadAccessControl from './src/utils/accessControl.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware & Routes
app.use(passportJWT().initialize());
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use(errorHandler);

// Server start with DB connect
await connectDB();
await loadAccessControl(); // ✅ loads and sets global.ac inside

app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
