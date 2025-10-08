ALTER TABLE `job_roles` ADD `description` text;--> statement-breakpoint
ALTER TABLE `job_roles` ADD `responsibilities` text;--> statement-breakpoint
ALTER TABLE `job_roles` ADD `jobSpecUrl` text;--> statement-breakpoint
ALTER TABLE `job_roles` ADD `status` text DEFAULT 'Open' NOT NULL;--> statement-breakpoint
ALTER TABLE `job_roles` ADD `openPositions` integer DEFAULT 1 NOT NULL;