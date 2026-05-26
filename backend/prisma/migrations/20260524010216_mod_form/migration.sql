/*
  Warnings:

  - The values [APPROVED] on the enum `ModStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [MAP] on the enum `ProjectType` will be removed. If these variants are still used in the database, this will fail.
  - The `categories` column on the `Mod` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Loader" ADD VALUE 'PAPER';
ALTER TYPE "Loader" ADD VALUE 'SPIGOT';
ALTER TYPE "Loader" ADD VALUE 'PURPUR';
ALTER TYPE "Loader" ADD VALUE 'BUKKIT';
ALTER TYPE "Loader" ADD VALUE 'FOLIA';

-- AlterEnum
BEGIN;
CREATE TYPE "ModStatus_new" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'ARCHIVED');
ALTER TABLE "public"."Mod" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Mod" ALTER COLUMN "status" TYPE "ModStatus_new" USING ("status"::text::"ModStatus_new");
ALTER TYPE "ModStatus" RENAME TO "ModStatus_old";
ALTER TYPE "ModStatus_new" RENAME TO "ModStatus";
DROP TYPE "public"."ModStatus_old";
ALTER TABLE "Mod" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProjectType_new" AS ENUM ('PLUGIN', 'MOD', 'MODPACK', 'SHADER', 'DATA_PACK', 'RESOURCE_PACK', 'WORLD', 'ADDON', 'TEXTURE', 'SCRIPT', 'CUSTOM');
ALTER TABLE "public"."Mod" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Mod" ALTER COLUMN "type" TYPE "ProjectType_new" USING ("type"::text::"ProjectType_new");
ALTER TYPE "ProjectType" RENAME TO "ProjectType_old";
ALTER TYPE "ProjectType_new" RENAME TO "ProjectType";
DROP TYPE "public"."ProjectType_old";
ALTER TABLE "Mod" ALTER COLUMN "type" SET DEFAULT 'MOD';
COMMIT;

-- AlterTable
ALTER TABLE "Mod" ADD COLUMN     "discordUrl" TEXT,
ADD COLUMN     "donationUrl" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "issuesUrl" TEXT,
ADD COLUMN     "license" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "websiteUrl" TEXT,
ADD COLUMN     "wikiUrl" TEXT,
DROP COLUMN "categories",
ADD COLUMN     "categories" TEXT[];

-- DropEnum
DROP TYPE "Categories";

-- CreateIndex
CREATE INDEX "Mod_platform_type_idx" ON "Mod"("platform", "type");

-- CreateIndex
CREATE INDEX "Mod_categories_idx" ON "Mod"("categories");

-- CreateIndex
CREATE INDEX "Mod_loader_idx" ON "Mod"("loader");
