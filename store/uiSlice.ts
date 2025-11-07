import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ActiveView } from '../types.ts';

/**
 * RTK Slice to manage global UI state.
 * This slice centralizes the logic for navigation and UI state,
 * which was previously distributed across local states in the App component.
 */
interface UiState {
    activeView: ActiveView;
    activeProjectId: string | null;
    activeGalleryId: string | null;
    isCommandPaletteOpen: boolean;
    newlyCreatedProjectId: string | null;
    newlyCreatedGalleryId: string | null;
}

const initialState: UiState = {
    activeView: 'workspace',
    activeProjectId: null,
    activeGalleryId: null,
    isCommandPaletteOpen: false,
    newlyCreatedProjectId: null,
    newlyCreatedGalleryId: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Sets the main view and resets project/gallery IDs if necessary.
        setActiveView(state, action: PayloadAction<ActiveView>) {
            state.activeView = action.payload;
            state.newlyCreatedProjectId = null;
            state.newlyCreatedGalleryId = null;
            if (action.payload !== 'project' && action.payload !== 'gallery') {
                state.activeProjectId = null;
                state.activeGalleryId = null;
            }
        },
        // Sets an active project and automatically switches to the project view.
        setActiveProjectId(state, action: PayloadAction<string | null>) {
            state.activeProjectId = action.payload;
            if (action.payload) {
                state.activeView = 'project';
                state.newlyCreatedProjectId = action.payload;
            }
        },
        // Sets an active gallery and automatically switches to the gallery view.
        setActiveGalleryId(state, action: PayloadAction<string | null>) {
            state.activeGalleryId = action.payload;
            if (action.payload) {
                state.activeView = 'gallery';
                state.newlyCreatedGalleryId = action.payload;
            }
        },
        // Controls the visibility of the command palette.
        setCommandPaletteOpen(state, action: PayloadAction<boolean>) {
            state.isCommandPaletteOpen = action.payload;
        },
    },
});

export const { setActiveView, setActiveProjectId, setActiveGalleryId, setCommandPaletteOpen } = uiSlice.actions;
export default uiSlice.reducer;