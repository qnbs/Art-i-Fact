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
        // Use a functional update with the most recent state
        setGalleries(currentGalleries => {
            const updatedGalleries = typeof newGalleries === 'function' ? newGalleries(currentGalleries) : newGalleries;
            db.saveGalleries(updatedGalleries);
            return updatedGalleries;
        });
    }, []);
    
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
        setGalleries(currentGalleries => {
            const galleryExists = currentGalleries.some(g => g.id === galleryId);
            if (!galleryExists) {
                console.warn(`Attempted to add artwork to non-existent gallery with id: ${galleryId}`);
                return currentGalleries;
            }
            
            const newGalleries = currentGalleries.map(gallery => {
                if (gallery.id === galleryId) {
                    return {
                        ...gallery,
                        artworks: gallery.artworks.some(a => a.id === artwork.id) ? gallery.artworks : [...gallery.artworks, artwork],
                        thumbnailUrl: gallery.artworks.length === 0 ? artwork.thumbnailUrl || artwork.imageUrl : gallery.thumbnailUrl,
                        updatedAt: new Date().toISOString(),
                    }
                }
                return gallery;
            });
            db.saveGalleries(newGalleries);
            return newGalleries;
        });
    }, []);
    
    const removeArtworkFromGallery = useCallback((galleryId: string, artworkId: string) => {
         setGalleries(currentGalleries => {
            const galleryExists = currentGalleries.some(g => g.id === galleryId);
            if (!galleryExists) {
                 console.warn(`Attempted to remove artwork from non-existent gallery with id: ${galleryId}`);
                return currentGalleries;
            }
            const newGalleries = currentGalleries.map(gallery => {
                 if (gallery.id === galleryId) {
                    const newArtworks = gallery.artworks.filter(a => a.id !== artworkId);
                    return {
                        ...gallery,
                        artworks: newArtworks,
                        thumbnailUrl: newArtworks[0]?.thumbnailUrl || newArtworks[0]?.imageUrl || undefined,
                        updatedAt: new Date().toISOString(),
                    };
                 }
                 return gallery;
            });
            db.saveGalleries(newGalleries);
            return newGalleries;
        });
    }, []);

    const reorderArtworksInGallery = useCallback((galleryId: string, reorderedArtworks: Artwork[]) => {
        setGalleries(currentGalleries => {
            const galleryExists = currentGalleries.some(g => g.id === galleryId);
            if (!galleryExists) {
                console.warn(`Attempted to reorder artworks in non-existent gallery with id: ${galleryId}`);
                return currentGalleries;
            }
            const newGalleries = currentGalleries.map(gallery => {
                 if (gallery.id === galleryId) {
                    return {
                        ...gallery,
                        artworks: reorderedArtworks,
                        updatedAt: new Date().toISOString(),
                    };
                 }
                 return gallery;
            });
            db.saveGalleries(newGalleries);
            return newGalleries;
        });
    }, []);

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

    const duplicateGallery = useCallback((id: string): string | undefined => {
        const galleryToDuplicate = galleries.find(g => g.id === id);
        if (!galleryToDuplicate) return undefined;

        const newGallery: Gallery = {
            ...galleryToDuplicate,
            id: `gal_${Date.now()}`,
            title: `${galleryToDuplicate.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        updateAndSave(prev => [newGallery, ...prev]);
        return newGallery.id;
    }, [galleries, updateAndSave]);

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
        duplicateGallery,
    };
};