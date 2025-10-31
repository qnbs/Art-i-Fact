import React, { createContext, useContext } from 'react';
import { useAppSettings as useAppSettingsHook } from '../hooks/useAppSettings.ts';
import type { AppSettings } from '../types.ts';

// FIX: Added isLoading property to the context type to match the hook's return value.
type AppSettingsContextType = {
  appSettings: AppSettings;
  setAppSettings: (settings: Partial<AppSettings>) => void;
  resetAppSettings: () => void;
  isLoading: boolean;
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appSettings, setAppSettings, resetAppSettings, isLoading } = useAppSettingsHook();
  return (
    <AppSettingsContext.Provider value={{ appSettings, setAppSettings, resetAppSettings, isLoading }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within a AppSettingsProvider');
  }
  return context;
};