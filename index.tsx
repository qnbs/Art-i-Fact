
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TranslationProvider } from './contexts/TranslationContext';
import { ModalProvider } from './contexts/ModalContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TranslationProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </TranslationProvider>
  </React.StrictMode>
);