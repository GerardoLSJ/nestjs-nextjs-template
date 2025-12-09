-- AlterTable: Add messages column with default for existing rows
ALTER TABLE "Event" ADD COLUMN "messages" TEXT NOT NULL DEFAULT '';

-- Update existing rows to have a placeholder message
UPDATE "Event" SET "messages" = 'No message provided' WHERE "messages" = '';

-- Remove the default so new rows must provide a value
ALTER TABLE "Event" ALTER COLUMN "messages" DROP DEFAULT;
