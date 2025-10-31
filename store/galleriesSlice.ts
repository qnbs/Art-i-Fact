import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../services/dbService.ts';
import type { Gallery, Artwork, Profile } from '../types.ts';
import type { RootState } from './store.ts';

interface GalleriesState {
    galleries: Gallery[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GalleriesState = {
    galleries: [],
    status: 'idle',
    error: null,
};

export const fetchGalleries = createAsyncThunk('galleries/fetchGalleries', async () => {
    return await db.getGalleries();
});

export const createGallery = createAsyncThunk('galleries/createGallery', async (details: { title: string; description: string; projectId: string | null }, { getState }) => {
    const newGallery: Gallery = {
        id: `gal_${Date.now()}`,
        ...details,
        artworks: [],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const currentGalleries = (getState() as RootState).galleries.galleries;
    const updatedGalleries = [newGallery, ...currentGalleries];
    await db.saveGalleries(updatedGalleries);
    return newGallery;
});

export const updateGallery = createAsyncThunk('galleries/updateGallery', async ({ id, updater }: { id: string; updater: (g: Gallery) => Gallery }, { getState }) => {
    const currentGalleries = (getState() as RootState).galleries.galleries;
    let updatedGallery: Gallery | undefined;
    const updatedGalleries = currentGalleries.map(g => {
        if (g.id === id) {
            updatedGallery = { ...updater(g), updatedAt: new Date().toISOString() };
            return updatedGallery;
        }
        return g;
    });
    await db.saveGalleries(updatedGalleries);
    return updatedGallery!;
});

export const deleteGallery = createAsyncThunk('galleries/deleteGallery', async (id: string, { getState }) => {
    const currentGalleries = (getState() as RootState).galleries.galleries;
    const updatedGalleries = currentGalleries.filter(g => g.id !== id);
    await db.saveGalleries(updatedGalleries);
    return id;
});

export const deleteGalleriesByProjectId = createAsyncThunk('galleries/deleteGalleriesByProjectId', async (projectId: string, { getState }) => {
    const currentGalleries = (getState() as RootState).galleries.galleries;
    const updatedGalleries = currentGalleries.filter(g => g.projectId !== projectId);
    await db.saveGalleries(updatedGalleries);
    return projectId;
});

export const addArtworkToGallery = createAsyncThunk('galleries/addArtworkToGallery', async ({ galleryId, artwork }: { galleryId: string; artwork: Artwork }, { getState }) => {
    return updateGallery({
        id: galleryId,
        updater: g => ({
            ...g,
            artworks: g.artworks.some(a => a.id === artwork.id) ? g.artworks : [...g.artworks, artwork],
            thumbnailUrl: g.artworks.length === 0 ? artwork.thumbnailUrl || artwork.imageUrl : g.thumbnailUrl,
        })
    })(getState().dispatch, getState, undefined);
});

export const removeArtworkFromGallery = createAsyncThunk('galleries/removeArtworkFromGallery', async ({ galleryId, artworkId }: { galleryId: string; artworkId: string }, { getState }) => {
    return updateGallery({
        id: galleryId,
        updater: g => {
            const newArtworks = g.artworks.filter(a => a.id !== artworkId);
            return {
                ...g,
                artworks: newArtworks,
                thumbnailUrl: newArtworks[0]?.thumbnailUrl || newArtworks[0]?.imageUrl || undefined,
            };
        }
    })(getState().dispatch, getState, undefined);
});

export const reorderArtworksInGallery = createAsyncThunk('galleries/reorderArtworksInGallery', async ({ galleryId, reorderedArtworks }: { galleryId: string; reorderedArtworks: Artwork[] }, { getState }) => {
     return updateGallery({
        id: galleryId,
        updater: g => ({ ...g, artworks: reorderedArtworks })
    })(getState().dispatch, getState, undefined);
});

export const importGallery = createAsyncThunk('galleries/importGallery', async (galleryToImport: Gallery & { curatorProfile?: Profile }, { getState }) => {
    const newGallery: Gallery = {
        ...galleryToImport,
        id: `gal_${Date.now()}`,
        projectId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: `${galleryToImport.description}\n\n(Imported from curator: ${galleryToImport.curatorProfile?.username || 'Unknown'})`,
    };
    return createGallery(newGallery)(getState().dispatch, getState, undefined);
});

export const duplicateGallery = createAsyncThunk('galleries/duplicateGallery', async (id: string, { getState }) => {
    const galleryToDuplicate = (getState() as RootState).galleries.galleries.find(g => g.id === id);
    if (!galleryToDuplicate) throw new Error('Gallery not found');
    const newGalleryData = {
        ...galleryToDuplicate,
        title: `${galleryToDuplicate.title} (Copy)`,
        projectId: galleryToDuplicate.projectId,
        description: galleryToDuplicate.description,
    };
    return createGallery(newGalleryData)(getState().dispatch, getState, undefined);
});

const galleriesSlice = createSlice({
    name: 'galleries',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGalleries.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGalleries.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.galleries = action.payload;
            })
            .addCase(createGallery.fulfilled, (state, action: PayloadAction<Gallery>) => {
                state.galleries.unshift(action.payload);
            })
            .addCase(updateGallery.fulfilled, (state, action: PayloadAction<Gallery>) => {
                const index = state.galleries.findIndex(g => g.id === action.payload.id);
                if (index !== -1) state.galleries[index] = action.payload;
            })
            .addCase(deleteGallery.fulfilled, (state, action: PayloadAction<string>) => {
                state.galleries = state.galleries.filter(g => g.id !== action.payload);
            })
            .addCase(deleteGalleriesByProjectId.fulfilled, (state, action: PayloadAction<string>) => {
                state.galleries = state.galleries.filter(g => g.projectId !== action.payload);
            });
    },
});

export default galleriesSlice.reducer;
