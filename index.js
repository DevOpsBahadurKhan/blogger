// Load environment variables
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.config.js';
import logger from './src/utils/logger.js';
import userRoutes from './src/routes/user.routes.js';
import postRoutes from './src/routes/post.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import permissionRoutes from './src/routes/permission.routes.js';
import roleRoutes from './src/routes/role.routes.js';
import userRoleRoutes from './src/routes/userRole.routes.js';
import attributeRoutes from './src/routes/attribute.routes.js';
import commentRoutes from './src/routes/comment.routes.js';
import profileRoutes from './src/routes/profile.routes.js';
import passport from './src/middlewares/passportJWT.js';
import errorHandler from './src/middlewares/errorHandler.js';
import loadAccessControl from './src/utils/accessControl.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

// Health check endpoint for Docker
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// Routes
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', permissionRoutes);
app.use('/api', roleRoutes);
app.use('/api', userRoleRoutes);
app.use('/api', attributeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/profiles', profileRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await loadAccessControl(); // ✅ loads and sets global.ac inside
    app.listen(PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
