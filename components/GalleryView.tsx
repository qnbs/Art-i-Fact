import React, { useState, useRef, DragEvent } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import { useModal } from '../contexts/ModalContext.tsx';
import * as gemini from '../services/geminiService.ts';
import type { Artwork, GalleryCritique, AudioGuide } from '../types.ts';

import { ArtworkItemUI } from './ui/ArtworkItemUI.tsx';
import { withDraggable } from './dnd/withDraggable.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { Button } from './ui/Button.tsx';
import { EmptyState } from './ui/EmptyState.tsx';
import { GalleryIcon, SparklesIcon, SpeakerWaveIcon, ShareIcon, PresentationChartBarIcon, TrashIcon, PencilIcon } from './IconComponents.tsx';
import { ExhibitionMode } from './ExhibitionMode.tsx';
import { CritiqueModalContent } from './CritiqueModalContent.tsx';
import { ShareModal } from './ShareModal.tsx';
import { GalleryCreator } from './GalleryCreator.tsx';

const DraggableArtworkItem = withDraggable(ArtworkItemUI);

export const GalleryView: React.FC = () => {
    const { t } = useTranslation();
    const { 
        activeGallery, 
        handleSetView, 
        handleViewArtworkDetails, 
        removeArtworkFromGallery,
        reorderArtworksInGallery,
        updateGallery,
        language,
        profile,
        settings,
    } = useAppContext();
    
    const { handleAiTask } = useAI();
    const { showModal, hideModal } = useModal();
    const [isExhibiting, setIsExhibiting] = useState(false);
    
    // DND state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const dragNode = useRef<HTMLDivElement | null>(null);

    if (!activeGallery) {
        return (
            <EmptyState
                icon={<GalleryIcon className="w-16 h-16" />}
                title="No Gallery Selected"
                message="Return to your workspace or gallery suite to select a gallery."
            />
        );
    }

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        dragNode.current = e.target as HTMLDivElement;
        e.dataTransfer.effectAllowed = 'move';
        // e.dataTransfer.setData('text/html', e.target.outerHTML); // For ghost image
    };
    
    const handleDragEnter = (e: DragEvent<HTMLDivElement>, index: number) => {
        if (dragNode.current !== e.target) {
            setDragOverIndex(index);
        }
    };

    const handleDragEnd = () => {
        if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
            const reorderedArtworks = [...activeGallery.artworks];
            const [draggedItem] = reorderedArtworks.splice(draggedIndex, 1);
            reorderedArtworks.splice(dragOverIndex, 0, draggedItem);
            reorderArtworksInGallery(activeGallery.id, reorderedArtworks);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
        dragNode.current = null;
    };
    
    const handleCritique = () => {
        handleAiTask<GalleryCritique>('critique', () => gemini.generateCritique(activeGallery, settings, language as 'de' | 'en'), {
            onEnd: (result) => result && showModal('AI Curatorial Critique', <CritiqueModalContent critiqueResult={result} />)
        });
    };

    const handleAudioGuide = () => {
        handleAiTask<AudioGuide>('audioGuide', () => gemini.generateAudioGuideScript(activeGallery, profile, settings, language as 'de' | 'en'), {
            onEnd: (result) => {
                if (result) {
                    updateGallery(activeGallery.id, g => ({...g, audioGuide: result }));
                    showModal('Audio Guide Script Generated', <div><p>The audio guide is now available in Exhibition Mode.</p><Button onClick={hideModal} className="mt-4">OK</Button></div>)
                }
            }
        });
    };

    const handleShare = () => {
        showModal(`Share "${activeGallery.title}"`, <ShareModal gallery={activeGallery} profile={profile} onClose={hideModal} />);
    };
    
    const handleEditDetails = () => {
        showModal('Edit Gallery Details', <GalleryCreator
            gallery={activeGallery}
            onSave={(details) => {
                updateGallery(activeGallery.id, g => ({...g, ...details}));
                hideModal();
            }}
            onCancel={hideModal}
        />)
    }

    const backTarget = activeGallery.projectId ? 'project' : 'gallerysuite';

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                onBack={() => handleSetView(backTarget)}
                title={activeGallery.title}
                subtitle={activeGallery.description}
                icon={<GalleryIcon className="w-8 h-8" />}
            >
                <Button variant="ghost" size="sm" onClick={handleEditDetails} aria-label="Edit Details">
                    <PencilIcon className="w-5 h-5" />
                </Button>
            </PageHeader>
            
            <div className="flex-shrink-0 flex flex-wrap gap-2 mb-4">
                <Button onClick={handleCritique} variant="secondary" size="sm">
                    <SparklesIcon className="w-4 h-4 mr-1" /> Critique
                </Button>
                <Button onClick={handleAudioGuide} variant="secondary" size="sm">
                    <SpeakerWaveIcon className="w-4 h-4 mr-1" /> Audio Guide
                </Button>
                 <Button onClick={handleShare} variant="secondary" size="sm">
                    <ShareIcon className="w-4 h-4 mr-1" /> Share
                </Button>
                <Button onClick={() => setIsExhibiting(true)} size="sm">
                    <PresentationChartBarIcon className="w-4 h-4 mr-1" /> Exhibit
                </Button>
            </div>

            <div className="flex-grow overflow-y-auto">
                {activeGallery.artworks.length === 0 ? (
                    <EmptyState
                        icon={<GalleryIcon className="w-16 h-16" />}
                        title="Gallery is Empty"
                        message="Go to Discover to find and add artworks to this gallery."
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {activeGallery.artworks.map((artwork, index) => (
                           <DraggableArtworkItem
                                key={artwork.id}
                                artwork={artwork}
                                overlayContent={
                                     <button
                                        onClick={(e) => { e.stopPropagation(); removeArtworkFromGallery(activeGallery.id, artwork.id); }}
                                        className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-red-600/70"
                                        aria-label={`Remove ${artwork.title}`}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                }
                                onClick={() => handleViewArtworkDetails(artwork)}
                                index={index}
                                isDragging={draggedIndex === index}
                                isDragOver={dragOverIndex === index}
                                onDragStart={handleDragStart}
                                onDragEnter={handleDragEnter}
                                onDragEnd={handleDragEnd}
                           />
                        ))}
                    </div>
                )}
            </div>

            {isExhibiting && (
                <ExhibitionMode
                    artworks={activeGallery.artworks}
                    onClose={() => setIsExhibiting(false)}
                    audioGuide={activeGallery.audioGuide}
                />
            )}
        </div>
    );
};
