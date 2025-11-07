import React, { useState } from 'react';
import type { Artwork, Gallery } from '../types.ts';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { PlusCircleIcon, GalleryIcon } from './IconComponents.tsx';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';
import { GalleryCreator } from './GalleryCreator.tsx';

interface AddToGalleryModalProps {
  artwork: Artwork;
  galleries: Gallery[];
  onAddExisting: (galleryId: string) => void;
  onCreateAndAdd: (details: { title: string; description: string; }) => void;
  activeProjectId: string | null;
}

const GalleryListItem: React.FC<{gallery: Gallery, onSelect: (id: string) => void}> = ({ gallery, onSelect }) => {
    const { t } = useTranslation();
    return (
        <button
            key={gallery.id}
            onClick={() => onSelect(gallery.id)}
            className="w-full text-left p-3 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
        >
            <ImageWithFallback 
                src={gallery.thumbnailUrl} 
                alt="" 
                fallbackText={gallery.title || 'G'}
                className="w-10 h-10 rounded object-cover flex-shrink-0 bg-gray-300" 
            />
            <span className="font-semibold truncate">{gallery.title || t('gallery.new')}</span>
        </button>
    );
}

export const AddToGalleryModal: React.FC<AddToGalleryModalProps> = ({ artwork, galleries, onAddExisting, onCreateAndAdd, activeProjectId }) => {
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'create'>('list');

  const projectGalleries = activeProjectId ? galleries.filter(g => g.projectId === activeProjectId) : [];
  const otherGalleries = activeProjectId ? galleries.filter(g => g.projectId !== activeProjectId) : galleries;

  if (view === 'create') {
    return (
        <div className="animate-fade-in">
            <GalleryCreator 
                onSave={onCreateAndAdd}
                onCancel={() => setView('list')}
                isCompact
            />
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <ImageWithFallback 
                src={artwork.thumbnailUrl || artwork.imageUrl} 
                alt={artwork.title}
                fallbackText={artwork.title}
                className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-gray-300"
            />
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white truncate">{artwork.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{artwork.artist}</p>
            </div>
        </div>

        <button
            onClick={() => setView('create')}
            className="w-full flex items-center justify-center p-3 mb-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            {t('modal.addToGallery.create')}
        </button>
        
        {galleries.length > 0 ? (
            <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">{t('modal.addToGallery.select')}</p>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {projectGalleries.length > 0 && (
                        <div className="mb-2">
                            <h4 className="text-xs uppercase font-bold text-gray-500 my-2 px-1">{t('modal.addToGallery.inProject')}</h4>
                            {projectGalleries.map(gallery => <GalleryListItem key={gallery.id} gallery={gallery} onSelect={onAddExisting} />)}
                        </div>
                    )}
                    {otherGalleries.length > 0 && (
                          <div className="mb-2">
                            {projectGalleries.length > 0 && otherGalleries.length > 0 && <h4 className="text-xs uppercase font-bold text-gray-500 my-2 px-1">{t('modal.addToGallery.other')}</h4>}
                            {otherGalleries.map(gallery => <GalleryListItem key={gallery.id} gallery={gallery} onSelect={onAddExisting} />)}
                        </div>
                    )}
                </div>
            </>
        ) : (
             <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                <GalleryIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                {t('modal.addToGallery.empty')}
            </div>
        )}
    </div>
  );
};