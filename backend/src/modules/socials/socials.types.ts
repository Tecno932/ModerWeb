import { SocialPlatform } from "@prisma/client";

//////////////////////////////////////////////////
// CREATE / UPDATE SOCIAL
//////////////////////////////////////////////////

export interface UpsertSocialInput {
  platform: SocialPlatform;
  url: string;
}