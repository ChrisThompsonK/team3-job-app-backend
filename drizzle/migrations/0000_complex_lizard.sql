CREATE TABLE `Applications` (
	`applicationID` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jobRoleId` integer NOT NULL,
	`phoneNumber` text NOT NULL,
	`emailAddress` text NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`coverLetter` text,
	`notes` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`jobRoleId`) REFERENCES `job_roles`(`jobRoleId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bands` (
	`bandId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bandName` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `capabilities` (
	`capabilityId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`capabilityName` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `job_availability_status` (
	`statusId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`statusName` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `job_roles` (
	`jobRoleId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`roleName` text NOT NULL,
	`location` text NOT NULL,
	`capabilityId` integer,
	`bandId` integer,
	`statusId` integer,
	`closingDate` text NOT NULL,
	`description` text,
	`responsibilities` text,
	`jobSpecUrl` text,
	`openPositions` integer DEFAULT 1 NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`capabilityId`) REFERENCES `capabilities`(`capabilityId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bandId`) REFERENCES `bands`(`bandId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`statusId`) REFERENCES `job_availability_status`(`statusId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`last_login_at` integer,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);