import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Application information table (for storing app metadata)
export const appInfo = sqliteTable('app_info', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Health check logs table (for storing health check history)
export const healthLogs = sqliteTable('health_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  status: text('status').notNull(),
  uptime: integer('uptime').notNull(),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
  details: text('details'), // JSON string for additional health info
});

// Example: Application settings table
export const appSettings = sqliteTable('app_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  settingName: text('setting_name').notNull().unique(),
  settingValue: text('setting_value').notNull(),
  settingType: text('setting_type').notNull(), // 'string', 'number', 'boolean', 'json'
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Type definitions for TypeScript
export type AppInfo = typeof appInfo.$inferSelect;
export type NewAppInfo = typeof appInfo.$inferInsert;

export type HealthLog = typeof healthLogs.$inferSelect;
export type NewHealthLog = typeof healthLogs.$inferInsert;

export type AppSetting = typeof appSettings.$inferSelect;
export type NewAppSetting = typeof appSettings.$inferInsert;
