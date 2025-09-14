
import React, { useState, DragEvent, memo } from 'react';
import type { Gallery, Artwork, AudioGuide, GalleryCritique } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { useModal } from '../contexts/ModalContext';
import { useAI } from '../contexts/AIStatusContext';
import { useProfile } from '../contexts/ProfileContext';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { SparklesIcon, PresentationChartBarIcon, ShareIcon, TrashIcon, CheckCircleIcon, PencilIcon, SpinnerIcon, InfoIcon, HomeIcon, ArrowDownIcon } from './IconComponents';
import { Button } from './ui/Button';
import { ExhibitionMode } from './ExhibitionMode';
import { CritiqueModalContent } from './CritiqueModalContent';
import { ShareModal } from './ShareModal';
import { Tooltip } from './ui/Tooltip';
import * as gemini from '../services/geminiService';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { PageHeader } from './ui/PageHeader';

interface GalleryViewProps {
    gallery: Gallery;
    language: 'de' | 'en';
    onClose: () => void;
    onUpdate: (updater: (gallery: Gallery) => Gallery) => void;
    onRemoveArtwork: (artworkId: string) => void;
    onReorderArtworks: (reorderedArtworks: Artwork[]) => void;
    onViewDetails: (artwork: Artwork) => void;
    onInitiateAdd: (artwork: Artwork) => void;
    onFindSimilar: (artwork: Artwork) => void;
}

const DraggableArtworkItem = memo<{
    art: Artwork;
    index: number;
    draggedIndex: number | null;
    dropTargetIndex: number | null;
    onDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
    onDragEnter: (e: DragEvent<HTMLDivElement>, index: number) => void;
    onDragEnd: () => void;
    onDrop: (e: DragEvent<HTMLDivElement>, dropIndex: number) => void;
    onViewDetails: (art: Artwork) => void;
    onRemoveArtwork: (id: string) => void;
}>(({ art, index, draggedIndex, dropTargetIndex, onDragStart, onDragEnter, onDragEnd, onDrop, onViewDetails, onRemoveArtwork }) => {
    const { t } = useTranslation();
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, index)}
            className={`group relative cursor-grab overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/20 focus-within:ring-2 focus-within:ring-amber-400 hover:z-20 
                ${draggedIndex === index ? 'opacity-30' : ''} 
                ${dropTargetIndex === index ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-gray-950' : ''}`}
        >
           <ImageWithFallback src={art.thumbnailUrl || art.imageUrl} alt={art.title} fallbackText={art.title} className="w-full h-auto object-cover aspect-[3/4] transition-opacity duration-300 group-hover:brightness-75"/>
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end">
               <h3 className="font-bold text-base text-white truncate">{art.title}</h3>
               <p className="text-sm text-gray-300 truncate">{art.artist}</p>
           </div>
           <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(art); }}
                className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full p-2.5 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all hover:bg-amber-600/70 focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label={t('artwork.detailsLabel', { title: art.title })}
            >
                <InfoIcon className="w-5 h-5" />
            </button>
            <Tooltip text={t('remove')}>
                <button
                    onClick={(e) => { e.stopPropagation(); onRemoveArtwork(art.id); }}
                    className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2.5 text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-all hover:bg-red-600/70 focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label={t('remove')}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </Tooltip>
        </div>
    );
});


export const GalleryView: React.FC<GalleryViewProps> = ({
    gallery, language, onClose, onUpdate, onRemoveArtwork, onReorderArtworks,
    onViewDetails, onInitiateAdd, onFindSimilar
}) => {
    const { t } = useTranslation();
    const { showModal, hideModal } = useModal();
    const { handleAiTask } = useAI();
    const { profile } = useProfile();
    const { appSettings } = useAppSettings();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(gallery.title);
    const [editedDescription, setEditedDescription] = useState(gallery.description);
    const [showExhibition, setShowExhibition] = useState(false);
    const [exhibitionAudioGuide, setExhibitionAudioGuide] = useState<AudioGuide | undefined>(undefined);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
    const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);


    const handleSave = () => {
        onUpdate(g => ({ ...g, title: editedTitle, description: editedDescription }));
        setIsEditing(false);
    };

    const handleCritique = () => {
        setIsAiMenuOpen(false);
        const result = handleAiTask('critique', () => gemini.generateCritique(gallery, appSettings, language)) as Promise<GalleryCritique | undefined>;
        result.then(critiqueResult => {
            if (critiqueResult) {
                showModal(t('gallery.critique.modal.critique'), <CritiqueModalContent critiqueResult={critiqueResult} />);
            }
        });
    };

    const handleAudioGuide = () => {
        setIsAiMenuOpen(false);
        const result = handleAiTask('audioGuide', () => gemini.generateAudioGuideScript(gallery, profile, appSettings, language)) as Promise<AudioGuide | undefined>;
        result.then(audioGuideResult => {
            if (audioGuideResult) {
                setExhibitionAudioGuide(audioGuideResult);
                setShowExhibition(true);
            }
        });
    };
    
    const handleTrailer = () => {
        setIsAiMenuOpen(false);
        if (gallery.trailerVideoStatus === 'pending') return;
        handleAiTask('trailer', () => gemini.generateTrailerVideo(gallery), {
            onStart: () => onUpdate(g => ({ ...g, trailerVideoStatus: 'pending' })),
            onEnd: (result) => {
                if (result) {
                    onUpdate(g => ({ ...g, trailerVideoStatus: 'ready', trailerVideoUrl: result as string }));
                } else {
                    onUpdate(g => ({ ...g, trailerVideoStatus: 'failed' }));
                }
            }
        });
    };

    const handleShare = () => {
        showModal(
            t('share.modal.title'), 
            <ShareModal gallery={gallery} profile={profile} onClose={hideModal} />
        );
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragEnter = (e: DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (index !== draggedIndex) {
            setDropTargetIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDropTargetIndex(null);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        
        const draggedItem = gallery.artworks[draggedIndex];
        const newArtworks = [...gallery.artworks];
        newArtworks.splice(draggedIndex, 1);
        newArtworks.splice(dropIndex, 0, draggedItem);
        
        onReorderArtworks(newArtworks);
        handleDragEnd();
    };

    return (
        <div className="flex flex-col h-full">
            {showExhibition && (
                <ExhibitionMode
                    artworks={gallery.artworks}
                    onClose={() => setShowExhibition(false)}
                    audioGuide={exhibitionAudioGuide}
                />
            )}
            {/* Header */}
            {isEditing ? (
                 <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700/50 flex-shrink-0">
                    <div className="space-y-2">
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
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave}><CheckCircleIcon className="w-4 h-4 mr-1" /> {t('save')}</Button>
                            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>{t('cancel')}</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <PageHeader 
                    title={gallery.title} 
                    subtitle={gallery.description}
                    icon={<HomeIcon className="w-8 h-8" />}
                >
                    <Tooltip text={t('workspace.editProject')}>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                            <PencilIcon className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                </PageHeader>
            )}

            {/* Actions */}
             <div className="flex-shrink-0 flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700/50">
                <Button onClick={() => setShowExhibition(true)} disabled={gallery.artworks.length === 0}>
                    <PresentationChartBarIcon className="w-5 h-5 mr-2" />
                    {t('gallery.exhibit.button')}
                </Button>
                <Button variant="secondary" onClick={handleShare}>
                    <ShareIcon className="w-5 h-5 mr-2" />
                    {t('gallery.share')}
                </Button>
                <details className="relative" onToggle={(e) => setIsAiMenuOpen(e.currentTarget.open)}>
                    <summary className="list-none">
                        <Button variant="secondary" as="div" className="flex items-center">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            AI Assistant
                            <ArrowDownIcon className="w-4 h-4 ml-2" />
                        </Button>
                    </summary>
                     {isAiMenuOpen && (
                        <div className="absolute z-10 top-full mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 animate-fade-in">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <button onClick={handleCritique} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('gallery.ai.critique')}</button>
                                <button onClick={handleAudioGuide} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('gallery.ai.audioGuide')}</button>
                                <button onClick={handleTrailer} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('gallery.ai.trailer')}</button>
                            </div>
                        </div>
                    )}
                </details>
                {gallery.trailerVideoUrl && gallery.trailerVideoStatus === 'ready' && <a href={`${gallery.trailerVideoUrl}&key=${process.env.API_KEY!}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600">{t('gallery.ai.trailer.ready')}</a>}
                {gallery.trailerVideoStatus === 'pending' && <p className="text-sm text-amber-600 flex items-center gap-2"><SpinnerIcon className="w-4 h-4" /> {t('gallery.ai.trailer.pending')}</p>}
                {gallery.trailerVideoStatus === 'failed' && <p className="text-sm text-red-600">{t('gallery.ai.trailer.failed')}</p>}
            </div>

            {/* Artwork Grid */}
            <div className="flex-grow overflow-y-auto">
                {gallery.artworks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <p className="mb-4">{t('gallery.empty.prompt')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {gallery.artworks.map((art, index) => (
                           <DraggableArtworkItem
                                key={art.id}
                                art={art}
                                index={index}
                                draggedIndex={draggedIndex}
                                dropTargetIndex={dropTargetIndex}
                                onDragStart={handleDragStart}
                                onDragEnter={handleDragEnter}
                                onDragEnd={handleDragEnd}
                                onDrop={handleDrop}
                                onViewDetails={onViewDetails}
                                onRemoveArtwork={onRemoveArtwork}
                           />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
