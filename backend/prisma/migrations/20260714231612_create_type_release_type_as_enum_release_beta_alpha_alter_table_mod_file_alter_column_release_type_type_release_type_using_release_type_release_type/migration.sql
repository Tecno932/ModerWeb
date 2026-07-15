/*
  Warnings:

  - Changed the type of `releaseType` on the `ModFile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM (
  'release',
  'beta',
  'alpha'
);

-- Convert existing column from TEXT to ENUM
ALTER TABLE "ModFile"
ALTER COLUMN "releaseType"
TYPE "ReleaseType"
USING ("releaseType"::"ReleaseType");