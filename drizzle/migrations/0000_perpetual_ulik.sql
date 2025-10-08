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
CREATE TABLE `job_roles` (
	`jobRoleId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`roleName` text NOT NULL,
	`location` text NOT NULL,
	`capabilityId` integer,
	`bandId` integer,
	`closingDate` text NOT NULL,
	FOREIGN KEY (`capabilityId`) REFERENCES `capabilities`(`capabilityId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bandId`) REFERENCES `bands`(`bandId`) ON UPDATE no action ON DELETE no action
);
