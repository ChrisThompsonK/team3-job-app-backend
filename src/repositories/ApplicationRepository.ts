import { eq } from 'drizzle-orm';
import { db } from '../db/database.js';
import { applications, jobRoles } from '../db/schema.js';
import type {
  Application,
  ApplicationCreate,
  ApplicationWithJobRole,
} from '../models/ApplicationModel.js';

export class ApplicationRepository {
  async createApplication(applicationData: ApplicationCreate): Promise<Application> {
    const now = new Date().toISOString();

    const result = await db
      .insert(applications)
      .values({
        ...applicationData,
        status: 'Pending', // Default status
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (result.length === 0) {
      throw new Error('Failed to create application');
    }

    return result[0] as Application;
  }

  async getApplicationById(applicationID: number): Promise<Application | null> {
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.applicationID, applicationID));

    return result.length > 0 ? (result[0] as Application) : null;
  }

  async getAllApplications(): Promise<Application[]> {
    const result = await db.select().from(applications);
    return result;
  }

  async getApplicationsWithJobRoles(): Promise<ApplicationWithJobRole[]> {
    const result = await db
      .select({
        applicationID: applications.applicationID,
        jobRoleId: applications.jobRoleId,
        phoneNumber: applications.phoneNumber,
        emailAddress: applications.emailAddress,
        status: applications.status,
        coverLetter: applications.coverLetter,
        notes: applications.notes,
        createdAt: applications.createdAt,
        jobRoleName: jobRoles.roleName,
        jobRoleLocation: jobRoles.location,
      })
      .from(applications)
      .leftJoin(jobRoles, eq(applications.jobRoleId, jobRoles.jobRoleId));

    return result as ApplicationWithJobRole[];
  }

  // Note: Applications should generally not be updated after submission
  // Only status updates might be needed for admin purposes
  async updateApplicationStatus(
    applicationID: number,
    status: string
  ): Promise<Application | null> {
    const now = new Date().toISOString();

    const result = await db
      .update(applications)
      .set({ status, updatedAt: now })
      .where(eq(applications.applicationID, applicationID))
      .returning();

    return result.length > 0 ? (result[0] as Application) : null;
  }

  async getApplicationsByJobRole(jobRoleId: number): Promise<Application[]> {
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.jobRoleId, jobRoleId));

    return result;
  }

  async getApplicationsByStatus(status: string): Promise<Application[]> {
    const result = await db.select().from(applications).where(eq(applications.status, status));

    return result;
  }
}
