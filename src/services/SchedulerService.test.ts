import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SchedulerService } from './SchedulerService.js';
import type { JobService } from './JobService.js';

// Mock JobService
const mockJobService: JobService = {
  autoCloseExpiredJobRoles: vi.fn().mockResolvedValue({
    closedCount: 2,
    message: 'Successfully auto-closed 2 job role(s)'
  })
} as any;

describe('SchedulerService', () => {
  let schedulerService: SchedulerService;

  beforeEach(() => {
    schedulerService = new SchedulerService(mockJobService);
    vi.clearAllMocks();
  });

  afterEach(() => {
    schedulerService.destroy();
  });

  describe('initialization', () => {
    it('should initialize schedules without errors', () => {
      expect(() => schedulerService.initializeSchedules()).not.toThrow();
    });

    it('should have auto-close task in task statuses after initialization', () => {
      schedulerService.initializeSchedules();
      const statuses = schedulerService.getTaskStatuses();
      expect(statuses).toHaveProperty('auto-close-expired-jobs');
      expect(statuses['auto-close-expired-jobs']).toBe(true);
    });
  });

  describe('task management', () => {
    beforeEach(() => {
      schedulerService.initializeSchedules();
    });

    it('should stop a specific task', () => {
      const result = schedulerService.stopTask('auto-close-expired-jobs');
      expect(result).toBe(true);
      
      const statuses = schedulerService.getTaskStatuses();
      expect(statuses['auto-close-expired-jobs']).toBe(false);
    });

    it('should start a stopped task', () => {
      schedulerService.stopTask('auto-close-expired-jobs');
      const result = schedulerService.startTask('auto-close-expired-jobs');
      expect(result).toBe(true);
      
      const statuses = schedulerService.getTaskStatuses();
      expect(statuses['auto-close-expired-jobs']).toBe(true);
    });

    it('should return false when trying to stop non-existent task', () => {
      const result = schedulerService.stopTask('non-existent-task');
      expect(result).toBe(false);
    });

    it('should return false when trying to start non-existent task', () => {
      const result = schedulerService.startTask('non-existent-task');
      expect(result).toBe(false);
    });

    it('should stop all tasks', () => {
      schedulerService.stopAllTasks();
      const statuses = schedulerService.getTaskStatuses();
      expect(statuses['auto-close-expired-jobs']).toBe(false);
    });

    it('should start all tasks', () => {
      schedulerService.stopAllTasks();
      schedulerService.startAllTasks();
      const statuses = schedulerService.getTaskStatuses();
      expect(statuses['auto-close-expired-jobs']).toBe(true);
    });
  });

  describe('manual triggers', () => {
    it('should manually trigger auto-close job roles', async () => {
      const result = await schedulerService.triggerAutoCloseJobRoles();
      
      expect(mockJobService.autoCloseExpiredJobRoles).toHaveBeenCalledOnce();
      expect(result).toEqual({
        closedCount: 2,
        message: 'Successfully auto-closed 2 job role(s)'
      });
    });

    it('should handle errors in manual trigger', async () => {
      const error = new Error('Database connection failed');
      vi.mocked(mockJobService.autoCloseExpiredJobRoles).mockRejectedValueOnce(error);

      await expect(schedulerService.triggerAutoCloseJobRoles()).rejects.toThrow('Database connection failed');
    });
  });

  describe('cleanup', () => {
    beforeEach(() => {
      schedulerService.initializeSchedules();
    });

    it('should destroy all tasks', () => {
      expect(() => schedulerService.destroy()).not.toThrow();
      
      // After destroy, task statuses should be empty
      const statuses = schedulerService.getTaskStatuses();
      expect(Object.keys(statuses)).toHaveLength(0);
    });
  });
});