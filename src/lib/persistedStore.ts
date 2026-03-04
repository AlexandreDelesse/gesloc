/**
 * Utilitaires de persistance localStorage pour les stores mock.
 * À remplacer par la vraie couche API quand elle sera prête.
 */

export function loadStore<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Silently fail (quota exceeded, private browsing, etc.)
  }
}
