import { useState, useEffect, useCallback } from 'react';
// FIX: Added .ts extension to fix module resolution error.
import type { AppSettings } from '../types.ts';
import { db } from '../services/dbService.ts';

const defaultSettings: AppSettings = {
  // General
  theme: 'dark',
  showDeletionConfirmation: true,
  compactMode: false,
  defaultViewOnStartup: 'workspace',

  // AI
  aiResultsCount: 15,
  aiCreativity: 'balanced',
  aiContentLanguage: 'ui',
  aiThinkingBudget: 50,
  streamJournalResponses: true,

  // Studio
  promptEnhancementStyle: 'descriptive',
  studioDefaultAspectRatio: '1:1',
  studioAutoSave: false,
  clearPromptOnGenerate: true,
  defaultRemixPrompt: 'Make this more vibrant and add a surreal element.',

  // Exhibition
  slideshowSpeed: 7, // in seconds
  slideshowTransition: 'fade',
  exhibitAutoplay: false,
  exhibitLoopSlideshow: true,
  showArtworkInfoInSlideshow: true,
  showControlsOnHover: true,
  
  // Journal
  autoSaveJournal: true,
  defaultJournalTitle: 'New Journal Entry',

  // Audio Guide
  audioGuideVoiceURI: '', 
  audioGuideSpeed: 1,
};

export const useAppSettings = () => {
    const [appSettings, setAppSettingsState] = useState<AppSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = await db.getAppSettings(defaultSettings);
            // Merge with defaults to ensure new settings are applied
            setAppSettingsState({ ...defaultSettings, ...savedSettings });
            setIsLoading(false);
        };
        loadSettings();
    }, []);
    
    const setAppSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
        const updatedSettings = { ...appSettings, ...newSettings };
        setAppSettingsState(updatedSettings);
        await db.saveAppSettings(updatedSettings);
    }, [appSettings]);

    const resetAppSettings = useCallback(async () => {
        setAppSettingsState(defaultSettings);
        await db.saveAppSettings(defaultSettings);
    }, []);

    return { appSettings, isLoading, setAppSettings, resetAppSettings };
};