import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { JobService } from './JobService.js';
import { SchedulerService } from './SchedulerService.js';

// Mock JobService
const mockJobService: JobService = {
  autoCloseExpiredJobRoles: vi.fn().mockResolvedValue({
    closedCount: 2,
    message: 'Successfully auto-closed 2 job role(s)',
  }),
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
  });

  describe('manual triggers', () => {
    it('should manually trigger auto-close job roles', async () => {
      const result = await schedulerService.triggerAutoCloseJobRoles();

      expect(mockJobService.autoCloseExpiredJobRoles).toHaveBeenCalledOnce();
      expect(result).toEqual({
        closedCount: 2,
        message: 'Successfully auto-closed 2 job role(s)',
      });
    });

    it('should handle errors in manual trigger', async () => {
      const error = new Error('Database connection failed');
      vi.mocked(mockJobService.autoCloseExpiredJobRoles).mockRejectedValueOnce(error);

      await expect(schedulerService.triggerAutoCloseJobRoles()).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('cleanup', () => {
    beforeEach(() => {
      schedulerService.initializeSchedules();
    });

    it('should destroy all tasks without errors', () => {
      expect(() => schedulerService.destroy()).not.toThrow();
    });
  });
});
