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

// Export all tables for use in queries
export type Capability = typeof capabilities.$inferSelect;
export type NewCapability = typeof capabilities.$inferInsert;

export type Band = typeof bands.$inferSelect;
export type NewBand = typeof bands.$inferInsert;

export type JobRole = typeof jobRoles.$inferSelect;
export type NewJobRole = typeof jobRoles.$inferInsert;
