import { and, asc, count, desc, eq, gte, lte } from 'drizzle-orm';
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

  async getAllApplications(sortBy = 'createdAt', sortOrder = 'desc'): Promise<Application[]> {
    // Map sort field to actual database column
    const sortFieldMap = {
      applicationID: applications.applicationID,
      jobRoleId: applications.jobRoleId,
      emailAddress: applications.emailAddress,
      phoneNumber: applications.phoneNumber,
      status: applications.status,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
    };

    type SortField = keyof typeof sortFieldMap;
    const sortColumn = sortFieldMap[sortBy as SortField] || applications.createdAt;
    const orderFn = sortOrder.toLowerCase() === 'desc' ? desc : asc;

    const result = await db.select().from(applications).orderBy(orderFn(sortColumn));
    return result;
  }

  async getApplicationsWithJobRoles(
    sortBy = 'createdAt',
    sortOrder = 'desc'
  ): Promise<ApplicationWithJobRole[]> {
    // Map sort field to actual database column
    const sortFieldMap = {
      applicationID: applications.applicationID,
      jobRoleId: applications.jobRoleId,
      emailAddress: applications.emailAddress,
      phoneNumber: applications.phoneNumber,
      status: applications.status,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      jobRoleName: jobRoles.roleName,
      jobRoleLocation: jobRoles.location,
    };

    type SortField = keyof typeof sortFieldMap;
    const sortColumn = sortFieldMap[sortBy as SortField] || applications.createdAt;
    const orderFn = sortOrder.toLowerCase() === 'desc' ? desc : asc;

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
      .leftJoin(jobRoles, eq(applications.jobRoleId, jobRoles.jobRoleId))
      .orderBy(orderFn(sortColumn));

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

  async getApplicationsByEmail(emailAddress: string): Promise<ApplicationWithJobRole[]> {
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
        updatedAt: applications.updatedAt,
        jobRoleName: jobRoles.roleName,
        jobRoleLocation: jobRoles.location,
      })
      .from(applications)
      .leftJoin(jobRoles, eq(applications.jobRoleId, jobRoles.jobRoleId))
      .where(eq(applications.emailAddress, emailAddress));

    return result as ApplicationWithJobRole[];
  }

  async deleteApplication(applicationID: number): Promise<boolean> {
    const result = await db
      .delete(applications)
      .where(eq(applications.applicationID, applicationID))
      .returning();

    return result.length > 0;
  }

  async getApplicationAnalytics(
    startDate: string,
    endDate: string
  ): Promise<{
    applicationsCreatedToday: number;
    applicationsHiredToday: number;
    applicationsRejectedToday: number;
    applicationsAcceptedToday: number;
    totalApplicationsToday: number;
  }> {
    try {
      // Applications created today (based on createdAt)
      const createdResult = await db
        .select({ count: count() })
        .from(applications)
        .where(and(gte(applications.createdAt, startDate), lte(applications.createdAt, endDate)));

      // Applications hired today (status = 'Hired' and updatedAt within date range)
      const hiredResult = await db
        .select({ count: count() })
        .from(applications)
        .where(
          and(
            eq(applications.status, 'Hired'),
            gte(applications.updatedAt, startDate),
            lte(applications.updatedAt, endDate)
          )
        );

      // Applications rejected today (status = 'Rejected' and updatedAt within date range)
      const rejectedResult = await db
        .select({ count: count() })
        .from(applications)
        .where(
          and(
            eq(applications.status, 'Rejected'),
            gte(applications.updatedAt, startDate),
            lte(applications.updatedAt, endDate)
          )
        );

      // Applications accepted today (status = 'Accepted' and updatedAt within date range)
      const acceptedResult = await db
        .select({ count: count() })
        .from(applications)
        .where(
          and(
            eq(applications.status, 'Accepted'),
            gte(applications.updatedAt, startDate),
            lte(applications.updatedAt, endDate)
          )
        );

      const applicationsCreatedToday = createdResult[0]?.count || 0;
      const applicationsHiredToday = hiredResult[0]?.count || 0;
      const applicationsRejectedToday = rejectedResult[0]?.count || 0;
      const applicationsAcceptedToday = acceptedResult[0]?.count || 0;

      return {
        applicationsCreatedToday,
        applicationsHiredToday,
        applicationsRejectedToday,
        applicationsAcceptedToday,
        totalApplicationsToday: applicationsCreatedToday, // Total created = total new applications
      };
    } catch (error) {
      throw new Error(
        `Failed to get application analytics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
