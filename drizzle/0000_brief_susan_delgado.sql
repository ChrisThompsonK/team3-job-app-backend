CREATE TABLE `app_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_info_key_unique` ON `app_info` (`key`);--> statement-breakpoint
CREATE TABLE `app_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`setting_name` text NOT NULL,
	`setting_value` text NOT NULL,
	`setting_type` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_settings_setting_name_unique` ON `app_settings` (`setting_name`);--> statement-breakpoint
CREATE TABLE `health_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text NOT NULL,
	`uptime` integer NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	`details` text
);
