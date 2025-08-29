/**
 * PUBLIC_INTERFACE
 * StorageService provides simple key-value persistence backed by localStorage.
 * Fallbacks to in-memory storage if localStorage is not available.
 */
export class StorageService {
  /** In-memory fallback store */
  private memoryStore = new Map<string, string>();

  /** Get a safe localStorage reference or undefined (SSR-safe). */
  private get localStorageSafe(): any | undefined {
    try {
      if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
        const g = globalThis as Record<string, unknown>;
        return g['localStorage'] as any;
      }
    } catch {
      // ignore
    }
    return undefined;
  }

  // PUBLIC_INTERFACE
  /**
   * Save a string value to storage.
   * @param key The key under which to store the value.
   * @param value The string value to store.
   */
  setItem(key: string, value: string): void {
    const ls = this.localStorageSafe;
    if (ls) {
      try {
        ls.setItem(key, value);
        return;
      } catch {
        // fall back to memory
      }
    }
    this.memoryStore.set(key, value);
  }

  // PUBLIC_INTERFACE
  /**
   * Retrieve a string value from storage.
   * @param key The key to retrieve.
   * @returns The stored string or null if not found.
   */
  getItem(key: string): string | null {
    const ls = this.localStorageSafe;
    if (ls) {
      try {
        return ls.getItem(key);
      } catch {
        // fall back to memory
      }
    }
    return this.memoryStore.get(key) ?? null;
  }

  // PUBLIC_INTERFACE
  /**
   * Remove a value from storage.
   * @param key The key to remove.
   */
  removeItem(key: string): void {
    const ls = this.localStorageSafe;
    if (ls) {
      try {
        ls.removeItem(key);
        return;
      } catch {
        // fall back to memory
      }
    }
    this.memoryStore.delete(key);
  }
}
