
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TranslationProvider } from './contexts/TranslationContext';
import { ModalProvider } from './contexts/ModalContext';
import { ToastProvider } from './contexts/ToastContext';
import { AIStatusProvider } from './contexts/AIStatusContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
import { ProfileProvider } from './contexts/ProfileContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <TranslationProvider>
        <ToastProvider>
          <AIStatusProvider>
            <AppSettingsProvider>
              <ProfileProvider>
                <ModalProvider>
                  <App />
                </ModalProvider>
              </ProfileProvider>
            </AppSettingsProvider>
          </AIStatusProvider>
        </ToastProvider>
      </TranslationProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
