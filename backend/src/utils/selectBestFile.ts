type Version = {
  id: number;
  version: string;
  minecraftVersion: string;
  loader?: string | null;
  createdAt: Date;
  files: {
    url: string;
    isPrimary: boolean;
  }[];
};

type Preferences = {
  minecraftVersion?: string;
  loader?: string;
};

export const selectBestFile = (
  versions: Version[],
  prefs: Preferences
) => {
  if (!versions.length) return null;

  let filtered = versions;

  // 1. Match Minecraft version
  if (prefs.minecraftVersion) {
    const exact = versions.filter(
      v => v.minecraftVersion === prefs.minecraftVersion
    );
    if (exact.length) filtered = exact;
  }

  // 2. Match loader
  if (prefs.loader) {
    const loaderMatch = filtered.filter(
      v => v.loader === prefs.loader
    );
    if (loaderMatch.length) filtered = loaderMatch;
  }

  // 3. Ordenar por fecha (más nuevo primero)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const bestVersion = filtered[0];

  if (!bestVersion) return null;

  // 4. Elegir archivo principal
  const primary = bestVersion.files.find(f => f.isPrimary);

  return primary || bestVersion.files[0] || null;
};