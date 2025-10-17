-- Change phoneNumber column from integer to text
-- Drop the column and re-add it as text

-- Step 1: Drop the phoneNumber column
ALTER TABLE 'Applications' DROP COLUMN 'phoneNumber';

-- Step 2: Add phoneNumber column back as text
ALTER TABLE 'Applications' ADD COLUMN 'phoneNumber' text NOT NULL DEFAULT '';
