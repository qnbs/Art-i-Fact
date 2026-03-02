/**
 * Secure API Key Management Service
 *
 * Stores the user-provided Gemini API key obfuscated in IndexedDB.
 * NEVER exposes the key in builds, localStorage, or source code.
 */

const DB_NAME = "art-i-fact-secure";
const STORE_NAME = "credentials";
const KEY_ID = "gemini-api-key";

// Simple XOR-based obfuscation (prevents casual inspection in DevTools)
const OBFUSCATION_KEY = "ArT-1-FaCt-2025-sEcUrE";

const obfuscate = (text: string): string => {
  return Array.from(text)
    .map((char, i) =>
      String.fromCharCode(
        char.charCodeAt(0) ^
          OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length),
      ),
    )
    .join("");
};

const deobfuscate = (text: string): string => obfuscate(text); // XOR is symmetric

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Runtime cache to avoid repeated IndexedDB reads
let _cachedKey: string | null = null;

export const saveApiKey = async (key: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const obfuscated = obfuscate(key);
  store.put({
    id: KEY_ID,
    value: obfuscated,
    updatedAt: new Date().toISOString(),
  });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      _cachedKey = key;
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
};

export const getApiKey = async (): Promise<string | null> => {
  if (_cachedKey) return _cachedKey;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(KEY_ID);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result?.value) {
          const key = deobfuscate(request.result.value);
          _cachedKey = key;
          resolve(key);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
};

export const deleteApiKey = async (): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.delete(KEY_ID);
  _cachedKey = null;
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const hasApiKey = async (): Promise<boolean> => {
  const key = await getApiKey();
  return key !== null && key.trim().length > 0;
};

/**
 * Initialize: try to load from IndexedDB, then fall back to build-time env var (dev only).
 * In production, the build-time env var should NOT exist.
 */
export const initializeApiKey = async (): Promise<string | null> => {
  const stored = await getApiKey();
  if (stored) return stored;

  // Fallback for development only
  try {
    const buildTimeKey = (process as any).env?.API_KEY;
    if (buildTimeKey && buildTimeKey !== "undefined" && buildTimeKey.trim()) {
      _cachedKey = buildTimeKey;
      return buildTimeKey;
    }
  } catch {
    // process.env not available — expected in production
  }

  return null;
};
