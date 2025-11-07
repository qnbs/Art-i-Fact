import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppProviders } from './contexts/AppProviders.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
// Assuming a base CSS file for Tailwind directives exists
// import './index.css'; 

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <AppProviders>
                    <App />
                </AppProviders>
            </ErrorBoundary>
        </React.StrictMode>
    );
} else {
    console.error("Failed to find the root element to mount the React application.");
}
