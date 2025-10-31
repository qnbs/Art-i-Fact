import { useState, useEffect, useCallback } from 'react';
// FIX: Added .ts extension to fix module resolution error.
import type { JournalEntry } from '../types.ts';
import { db } from '../services/dbService.ts';

export const useJournal = (defaultTitle: string) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEntries = async () => {
            const storedEntries = await db.getJournalEntries();
            setEntries(storedEntries);
            setIsLoading(false);
        };
        loadEntries();
    }, []);

    const updateAndSave = useCallback(async (newEntries: JournalEntry[] | ((prev: JournalEntry[]) => JournalEntry[])) => {
        const updatedEntries = typeof newEntries === 'function' ? newEntries(entries) : newEntries;
        setEntries(updatedEntries);
        await db.saveJournalEntries(updatedEntries);
    }, [entries]);

    // FIX: Made function async and return a promise to match its behavior.
    const createJournalEntry = useCallback(async (projectId: string | null = null): Promise<string> => {
        const newEntry: JournalEntry = {
            id: `jnl_${Date.now()}`,
            title: defaultTitle,
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            projectId: projectId || undefined,
        };
        await updateAndSave(prev => [newEntry, ...prev]);
        return newEntry.id;
    }, [defaultTitle, updateAndSave]);

    const updateJournalEntry = useCallback((id: string, updatedDetails: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
        updateAndSave(prev => 
            prev.map(e => 
                e.id === id ? { ...e, ...updatedDetails, updatedAt: new Date().toISOString() } : e
            ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        );
    }, [updateAndSave]);

    const deleteJournalEntry = useCallback((id: string) => {
        updateAndSave(prev => prev.filter(e => e.id !== id));
    }, [updateAndSave]);
    
    const deleteAllJournals = useCallback(() => {
        updateAndSave([]);
    }, [updateAndSave]);

    const deleteJournalsByProjectId = useCallback((projectId: string) => {
        updateAndSave(prev => prev.filter(j => j.projectId !== projectId));
    }, [updateAndSave]);

    return {
        entries,
        isLoading,
        createJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        deleteAllJournals,
        deleteJournalsByProjectId,
    };
};