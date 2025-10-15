-- Create status table
CREATE TABLE `status`(
  `statusId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `statusName` text NOT NULL
);

-- Insert default statuses (Open=1, Closed=2)
INSERT INTO `status` (`statusName`) VALUES ('Open');
INSERT INTO `status` (`statusName`) VALUES ('Closed');

-- Add statusId column to job_roles table
ALTER TABLE `job_roles` ADD COLUMN `statusId` integer REFERENCES `status`(`statusId`);

-- Update existing records to use statusId
-- Convert 'Open' and 'Closing Soon' to 'Open' (statusId = 1)
-- Convert 'Closed' to 'Closed' (statusId = 2)
UPDATE `job_roles` SET `statusId` = 1 WHERE `status` = 'Open' OR `status` = 'Closing Soon' OR `status` IS NULL;
UPDATE `job_roles` SET `statusId` = 2 WHERE `status` = 'Closed';

-- Note: We're keeping the old status column for now to avoid data loss
-- In a production environment, you might want to drop it after confirming the migration works
-- ALTER TABLE `job_roles` DROP COLUMN `status`; -- Not supported in SQLite directly