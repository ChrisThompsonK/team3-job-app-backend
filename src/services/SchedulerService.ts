import cron, { type ScheduledTask } from 'node-cron';
import type { JobService } from './JobService.js';

export class SchedulerService {
  private jobService: JobService;
  private autoCloseTask: ScheduledTask | null = null;

  constructor(jobService: JobService) {
    this.jobService = jobService;
  }

  /**
   * Initialize all scheduled tasks
   */
  public initializeSchedules(): void {
    console.log('SchedulerService: Initializing scheduled tasks...');

    // Schedule auto-close job roles to run daily at 1:00 AM
    this.scheduleAutoCloseJobRoles();

    console.log('SchedulerService: All scheduled tasks initialized successfully');
  }

  /**
   * Schedule the auto-close expired job roles task
   * Runs daily at 1:00 AM by default (configurable via AUTO_CLOSE_CRON_SCHEDULE env var)
   */
  private scheduleAutoCloseJobRoles(): void {
    // Cron expression: 0 1 * * * (every day at 1:00 AM)
    // Can be configured via environment variable AUTO_CLOSE_CRON_SCHEDULE
    const cronExpression = process.env['AUTO_CLOSE_CRON_SCHEDULE'] || '0 1 * * *';

    this.autoCloseTask = cron.schedule(
      cronExpression,
      async () => {
        try {
          console.log(
            `[${new Date().toISOString()}] Running scheduled task: Auto-close expired job roles`
          );

          const result = await this.jobService.autoCloseExpiredJobRoles();

          console.log(`[${new Date().toISOString()}] Auto-close task completed: ${result.message}`);
        } catch (error) {
          console.error(`[${new Date().toISOString()}] Error in auto-close task:`, error);
        }
      },
      {
        timezone: 'UTC', // Use UTC timezone for consistency
      }
    );

    console.log(
      `SchedulerService: Scheduled 'auto-close-expired-jobs' with cron expression '${cronExpression}' (UTC)`
    );
  }

  /**
   * Manually trigger the auto-close job roles task (for testing)
   */
  public async triggerAutoCloseJobRoles(): Promise<{ closedCount: number; message: string }> {
    console.log('SchedulerService: Manually triggering auto-close expired job roles...');

    try {
      const result = await this.jobService.autoCloseExpiredJobRoles();
      console.log(`SchedulerService: Manual trigger completed: ${result.message}`);
      return result;
    } catch (error) {
      console.error('SchedulerService: Error in manual trigger:', error);
      throw error;
    }
  }

  /**
   * Destroy all tasks and clean up
   */
  public destroy(): void {
    console.log('SchedulerService: Destroying all scheduled tasks...');

    if (this.autoCloseTask) {
      this.autoCloseTask.destroy();
      this.autoCloseTask = null;
      console.log('SchedulerService: Destroyed auto-close task');
    }

    console.log('SchedulerService: All tasks destroyed and cleaned up');
  }
}
