import {
    WELCOME_PORTAL_SEEN_KEY,
} from '../constants.ts';
import type { Gallery, Profile, AppSettings, JournalEntry, Project } from '../types.ts';

const DB_NAME = 'Art-i-FactDB';
const DB_VERSION = 1;

const STORE_PROJECTS = 'projects';
const STORE_GALLERIES = 'galleries';
const STORE_JOURNAL = 'journal';
const STORE_SETTINGS = 'settings';
const STORE_PROFILE = 'profile';
const STORE_MISC = 'misc'; // For simple key-value pairs like welcome seen

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
    if (dbPromise) {
        return dbPromise;
    }
    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
                db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_GALLERIES)) {
                db.createObjectStore(STORE_GALLERIES, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_JOURNAL)) {
                db.createObjectStore(STORE_JOURNAL, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
                db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
            }
             if (!db.objectStoreNames.contains(STORE_PROFILE)) {
                db.createObjectStore(STORE_PROFILE, { keyPath: 'key' });
            }
            if (!db.objectStoreNames.contains(STORE_MISC)) {
                db.createObjectStore(STORE_MISC, { keyPath: 'key' });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
            reject("Error opening database");
        };
    });
    return dbPromise;
};

const getAll = async <T>(storeName: string): Promise<T[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const putAll = async <T>(storeName: string, items: T[]): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        // Clear the store before adding new items to ensure synchronization
        const clearRequest = store.clear();
        clearRequest.onerror = () => reject(clearRequest.error);
        clearRequest.onsuccess = () => {
            if (items.length === 0) {
                resolve();
                return;
            }
            items.forEach(item => store.put(item));
        };

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

const get = async <T>(storeName: string, key: string, defaultValue: T): Promise<T> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result?.value ?? defaultValue);
        request.onerror = () => reject(request.error);
    });
};

const put = async <T>(storeName: string, key: string, value: T): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({ key, value });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const db = {
    // Projects
    getProjects: (): Promise<Project[]> => getAll<Project>(STORE_PROJECTS),
    saveProjects: (projects: Project[]): Promise<void> => putAll<Project>(STORE_PROJECTS, projects),

    // Galleries
    getGalleries: (): Promise<Gallery[]> => getAll<Gallery>(STORE_GALLERIES),
    saveGalleries: (galleries: Gallery[]): Promise<void> => putAll<Gallery>(STORE_GALLERIES, galleries),

    // Journal
    getJournalEntries: (): Promise<JournalEntry[]> => getAll<JournalEntry>(STORE_JOURNAL),
    saveJournalEntries: (entries: JournalEntry[]): Promise<void> => putAll<JournalEntry>(STORE_JOURNAL, entries),

    // Profile
    getProfile: (defaultValue: Profile): Promise<Profile> => get<Profile>(STORE_PROFILE, 'userProfile', defaultValue),
    saveProfile: (profile: Profile): Promise<void> => put<Profile>(STORE_PROFILE, 'userProfile', profile),
    
    // App Settings
    getAppSettings: (defaultValue: AppSettings): Promise<AppSettings> => get<AppSettings>(STORE_SETTINGS, 'appSettings', defaultValue),
    saveAppSettings: (settings: AppSettings): Promise<void> => put<AppSettings>(STORE_SETTINGS, 'appSettings', settings),
    
    // Welcome Portal
    getWelcomeSeen: (): Promise<boolean> => get<boolean>(STORE_MISC, WELCOME_PORTAL_SEEN_KEY, false),
    setWelcomeSeen: (seen: boolean): Promise<void> => put<boolean>(STORE_MISC, WELCOME_PORTAL_SEEN_KEY, seen),

    // Full export/import
    exportAllData: async (): Promise<string> => {
        const data = {
            projects: await db.getProjects(),
            galleries: await db.getGalleries(),
            journal: await db.getJournalEntries(),
            profile: await db.getProfile({} as Profile),
            settings: await db.getAppSettings({} as AppSettings),
        };
        return JSON.stringify(data, null, 2);
    },

    importAllData: async (jsonString: string): Promise<void> => {
        const data = JSON.parse(jsonString);
        if (data.projects) await db.saveProjects(data.projects);
        if (data.galleries) await db.saveGalleries(data.galleries);
        if (data.journal) await db.saveJournalEntries(data.journal);
        if (data.profile) await db.saveProfile(data.profile);
        if (data.settings) await db.saveAppSettings(data.settings);
    },
};