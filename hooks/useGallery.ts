
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GALLERY_LOCAL_STORAGE_KEY } from '../constants';
import type { Artwork, Gallery } from '../types';

export const useGallery = (activeGalleryId: string | null) => {
    const [galleries, setGalleries] = useState<Gallery[]>(() => {
        try {
            const savedGalleries = localStorage.getItem(GALLERY_LOCAL_STORAGE_KEY);
            return savedGalleries ? JSON.parse(savedGalleries) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(GALLERY_LOCAL_STORAGE_KEY, JSON.stringify(galleries));
        } catch (error) {
            console.warn("Could not save galleries:", error);
        }
    }, [galleries]);

    const updateGallery = useCallback((id: string, updater: (gallery: Gallery) => Gallery) => {
        setGalleries(prev => prev.map(g => (g.id === id ? { ...updater(g), updatedAt: new Date().toISOString() } : g)));
    }, []);

    const createNewGallery = useCallback((initialData: Partial<Gallery> = {}): string => {
        const newGallery: Gallery = {
            id: uuidv4(),
            title: 'Untitled Gallery',
            description: '',
            artworks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'draft',
            tags: [],
            curatorNotes: '',
            introduction: '',
            ...initialData,
        };
        setGalleries(prev => [...prev, newGallery]);
        return newGallery.id;
    }, []);

    const deleteGallery = useCallback((id: string) => {
        setGalleries(prev => prev.filter(g => g.id !== id));
    }, []);

    const duplicateGallery = useCallback((id: string): string | null => {
        const originalGallery = galleries.find(g => g.id === id);
        if (!originalGallery) return null;
        
        const newGallery: Gallery = {
            ...originalGallery,
            id: uuidv4(),
            title: `${originalGallery.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setGalleries(prev => [...prev, newGallery]);
        return newGallery.id;
    }, [galleries]);
    
    const updateActiveGallery = useCallback((updater: (gallery: Gallery) => Gallery) => {
        if (activeGalleryId) {
            updateGallery(activeGalleryId, updater);
        }
    }, [activeGalleryId, updateGallery]);

    const addArtworkToGallery = useCallback((artwork: Artwork, galleryId: string): boolean => {
        const gallery = galleries.find(g => g.id === galleryId);
        if (gallery && !gallery.artworks.some(a => a.id === artwork.id)) {
            const updatedGallery = {
                ...gallery,
                artworks: [...gallery.artworks, artwork],
                thumbnailUrl: gallery.artworks.length === 0 ? artwork.thumbnailUrl || artwork.imageUrl : gallery.thumbnailUrl,
            };
            updateGallery(galleryId, () => updatedGallery);
            return true;
        }
        return false;
    }, [galleries, updateGallery]);

    const removeArtworkFromActiveGallery = useCallback((artworkId: string) => {
        if (activeGalleryId) {
            updateActiveGallery(g => ({
                ...g,
                artworks: g.artworks.filter(a => a.id !== artworkId),
            }));
        }
    }, [activeGalleryId, updateActiveGallery]);

    const reorderArtworksInActiveGallery = useCallback((reorderedArtworks: Artwork[]) => {
        if (activeGalleryId) {
            updateActiveGallery(g => ({
                ...g,
                artworks: reorderedArtworks,
            }));
        }
    }, [activeGalleryId, updateActiveGallery]);

    const addCommentToArtwork = useCallback((artworkId: string, comment: string) => {
        if (activeGalleryId) {
            updateActiveGallery(g => ({
                ...g,
                artworks: g.artworks.map(a => a.id === artworkId ? { ...a, comment } : a),
            }));
        }
    }, [activeGalleryId, updateActiveGallery]);
    
    const clearAllGalleries = useCallback(() => {
        setGalleries([]);
    }, []);

    return {
        galleries,
        setGalleries,
        createNewGallery,
        deleteGallery,
        duplicateGallery,
        updateActiveGallery,
        addArtworkToGallery,
        removeArtworkFromActiveGallery,
        reorderArtworksInActiveGallery,
        addCommentToArtwork,
        clearAllGalleries,
    };
};
