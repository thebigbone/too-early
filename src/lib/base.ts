export const baseUrl = import.meta.env.BASE_URL;

/**
 * Build a path that works at the dev root and under the GitHub Pages
 * project base (e.g. "/too-early/").
 */
export function withBase(path = "") {
  const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}${path.replace(/^\//, "")}`;
}
