---
applyTo: '**/*.test.ts', '**/*.spec.ts', 'vitest.config.ts'
---

# Testing Instructions for Team 3 Job Application Backend

## 📋 **Read This First**
**Always read this file when creating, modifying, or reviewing tests.** This ensures consistency across all test suites and maintains quality standards.

## 🎯 **Testing Philosophy**
This project uses a **layered testing approach**:
- **Unit Tests** (Vitest): Test individual services, utilities, and business logic in isolation
- **Integration Tests** (Vitest): Test services interacting with repositories and databases
- **Database Tests**: Optional tests using in-memory SQLite for data layer validation

### Goal
Achieve **70%+ code coverage** on critical paths (services, business logic). Focus on meaningful tests that catch real bugs, not just line coverage.

---

## 🛠️ **Testing Tools & Configuration**

### Unit/Integration Tests
- **Framework**: Vitest 3.2.4
- **Config**: `vitest.config.ts`
- **Commands**:
  - `npm run test` - Interactive test runner
  - `npm run test:run` - Run all tests once (CI mode)
  - `npm run test:ui` - Open Vitest UI in browser
  - `npm run test:coverage` - Generate coverage report

### Environment Setup
- **Setup File**: `vitest.setup.ts` (if needed for test environment)
- **Database**: SQLite in-memory (`:memory:`) for tests
- **Node Version**: >= 18.0.0

---

## 📁 **Test File Organization**

### Current Structure
```
src/
├── services/
│   ├── JobService.ts
│   ├── JobService.test.ts              ✅ Unit tests for main methods
│   ├── JobService.autoClose.test.ts    ✅ Specialized test for scheduler
│   ├── SchedulerService.ts
│   ├── SchedulerService.test.ts        ✅ Unit tests
│   ├── ApplicationService.ts
│   │   # TODO: Add ApplicationService.test.ts (missing)
│   └── AuthService.ts
├── controllers/
│   ├── ApplicationController.ts
│   ├── JobController.ts
│   └── __tests__/                      # Recommended: Create for integration tests
│       ├── ApplicationController.test.ts
│       └── JobController.test.ts
├── repositories/
│   ├── ApplicationRepository.ts
│   ├── JobRepository.ts
│   └── __tests__/
│       ├── ApplicationRepository.test.ts    # Optional: for complex queries
│       └── JobRepository.test.ts
└── utils/
    └── __tests__/
        └── validation.test.ts               # Utility tests
```

### Recommended Structure for New Tests
```typescript
// src/services/__tests__/ApplicationService.test.ts
// OR
// src/services/ApplicationService.test.ts (simpler, co-located)
```

---

## ✅ **Test Writing Standards**

### 1. **Unit Tests (Services)**

**Purpose**: Test isolated business logic with mocked dependencies.

**Structure**:
```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { JobRepository } from '../repositories/JobRepository.js';
import { JobService } from './JobService.js';
import type { JobRoleCreate, JobRoleDetails } from '../models/JobModel.js';

describe('JobService.addJob', () => {
  let jobService: JobService;
  let mockRepository: JobRepository;

  beforeEach(() => {
    // ✅ Mock repository with all required methods
    mockRepository = {
      addJobRole: vi.fn(),
      updateJobRole: vi.fn(),
      getAllJobs: vi.fn(),
      getJobById: vi.fn(),
      deleteJob: vi.fn(),
      getAllCapabilities: vi.fn(),
      getAllBands: vi.fn(),
      getAllStatuses: vi.fn(),
    } as JobRepository;

    // ✅ Initialize service with mocked repository
    jobService = new JobService(mockRepository);
  });

  it('should add a valid job successfully', async () => {
    // ✅ Arrange: Prepare test data
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
      statusId: 1,
      statusName: 'Open',
      openPositions: 1,
    };

    // ✅ Mock the repository method
    vi.mocked(mockRepository.addJobRole).mockResolvedValue(mockCreatedJob);

    // ✅ Act: Call the service method
    const result = await jobService.addJob(validJob);

    // ✅ Assert: Verify the result
    expect(result).toEqual(mockCreatedJob);
    expect(mockRepository.addJobRole).toHaveBeenCalledWith(validJob);
    expect(mockRepository.addJobRole).toHaveBeenCalledOnce();
  });

  it('should reject job with missing required fields', async () => {
    // ✅ Test validation
    const invalidJob = { name: 'Software Engineer' } as JobRoleCreate;

    // ✅ Expect error to be thrown or handled
    await expect(jobService.addJob(invalidJob)).rejects.toThrow(
      'Missing required fields'
    );
    
    // ✅ Verify repository was never called
    expect(mockRepository.addJobRole).not.toHaveBeenCalled();
  });

  it('should handle repository errors gracefully', async () => {
    // ✅ Test error handling
    const validJob: JobRoleCreate = {
      name: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1,
      bandId: 2,
      closingDate: '2025-12-31',
    };

    // ✅ Mock repository to throw error
    vi.mocked(mockRepository.addJobRole).mockRejectedValue(
      new Error('Database connection failed')
    );

    // ✅ Assert error propagation
    await expect(jobService.addJob(validJob)).rejects.toThrow(
      'Database connection failed'
    );
  });
});
```

**Conventions**:
- ✅ Use AAA pattern: Arrange, Act, Assert
- ✅ Mock all external dependencies (`repositories`, `services`)
- ✅ Use `vi.fn()` for mocking and spying
- ✅ Clear mocks with `vi.clearAllMocks()` between tests
- ✅ Test both success AND error paths
- ✅ Test validation and edge cases
- ✅ Use type-safe mocks with `vi.mocked()`
- ✅ One logical assertion per test (multiple related assertions OK)

### 2. **Integration Tests (Controllers)**

**Purpose**: Test HTTP endpoint handling with mocked services.

**Structure**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { ApplicationController } from '../ApplicationController.js';
import type { ApplicationService } from '../../services/ApplicationService.js';

// ✅ Mock the service
vi.mock('../../services/ApplicationService.js');

describe('ApplicationController', () => {
  let app: express.Application;
  let applicationService: ApplicationService;

  beforeEach(() => {
    vi.clearAllMocks();

    // ✅ Create Express app with controller routes
    app = express();
    app.use(express.json());

    // ✅ Create mock service
    applicationService = {
      submitApplication: vi.fn(),
      getApplicationById: vi.fn(),
      updateApplicationStatus: vi.fn(),
      withdrawApplication: vi.fn(),
    } as unknown as ApplicationService;

    // ✅ Create controller and register routes
    const controller = new ApplicationController(applicationService);
    app.post('/api/applications', controller.submitApplication.bind(controller));
    app.get('/api/applications/:id', controller.getApplicationById.bind(controller));
    app.patch('/api/applications/:id/status', controller.updateApplicationStatus.bind(controller));
  });

  describe('POST /api/applications', () => {
    it('should submit application successfully', async () => {
      // ✅ Arrange: Mock service response
      const mockResponse = {
        success: true,
        applicationID: 123,
        message: 'Application submitted successfully',
      };
      vi.mocked(applicationService.submitApplication).mockResolvedValue(mockResponse);

      // ✅ Act: Make HTTP request
      const response = await request(app)
        .post('/api/applications')
        .send({
          emailAddress: 'test@example.com',
          phoneNumber: '+44-123-456-7890',
          jobRoleId: 1,
          coverLetter: 'I am interested in this role.',
        });

      // ✅ Assert: Verify HTTP response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(applicationService.submitApplication).toHaveBeenCalledWith(
        expect.objectContaining({
          emailAddress: 'test@example.com',
          phoneNumber: '+44-123-456-7890',
        })
      );
    });

    it('should return 400 for invalid email', async () => {
      // ✅ Mock service to return error
      const mockResponse = {
        success: false,
        message: 'Invalid email address format',
      };
      vi.mocked(applicationService.submitApplication).mockResolvedValue(mockResponse);

      // ✅ Send invalid data
      const response = await request(app)
        .post('/api/applications')
        .send({
          emailAddress: 'invalid-email',
          phoneNumber: '123-456-7890',
          jobRoleId: 1,
        });

      // ✅ Assert error response
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email');
    });

    it('should validate required fields', async () => {
      // ✅ Test missing fields
      const response = await request(app)
        .post('/api/applications')
        .send({}); // No required fields

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });
  });

  describe('GET /api/applications/:id', () => {
    it('should return application by ID', async () => {
      // ✅ Arrange
      const mockApplication = {
        applicationID: 1,
        emailAddress: 'test@example.com',
        jobRoleId: 1,
        status: 'Pending',
      };
      vi.mocked(applicationService.getApplicationById).mockResolvedValue(mockApplication);

      // ✅ Act & Assert
      const response = await request(app).get('/api/applications/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockApplication);
      expect(applicationService.getApplicationById).toHaveBeenCalledWith(1);
    });

    it('should return 404 for non-existent ID', async () => {
      // ✅ Mock null response
      vi.mocked(applicationService.getApplicationById).mockResolvedValue(null);

      const response = await request(app).get('/api/applications/9999');

      expect(response.status).toBe(404);
    });

    it('should handle invalid ID format', async () => {
      // ✅ Test invalid input
      const response = await request(app).get('/api/applications/invalid');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/applications/:id/status', () => {
    it('should update application status', async () => {
      // ✅ Test status update
      const updatedApp = { applicationID: 1, status: 'Reviewed' };
      vi.mocked(applicationService.updateApplicationStatus).mockResolvedValue(updatedApp);

      const response = await request(app)
        .patch('/api/applications/1/status')
        .send({ status: 'Reviewed' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('Reviewed');
    });

    it('should reject invalid status', async () => {
      // ✅ Test validation
      const response = await request(app)
        .patch('/api/applications/1/status')
        .send({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
    });
  });
});
```

**Dependencies**:
```bash
npm install --save-dev supertest @types/supertest
```

**Conventions**:
- ✅ Test each HTTP method (GET, POST, PATCH, DELETE)
- ✅ Assert HTTP status codes (200, 400, 404, 500)
- ✅ Verify request data is passed to service correctly
- ✅ Test error responses and edge cases
- ✅ Use descriptive assertion messages
- ✅ Mock all service calls

### 3. **Service-to-Repository Integration Tests**

**Purpose**: Test how services interact with repositories (optional, for complex logic).

**Structure**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import { ApplicationService } from './ApplicationService.js';
import type { ApplicationCreate } from '../models/ApplicationModel.js';

describe('ApplicationService - Integration with Repository', () => {
  let applicationService: ApplicationService;
  let mockRepository: ApplicationRepository;

  beforeEach(() => {
    mockRepository = {
      createApplication: vi.fn(),
      getApplicationById: vi.fn(),
      updateApplicationStatus: vi.fn(),
      deleteApplication: vi.fn(),
    } as unknown as ApplicationRepository;

    applicationService = new ApplicationService(mockRepository);
  });

  it('should persist application to repository', async () => {
    // ✅ Test repository interaction
    const applicationData: ApplicationCreate = {
      emailAddress: 'test@example.com',
      phoneNumber: '123-456-7890',
      jobRoleId: 1,
    };

    const savedApplication = {
      applicationID: 1,
      ...applicationData,
      status: 'Pending',
      createdAt: new Date(),
    };

    vi.mocked(mockRepository.createApplication).mockResolvedValue(savedApplication);

    const result = await applicationService.submitApplication(applicationData);

    // ✅ Verify repository was called correctly
    expect(mockRepository.createApplication).toHaveBeenCalledWith(applicationData);
    expect(result.applicationID).toBe(1);
  });
});
```

---

## 📊 **Coverage Requirements**

### Targets (Priority Order)
1. **Services & Business Logic**: 70%+ (critical)
2. **Utilities & Helpers**: 80%+ (important)
3. **Controllers**: 60%+ (medium)
4. **Repositories**: 50%+ (lower - focus on complex queries)
5. **Middleware**: 40%+ (lowest - mostly routing logic)

### Generate Coverage Report
```bash
npm run test:coverage
# Output:
# coverage/
# ├── index.html          # Open in browser for interactive report
# ├── coverage-final.json # Machine-readable
# └── team3-job-app-backend/
```

### Set Coverage Thresholds
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 70,              // ✅ Enforce 70% line coverage
      functions: 70,
      branches: 60,           // Branches are harder to hit
      statements: 70,
      exclude: [
        'node_modules/',
        'dist/',
        'src/**/*.d.ts',
        'src/**/*.config.ts',
        'coverage/**',
      ],
    },
  },
});
```

---

## 🚀 **Running Tests**

### All Tests
```bash
npm run test              # Interactive mode (Vitest)
npm run test:run         # Run all tests once (CI mode)
npm run test:coverage    # Generate coverage report
npm run test:ui          # Open Vitest UI in browser
```

### Specific Tests
```bash
# Run specific test file
npm run test:run -- JobService.test.ts

# Run tests matching a pattern
npm run test:run -- --grep "should add"

# Run single test
npm run test:run -- --reporter=verbose JobService.test.ts
```

### Watch Mode (Development)
```bash
npm run test    # Start interactive Vitest
# Commands:
#  a - run all tests
#  f - run only failed tests
#  p - filter by filename pattern
#  t - filter by test name pattern
#  q - quit
```

### Coverage Analysis
```bash
npm run test:coverage
# Navigate to: coverage/index.html
# View line-by-line coverage, drill into files
```

---

## 🔍 **Test Naming Conventions**

### File Names
```typescript
// ✅ GOOD
JobService.test.ts                    // Service unit tests
JobService.autoClose.test.ts          // Focused feature tests
ApplicationController.test.ts          // Controller integration tests
validation.test.ts                     // Utility tests

// ❌ AVOID
test.ts                               // Too generic
tests.ts                              // Plural form
JobServiceTest.ts                     // Use .test.ts suffix
specs.ts                              # Use .test.ts not .spec.ts
```

### Test Descriptions
```typescript
// ✅ GOOD - Clear, specific, testable
describe('JobService.addJob', () => {
  it('should add a valid job successfully', () => {});
  it('should reject job with missing required fields', () => {});
  it('should handle database connection errors', () => {});
});

// ✅ ACCEPTABLE - More detailed
describe('JobService', () => {
  describe('addJob', () => {
    it('should create a new job role and return the created job', () => {});
  });
});

// ❌ AVOID - Vague or unclear
describe('tests', () => {
  it('should work', () => {});
  it('test1', () => {});
  it('JobService tests', () => {});
});
```

---

## ⚠️ **Common Test Pitfalls**

### ❌ DO NOT
- **Skip cleanup**: Always use `afterEach()` for teardown
- **Hardcode test data**: Use variables or builders
- **Mock everything**: Only mock external dependencies
- **Test implementation**: Test behavior/contracts instead
- **Ignore error cases**: Always test error paths
- **Use test.only() permanently**: Remove before committing
- **Leave console.log() in tests**: Clean up before submission
- **Rely on test order**: Make tests independent
- **Create shared mutable state**: Use `beforeEach` to reset

### ✅ DO
- **Use clear, specific names**: "should add a job with all required fields"
- **Follow AAA pattern**: Arrange, Act, Assert
- **Mock only externals**: Repositories, APIs, third-party services
- **Test edge cases**: null, empty, invalid, boundary values
- **Keep tests focused**: One logical unit per test
- **Use helper methods**: Reduce duplication
- **Group with describe()**: Organize related tests
- **Verify mock calls**: Check that services are called correctly
- **Test happy AND sad paths**: Success and error scenarios

---

## 📝 **Test Data Best Practices**

### ❌ AVOID: Hardcoded Data in Tests
```typescript
it('should add a job', async () => {
  const result = await jobService.addJob({
    name: 'Software Engineer',
    location: 'Belfast',
    capabilityId: 1,
    bandId: 2,
    closingDate: '2025-12-31',
  });
});
```

### ✅ BETTER: Builder Pattern or Factory
```typescript
// src/services/__tests__/helpers/jobBuilder.ts
export function createJobRoleData(overrides = {}) {
  return {
    name: 'Software Engineer',
    location: 'Belfast',
    capabilityId: 1,
    bandId: 2,
    closingDate: '2025-12-31',
    ...overrides,
  };
}

// In test
it('should add a job', async () => {
  const result = await jobService.addJob(
    createJobRoleData({ name: 'DevOps Engineer' })
  );
});
```

---

## 🔗 **Integration with CI/CD**

### Pre-Commit Checklist
```bash
npm run test:run
npm run type-check
npm run lint
npm run check
```

### CI Pipeline (GitHub Actions, etc.)
```yaml
- name: Run Tests
  run: npm run test:run

- name: Generate Coverage
  run: npm run test:coverage

- name: Type Check
  run: npm run type-check
```

### Merge Requirements
- ✅ All tests pass
- ✅ Coverage meets targets (70%+ services)
- ✅ No `test.only()` in code
- ✅ No console.log() in tests
- ✅ TypeScript strict mode passes

---

## 📚 **Resources & References**

- **Vitest Documentation**: https://vitest.dev/
- **Supertest Documentation**: https://github.com/visionmedia/supertest
- **Vitest Matchers**: https://vitest.dev/api/expect.html
- **Mocking Guide**: https://vitest.dev/guide/mocking.html

### Project Documentation
- **Main Instructions**: `.copilot-instructions.md` (general project)
- **Architecture**: README.md
- **API Docs**: README.md API Endpoints section

---

## ✅ **Testing Checklist**

Before submitting a test file:

**Organization**
- [ ] File follows naming: `*.test.ts`
- [ ] Tests grouped with `describe()` blocks
- [ ] Clear hierarchy: describe → it

**Dependencies**
- [ ] All external dependencies mocked
- [ ] Mocks use `vi.fn()` or `vi.mock()`
- [ ] Mock state cleared with `beforeEach()`
- [ ] Cleanup in `afterEach()` if needed

**Test Quality**
- [ ] Clear, specific test names
- [ ] Happy path tested
- [ ] Error cases tested
- [ ] Edge cases tested (null, empty, invalid)
- [ ] No hardcoded test data
- [ ] Uses AAA pattern (Arrange, Act, Assert)

**Code Quality**
- [ ] No `test.only()` left behind
- [ ] No `test.skip()` left behind
- [ ] No console.log() statements
- [ ] TypeScript strict mode compliant
- [ ] JSDoc comments for helpers

**Coverage & Performance**
- [ ] Achieves target coverage (70%+ for services)
- [ ] Tests are fast (< 100ms each)
- [ ] No unnecessary async operations
- [ ] Uses mocks effectively

**Pre-Submission**
- [ ] All tests pass locally: `npm run test:run`
- [ ] Coverage report generated: `npm run test:coverage`
- [ ] Type checking passes: `npm run type-check`
- [ ] Code quality passes: `npm run check`

---

**Last Updated**: November 2025
**Maintainer**: Team 3 Engineering Academy
**Questions?** Refer to this document first, then `.copilot-instructions.md`.
