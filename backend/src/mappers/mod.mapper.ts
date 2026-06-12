export function mapMod(
  mod: any,
  userId?: number
) {
  return {
    ////////////////////////////////////////////////////
    // BASIC
    ////////////////////////////////////////////////////

    id: mod.id,
    title: mod.title,
    slug: mod.slug,

    summary: mod.summary,

    description: mod.description,
    content: (() => {
      try {
        return mod.content
          ? JSON.parse(mod.content)
          : null;
      } catch {
        return null;
      }
    })(),

    icon: mod.icon,

    platform: mod.platform,
    loader: mod.loader,
    type: mod.type,

    categories: mod.categories,

    links: {
      sourceUrl: mod.sourceUrl,
      issuesUrl: mod.issuesUrl,
      discordUrl: mod.discordUrl,
      websiteUrl: mod.websiteUrl,
      wikiUrl: mod.wikiUrl,
      donationUrl: mod.donationUrl,
    },

    createdAt: mod.createdAt,
    updatedAt: mod.updatedAt,

    ////////////////////////////////////////////////////
    // AUTHOR
    ////////////////////////////////////////////////////

    author: mod.author,

    ////////////////////////////////////////////////////
    // STATS
    ////////////////////////////////////////////////////

    stats: {
      views: mod.views,

      likes:
        mod.likesCount || 0,

      favorites:
        mod.favoritesCount || 0,

      downloads:
        mod.downloads,
    },

    ////////////////////////////////////////////////////
    // INTERACTIONS
    ////////////////////////////////////////////////////

    interactions: {
      liked:
        Array.isArray(mod.likes)
          ? mod.likes.length > 0
          : false,

      favorited:
        Array.isArray(
          mod.favorites
        )
          ? mod.favorites.length >
            0
          : false,
    },

    ////////////////////////////////////////////////////
    // MEDIA
    ////////////////////////////////////////////////////

    images: mod.images,

    ////////////////////////////////////////////////////
    // TAGS
    ////////////////////////////////////////////////////

    tags:
      mod.tags?.map(
        (t: any) => t.tag
      ) || [],

    ////////////////////////////////////////////////////
    // VERSIONS
    ////////////////////////////////////////////////////

    versions:
      mod.versions || [],
  };
}