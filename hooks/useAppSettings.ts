
import { useState, useEffect, useCallback } from 'react';
import { APP_SETTINGS_LOCAL_STORAGE_KEY } from '../constants';
import type { AppSettings } from '../types';

const defaultAppSettings: AppSettings = {
  // General
  showDeletionConfirmation: true,
  compactMode: false,
  
  // AI
  aiResultsCount: 15,
  aiCreativity: 'balanced',
  aiContentLanguage: 'ui',
  aiThinkingBudget: 50,

  // Studio
  promptEnhancementStyle: 'descriptive',
  studioDefaultAspectRatio: '1:1',
  studioAutoSave: false,

  // Exhibition
  slideshowSpeed: 5,
  slideshowTransition: 'fade',
  exhibitAutoplay: false,
  exhibitLoopSlideshow: true,
  showArtworkInfoInSlideshow: true,
  
  // Audio Guide
  audioGuideVoiceURI: '',
  audioGuideSpeed: 1,
};

export const useAppSettings = (): { appSettings: AppSettings; setAppSettings: (settings: Partial<AppSettings>) => void; resetAppSettings: () => void; } => {
  const [appSettings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(APP_SETTINGS_LOCAL_STORAGE_KEY);
      return savedSettings ? { ...defaultAppSettings, ...JSON.parse(savedSettings) } : defaultAppSettings;
    } catch {
      return defaultAppSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(APP_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(appSettings));
    } catch (error) {
      console.warn("Could not save app settings:", error);
    }
  }, [appSettings]);

  const setAppSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetAppSettings = useCallback(() => {
      setSettings(defaultAppSettings);
  }, []);

  return { appSettings, setAppSettings, resetAppSettings };
};
