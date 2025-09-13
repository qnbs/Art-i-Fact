

import React from 'react';
import type { Gallery } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { GalleryIcon, PlusCircleIcon, TrashIcon } from './IconComponents';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';

interface GalleryManagerProps {
    galleries: Gallery[];
    onCreateNew: () => void;
    onSelectGallery: (id: string) => void;
    onDeleteGallery: (id: string, title: string) => void;
    isProjectView: boolean;
}

const GalleryCard: React.FC<{ gallery: Gallery; onSelect: () => void; onDelete: () => void; }> = ({ gallery, onSelect, onDelete }) => {
    const { t } = useTranslation();
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div 
            className="group relative bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            onClick={onSelect}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
            tabIndex={0}
        >
            <ImageWithFallback 
                src={gallery.thumbnailUrl} 
                alt={gallery.title} 
                fallbackText={gallery.title}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h3 className="font-bold text-lg truncate">{gallery.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{gallery.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('gallery.manager.artworkCount', { count: String(gallery.artworks.length) })}</p>
            </div>
            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-red-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                title={t('remove')}
            >
                <TrashIcon className="w-4 h-4"/>
            </button>
        </div>
    );
};

export const GalleryManager: React.FC<GalleryManagerProps> = ({ galleries, onCreateNew, onSelectGallery, onDeleteGallery, isProjectView }) => {
    const { t } = useTranslation();
    
    if (galleries.length === 0 && !isProjectView) {
         return (
             <EmptyState
                icon={<GalleryIcon className="w-16 h-16" />}
                title={t('gallery.manager.empty.title')}
                message={t('gallery.manager.empty.prompt')}
            >
                <Button onClick={onCreateNew}>
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {t('gallery.manager.create')}
                </Button>
            </EmptyState>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!isProjectView && (
                <button
                    onClick={onCreateNew}
                    className="flex flex-col items-center justify-center h-full p-6 bg-gray-100 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-gray-200 dark:hover:bg-gray-800/80 transition-all text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                    <PlusCircleIcon className="w-12 h-12 mb-2" />
                    <span className="font-semibold">{t('gallery.manager.create')}</span>
                </button>
            )}
            {galleries.map(gallery => (
                <GalleryCard 
                    key={gallery.id} 
                    gallery={gallery} 
                    onSelect={() => onSelectGallery(gallery.id)} 
                    onDelete={() => onDeleteGallery(gallery.id, gallery.title)}
                />
            ))}
        </div>
    );
};
