import { prisma } from "../../lib/prisma";

import { generateSlug } from "../../utils/slug";

export async function generateUniqueSlug(
  username: string,
  title: string
) {
  let slug =
    generateSlug(username, title);

  let counter = 1;

  while (
    await prisma.mod.findUnique({
      where: {
        slug,
      },
    })
  ) {
    slug =
      `${generateSlug(
        username,
        title
      )}-${counter}`;

    counter++;
  }

  return slug;
}