export const PLATFORM_OPTIONS = [
  { value: "JAVA", label: "Java" },
  { value: "BEDROCK", label: "Bedrock" },
];

export const LOADER_OPTIONS = [
  { value: "FABRIC", label: "Fabric" },
  { value: "FORGE", label: "Forge" },
  { value: "NEOFORGE", label: "NeoForge" },
  { value: "QUILT", label: "Quilt" },
  { value: "LITELOADER", label: "LiteLoader" },
];

export const PROJECT_TYPE_OPTIONS = [
  // Java //
  { value: "PLUGIN", label: "Plugin" },
  { value: "MOD", label: "Mod" },
  { value: "MODPACK", label: "Modpack" },
  { value: "SHADER", label: "Shader" },
  { value: "DATA_PACK", label: "Data Pack" },
  { value: "RESOURCE_PACK", label: "Resource Pack" },
  { value: "WORLD", label: "World" },

  // Bedrock //
  { value: "ADDON", label: "Addon" },
  { value: "TEXTURE", label: "Texture" },
  { value: "SCRIPT", label: "Script" },

  // Custom //
  { value: "CUSTOM", label: "Custom" },
];