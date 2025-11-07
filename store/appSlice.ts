import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Gallery } from '../types.ts';
import { db } from '../services/dbService.ts';

interface AppState {
    showWelcome: boolean;
    previewGallery: Gallery | null;
    initialDiscoverSearch: string;
    status: 'idle' | 'loading' | 'succeeded';
}

const initialState: AppState = {
    showWelcome: false,
    previewGallery: null,
    initialDiscoverSearch: '',
    status: 'idle',
};

export const fetchWelcomeStatus = createAsyncThunk('app/fetchWelcomeStatus', async () => {
    const seen = await db.getWelcomeSeen();
    return !seen;
});

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setPreviewGallery(state, action: PayloadAction<Gallery | null>) {
            state.previewGallery = action.payload;
        },
        setShowWelcome(state, action: PayloadAction<boolean>) {
            state.showWelcome = action.payload;
            if (!action.payload) {
                db.setWelcomeSeen(true);
            }
        },
        setInitialDiscoverSearch(state, action: PayloadAction<string>) {
            state.initialDiscoverSearch = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWelcomeStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWelcomeStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.showWelcome = action.payload;
            });
    },
});

export const { setPreviewGallery, setShowWelcome, setInitialDiscoverSearch } = appSlice.actions;
export default appSlice.reducer;