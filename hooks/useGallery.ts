

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Gallery, Artwork } from '../types';
import { GALLERY_LOCAL_STORAGE_KEY } from '../constants';
import { sanitizeInput } from '../services/geminiService';

const getGalleryThumbnail = (artworks: Artwork[]): string => {
    if (artworks.length > 0) {
        const firstArt = artworks[0];
        if (firstArt.thumbnailUrl) {
            return firstArt.thumbnailUrl;
        }
        if (firstArt.imageUrl) {
            return firstArt.imageUrl;
        }
    }
    // Return a default placeholder SVG for an empty gallery
    const svg = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#e5e7eb"/><text x="50" y="55" font-family="sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">Empty</text></svg>`;
    try {
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    } catch (e) {
        console.error("Failed to encode SVG thumbnail", e);
        return '';
    }
};


export const useGallery = (activeGalleryId: string | null) => {
  const [galleries, setGalleries] = useState<Gallery[]>(() => {
    try {
      const savedGalleries = localStorage.getItem(GALLERY_LOCAL_STORAGE_KEY);
      return savedGalleries ? JSON.parse(savedGalleries) : [];
    } catch (error) {
      console.error("Could not parse saved galleries:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(GALLERY_LOCAL_STORAGE_KEY, JSON.stringify(galleries));
    } catch (error) {
        console.warn("Could not save galleries to local storage:", error);
    }
  }, [galleries]);

  const activeGallery = useMemo(() => galleries.find(g => g.id === activeGalleryId) || null, [galleries, activeGalleryId]);

  const updateGallery = useCallback((id: string, updater: (gallery: Gallery) => Gallery) => {
      setGalleries(prev => prev.map(g => {
        if (g.id !== id) return g;
        const updated = updater(g);
        // Sanitize user-provided text fields for security
        return {
            ...updated,
            title: sanitizeInput(updated.title),
            description: sanitizeInput(updated.description),
            curatorIntro: updated.curatorIntro ? sanitizeInput(updated.curatorIntro) : undefined,
            updatedAt: new Date().toISOString()
        };
      }));
  }, []);
  
  const updateActiveGallery = useCallback((updater: (gallery: Gallery) => Gallery) => {
      if(!activeGalleryId) return;
      updateGallery(activeGalleryId, updater);
  }, [activeGalleryId, updateGallery]);


  const createNewGallery = useCallback((initialData?: Partial<Gallery>): string => {
      const newId = `gallery_${Date.now()}`;
      const now = new Date().toISOString();
      const newGallery: Gallery = {
          id: newId,
          title: initialData?.title ? sanitizeInput(initialData.title) : 'Untitled Gallery',
          description: initialData?.description ? sanitizeInput(initialData.description) : '',
          artworks: initialData?.artworks || [],
          createdAt: now,
          updatedAt: now,
          projectId: initialData?.projectId,
      };
      newGallery.thumbnailUrl = getGalleryThumbnail(newGallery.artworks);
      
      setGalleries(prev => [...prev, newGallery]);
      return newId;
  }, []);

  const deleteGallery = useCallback((id: string) => {
      setGalleries(prev => prev.filter(g => g.id !== id));
  }, []);

  const addArtworkToGallery = useCallback((artworkToAdd: Artwork, galleryId: string): boolean => {
    let success = false;
    setGalleries(prev => {
        const galleryIndex = prev.findIndex(g => g.id === galleryId);
        if (galleryIndex === -1) {
            success = false;
            return prev;
        }

        const gallery = prev[galleryIndex];
        if (gallery.artworks.find(art => art.id === artworkToAdd.id)) {
            success = false;
            return prev;
        }
        
        success = true;
        const newArtworks = [...gallery.artworks, artworkToAdd];
        const updatedGallery = { 
            ...gallery, 
            artworks: newArtworks, 
            thumbnailUrl: getGalleryThumbnail(newArtworks),
            updatedAt: new Date().toISOString()
        };

        const newGalleries = [...prev];
        newGalleries[galleryIndex] = updatedGallery;
        return newGalleries;
    });
    return success;
  }, []);

  const removeArtworkFromActiveGallery = useCallback((artworkId: string) => {
    updateActiveGallery(g => {
      const newArtworks = g.artworks.filter(art => art.id !== artworkId)
      return { ...g, artworks: newArtworks, thumbnailUrl: getGalleryThumbnail(newArtworks) };
    });
  }, [updateActiveGallery]);

  const reorderArtworksInActiveGallery = useCallback((reorderedArtworks: Artwork[]) => {
    updateActiveGallery(g => ({ ...g, artworks: reorderedArtworks }));
  }, [updateActiveGallery]);

  const addCommentToArtwork = useCallback((artworkId: string, comment: string) => {
    const sanitizedComment = sanitizeInput(comment);
    updateActiveGallery(g => ({
        ...g,
        artworks: g.artworks.map(art => art.id === artworkId ? { ...art, comment: sanitizedComment } : art),
    }));
  }, [updateActiveGallery]);

  const clearAllGalleries = useCallback(() => {
    setGalleries([]);
  }, []);
  
  return {
    galleries,
    setGalleries,
    activeGallery,
    createNewGallery,
    deleteGallery,
    updateActiveGallery,
    addArtworkToGallery,
    removeArtworkFromActiveGallery,
    reorderArtworksInActiveGallery,
    addCommentToArtwork,
    clearAllGalleries,
  };
};