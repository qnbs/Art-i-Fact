

import { useState, useEffect, useCallback } from 'react';
import type { Gallery, Artwork } from '../types';
import { GALLERY_LOCAL_STORAGE_KEY } from '../constants';

const generateGalleryThumbnail = (artworks: Artwork[]): string => {
    if (artworks.length === 0) {
        // Return a default placeholder SVG for an empty gallery
        const svg = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#e5e7eb"/><text x="50" y="55" font-family="sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">Empty</text></svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    const collageArtworks = artworks.slice(0, 4);
    const images = collageArtworks.map((art, index) => {
        const x = (index % 2) * 50;
        const y = Math.floor(index / 2) * 50;
        // The artwork imageUrl is a base64 encoded SVG, so we need to decode it to embed it.
        const base64Svg = art.imageUrl.split(',')[1];
        const decodedSvg = atob(base64Svg);
        // We need to remove width/height attributes to let the <image> tag control the size.
        const cleanedSvg = decodedSvg.replace(/width=".*?"/g, '').replace(/height=".*?"/g, '');
        const reEncodedSvg = btoa(cleanedSvg);
        return `<image href="data:image/svg+xml;base64,${reEncodedSvg}" x="${x}" y="${y}" width="50" height="50" />`;
    });

    const svg = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${images.join('')}</svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};


export const useGallery = () => {
  const [galleries, setGalleries] = useState<Gallery[]>(() => {
    try {
      const savedGalleries = localStorage.getItem(GALLERY_LOCAL_STORAGE_KEY);
      return savedGalleries ? JSON.parse(savedGalleries) : [];
    } catch (error) {
      console.error("Could not parse saved galleries:", error);
      return [];
    }
  });

  const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(GALLERY_LOCAL_STORAGE_KEY, JSON.stringify(galleries));
    } catch (error) {
        console.warn("Could not save galleries to local storage:", error);
    }
  }, [galleries]);

  const activeGallery = galleries.find(g => g.id === activeGalleryId) || null;

  const updateGallery = useCallback((id: string, updater: (gallery: Gallery) => Gallery) => {
      setGalleries(prev => prev.map(g => g.id === id ? {...updater(g), updatedAt: new Date().toISOString() } : g));
  }, []);
  
  const updateActiveGallery = useCallback((updater: (gallery: Gallery) => Gallery) => {
      if(!activeGalleryId) return;
      updateGallery(activeGalleryId, updater);
  }, [activeGalleryId, updateGallery]);


  const createNewGallery = useCallback((initialData?: Partial<Gallery>, projectId?: string): string => {
      const newId = `gallery_${Date.now()}`;
      const now = new Date().toISOString();
      const newGallery: Gallery = {
          id: newId,
          title: '',
          description: '',
          artworks: [],
          createdAt: now,
          updatedAt: now,
          projectId: projectId,
          ...initialData,
      };
      if (newGallery.artworks.length > 0 && !newGallery.thumbnailUrl) {
          newGallery.thumbnailUrl = generateGalleryThumbnail(newGallery.artworks);
      }
      setGalleries(prev => [...prev, newGallery]);
      return newId;
  }, []);

  const deleteGallery = useCallback((id: string) => {
      setGalleries(prev => prev.filter(g => g.id !== id));
      if (activeGalleryId === id) {
          setActiveGalleryId(null);
      }
  }, [activeGalleryId]);

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
            thumbnailUrl: generateGalleryThumbnail(newArtworks),
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
      return { ...g, artworks: newArtworks, thumbnailUrl: generateGalleryThumbnail(newArtworks) };
    });
  }, [updateActiveGallery]);

  const reorderArtworksInActiveGallery = useCallback((reorderedArtworks: Artwork[]) => {
    updateActiveGallery(g => ({ ...g, artworks: reorderedArtworks }));
  }, [updateActiveGallery]);

  const addCommentToArtwork = useCallback((artworkId: string, comment: string) => {
    updateActiveGallery(g => ({
        ...g,
        artworks: g.artworks.map(art => art.id === artworkId ? { ...art, comment } : art),
    }));
  }, [updateActiveGallery]);

  const clearAllGalleries = useCallback(() => {
    setGalleries([]);
    setActiveGalleryId(null);
  }, []);

  const importGalleries = useCallback((importedGalleries: Gallery[], mode: 'merge' | 'replace') => {
      if(mode === 'replace') {
          setGalleries(importedGalleries);
      } else {
          setGalleries(prev => {
              const galleryMap = new Map(prev.map(g => [g.id, g]));
              importedGalleries.forEach(g => galleryMap.set(g.id, g));
              return Array.from(galleryMap.values());
          });
      }
  }, []);

  return {
    galleries,
    activeGallery,
    setActiveGalleryId,
    createNewGallery,
    deleteGallery,
    updateActiveGallery,
    addArtworkToGallery,
    removeArtworkFromActiveGallery,
    reorderArtworksInActiveGallery,
    addCommentToArtwork,
    clearAllGalleries,
    importGalleries,
  };
};