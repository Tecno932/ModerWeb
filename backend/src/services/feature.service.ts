import { prisma } from "../lib/prisma";

export class FeatureService {
  static async hasFeature(userId: number, key: string) {
    const feature = await prisma.userFeature.findFirst({
      where: {
        userId,
        feature: {
          key,
        },
      },
      include: { feature: true },
    });

    return !!feature;
  }
}