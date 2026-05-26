export function generateSlug(username: string, title: string) {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // quitar caracteres raros
    .replace(/\s+/g, "-");        // espacios → guiones

  return `${username}-${cleanTitle}`;
}