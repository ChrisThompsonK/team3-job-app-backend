import { createId } from '@paralleldrive/cuid2';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Users table (authentication)
export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'user'] })
    .notNull()
    .default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

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

// Job availability status table
export const jobAvailabilityStatus = sqliteTable('job_availability_status', {
  statusId: integer('statusId').primaryKey({ autoIncrement: true }),
  statusName: text('statusName').notNull(),
});

// Job roles table
export const jobRoles = sqliteTable('job_roles', {
  jobRoleId: integer('jobRoleId').primaryKey({ autoIncrement: true }),
  roleName: text('roleName').notNull(),
  location: text('location').notNull(),
  capabilityId: integer('capabilityId').references(() => capabilities.capabilityId),
  bandId: integer('bandId').references(() => bands.bandId),
  statusId: integer('statusId').references(() => jobAvailabilityStatus.statusId),
  closingDate: text('closingDate').notNull(), // Using text for date, you can also use integer for timestamp
  description: text('description'),
  responsibilities: text('responsibilities'),
  jobSpecUrl: text('jobSpecUrl'),
  openPositions: integer('openPositions').notNull().default(1),
  deleted: integer('deleted').default(0).notNull(), // Soft delete flag
});

// Applications table
export const applications = sqliteTable('Applications', {
  applicationID: integer('applicationID').primaryKey({ autoIncrement: true }),
  jobRoleId: integer('jobRoleId')
    .notNull()
    .references(() => jobRoles.jobRoleId),
  phoneNumber: text('phoneNumber').notNull(),
  emailAddress: text('emailAddress').notNull(),
  status: text('status').notNull().default('Pending'),
  coverLetter: text('coverLetter'),
  notes: text('notes'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});

// Export all tables for use in queries
export type Capability = typeof capabilities.$inferSelect;
export type NewCapability = typeof capabilities.$inferInsert;

export type Band = typeof bands.$inferSelect;
export type NewBand = typeof bands.$inferInsert;

export type JobAvailabilityStatus = typeof jobAvailabilityStatus.$inferSelect;
export type NewJobAvailabilityStatus = typeof jobAvailabilityStatus.$inferInsert;

export type JobRole = typeof jobRoles.$inferSelect;
export type NewJobRole = typeof jobRoles.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
