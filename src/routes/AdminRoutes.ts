import express from 'express';
import { schedulerService } from '../di/SchedulerService.js';

const router = express.Router();

/**
 * GET /api/admin/scheduler/status
 * Get the status of all scheduled tasks
 */
router.get('/scheduler/status', (_req, res) => {
  try {
    const statuses = schedulerService.getTaskStatuses();
    res.json({
      success: true,
      data: {
        tasks: statuses,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get scheduler status',
    });
  }
});

/**
 * POST /api/admin/scheduler/start/:taskName
 * Start a specific scheduled task
 */
router.post('/scheduler/start/:taskName', (req, res) => {
  try {
    const { taskName } = req.params;
    const success = schedulerService.startTask(taskName);

    if (success) {
      res.json({
        success: true,
        message: `Task '${taskName}' started successfully`,
      });
    } else {
      res.status(400).json({
        success: false,
        error: `Task '${taskName}' not found or already running`,
      });
    }
  } catch (error) {
    console.error('Error starting task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start task',
    });
  }
});

/**
 * POST /api/admin/scheduler/stop/:taskName
 * Stop a specific scheduled task
 */
router.post('/scheduler/stop/:taskName', (req, res) => {
  try {
    const { taskName } = req.params;
    const success = schedulerService.stopTask(taskName);

    if (success) {
      res.json({
        success: true,
        message: `Task '${taskName}' stopped successfully`,
      });
    } else {
      res.status(400).json({
        success: false,
        error: `Task '${taskName}' not found or already stopped`,
      });
    }
  } catch (error) {
    console.error('Error stopping task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop task',
    });
  }
});

/**
 * POST /api/admin/scheduler/start-all
 * Start all scheduled tasks
 */
router.post('/scheduler/start-all', (_req, res) => {
  try {
    schedulerService.startAllTasks();
    res.json({
      success: true,
      message: 'All tasks started successfully',
    });
  } catch (error) {
    console.error('Error starting all tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start all tasks',
    });
  }
});

/**
 * POST /api/admin/scheduler/stop-all
 * Stop all scheduled tasks
 */
router.post('/scheduler/stop-all', (_req, res) => {
  try {
    schedulerService.stopAllTasks();
    res.json({
      success: true,
      message: 'All tasks stopped successfully',
    });
  } catch (error) {
    console.error('Error stopping all tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop all tasks',
    });
  }
});

/**
 * POST /api/admin/scheduler/trigger/auto-close
 * Manually trigger the auto-close job roles task
 */
router.post('/scheduler/trigger/auto-close', async (_req, res) => {
  try {
    const result = await schedulerService.triggerAutoCloseJobRoles();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error triggering auto-close task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger auto-close task',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as adminRoutes };
