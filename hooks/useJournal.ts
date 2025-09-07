import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry } from '../types';
import { JOURNAL_LOCAL_STORAGE_KEY } from '../constants';

export const useJournal = () => {
    const [journal, setJournal] = useState<JournalEntry[]>(() => {
        try {
            const savedJournal = localStorage.getItem(JOURNAL_LOCAL_STORAGE_KEY);
            return savedJournal ? JSON.parse(savedJournal) : [];
        } catch (error) {
            console.error("Could not parse saved journal:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(JOURNAL_LOCAL_STORAGE_KEY, JSON.stringify(journal));
        } catch (error) {
            console.warn("Could not save journal to local storage:", error);
        }
    }, [journal]);

    const addEntry = useCallback((projectId?: string): string => {
        const newId = `journal_${Date.now()}`;
        const now = new Date().toISOString();
        const newEntry: JournalEntry = {
            id: newId,
            title: 'Untitled Entry',
            content: '',
            createdAt: now,
            updatedAt: now,
            projectId: projectId,
        };
        setJournal(prev => [newEntry, ...prev]);
        return newId;
    }, []);

    const updateEntry = useCallback((id: string, updatedEntry: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
        setJournal(prev => prev.map(entry => 
            entry.id === id 
            ? { ...entry, ...updatedEntry, updatedAt: new Date().toISOString() } 
            : entry
        ));
    }, []);
    
    const deleteEntry = useCallback((id: string) => {
        setJournal(prev => prev.filter(entry => entry.id !== id));
    }, []);

    return {
        journal,
        setJournal,
        addEntry,
        updateEntry,
        deleteEntry,
    };
};