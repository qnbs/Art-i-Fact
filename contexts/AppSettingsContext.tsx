
import React, { createContext, useContext } from 'react';
import { useAppSettings as useAppSettingsHook } from '../hooks/useAppSettings';
import type { AppSettings } from '../types';

type AppSettingsContextType = {
  appSettings: AppSettings;
  setAppSettings: (settings: Partial<AppSettings>) => void;
  resetAppSettings: () => void;
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appSettings, setAppSettings, resetAppSettings } = useAppSettingsHook();
  return (
    <AppSettingsContext.Provider value={{ appSettings, setAppSettings, resetAppSettings }}>
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
