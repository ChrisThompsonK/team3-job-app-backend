-- Add updatedAt column to Applications table
ALTER TABLE 'Applications' ADD COLUMN 'updatedAt' text NOT NULL DEFAULT '';
