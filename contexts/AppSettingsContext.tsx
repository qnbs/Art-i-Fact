import React, { createContext, useContext } from 'react';
import { useAppSettings as useAppSettingsHook } from '../hooks/useAppSettings';

type AppSettingsContextType = ReturnType<typeof useAppSettingsHook>;

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useAppSettingsHook();
  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
};

export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};