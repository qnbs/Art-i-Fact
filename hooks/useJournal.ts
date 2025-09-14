
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { JOURNAL_LOCAL_STORAGE_KEY } from '../constants';
import type { JournalEntry } from '../types';

export const useJournal = () => {
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
        try {
            const savedEntries = localStorage.getItem(JOURNAL_LOCAL_STORAGE_KEY);
            return savedEntries ? JSON.parse(savedEntries) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(JOURNAL_LOCAL_STORAGE_KEY, JSON.stringify(journalEntries));
        } catch (error) {
            console.warn("Could not save journal entries:", error);
        }
    }, [journalEntries]);

    const createNewJournalEntry = useCallback((initialData: Partial<JournalEntry> = {}): string => {
        const newEntry: JournalEntry = {
            id: uuidv4(),
            title: 'New Entry',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            linkedGalleryId: null,
            ...initialData,
        };
        setJournalEntries(prev => [newEntry, ...prev]);
        return newEntry.id;
    }, []);

    const deleteJournalEntry = useCallback((id: string) => {
        setJournalEntries(prev => prev.filter(e => e.id !== id));
    }, []);

    const updateJournalEntry = useCallback((id: string, updatedEntry: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
        setJournalEntries(prev => prev.map(e => e.id === id ? { ...e, ...updatedEntry, updatedAt: new Date().toISOString() } : e));
    }, []);
    
    const unlinkGallery = useCallback((galleryId: string) => {
        setJournalEntries(prev => prev.map(e => e.linkedGalleryId === galleryId ? { ...e, linkedGalleryId: null, updatedAt: new Date().toISOString() } : e));
    }, []);

    const clearAllJournalEntries = useCallback(() => {
        setJournalEntries([]);
    }, []);

    return { journalEntries, setJournalEntries, createNewJournalEntry, deleteJournalEntry, updateJournalEntry, unlinkGallery, clearAllJournalEntries };
};
