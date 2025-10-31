import React from 'react';
import { AppLayout } from './components/AppLayout.tsx';

/**
 * The root component of the application.
 * It renders the main AppLayout, which contains all UI and logic.
 * The necessary providers are wrapped around this component in index.tsx.
 */
const App: React.FC = () => {
    return (
        <AppLayout />
    );
};

export default App;