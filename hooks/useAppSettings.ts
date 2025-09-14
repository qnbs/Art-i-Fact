
import { useState, useEffect, useCallback } from 'react';
import { APP_SETTINGS_LOCAL_STORAGE_KEY } from '../constants';
import type { AppSettings } from '../types';

const defaultAppSettings: AppSettings = {
  aiResultsCount: 15,
  aiCreativity: 'balanced',
  slideshowSpeed: 5,
  slideshowTransition: 'fade',
  exhibitAutoplay: false,
  showArtworkInfoInSlideshow: true,
  promptEnhancementStyle: 'descriptive',
  aiContentLanguage: 'ui',
  compactMode: false,
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
