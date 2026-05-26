export const JAVA_TYPES = [
  "all",
  "bukkit-plugin",
  "addon",
  "mod",
  "modpack",
  "data-pack",
  "shader",
  "resource-pack",
  "world",
];

export const BEDROCK_TYPES = [
  "all",
  "addon",
  "map",
  "texture",
  "script",
];

//////////////////////////////////////////////////////
// JAVA CATEGORIES
//////////////////////////////////////////////////////

export const JAVA_CATEGORIES: Record<
  string,
  string[]
> = {
  all: [],

  "bukkit-plugin": [
    "admin tools",
    "anti-griefing tools",
    "chat related",
    "developer tools",
    "economy",
    "fixes",
    "fun",
    "information",
    "mechanics",
    "miscellaneous",
    "roleplay",
    "teleport",
    "website administration",
    "world generator",
  ],

  world: [
    "adventure",
    "creation",
    "mini game",
    "parkour",
    "puzzle",
    "survival",
    "roleplay",
    "modded world",
  ],

  "resource-pack": [
    "x512",
    "x256",
    "x128",
    "x64",
    "x32",
    "x16",
    "x8",
    "animated",
    "font pack",
    "medieval",
    "miscellaneous",
    "mod support",
    "modern",
    "traditional",
  ],

  "data-pack": [
    "adventure",
    "fantasy",
    "library",
    "magic",
    "miscellaneous",
    "mod support",
    "tech",
    "utility",
  ],

  addon: [
    "resource pack",
    "scenarios",
    "world",
  ],

  mod: [
    "addon",
    "adventure rpg",
    "api",
    "armor",
    "tools",
    "weapons",
    "bug fixes",
    "cosmetic",
    "creative mode",
    "education",
    "food",
    "horror",
    "magic",
    "map",
    "mcreator",
    "miscellaneous",
    "performance",
    "redstone",
    "server utility",
    "storage",
    "technology",
    "world gen",
  ],

  modpack: [
    "adventure rpg",
    "combat",
    "expert",
    "exploration",
    "extra large",
    "hardcore",
    "horror",
    "magic",
    "map based",
    "mini game",
    "multiplayer",
    "skyblock",
    "tech",
    "vanilla+",
  ],

  shader: [
    "fantasy",
    "realistic",
    "vanilla",
  ],
};

//////////////////////////////////////////////////////
// BEDROCK CATEGORIES
//////////////////////////////////////////////////////

export const BEDROCK_CATEGORIES: Record<
  string,
  string[]
> = {
  all: [],

  addon: [
    "weapons",
    "armor",
    "tools",
    "cosmetics",
    "horror",
    "fantasy",
    "food",
    "magic",
    "creation addon",
    "creations",
    "multiplayer",
    "roleplay",
    "performance",
    "skins",
    "survival",
    "technology",
    "utility",
    "vanilla+",
  ],

  map: [
    "adventure",
    "creation",
    "custom terrain",
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

//////////////////////////////////////////////////////
// JAVA LOADERS
//////////////////////////////////////////////////////

export const JAVA_LOADERS = [
  "forge",
  "neoforge",
  "fabric",
  "quilt",
];