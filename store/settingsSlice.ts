import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../services/dbService.ts';
import type { AppSettings, ActiveView, ImageAspectRatio } from '../types.ts';
import type { RootState } from './store.ts';

const defaultSettings: AppSettings = {
  theme: 'dark',
  showDeletionConfirmation: true,
  compactMode: false,
  defaultViewOnStartup: 'workspace',
  aiResultsCount: 15,
  aiCreativity: 'balanced',
  aiContentLanguage: 'ui',
  aiThinkingBudget: 50,
  streamJournalResponses: true,
  promptEnhancementStyle: 'descriptive',
  studioDefaultAspectRatio: '1:1',
  studioAutoSave: false,
  clearPromptOnGenerate: true,
  defaultRemixPrompt: 'Make this more vibrant and add a surreal element.',
  slideshowSpeed: 7,
  slideshowTransition: 'fade',
  exhibitAutoplay: false,
  exhibitLoopSlideshow: true,
  showArtworkInfoInSlideshow: true,
  showControlsOnHover: true,
  autoSaveJournal: true,
  defaultJournalTitle: 'New Journal Entry',
  audioGuideVoiceURI: '',
  audioGuideSpeed: 1,
};

interface SettingsState {
    settings: AppSettings;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SettingsState = {
    settings: defaultSettings,
    status: 'idle',
    error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => {
    const settings = await db.getAppSettings(defaultSettings);
    return { ...defaultSettings, ...settings };
});

export const updateSettings = createAsyncThunk('settings/updateSettings', async (newSettings: Partial<AppSettings>, { getState }) => {
    const currentSettings = (getState() as RootState).settings.settings;
    const updatedSettings = { ...currentSettings, ...newSettings };
    await db.saveAppSettings(updatedSettings);
    return updatedSettings;
});

export const resetSettings = createAsyncThunk('settings/resetSettings', async () => {
    await db.saveAppSettings(defaultSettings);
    return defaultSettings;
});

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.settings = action.payload;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.settings = action.payload;
            })
            .addCase(resetSettings.fulfilled, (state, action) => {
                state.settings = action.payload;
            });
    },
});

export default settingsSlice.reducer;
