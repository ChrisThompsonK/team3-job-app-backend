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
