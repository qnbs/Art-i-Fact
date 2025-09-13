
import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry } from '../types';
import { JOURNAL_LOCAL_STORAGE_KEY } from '../constants';
import { sanitizeInput } from '../services/geminiService';

export const useJournal = () => {
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
        try {
            const savedEntries = localStorage.getItem(JOURNAL_LOCAL_STORAGE_KEY);
            return savedEntries ? JSON.parse(savedEntries) : [];
        } catch (error) {
            console.error("Could not parse saved journal entries:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(JOURNAL_LOCAL_STORAGE_KEY, JSON.stringify(journalEntries));
        } catch (error) {
            console.warn("Could not save journal entries to local storage:", error);
        }
    }, [journalEntries]);

    const createNewJournalEntry = useCallback((initialData?: Partial<JournalEntry>): string => {
        const newId = `journal_${Date.now()}`;
        const now = new Date().toISOString();
        const newEntry: JournalEntry = {
            id: newId,
            title: sanitizeInput(initialData?.title || 'Untitled Entry'),
            content: initialData?.content || '',
            createdAt: now,
            updatedAt: now,
            galleryIds: [],
            projectId: initialData?.projectId,
        };
        setJournalEntries(prev => [newEntry, ...prev]);
        return newId;
    }, []);

    const deleteJournalEntry = useCallback((id: string) => {
        setJournalEntries(prev => prev.filter(entry => entry.id !== id));
    }, []);

    const updateJournalEntry = useCallback((id: string, updatedEntry: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
        setJournalEntries(prev => prev.map(entry => {
            if (entry.id !== id) return entry;
            
            const newValues = { ...updatedEntry };
            if (newValues.title) newValues.title = sanitizeInput(newValues.title);
            // Content is markdown, so we don't sanitize it here. It's sanitized on render.
            
            return { ...entry, ...newValues, updatedAt: new Date().toISOString() };
        }));
    }, []);

    const clearAllJournalEntries = useCallback(() => {
        setJournalEntries([]);
    }, []);
    
    const unlinkGallery = useCallback((galleryId: string) => {
        setJournalEntries(prev => prev.map(entry => {
            if (entry.galleryIds.includes(galleryId)) {
                return {
                    ...entry,
                    galleryIds: entry.galleryIds.filter(id => id !== galleryId),
                    updatedAt: new Date().toISOString(),
                };
            }
            return entry;
        }));
    }, []);

    const importJournalEntries = useCallback((importedEntries: JournalEntry[], mode: 'merge' | 'replace') => {
        const sanitizedImport = importedEntries.map(entry => ({
            ...entry,
            title: sanitizeInput(entry.title),
        }));

        if (mode === 'replace') {
            setJournalEntries(sanitizedImport);
        } else {
            setJournalEntries(prev => {
                const entryMap = new Map(prev.map(e => [e.id, e]));
                sanitizedImport.forEach(e => entryMap.set(e.id, e));
                return Array.from(entryMap.values());
            });
        }
    }, []);


    return {
        journalEntries,
        setJournalEntries,
        createNewJournalEntry,
        deleteJournalEntry,
        updateJournalEntry,
        clearAllJournalEntries,
        importJournalEntries,
        unlinkGallery,
    };
};