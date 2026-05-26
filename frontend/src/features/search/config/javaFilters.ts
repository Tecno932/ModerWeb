export const JAVA_TYPES = [
  "all",
  "plugin",
  "addon",
  "mod",
  "modpack",
  "datapack",
  "shader",
  "resourcepack",
  "world",
];

export const JAVA_CATEGORIES: Record<
  string,
  string[]
> = {
  all: [],

  plugin: [
    "admin tools",
    "anti griefing",
    "chat",
    "economy",
    "fun",
    "teleport",
  ],

  mod: [
    "adventure rpg",
    "api",
    "armor",
    "technology",
    "magic",
    "performance",
    "world gen",
  ],

  shader: [
    "fantasy",
    "realistic",
    "vanilla",
  ],

  modpack: [
    "adventure rpg",
    "expert",
    "skyblock",
    "tech",
  ],
};