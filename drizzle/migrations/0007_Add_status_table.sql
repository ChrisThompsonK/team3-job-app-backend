-- Create job availability status table
CREATE TABLE `job_availability_status`(
  `statusId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `statusName` text NOT NULL
);

-- Insert default statuses (Open=1, Closed=2)
INSERT INTO `job_availability_status` (`statusName`) VALUES ('Open');
INSERT INTO `job_availability_status` (`statusName`) VALUES ('Closed');

-- Add statusId column to job_roles table
ALTER TABLE `job_roles` ADD COLUMN `statusId` integer REFERENCES `job_availability_status`(`statusId`);

-- Update existing records to use statusId
-- Convert 'Open' and 'Closing Soon' to 'Open' (statusId = 1)
-- Convert 'Closed' to 'Closed' (statusId = 2)
UPDATE `job_roles` SET `statusId` = 1 WHERE `status` = 'Open' OR `status` = 'Closing Soon' OR `status` IS NULL;
UPDATE `job_roles` SET `statusId` = 2 WHERE `status` = 'Closed';

ALTER TABLE `job_roles` DROP COLUMN `status`; 