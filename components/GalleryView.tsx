import React, { useState, DragEvent, memo, useRef, useCallback } from 'react';
import type { Gallery, Artwork, AudioGuide, GalleryCritique } from '../types.ts';
// FIX: Added .tsx extension to fix module resolution error.
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useModal } from '../contexts/ModalContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import { useProfile } from '../contexts/ProfileContext.tsx';
import { useAppSettings } from '../contexts/AppSettingsContext.tsx';
import { SparklesIcon, PresentationChartBarIcon, ShareIcon, TrashIcon, CheckCircleIcon, PencilIcon, SpinnerIcon, InfoIcon, HomeIcon, ArrowDownIcon, GalleryIcon, ArrowUpIcon, VideoCameraIcon } from './IconComponents.tsx';
import { Button } from './ui/Button.tsx';
import { ExhibitionMode } from './ExhibitionMode.tsx';
import { CritiqueModalContent } from './CritiqueModalContent.tsx';
import { ShareModal } from './ShareModal.tsx';
import * as gemini from '../services/geminiService.ts';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { EmptyState } from './ui/EmptyState.tsx';

interface GalleryViewProps {
    gallery: Gallery;
    language: 'de' | 'en';
    onClose: () => void;
    onUpdate: (updater: (gallery: Gallery) => Gallery) => void;
    onRemoveArtwork: (artworkId: string) => void;
    onReorderArtworks: (reorderedArtworks: Artwork[]) => void;
    onViewDetails: (artwork: Artwork) => void;
    onInitiateAdd: (artwork: Artwork) => void;
}

const DraggableArtworkItem: React.FC<{
    artwork: Artwork;
    index: number;
    artworkCount: number;
    onDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
    onDragEnter: (e: DragEvent<HTMLDivElement>, index: number) => void;
    onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
    onViewDetails: (artwork: Artwork) => void;
    onRemove: (artworkId: string) => void;
    onMove: (index: number, direction: 'up' | 'down') => void;
}> = memo(({ artwork, index, artworkCount, onDragStart, onDragEnter, onDragEnd, onViewDetails, onRemove, onMove }) => {
    const { t } = useTranslation();
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            tabIndex={0}
            className="group relative cursor-grab overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label={`${artwork.title} by ${artwork.artist}`}
            aria-roledescription="Reorderable artwork"
        >
            <ImageWithFallback 
                src={artwork.thumbnailUrl || artwork.imageUrl} 
                alt={artwork.title} 
                fallbackText={artwork.title}
                className="w-full h-auto object-cover aspect-[3/4] transition-opacity duration-300 group-hover:brightness-50 group-focus-within:brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end">
                <h3 className="font-bold text-base text-white truncate">{artwork.title}</h3>
                <p className="text-sm text-gray-300 truncate">{artwork.artist}</p>
            </div>
             {/* Accessible Controls Overlay */}
            <div className="absolute inset-0 bg-black/75 flex-col items-center justify-center gap-2 p-2 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex">
                <Button variant="secondary" size="sm" className="w-full" disabled={index === 0} onClick={() => onMove(index, 'up')} aria-label={t('artwork.moveUp', { title: artwork.title })}>
                    <ArrowUpIcon className="w-5 h-5 mr-2" /> Move Up
                </Button>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => onViewDetails(artwork)}>
                    <InfoIcon className="w-5 h-5 mr-2" /> Details
                </Button>
                <Button variant="secondary" size="sm" className="w-full" disabled={index === artworkCount - 1} onClick={() => onMove(index, 'down')} aria-label={t('artwork.moveDown', { title: artwork.title })}>
                    <ArrowDownIcon className="w-5 h-5 mr-2" /> Move Down
                </Button>
                <Button variant="danger" size="sm" className="w-full mt-2" onClick={() => onRemove(artwork.id)}>
                    <TrashIcon className="w-5 h-5 mr-2" /> Remove
                </Button>
            </div>
        </div>
    );
});
DraggableArtworkItem.displayName = 'DraggableArtworkItem';

export const GalleryView: React.FC<GalleryViewProps> = (props) => {
    const { gallery, language, onClose, onUpdate, onRemoveArtwork, onReorderArtworks, onViewDetails } = props;
    const { t } = useTranslation();
    const { showModal, hideModal } = useModal();
    const { handleAiTask, activeAiTask } = useAI();
    const { profile } = useProfile();
    const { appSettings } = useAppSettings();
    const aiAssistantMenuRef = useRef<HTMLDetailsElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(gallery.title);
    const [editedDescription, setEditedDescription] = useState(gallery.description);
    const [showExhibition, setShowExhibition] = useState(false);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleSave = useCallback(() => {
        onUpdate(g => ({ ...g, title: editedTitle, description: editedDescription }));
        setIsEditing(false);
    }, [onUpdate, editedTitle, editedDescription]);
    
    // AI handlers
    const handleCritique = useCallback(async () => {
        aiAssistantMenuRef.current?.removeAttribute('open');
        const result = await handleAiTask('critique', () => gemini.generateCritique(gallery, appSettings, language)) as GalleryCritique | undefined;
        if (result) {
            showModal(t('gallery.critique.modal.critique'), <CritiqueModalContent critiqueResult={result} />);
        }
    }, [handleAiTask, gallery, appSettings, language, showModal, t]);
    
    const handleAudioGuide = useCallback(async () => {
        aiAssistantMenuRef.current?.removeAttribute('open');
        const script = await handleAiTask('audioGuide', () => gemini.generateAudioGuideScript(gallery, profile, appSettings, language)) as AudioGuide | undefined;
        if (script) {
            onUpdate(g => ({ ...g, audioGuide: script }));
            showModal("Audio Guide Ready", <div>The audio guide script has been generated and saved with this gallery. You can access it in Exhibition Mode.</div>);
        }
    }, [handleAiTask, gallery, profile, appSettings, language, onUpdate, showModal]);

    const handleTrailer = useCallback(async () => {
        aiAssistantMenuRef.current?.removeAttribute('open');
        onUpdate(g => ({ ...g, trailerVideoStatus: 'pending' }));
        const downloadLink = await handleAiTask('video', () => gemini.generateTrailerVideo(gallery)) as string | undefined;
        if (downloadLink) {
            onUpdate(g => ({ ...g, trailerVideoUrl: downloadLink, trailerVideoStatus: 'ready' }));
        } else {
            onUpdate(g => ({ ...g, trailerVideoStatus: 'failed' }));
        }
    }, [handleAiTask, onUpdate, gallery]);
    
    const handleShare = useCallback(() => {
        showModal(t('share.modal.title'), <ShareModal gallery={gallery} profile={profile} onClose={hideModal} />);
    }, [showModal, t, gallery, profile, hideModal]);

    // Drag and drop handlers
    const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, position: number) => {
        dragItem.current = position;
    }, []);
    
    const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>, position: number) => {
        dragOverItem.current = position;
    }, []);

    const handleDragEnd = useCallback(() => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            return;
        }
        const newArtworkList = [...gallery.artworks];
        const dragItemContent = newArtworkList.splice(dragItem.current, 1)[0];
        newArtworkList.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        onReorderArtworks(newArtworkList);
    }, [gallery.artworks, onReorderArtworks]);

    const handleMoveArtwork = useCallback((index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === gallery.artworks.length - 1)) {
            return;
        }
        const newArtworks = [...gallery.artworks];
        const item = newArtworks.splice(index, 1)[0];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        newArtworks.splice(newIndex, 0, item);
        onReorderArtworks(newArtworks);
    }, [gallery.artworks, onReorderArtworks]);

    return (
        <div className="flex flex-col h-full">
            {showExhibition && <ExhibitionMode artworks={gallery.artworks} onClose={() => setShowExhibition(false)} audioGuide={gallery.audioGuide} galleryTitle={gallery.title} curatorProfile={profile} />}
            
            {isEditing ? (
                 <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700/50 flex-shrink-0">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-3xl font-bold bg-gray-100 dark:bg-gray-800 focus:outline-none w-full p-1 rounded"
                    />
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="text-gray-600 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-gray-800 focus:outline-none w-full p-1 rounded resize-none"
                        rows={2}
                    />
                    <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleSave}><CheckCircleIcon className="w-4 h-4 mr-1" /> {t('save')}</Button>
                        <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>{t('cancel')}</Button>
                    </div>
                </div>
            ) : (
                <PageHeader 
                    onBack={onClose}
                    title={gallery.title} 
                    subtitle={gallery.description}
                    icon={<GalleryIcon className="w-8 h-8" />}
                >
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} aria-label={t('workspace.editProject')}>
                        <PencilIcon className="w-5 h-5" />
                    </Button>
                </PageHeader>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4 flex-shrink-0">
                <Button onClick={() => setShowExhibition(true)} disabled={gallery.artworks.length === 0}>
                    <PresentationChartBarIcon className="w-5 h-5 mr-2"/>
                    {t('gallery.exhibit.button')}
                </Button>
                <Button variant="secondary" onClick={handleShare}>
                    <ShareIcon className="w-5 h-5 mr-2"/>
                    {t('share')}
                </Button>
                 {gallery.trailerVideoStatus === 'ready' && gallery.trailerVideoUrl && (
                    <Button variant="secondary" onClick={() => window.open(`${gallery.trailerVideoUrl}&key=${process.env.API_KEY}`, '_blank')}>
                        <VideoCameraIcon className="w-5 h-5 mr-2" />
                        {t('gallery.ai.viewTrailer')}
                    </Button>
                )}
                {gallery.trailerVideoStatus === 'pending' && (
                    <Button variant="secondary" disabled>
                        <SpinnerIcon className="w-5 h-5 mr-2" />
                        {t('gallery.ai.trailerPending')}
                    </Button>
                )}
                <details ref={aiAssistantMenuRef} className="relative">
                    <summary className="list-none">
                        <Button variant="secondary" as="div">
                             <SparklesIcon className="w-5 h-5 mr-2"/>
                             AI Assistant
                             <ArrowDownIcon className="w-4 h-4 ml-2"/>
                        </Button>
                    </summary>
                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                        <button onClick={handleCritique} disabled={activeAiTask === 'critique'} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                            {activeAiTask === 'critique' ? <SpinnerIcon className="w-4 h-4 mr-2"/> : <SparklesIcon className="w-4 h-4 mr-2"/>}
                            {t('gallery.ai.critique')}
                        </button>
                        <button onClick={handleAudioGuide} disabled={activeAiTask === 'audioGuide'} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                           {activeAiTask === 'audioGuide' ? <SpinnerIcon className="w-4 h-4 mr-2"/> : <SparklesIcon className="w-4 h-4 mr-2"/>}
                           {t('gallery.ai.audioGuide')}
                        </button>
                         {gallery.trailerVideoStatus !== 'ready' && (
                            <button onClick={handleTrailer} disabled={activeAiTask === 'video' || gallery.trailerVideoStatus === 'pending'} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                               {activeAiTask === 'video' || gallery.trailerVideoStatus === 'pending' ? <SpinnerIcon className="w-4 h-4 mr-2"/> : <SparklesIcon className="w-4 h-4 mr-2"/>}
                               {gallery.trailerVideoStatus === 'failed' ? t('gallery.ai.trailerFailed') : t('gallery.ai.trailer')}
                            </button>
                        )}
                    </div>
                </details>
            </div>
            
            <div className="flex-grow overflow-y-auto">
                {gallery.artworks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {gallery.artworks.map((art, index) => (
                            <DraggableArtworkItem 
                                key={art.id}
                                artwork={art} 
                                index={index}
                                artworkCount={gallery.artworks.length}
                                onDragStart={handleDragStart}
                                onDragEnter={handleDragEnter}
                                onDragEnd={handleDragEnd}
                                onViewDetails={onViewDetails}
                                onRemove={onRemoveArtwork}
                                onMove={handleMoveArtwork}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<GalleryIcon className="w-16 h-16" />}
                        title={t('gallery.empty.title')}
                        message={t('gallery.empty.prompt')}
                    />
                )}
            </div>
        </div>
    );
};