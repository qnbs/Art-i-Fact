import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice.ts';
import projectsReducer from './projectsSlice.ts';
import galleriesReducer from './galleriesSlice.ts';
import journalReducer from './journalSlice.ts';
import settingsReducer from './settingsSlice.ts';
import profileReducer from './profileSlice.ts';
import appReducer from './appSlice.ts';

/**
 * RTK Store Configuration.
 * This combines all application slices into a single, global store.
 */
export const store = configureStore({
    reducer: {
        ui: uiReducer,
        projects: projectsReducer,
        galleries: galleriesReducer,
        journal: journalReducer,
        settings: settingsReducer,
        profile: profileReducer,
        app: appReducer,
    },
});

// Types for use throughout the app to ensure type safety.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;