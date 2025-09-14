


import React, { useCallback } from 'react';
// FIX: Added .tsx extension to fix module resolution error.
import type { Gallery, Project } from '../types.ts';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../contexts/TranslationContext.tsx';
// FIX: Added .tsx extension to fix module resolution error.
import { GalleryIcon, PlusCircleIcon, TrashIcon, DocumentDuplicateIcon, EllipsisVerticalIcon, HomeIcon } from './IconComponents.tsx';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';
import { EmptyState } from './ui/EmptyState.tsx';
import { Button } from './ui/Button.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { useAppSettings } from '../../contexts/AppSettingsContext.tsx';
import { useModal } from '../../contexts/ModalContext.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';

interface GalleryManagerProps {
    galleries: Gallery[];
    projects?: Project[];
    onCreateNew: () => void;
    onSelectGallery: (id: string) => void;
    onDeleteGallery: (id: string) => void;
    onDuplicateGallery?: (id: string) => void;
    hideHeader?: boolean;
    newlyCreatedId?: string | null;
}

const StatusBadge: React.FC<{status: 'draft' | 'published'}> = ({ status }) => {
    const { t } = useTranslation();
    const isDraft = status === 'draft';
    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${isDraft ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
            {isDraft ? t('gallery.status.draft') : t('gallery.status.published')}
        </span>
    );
};

const GalleryCard: React.FC<{ 
    gallery: Gallery; 
    project?: Project;
    isNew: boolean;
    onSelect: () => void; 
    onDelete: () => void;
    onDuplicate?: () => void;
}> = React.memo(({ gallery, project, isNew, onSelect, onDelete, onDuplicate }) => {
    const { t } = useTranslation();
    
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div 
            className={`group relative bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-800 flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${isNew ? 'animate-newItem' : ''}`}
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
            <div className="p-4 flex flex-col flex-grow">
                {project && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1 flex items-center gap-1">
                        <HomeIcon className="w-3 h-3" /> {project.title}
                    </div>
                )}
                <h3 className="font-bold text-lg truncate">{gallery.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-grow">{gallery.description}</p>
                
                {gallery.tags && gallery.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {gallery.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">{tag}</span>
                        ))}
                    </div>
                )}
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                    <p className="text-xs text-gray-400 dark:text-gray-500">{t('gallery.manager.artworkCount', { count: String(gallery.artworks.length) })}</p>
                    <StatusBadge status={gallery.status || 'draft'} />
                </div>
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity" onClick={stopPropagation}>
                 <details className="relative">
                    <summary className="list-none cursor-pointer p-2 bg-black/40 text-white rounded-full hover:bg-black/60">
                        <EllipsisVerticalIcon className="w-5 h-5"/>
                    </summary>
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                        {onDuplicate && (
                            <button onClick={onDuplicate} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <DocumentDuplicateIcon className="w-4 h-4" /> {t('gallery.actions.duplicate')}
                            </button>
                        )}
                        <button onClick={onDelete} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">
                            <TrashIcon className="w-4 h-4" /> {t('remove')}
                        </button>
                    </div>
                </details>
            </div>
        </div>
    );
});

export const GalleryManager: React.FC<GalleryManagerProps> = ({ galleries, projects, onCreateNew, onSelectGallery, onDeleteGallery, onDuplicateGallery, hideHeader = false, newlyCreatedId }) => {
    const { t } = useTranslation();
    const { appSettings } = useAppSettings();
    const { showModal, hideModal } = useModal();
    const { showToast } = useToast();
    
    const confirmAndDelete = useCallback((gallery: Gallery) => {
        onDeleteGallery(gallery.id);
        showToast(t('toast.gallery.deleted', { title: gallery.title }), 'success');
        hideModal();
    }, [onDeleteGallery, showToast, t, hideModal]);

    const handleDelete = useCallback((gallery: Gallery) => {
        if (appSettings.showDeletionConfirmation) {
            showModal(t('delete.gallery.title'), (
                <div>
                    <p>{t('delete.gallery.confirm', { title: gallery.title })}</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="secondary" onClick={hideModal}>{t('cancel')}</Button>
                        <Button variant="danger" onClick={() => confirmAndDelete(gallery)}>{t('remove')}</Button>
                    </div>
                </div>
            ));
        } else {
            confirmAndDelete(gallery);
        }
    }, [appSettings.showDeletionConfirmation, showModal, t, confirmAndDelete, hideModal]);
    
    if (galleries.length === 0 && !hideHeader) {
         return (
            <>
                <PageHeader title={t('gallery.suite.title')} icon={<GalleryIcon className="w-8 h-8" />} />
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
            </>
        );
    }
    
    return (
        <div className="h-full flex flex-col">
            {!hideHeader && (
                <PageHeader title={t('gallery.suite.title')} icon={<GalleryIcon className="w-8 h-8" />}>
                     <Button onClick={onCreateNew}>
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        {t('gallery.manager.create')}
                    </Button>
                </PageHeader>
            )}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...galleries].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(gallery => (
                    <GalleryCard 
                        key={gallery.id} 
                        gallery={gallery} 
                        project={projects?.find(p => p.id === gallery.projectId)}
                        isNew={gallery.id === newlyCreatedId}
                        onSelect={() => onSelectGallery(gallery.id)} 
                        onDelete={() => handleDelete(gallery)}
                        onDuplicate={onDuplicateGallery ? () => onDuplicateGallery(gallery.id) : undefined}
                    />
                ))}
            </div>
        </div>
    );
};