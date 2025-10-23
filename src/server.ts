import { schedulerService } from './di/SchedulerService.js';
import app from './index.js';
import 'dotenv/config';
import { logger } from './utils/logger.js';

const PORT = process.env['PORT'] || 3001;

// Initialize scheduler before starting the server
logger.info('Initializing scheduler...');
schedulerService.initializeSchedules();

// Start server
const server = app.listen(PORT, () => {
  logger.app.started(PORT);
  logger.info('Scheduler is active and running...');
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
