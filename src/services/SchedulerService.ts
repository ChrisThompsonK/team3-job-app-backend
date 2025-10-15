import cron, { type ScheduledTask } from 'node-cron';
import type { JobService } from './JobService.js';

export class SchedulerService {
  private jobService: JobService;
  private tasks: Map<string, ScheduledTask> = new Map();
  private taskStatuses: Map<string, boolean> = new Map();

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
   * Runs daily at 1:00 AM
   */
  private scheduleAutoCloseJobRoles(): void {
    const taskName = 'auto-close-expired-jobs';
    
    // Cron expression: 0 1 * * * (every day at 1:00 AM)
    const cronExpression = '0 1 * * *';
    
    const task = cron.schedule(cronExpression, async () => {
      try {
        console.log(`[${new Date().toISOString()}] Running scheduled task: Auto-close expired job roles`);
        
        const result = await this.jobService.autoCloseExpiredJobRoles();
        
        console.log(`[${new Date().toISOString()}] Auto-close task completed: ${result.message}`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in auto-close task:`, error);
      }
    }, {
      timezone: 'UTC' // Use UTC timezone for consistency
    });

    this.tasks.set(taskName, task);
    this.taskStatuses.set(taskName, true);
    
    console.log(`SchedulerService: Scheduled '${taskName}' to run daily at 1:00 AM UTC`);
  }

  /**
   * Start all scheduled tasks
   */
  public startAllTasks(): void {
    console.log('SchedulerService: Starting all scheduled tasks...');
    
    for (const [taskName, task] of this.tasks) {
      if (!this.taskStatuses.get(taskName)) {
        task.start();
        this.taskStatuses.set(taskName, true);
        console.log(`SchedulerService: Started task '${taskName}'`);
      }
    }
  }

  /**
   * Stop all scheduled tasks
   */
  public stopAllTasks(): void {
    console.log('SchedulerService: Stopping all scheduled tasks...');
    
    for (const [taskName, task] of this.tasks) {
      if (this.taskStatuses.get(taskName)) {
        task.stop();
        this.taskStatuses.set(taskName, false);
        console.log(`SchedulerService: Stopped task '${taskName}'`);
      }
    }
  }

  /**
   * Stop a specific task by name
   */
  public stopTask(taskName: string): boolean {
    const task = this.tasks.get(taskName);
    if (task && this.taskStatuses.get(taskName)) {
      task.stop();
      this.taskStatuses.set(taskName, false);
      console.log(`SchedulerService: Stopped task '${taskName}'`);
      return true;
    }
    return false;
  }

  /**
   * Start a specific task by name
   */
  public startTask(taskName: string): boolean {
    const task = this.tasks.get(taskName);
    if (task && !this.taskStatuses.get(taskName)) {
      task.start();
      this.taskStatuses.set(taskName, true);
      console.log(`SchedulerService: Started task '${taskName}'`);
      return true;
    }
    return false;
  }

  /**
   * Get status of all tasks
   */
  public getTaskStatuses(): Record<string, boolean> {
    const statuses: Record<string, boolean> = {};
    
    for (const [taskName] of this.tasks) {
      statuses[taskName] = this.taskStatuses.get(taskName) || false;
    }
    
    return statuses;
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
    
    for (const [taskName, task] of this.tasks) {
      task.destroy();
      console.log(`SchedulerService: Destroyed task '${taskName}'`);
    }
    
    this.tasks.clear();
    this.taskStatuses.clear();
    console.log('SchedulerService: All tasks destroyed and cleaned up');
  }
}