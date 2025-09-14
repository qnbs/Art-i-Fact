import { useState, useEffect, useCallback } from 'react';
import type { Gallery, Artwork } from '../types.ts';
import { db } from '../services/dbService.ts';

export const useGallery = () => {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGalleries = async () => {
            const storedGalleries = await db.getGalleries();
            setGalleries(storedGalleries);
            setIsLoading(false);
        };
        loadGalleries();
    }, []);

    const updateAndSave = useCallback(async (newGalleries: Gallery[] | ((prev: Gallery[]) => Gallery[])) => {
        const updatedGalleries = typeof newGalleries === 'function' ? newGalleries(galleries) : newGalleries;
        setGalleries(updatedGalleries);
        await db.saveGalleries(updatedGalleries);
    }, [galleries]);
    
    const createGallery = useCallback((details: { title: string; description: string; projectId: string | null }): string => {
        const newGallery: Gallery = {
            id: `gal_${Date.now()}`,
            ...details,
            artworks: [],
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        updateAndSave(prev => [newGallery, ...prev]);
        return newGallery.id;
    }, [updateAndSave]);

    const updateGallery = useCallback((id: string, updater: (gallery: Gallery) => Gallery) => {
        updateAndSave(prev => prev.map(g => g.id === id ? { ...updater(g), updatedAt: new Date().toISOString() } : g));
    }, [updateAndSave]);
    
    const deleteGallery = useCallback((id: string) => {
        updateAndSave(prev => prev.filter(g => g.id !== id));
    }, [updateAndSave]);

    const addArtworkToGallery = useCallback((galleryId: string, artwork: Artwork) => {
        updateGallery(galleryId, gallery => ({
            ...gallery,
            artworks: gallery.artworks.some(a => a.id === artwork.id) ? gallery.artworks : [...gallery.artworks, artwork],
            thumbnailUrl: gallery.artworks.length === 0 ? artwork.thumbnailUrl || artwork.imageUrl : gallery.thumbnailUrl
        }));
    }, [updateGallery]);
    
    const removeArtworkFromGallery = useCallback((galleryId: string, artworkId: string) => {
        updateGallery(galleryId, gallery => {
            const newArtworks = gallery.artworks.filter(a => a.id !== artworkId);
            return {
                ...gallery,
                artworks: newArtworks,
                thumbnailUrl: newArtworks[0]?.thumbnailUrl || newArtworks[0]?.imageUrl || undefined,
            };
        });
    }, [updateGallery]);

    const reorderArtworksInGallery = useCallback((galleryId: string, reorderedArtworks: Artwork[]) => {
        updateGallery(galleryId, gallery => ({
            ...gallery,
            artworks: reorderedArtworks
        }));
    }, [updateGallery]);

    const importGallery = useCallback((galleryToImport: Gallery) => {
        const importedGallery: Gallery = {
            ...galleryToImport,
            id: `gal_${Date.now()}`, // Ensure a unique ID
            projectId: null, // Imported galleries don't belong to a project initially
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            description: `${galleryToImport.description}\n\n(Imported from curator: ${galleryToImport.curatorProfile?.username || 'Unknown'})`
        };
        updateAndSave(prev => [importedGallery, ...prev]);
        return importedGallery.id;
    }, [updateAndSave]);

    return {
        galleries,
        isLoading,
        createGallery,
        updateGallery,
        deleteGallery,
        addArtworkToGallery,
        removeArtworkFromGallery,
        reorderArtworksInGallery,
        importGallery,
    };
};