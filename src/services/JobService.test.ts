import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { JobRoleCreate, JobRoleDetails } from '../models/JobModel.js';
import type { JobRepository } from '../repositories/JobRepository.js';
import { JobService } from './JobService.js';

describe('JobService.addJob', () => {
  let jobService: JobService;
  let mockRepository: JobRepository;

  beforeEach(() => {
    mockRepository = {
      addJobRole: vi.fn(),
      updateJobRole: vi.fn(),
      getAllJobs: vi.fn(),
      getJobById: vi.fn(),
      getJobByID: vi.fn(),
      deleteJob: vi.fn(),
      getAllCapabilities: vi.fn(),
      getAllBands: vi.fn(),
      getAllStatuses: vi.fn(),
      autoCloseExpiredJobRoles: vi.fn(),
      getServerName: vi.fn(),
      getAppInfo: vi.fn(),
      getHealthInfo: vi.fn(),
    } as JobRepository;
    jobService = new JobService(mockRepository);
  });

  it('should add a valid job successfully', async () => {
    const validJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2025-12-31',
    };

    const mockCreatedJob: JobRoleDetails = {
      id: 1,
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      capabilityName: 'Engineering',
      bandId: 2,
      bandName: 'Associate',
      closingDate: '2025-12-31',
      description: null,
      responsibilities: null,
      jobSpecUrl: null,
      statusId: 1,
      statusName: 'Open',
      openPositions: 1,
    };

    vi.mocked(mockRepository.addJobRole).mockResolvedValue(mockCreatedJob);

    const result = await jobService.addJob(validJob);

    expect(result).toEqual(mockCreatedJob);
    expect(mockRepository.addJobRole).toHaveBeenCalledWith(validJob);
  });

  it('should add a job with optional fields', async () => {
    const jobWithOptionals: JobRoleCreate = {
      name: 'Senior Software Engineer',
      location: 'London',
      capabilityId: 1,
      bandId: 3,
      closingDate: '2025-12-31',
      description: 'A senior role requiring extensive experience',
      responsibilities: 'Lead development projects',
      jobSpecUrl: 'https://example.com/job-spec.pdf',
      statusId: 1,
      openPositions: 3,
    };

    const mockCreatedJob: JobRoleDetails = {
      id: 2,
      name: 'Senior Software Engineer',
      location: 'London',
      capabilityId: 1,
      capabilityName: 'Engineering',
      bandId: 3,
      bandName: 'Senior Associate',
      closingDate: '2025-12-31',
      description: 'A senior role requiring extensive experience',
      responsibilities: 'Lead development projects',
      jobSpecUrl: 'https://example.com/job-spec.pdf',
      statusId: 1,
      statusName: 'Open',
      openPositions: 3,
    };

    vi.mocked(mockRepository.addJobRole).mockResolvedValue(mockCreatedJob);

    const result = await jobService.addJob(jobWithOptionals);

    expect(result).toEqual(mockCreatedJob);
    expect(mockRepository.addJobRole).toHaveBeenCalledWith(jobWithOptionals);
  });

  it('should throw error for empty role name', async () => {
    const invalidJob: JobRoleCreate = {
      name: '',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2025-12-31',
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow('Role name is required');
  });

  it('should throw error for whitespace-only role name', async () => {
    const invalidJob: JobRoleCreate = {
      name: '   ',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2025-12-31',
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow('Role name is required');
  });

  it('should throw error for empty location', async () => {
    const invalidJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: '',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2025-12-31',
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow('Location is required');
  });

  it('should throw error for invalid capability ID', async () => {
    const invalidJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 0,
      bandId: 2,
      closingDate: '2025-12-31',
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow('Valid capability ID is required');
  });

  it('should throw error for invalid band ID', async () => {
    const invalidJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: -1,
      closingDate: '2025-12-31',
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow('Valid band ID is required');
  });

  it('should throw error for past closing date', async () => {
    const invalidJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2020-01-01',
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow(
      'Closing date must be in the future'
    );
  });

  it('should throw error for invalid date format (DD/MM/YYYY)', async () => {
    const invalidJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '31/12/2025',
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow(
      'Invalid closing date format. Use YYYY-MM-DD'
    );
  });

  it('should throw error for invalid date format (MM-DD-YYYY)', async () => {
    const invalidJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '12-31-2025',
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow(
      'Invalid closing date format. Use YYYY-MM-DD'
    );
  });

  it('should throw error for invalid openPositions (zero)', async () => {
    const invalidJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2025-12-31',
      openPositions: 0,
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow(
      'Open positions must be greater than 0'
    );
  });

  it('should throw error for invalid openPositions (negative)', async () => {
    const invalidJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2025-12-31',
      openPositions: -5,
    };

    await expect(jobService.addJob(invalidJob)).rejects.toThrow(
      'Open positions must be greater than 0'
    );
  });

  it('should return null when repository fails to add job', async () => {
    const validJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2025-12-31',
    };

    vi.mocked(mockRepository.addJobRole).mockResolvedValue(null);

    const result = await jobService.addJob(validJob);

    expect(result).toBe(null);
  });

  it('should accept today as closing date', async () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    const validJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: todayString,
    };

    const mockCreatedJob: JobRoleDetails = {
      id: 3,
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      capabilityName: 'Engineering',
      bandId: 2,
      bandName: 'Associate',
      closingDate: todayString,
      description: null,
      responsibilities: null,
      jobSpecUrl: null,
      statusId: 1,
      statusName: 'Open',
      openPositions: 1,
    };

    vi.mocked(mockRepository.addJobRole).mockResolvedValue(mockCreatedJob);

    const result = await jobService.addJob(validJob);

    expect(result).toEqual(mockCreatedJob);
  });
});

describe('JobService.getCapabilities', () => {
  let jobService: JobService;
  let mockRepository: JobRepository;

  beforeEach(() => {
    mockRepository = {
      addJobRole: vi.fn(),
      updateJobRole: vi.fn(),
      getAllJobs: vi.fn(),
      getJobById: vi.fn(),
      getJobByID: vi.fn(),
      deleteJob: vi.fn(),
      getAllCapabilities: vi.fn(),
      getAllBands: vi.fn(),
      getAllStatuses: vi.fn(),
      autoCloseExpiredJobRoles: vi.fn(),
      getServerName: vi.fn(),
      getAppInfo: vi.fn(),
      getHealthInfo: vi.fn(),
    } as JobRepository;
    jobService = new JobService(mockRepository);
  });

  it('should return all capabilities', async () => {
    const mockCapabilities = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Data' },
      { id: 3, name: 'Cyber Security' },
    ];

    vi.mocked(mockRepository.getAllCapabilities).mockResolvedValue(mockCapabilities);

    const result = await jobService.getCapabilities();

    expect(result).toEqual(mockCapabilities);
    expect(mockRepository.getAllCapabilities).toHaveBeenCalled();
  });

  it('should return empty array when no capabilities exist', async () => {
    vi.mocked(mockRepository.getAllCapabilities).mockResolvedValue([]);

    const result = await jobService.getCapabilities();

    expect(result).toEqual([]);
    expect(mockRepository.getAllCapabilities).toHaveBeenCalled();
  });
});

describe('JobService.getBands', () => {
  let jobService: JobService;
  let mockRepository: JobRepository;

  beforeEach(() => {
    mockRepository = {
      addJobRole: vi.fn(),
      updateJobRole: vi.fn(),
      getAllJobs: vi.fn(),
      getJobById: vi.fn(),
      getJobByID: vi.fn(),
      deleteJob: vi.fn(),
      getAllCapabilities: vi.fn(),
      getAllBands: vi.fn(),
      getAllStatuses: vi.fn(),
      autoCloseExpiredJobRoles: vi.fn(),
      getServerName: vi.fn(),
      getAppInfo: vi.fn(),
      getHealthInfo: vi.fn(),
    } as JobRepository;
    jobService = new JobService(mockRepository);
  });

  it('should return all bands', async () => {
    const mockBands = [
      { id: 1, name: 'Trainee' },
      { id: 2, name: 'Associate' },
      { id: 3, name: 'Senior Associate' },
    ];

    vi.mocked(mockRepository.getAllBands).mockResolvedValue(mockBands);

    const result = await jobService.getBands();

    expect(result).toEqual(mockBands);
    expect(mockRepository.getAllBands).toHaveBeenCalled();
  });

  it('should return empty array when no bands exist', async () => {
    vi.mocked(mockRepository.getAllBands).mockResolvedValue([]);

    const result = await jobService.getBands();

    expect(result).toEqual([]);
    expect(mockRepository.getAllBands).toHaveBeenCalled();
  });
});
