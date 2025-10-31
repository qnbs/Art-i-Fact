import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store.ts';
import { TranslationProvider } from './TranslationContext.tsx';
import { ToastProvider } from './ToastContext.tsx';
import { ModalProvider } from './ModalContext.tsx';
import { AIStatusProvider } from './AIStatusContext.tsx';
import { AppProvider } from './AppContext.tsx';
import { OnlineStatusProvider } from './OnlineStatusContext.tsx';
// FIX: Import AppSettingsProvider and ProfileProvider
import { AppSettingsProvider } from './AppSettingsContext.tsx';
import { ProfileProvider } from './ProfileContext.tsx';

/**
 * A single component that wraps the entire application with all necessary providers.
 * This simplifies the root `index.tsx` and ensures a consistent provider order.
 * - Redux Provider: Connects the app to the Redux store.
 * - OnlineStatusProvider: Tracks the user's network connection status.
 * - TranslationProvider: Manages internationalization (i18n).
 * - ToastProvider: Handles global toast notifications.
 * - ModalProvider: Manages modal dialogs.
 * - AIStatusProvider: Tracks the status of ongoing AI tasks.
 * - AppProvider: The main application context that aggregates data and logic.
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Provider store={store}>
            <OnlineStatusProvider>
                <TranslationProvider>
                    <ToastProvider>
                        <ModalProvider>
                            <AIStatusProvider>
                                {/* FIX: Add AppSettingsProvider and ProfileProvider wrapper */}
                                <AppSettingsProvider>
                                    <ProfileProvider>
                                        <AppProvider>
                                            {children}
                                        </AppProvider>
                                    </ProfileProvider>
                                </AppSettingsProvider>
                            </AIStatusProvider>
                        </ModalProvider>
                    </ToastProvider>
                </TranslationProvider>
            </OnlineStatusProvider>
        </Provider>
    );
};
