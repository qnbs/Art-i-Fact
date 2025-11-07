import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../services/dbService.ts';
import type { JournalEntry } from '../types.ts';
import type { RootState } from './store.ts';

interface JournalState {
    entries: JournalEntry[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: JournalState = {
    entries: [],
    status: 'idle',
    error: null,
};

export const fetchJournalEntries = createAsyncThunk('journal/fetchJournalEntries', async () => {
    return await db.getJournalEntries();
});

export const createJournalEntry = createAsyncThunk('journal/createJournalEntry', async ({ projectId, defaultTitle }: { projectId: string | null, defaultTitle: string }, { getState }) => {
    const newEntry: JournalEntry = {
        id: `jnl_${Date.now()}`,
        title: defaultTitle,
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectId: projectId || undefined,
    };
    const currentEntries = (getState() as RootState).journal.entries;
    const updatedEntries = [newEntry, ...currentEntries];
    await db.saveJournalEntries(updatedEntries);
    return newEntry;
});

export const updateJournalEntry = createAsyncThunk('journal/updateJournalEntry', async ({ id, updatedDetails }: { id: string, updatedDetails: Partial<Omit<JournalEntry, 'id' | 'createdAt'>> }, { getState }) => {
    const currentEntries = (getState() as RootState).journal.entries;
    let updatedEntry: JournalEntry | undefined;
    const updatedEntries = currentEntries.map(e => {
        if (e.id === id) {
            updatedEntry = { ...e, ...updatedDetails, updatedAt: new Date().toISOString() };
            return updatedEntry;
        }
        return e;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    await db.saveJournalEntries(updatedEntries);
    return updatedEntry!;
});

export const deleteJournalEntry = createAsyncThunk('journal/deleteJournalEntry', async (id: string, { getState }) => {
    const currentEntries = (getState() as RootState).journal.entries;
    const updatedEntries = currentEntries.filter(e => e.id !== id);
    await db.saveJournalEntries(updatedEntries);
    return id;
});

export const deleteJournalsByProjectId = createAsyncThunk('journal/deleteJournalsByProjectId', async (projectId: string, { getState }) => {
    const currentEntries = (getState() as RootState).journal.entries;
    const updatedEntries = currentEntries.filter(j => j.projectId !== projectId);
    await db.saveJournalEntries(updatedEntries);
    return projectId;
});

export const deleteAllJournals = createAsyncThunk('journal/deleteAllJournals', async () => {
    await db.saveJournalEntries([]);
});

const journalSlice = createSlice({
    name: 'journal',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJournalEntries.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchJournalEntries.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.entries = action.payload;
            })
            .addCase(createJournalEntry.fulfilled, (state, action: PayloadAction<JournalEntry>) => {
                state.entries.unshift(action.payload);
            })
            .addCase(updateJournalEntry.fulfilled, (state, action: PayloadAction<JournalEntry>) => {
                const index = state.entries.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    state.entries[index] = action.payload;
                    state.entries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                }
            })
            .addCase(deleteJournalEntry.fulfilled, (state, action: PayloadAction<string>) => {
                state.entries = state.entries.filter(e => e.id !== action.payload);
            })
            .addCase(deleteJournalsByProjectId.fulfilled, (state, action: PayloadAction<string>) => {
                state.entries = state.entries.filter(j => j.projectId !== action.payload);
            })
            .addCase(deleteAllJournals.fulfilled, (state) => {
                state.entries = [];
            });
    },
});

export default journalSlice.reducer;