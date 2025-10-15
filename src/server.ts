import app from './index.js';
import { schedulerService } from './di/SchedulerService.js';
import 'dotenv/config';

const PORT = process.env['PORT'] || 3001;

// Initialize scheduler before starting the server
console.log('Initializing scheduler...');
schedulerService.initializeSchedules();

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  console.log('Scheduler is active and running...');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  schedulerService.destroy();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  schedulerService.destroy();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
