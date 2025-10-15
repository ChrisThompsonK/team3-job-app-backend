-- Change phoneNumber column from integer to text
-- SQLite doesn't support direct column type changes, so we need to recreate the table

-- Step 1: Create a new table with the correct schema
CREATE TABLE 'Applications_new' (
    'applicationID' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    'jobRoleId' integer NOT NULL,
    'phoneNumber' text NOT NULL,
    'emailAddress' text NOT NULL,
    'status' text DEFAULT 'Pending' NOT NULL,
    'coverLetter' text,
    'notes' text,
    'createdAt' text NOT NULL,
    'updatedAt' text NOT NULL,
    FOREIGN KEY ('jobRoleId') REFERENCES 'job_roles'('jobRoleId') ON UPDATE no action ON DELETE no action
);

-- Step 2: Copy data from old table to new table (converting phoneNumber to text)
INSERT INTO 'Applications_new' (
    'applicationID',
    'jobRoleId',
    'phoneNumber',
    'emailAddress',
    'status',
    'coverLetter',
    'notes',
    'createdAt',
    'updatedAt'
)
SELECT 
    'applicationID',
    'jobRoleId',
    CAST('phoneNumber' AS TEXT),
    'emailAddress',
    'status',
    'coverLetter',
    'notes',
    'createdAt',
    'updatedAt'
FROM 'Applications';

-- Step 3: Drop the old table
DROP TABLE 'Applications';

-- Step 4: Rename the new table to the original name
ALTER TABLE 'Applications_new' RENAME TO 'Applications';
