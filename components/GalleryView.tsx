
import React, { useState, useRef, DragEvent } from 'react';
import { Gallery, Artwork, Profile, AppSettings, AudioGuide, GalleryCritique } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { ArrowLeftIcon, SparklesIcon, PresentationChartBarIcon, ShareIcon, EllipsisVerticalIcon, PlusCircleIcon, TrashIcon, CheckCircleIcon, PencilIcon, SpinnerIcon } from './IconComponents';
import { Button } from './ui/Button';
import { ExhibitionMode } from './ExhibitionMode';
import { useModal } from '../contexts/ModalContext';
import { CritiqueModalContent } from './CritiqueModalContent';
import { ShareModal } from './ShareModal';
import { Tooltip } from './ui/Tooltip';
import * as gemini from '../services/geminiService';
import { ImageWithFallback } from './ui/ImageWithFallback';

interface GalleryViewProps {
    gallery: Gallery;
    profile: Profile;
    appSettings: AppSettings;
    onClose: () => void;
    onUpdate: (updater: (gallery: Gallery) => Gallery) => void;
    onRemoveArtwork: (artworkId: string) => void;
    onReorderArtworks: (reorderedArtworks: Artwork[]) => void;
    onViewDetails: (artwork: Artwork) => void;
    onInitiateAdd: (artwork: Artwork) => void;
    onFindSimilar: (artwork: Artwork) => void;
    handleAiTask: <T>(taskName: string, taskFn: () => Promise<T>, options?: { onStart?: () => void; onEnd?: (result: T | undefined) => void; }) => Promise<T | undefined>;
    showToast: (message: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
    gallery, profile, appSettings, onClose, onUpdate, onRemoveArtwork, onReorderArtworks,
    onViewDetails, onInitiateAdd, onFindSimilar, handleAiTask, showToast
}) => {
    const { t } = useTranslation();
    const { showModal, hideModal } = useModal();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(gallery.title);
    const [editedDescription, setEditedDescription] = useState(gallery.description);
    const [showExhibition, setShowExhibition] = useState(false);
    const [exhibitionAudioGuide, setExhibitionAudioGuide] = useState<AudioGuide | undefined>(undefined);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleSave = () => {
        onUpdate(g => ({ ...g, title: editedTitle, description: editedDescription }));
        setIsEditing(false);
    };

    const handleCritique = async () => {
        const result = await handleAiTask('critique', () => gemini.generateCritique(gallery)) as GalleryCritique | undefined;
        if (result) {
            showModal(t('gallery.critique.modal.critique'), <CritiqueModalContent critiqueResult={result} />);
        }
    };

    const handleAudioGuide = async () => {
        const result = await handleAiTask('audioGuide', () => gemini.generateAudioGuideScript(gallery, profile)) as AudioGuide | undefined;
        if (result) {
            setExhibitionAudioGuide(result);
            setShowExhibition(true);
        }
    };
    
    const handleTrailer = async () => {
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
            <ShareModal gallery={gallery} profile={profile} onClose={hideModal} onShowToast={showToast} />
        );
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        const draggedItem = gallery.artworks[draggedIndex];
        const newArtworks = [...gallery.artworks];
        newArtworks.splice(draggedIndex, 1);
        newArtworks.splice(dropIndex, 0, draggedItem);
        onReorderArtworks(newArtworks);
        setDraggedIndex(null);
    };

    return (
        <div className="flex flex-col h-full">
            {showExhibition && (
                <ExhibitionMode
                    artworks={gallery.artworks}
                    onClose={() => setShowExhibition(false)}
                    audioGuide={exhibitionAudioGuide}
                    settings={appSettings}
                />
            )}
            {/* Header */}
            <div className="flex-shrink-0 mb-6">
                <button onClick={onClose} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-2">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    {t('workspace.title')}
                </button>
                {isEditing ? (
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
                ) : (
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{gallery.title}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{gallery.description}</p>
                        </div>
                        <Tooltip text={t('workspace.editProject')}>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                <PencilIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    </div>
                )}
            </div>

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
                <div className="relative inline-block">
                     <Button variant="secondary" className="peer">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        AI Assistant
                    </Button>
                    <div className="absolute z-10 top-full mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 peer-focus:opacity-100 hover:opacity-100 transition-opacity focus-within:opacity-100">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            <a href="#" onClick={handleCritique} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('gallery.ai.critique')}</a>
                            <a href="#" onClick={handleAudioGuide} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('gallery.ai.audioGuide')}</a>
                            <a href="#" onClick={handleTrailer} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('gallery.ai.trailer')}</a>
                        </div>
                    </div>
                </div>
                {gallery.trailerVideoUrl && gallery.trailerVideoStatus === 'ready' && <a href={`${gallery.trailerVideoUrl}&key=${process.env.API_KEY}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600">{t('gallery.ai.trailer.ready')}</a>}
                {gallery.trailerVideoStatus === 'pending' && <p className="text-sm text-amber-600 flex items-center gap-2"><SpinnerIcon className="w-4 h-4" /> {t('gallery.ai.trailer.pending')}</p>}
                {gallery.trailerVideoStatus === 'failed' && <p className="text-sm text-red-600">{t('gallery.ai.trailer.failed')}</p>}
            </div>

            {/* Artwork Grid */}
            <div className="flex-grow overflow-y-auto">
                {gallery.artworks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <p className="mb-4">{t('gallery.empty.prompt')}</p>
                        <Button onClick={() => onInitiateAdd(gallery.artworks[0])}>
                            <PlusCircleIcon className="w-5 h-5 mr-2"/>
                            {t('gallery.empty.add')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {gallery.artworks.map((art, index) => (
                            <div
                                key={art.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`group relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-900 transition-transform duration-300 hover:scale-105 hover:shadow-amber-500/20 focus-within:ring-2 focus-within:ring-amber-400 ${draggedIndex === index ? 'opacity-50' : ''}`}
                            >
                               <ImageWithFallback src={art.imageUrl} alt={art.title} fallbackText={art.title} className="w-full h-auto object-cover aspect-[3/4] transition-opacity duration-300 group-hover:brightness-75"/>
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end">
                                   <h3 className="font-bold text-base text-white truncate">{art.title}</h3>
                                   <p className="text-sm text-gray-300 truncate">{art.artist}</p>
                               </div>
                               <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="ghost" className="bg-black/50 text-white" onClick={() => onViewDetails(art)}><PencilIcon className="w-4 h-4"/></Button>
                                    <Button size="sm" variant="danger" className="bg-red-600/80" onClick={() => onRemoveArtwork(art.id)}><TrashIcon className="w-4 h-4"/></Button>
                               </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
