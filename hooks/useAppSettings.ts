import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../types';
import { APP_SETTINGS_LOCAL_STORAGE_KEY } from '../constants';

const initialSettings: AppSettings = {
    aiCreativity: 'focused',
    aiResultsCount: 12,
    slideshowSpeed: 7,
    exhibitAutoplay: true,
    audioGuideVoiceURI: null,
    audioGuideSpeed: 1,
};

export const useAppSettings = () => {
    const [appSettings, setAppSettings] = useState<AppSettings>(() => {
        try {
            const savedSettings = localStorage.getItem(APP_SETTINGS_LOCAL_STORAGE_KEY);
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                return { ...initialSettings, ...parsed };
            }
            return initialSettings;
        } catch (error) {
            console.error("Could not parse saved app settings:", error);
            return initialSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(APP_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(appSettings));
        } catch (error) {
            console.warn("Could not save app settings to local storage:", error);
        }
    }, [appSettings]);

    const updateAppSettings = useCallback((newSettings: Partial<AppSettings>) => {
        setAppSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    return {
        appSettings,
        updateAppSettings,
        setAppSettings,
    };
};