import { describe, expect, it, vi } from 'vitest';
import { JobService } from './JobService.js';
import type { JobRepository } from '../repositories/JobRepository.js';

describe('JobService - autoCloseExpiredJobRoles', () => {
  it('should call repository method and return formatted result', async () => {
    // Mock repository
    const mockJobRepository = {
      autoCloseExpiredJobRoles: vi.fn().mockResolvedValue(3),
    } as unknown as JobRepository;

    const jobService = new JobService(mockJobRepository);

    // Call the service method
    const result = await jobService.autoCloseExpiredJobRoles();

    // Verify repository was called
    expect(mockJobRepository.autoCloseExpiredJobRoles).toHaveBeenCalledTimes(1);

    // Verify result format
    expect(result).toEqual({
      closedCount: 3,
      message: 'Successfully auto-closed 3 job role(s)',
    });
  });

  it('should return appropriate message when no jobs are closed', async () => {
    // Mock repository returning 0 closed jobs
    const mockJobRepository = {
      autoCloseExpiredJobRoles: vi.fn().mockResolvedValue(0),
    } as unknown as JobRepository;

    const jobService = new JobService(mockJobRepository);

    // Call the service method
    const result = await jobService.autoCloseExpiredJobRoles();

    // Verify result
    expect(result).toEqual({
      closedCount: 0,
      message: 'No job roles needed to be closed',
    });
  });

  it('should propagate errors from repository', async () => {
    // Mock repository throwing error
    const mockJobRepository = {
      autoCloseExpiredJobRoles: vi.fn().mockRejectedValue(new Error('Database connection failed')),
    } as unknown as JobRepository;

    const jobService = new JobService(mockJobRepository);

    // Verify error is propagated
    await expect(jobService.autoCloseExpiredJobRoles()).rejects.toThrow(
      'Database connection failed'
    );
  });
});
