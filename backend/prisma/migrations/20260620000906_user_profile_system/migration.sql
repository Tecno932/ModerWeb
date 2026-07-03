/*
  Warnings:

  - The values [WEBSITE,BLUESKY] on the enum `SocialPlatform` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SocialPlatform_new" AS ENUM ('GITHUB', 'DISCORD', 'YOUTUBE', 'INSTAGRAM', 'PATREON', 'KOFI', 'TWITCH', 'X', 'TIKTOK');
ALTER TABLE "ProfileSocial" ALTER COLUMN "platform" TYPE "SocialPlatform_new" USING ("platform"::text::"SocialPlatform_new");
ALTER TYPE "SocialPlatform" RENAME TO "SocialPlatform_old";
ALTER TYPE "SocialPlatform_new" RENAME TO "SocialPlatform";
DROP TYPE "public"."SocialPlatform_old";
COMMIT;
