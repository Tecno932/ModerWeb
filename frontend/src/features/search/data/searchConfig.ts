export const JAVA_TYPES = [
  "mod",
  "modpack",
  "plugin",
  "shader",
  "resourcepack",
  "datapack",
  "world",
];

export const BEDROCK_TYPES = [
  "addon",
  "map",
  "texture",
  "script",
];

//////////////////////////////////////////////////
// JAVA CATEGORIES
//////////////////////////////////////////////////

export const JAVA_CATEGORIES: Record<
  string,
  string[]
> = {
  mod: [
    "adventure-rpg",
    "api",
    "armor-tools-weapons",
    "bug-fixes",
    "cosmetic",
    "creative",
    "education",
    "food",
    "horror",
    "magic",
    "map",
    "mcreator",
    "miscellaneous",
    "performance",
    "redstone",
    "server-utility",
    "storage",
    "technology",
    "worldgen",
  ],

  modpack: [
    "adventure-rpg",
    "combat",
    "expert",
    "exploration",
    "extra-large",
    "hardcore",
    "horror",
    "magic",
    "map-based",
    "minigame",
    "multiplayer",
    "skyblock",
    "tech",
    "vanilla-plus",
  ],

  plugin: [
    "admin-tools",
    "anti-griefing",
    "chat",
    "developer-tools",
    "economy",
    "fun",
    "information",
    "mechanics",
    "miscellaneous",
    "roleplay",
    "teleport",
    "website-administration",
    "world-generator",
  ],

  shader: [
    "fantasy",
    "realistic",
    "vanilla",
  ],

  resourcepack: [
    "x512",
    "x256",
    "x128",
    "x64",
    "x32",
    "x16",
    "x8",
    "animated",
    "font-pack",
    "medieval",
    "miscellaneous",
    "mod-support",
    "modern",
    "traditional",
  ],

  datapack: [
    "adventure",
    "fantasy",
    "library",
    "magic",
    "miscellaneous",
    "mod-support",
    "tech",
    "utility",
  ],

  world: [
    "adventure",
    "creation",
    "minigame",
    "parkour",
    "puzzle",
    "survival",
    "roleplay",
    "modded-world",
  ],
};

//////////////////////////////////////////////////
// BEDROCK CATEGORIES
//////////////////////////////////////////////////

export const BEDROCK_CATEGORIES: Record<
  string,
  string[]
> = {
  addon: [
    "weapons",
    "armor",
    "tools",
    "cosmetics",
    "horror",
    "fantasy",
    "food",
    "magic",
    "building",
    "multiplayer",
    "roleplay",
    "performance",
    "skins",
    "survival",
    "technology",
    "utility",
    "vanilla-plus",
  ],

  map: [
    "adventure",
    "creation",
    "custom-terrain",
    "minigame",
    "parkour",
    "puzzle",
    "pvp",
    "redstone",
    "survival",
    "roleplay",
  ],

  texture: [
    "gui",
    "miscellaneous",
    "pvp",
    "realistic",
    "shader",
    "simplistic",
    "themed",
    "x128",
    "x64",
    "x32",
    "x16",
  ],

  script: [],
};

//////////////////////////////////////////////////
// LOADERS
//////////////////////////////////////////////////

export const JAVA_LOADERS = [
  "forge",
  "neoforge",
  "fabric",
  "quilt",
];

//////////////////////////////////////////////////
// VERSIONS
//////////////////////////////////////////////////

export const JAVA_VERSIONS = [
  "1.21.5",
  "1.21.4",
  "1.21.1",
  "1.20.6",
  "1.20.4",
  "1.20.1",
  "1.19.4",
  "1.19.2",
  "1.18.2",
  "1.16.5",
  "1.12.2",
];

//////////////////////////////////////////////////
// LABEL FORMATTER
//////////////////////////////////////////////////

export function formatLabel(
  value: string
) {
  return value
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (l) => l.toUpperCase()
    );
}