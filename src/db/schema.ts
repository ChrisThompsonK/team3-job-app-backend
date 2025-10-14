import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Capability table
export const capabilities = sqliteTable('capabilities', {
  capabilityId: integer('capabilityId').primaryKey({ autoIncrement: true }),
  capabilityName: text('capabilityName').notNull(),
});

// Band table
export const bands = sqliteTable('bands', {
  bandId: integer('bandId').primaryKey({ autoIncrement: true }),
  bandName: text('bandName').notNull(),
});

// Job roles table
export const jobRoles = sqliteTable('job_roles', {
  jobRoleId: integer('jobRoleId').primaryKey({ autoIncrement: true }),
  roleName: text('roleName').notNull(),
  location: text('location').notNull(),
  capabilityId: integer('capabilityId').references(() => capabilities.capabilityId),
  bandId: integer('bandId').references(() => bands.bandId),
  closingDate: text('closingDate').notNull(), // Using text for date, you can also use integer for timestamp
  description: text('description'),
  responsibilities: text('responsibilities'),
  jobSpecUrl: text('jobSpecUrl'),
  status: text('status').notNull().default('Open'),
  openPositions: integer('openPositions').notNull().default(1),
  deleted: integer('deleted').default(0).notNull(), // Soft delete flag
});

// Applicants table
export const applicants = sqliteTable('Applicants', {
  applicantID: integer('applicantID').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  password: text('password').notNull(),
  firstName: text('firstName').notNull(),
  surname: text('surname').notNull(),
  phoneNumber: integer('phoneNumber').notNull(),
  emailAddress: text('emailAddress').notNull(),
  homeAddress: text('homeAddress').notNull(),
});

// Applications table
export const applications = sqliteTable('Applications', {
  applicationID: integer('applicationID').primaryKey({ autoIncrement: true }),
  applicantID: integer('applicantID').notNull().references(() => applicants.applicantID),
  jobRoleId: integer('jobRoleId').notNull().references(() => jobRoles.jobRoleId),
  dateApplied: text('dateApplied').notNull(),
  status: text('status').notNull().default('Pending'),
  coverLetter: text('coverLetter'),
  resumeUrl: text('resumeUrl'),
  notes: text('notes'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});

// Export all tables for use in queries
export type Capability = typeof capabilities.$inferSelect;
export type NewCapability = typeof capabilities.$inferInsert;

export type Band = typeof bands.$inferSelect;
export type NewBand = typeof bands.$inferInsert;

export type JobRole = typeof jobRoles.$inferSelect;
export type NewJobRole = typeof jobRoles.$inferInsert;

export type Applicant = typeof applicants.$inferSelect;
export type NewApplicant = typeof applicants.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
