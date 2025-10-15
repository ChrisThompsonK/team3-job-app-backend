-- Remove resumeUrl column from Applications table
-- Note: This column was in schema.ts but never properly migrated
-- If your database doesn't have this column, this migration will fail (which is fine - skip it)
ALTER TABLE 'Applications' DROP COLUMN 'resumeUrl';
