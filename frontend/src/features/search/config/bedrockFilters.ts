export const BEDROCK_TYPES =
  [
    "addon",
    "map",
    "texture",
    "script",
  ];

export const BEDROCK_CATEGORIES: Record<
  string,
  string[]
> = {
  all: [],

  addon: [
    "weapons",
    "armor",
    "magic",
    "technology",
    "survival",
  ],

  map: [
    "adventure",
    "parkour",
    "puzzle",
    "survival",
  ],

  texture: [
    "realistic",
    "pvp",
    "shader",
    "x16",
    "x32",
    "x64",
  ],

  script: [],
};