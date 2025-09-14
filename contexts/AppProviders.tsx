

import React from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import { TranslationProvider } from './TranslationContext.tsx';
import { ModalProvider } from './ModalContext.tsx';
import { ToastProvider } from './ToastContext.tsx';
import { AIStatusProvider } from './AIStatusContext.tsx';
import { AppSettingsProvider } from './AppSettingsContext.tsx';
import { ProfileProvider } from './ProfileContext.tsx';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <TranslationProvider>
            <ToastProvider>
                <AIStatusProvider>
                    <AppSettingsProvider>
                        <ProfileProvider>
                            <ModalProvider>
                                {children}
                            </ModalProvider>
                        </ProfileProvider>
                    </AppSettingsProvider>
                </AIStatusProvider>
            </ToastProvider>
        </TranslationProvider>
    );
};