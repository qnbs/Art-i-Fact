import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../services/dbService.ts';
import type { AppSettings } from '../types.ts';
import type { RootState } from './store.ts';

const defaultSettings: AppSettings = {
  // General & Appearance
  theme: 'dark',
  showDeletionConfirmation: true,
  compactMode: false,
  defaultViewOnStartup: 'workspace',
  reduceMotion: false,

  // AI Assistant
  aiCreativity: 'balanced',
  aiTemperature: 0.7,
  aiTopP: 0.9,
  aiTopK: 40,
  aiContentLanguage: 'ui',
  aiThinkingBudget: 50,
  streamJournalResponses: true,

  // Studio
  promptEnhancementStyle: 'descriptive',
  autoEnhancePrompts: false,
  studioDefaultAspectRatio: '1:1',
  clearPromptOnGenerate: true,
  defaultNegativePrompt: 'text, watermark, ugly, deformed',
  defaultRemixPrompt: 'Make this more vibrant and add a surreal element.',

  // Exhibition Mode
  slideshowSpeed: 7,
  slideshowTransition: 'fade',
  exhibitAutoplay: false,
  exhibitLoopSlideshow: true,
  exhibitBackground: 'blur',
  exhibitEnableParallax: true,
  showArtworkInfoInSlideshow: true,
  showControlsOnHover: true,
  
  // Journal
  autoSaveJournal: true,
  defaultJournalTitle: 'New Journal Entry',
  journalEditorFontSize: 'base',

  // Audio Guide
  audioGuideVoiceURI: 'default', 
  audioGuideSpeed: 1,
  audioGuidePitch: 1,
  audioGuideVolume: 1,

  // Profile
  showProfileActivity: true,
  showProfileAchievements: true,
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