-- First add the columns as nullable
ALTER TABLE "public"."registrations" 
ADD COLUMN "fullName" TEXT,
ADD COLUMN "registrationNumber" INTEGER,
ADD COLUMN "semester" INTEGER;

-- Update existing records with default values
UPDATE "public"."registrations" 
SET 
  "fullName" = 'Student Name',
  "registrationNumber" = 10000,
  "semester" = 1;

-- Now make the columns NOT NULL
ALTER TABLE "public"."registrations" 
ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "registrationNumber" SET NOT NULL,
ALTER COLUMN "semester" SET NOT NULL;
