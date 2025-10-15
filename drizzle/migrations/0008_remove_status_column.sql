-- Remove the old status column from job_roles table
-- SQLite doesn't support DROP COLUMN, so we need to recreate the table

-- Step 1: Create a new table without the status column
CREATE TABLE `job_roles_new`(
  `jobRoleId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `roleName` text NOT NULL,
  `location` text NOT NULL,
  `capabilityId` integer,
  `bandId` integer,
  `closingDate` text NOT NULL,
  `description` text,
  `responsibilities` text,
  `jobSpecUrl` text,
  `openPositions` integer DEFAULT 1 NOT NULL,
  `deleted` integer DEFAULT 0 NOT NULL,
  `statusId` integer REFERENCES `job_availability_status`(`statusId`),
  FOREIGN KEY (`capabilityId`) REFERENCES `capabilities`(`capabilityId`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`bandId`) REFERENCES `bands`(`bandId`) ON UPDATE no action ON DELETE no action
);

-- Step 2: Copy data from old table to new table (excluding the status column)
INSERT INTO `job_roles_new` (
  `jobRoleId`, `roleName`, `location`, `capabilityId`, `bandId`, 
  `closingDate`, `description`, `responsibilities`, `jobSpecUrl`, 
  `openPositions`, `deleted`, `statusId`
)
SELECT 
  `jobRoleId`, `roleName`, `location`, `capabilityId`, `bandId`, 
  `closingDate`, `description`, `responsibilities`, `jobSpecUrl`, 
  `openPositions`, `deleted`, `statusId`
FROM `job_roles`;

-- Step 3: Drop the old table
DROP TABLE `job_roles`;

-- Step 4: Rename the new table to the original name
ALTER TABLE `job_roles_new` RENAME TO `job_roles`;