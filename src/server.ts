import { schedulerService } from './di/SchedulerService.js';
import app from './index.js';
import 'dotenv/config';
import { logger } from './utils/logger.js';

const PORT = process.env['PORT'] || 3001;

// Initialize scheduler before starting the server
logger.info('Initializing scheduler...');
try {
  schedulerService.initializeSchedules();
  logger.info('Scheduler initialized successfully');
} catch (error) {
  logger.error('Failed to initialize scheduler:', error);
  // Continue anyway - scheduler is not critical to API functionality
}

// Start server
const server = app.listen(PORT, () => {
  logger.app.started(PORT);
  logger.info('✅ Server is running and ready to accept requests');
  logger.info('📝 Scheduler is active and running...');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.app.stopping();
  server.close(() => {
    logger.app.stopped();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.app.stopping();
  server.close(() => {
    logger.app.stopped();
    process.exit(0);
  });
});
