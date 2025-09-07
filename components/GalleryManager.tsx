import React from 'react';
import type { Gallery } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { GalleryIcon, PlusCircleIcon, PencilIcon, TrashIcon } from './IconComponents';
import { Button } from './ui/Button';

interface GalleryManagerProps {
    galleries: Gallery[];
    onCreateNew: () => void;
    onSelectGallery: (id: string) => void;
    onDeleteGallery: (id: string) => void;
}

const GalleryCard: React.FC<{ gallery: Gallery, onSelect: () => void, onDelete: () => void }> = React.memo(({ gallery, onSelect, onDelete }) => {
    const { t } = useTranslation();
    
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div className="group relative bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800" onClick={onSelect}>
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-800">
                <img src={gallery.thumbnailUrl} alt={`${gallery.title} thumbnail`} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{gallery.title || t('gallery.new')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{gallery.description || '...'}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('gallery.manager.artworks', { count: String(gallery.artworks.length) })}</p>
            </div>
             <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handleDeleteClick} className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full">
                    <TrashIcon className="w-4 h-4" />
                </button>
                 <button onClick={onSelect} className="p-2 bg-amber-600/80 hover:bg-amber-600 text-white rounded-full">
                    <PencilIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
});

export const GalleryManager: React.FC<GalleryManagerProps> = ({ galleries, onCreateNew, onSelectGallery, onDeleteGallery }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-full">
            {galleries.length === 0 ? (
                <div className="flex-grow flex justify-center items-center">
                    <div className="text-center text-gray-500 max-w-md p-8 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                        <GalleryIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('gallery.manager.empty.title')}</h3>
                        <p className="mb-6">{t('gallery.manager.empty.prompt')}</p>
                        <Button onClick={onCreateNew}>
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            {t('gallery.manager.empty.button')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {galleries.map(gallery => (
                        <GalleryCard 
                            key={gallery.id} 
                            gallery={gallery} 
                            onSelect={() => onSelectGallery(gallery.id)} 
                            onDelete={() => onDeleteGallery(gallery.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};