-- Migration: Remove resumeUrl column from Applications table
-- This column was added to schema.ts but never properly migrated to production databases
-- This migration ensures all team members' databases are consistent

-- Note: SQLite doesn't support DROP COLUMN directly in older versions
-- We need to recreate the table without the resumeUrl column

-- Step 1: Create new table without resumeUrl
CREATE TABLE 'Applications_new' (
    'applicationID' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    'jobRoleId' integer NOT NULL,
    'phoneNumber' integer NOT NULL,
    'emailAddress' text NOT NULL,
    'status' text DEFAULT 'Pending' NOT NULL,
    'coverLetter' text,
    'notes' text,
    'createdAt' text NOT NULL,
    'updatedAt' text NOT NULL,
    FOREIGN KEY ('jobRoleId') REFERENCES 'job_roles'('jobRoleId')
);

-- Step 2: Copy data from old table to new table (excluding resumeUrl)
INSERT INTO 'Applications_new' (
    applicationID, jobRoleId, phoneNumber, emailAddress, 
    status, coverLetter, notes, createdAt, updatedAt
)
SELECT 
    applicationID, jobRoleId, phoneNumber, emailAddress,
    status, coverLetter, notes, createdAt, updatedAt
FROM 'Applications';

-- Step 3: Drop old table
DROP TABLE 'Applications';

-- Step 4: Rename new table to original name
ALTER TABLE 'Applications_new' RENAME TO 'Applications';
