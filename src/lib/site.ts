/** GitHub Pages liefert die App unter /<repo>/ aus. Links von Next ergänzen das selbst, feste Pfade nicht. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
