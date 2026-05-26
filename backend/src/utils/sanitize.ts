import sanitizeHtml from "sanitize-html";

export function sanitizeText(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [], // ❌ elimina todo HTML
    allowedAttributes: {},
  });
}

// opcional: si querés permitir HTML básico en el futuro
export function sanitizeRichText(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ["b", "i", "em", "strong", "a", "ul", "li", "p", "br"],
    allowedAttributes: {
      a: ["href"],
    },
  });
}