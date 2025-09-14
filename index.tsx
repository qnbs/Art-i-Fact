import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Corrected import path for App component.
// FIX: Added .tsx extension to fix module resolution error.
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { AppProviders } from './contexts/AppProviders.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </ErrorBoundary>
  </React.StrictMode>
);