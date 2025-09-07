import React, { useState, useRef } from 'react';
import type { Gallery, Artwork } from '../types';
import { ShareIcon, CloseIcon, GalleryIcon, MagicWandIcon, PresentationChartBarIcon, Bars3Icon, SparklesIcon, SpeakerWaveIcon, DocumentTextIcon, ArrowLeftIcon, SpinnerIcon, QuestionMarkCircleIcon, PlusCircleIcon, ArrowPathIcon, PlayIcon } from './IconComponents';
import { useTranslation } from '../contexts/TranslationContext';
import { Modal } from './Modal';
import { Button } from './ui/Button';

interface GalleryCreatorProps {
  gallery: Gallery;
  onUpdateGallery: (updater: (gallery: Gallery) => Gallery) => void;
  onRemoveArtwork: (artworkId: string) => void;
  onReorderArtworks: (reorderedArtworks: Artwork[]) => void;
  onViewArtworkDetails: (artwork: Artwork) => void;
  onGenerateSuggestions: () => void;
  suggestions: Artwork[];
  onAddSuggestion: (artwork: Artwork) => void;
  onGenerateIntro: () => void;
  onGenerateAudioGuide: () => void;
  onGenerateCritique: () => void;
  onGenerateVideo: () => void;
  onSuggestTitle: () => Promise<void>;
  onSuggestDescription: () => Promise<void>;
  onSmartReorder: () => Promise<void>;
  activeAiTask: string | null;
  isEditing: boolean;
  setActiveView: (view: 'discover') => void;
}

const SuggestionSkeletonItem: React.FC = () => (
    <div className="relative group aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
);

const AIAssistantButton: React.FC<{
    title: string;
    description: string;
    icon: React.ReactElement<{ className?: string }>;
    onClick: () => void;
    isLoading: boolean;
    isDisabled: boolean;
}> = ({ title, description, icon, onClick, isLoading, isDisabled }) => (
    <button
        onClick={onClick}
        disabled={isLoading || isDisabled}
        className="flex items-start text-left p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-800"
    >
        <div className="flex-shrink-0 mr-4 text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
            {isLoading ? <SpinnerIcon className="w-6 h-6" /> : React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
        <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    </button>
);


export const GalleryCreator: React.FC<GalleryCreatorProps> = ({ 
    gallery, onUpdateGallery, onRemoveArtwork, onReorderArtworks, onViewArtworkDetails,
    onGenerateSuggestions, suggestions, onAddSuggestion,
    onGenerateIntro,
    onGenerateAudioGuide,
    onGenerateCritique, onSmartReorder, onGenerateVideo,
    onSuggestTitle, onSuggestDescription, activeAiTask,
    isEditing,
    setActiveView
}) => {
  const { t } = useTranslation();
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const isTitleMissing = !gallery.title.trim();

  // Drag and Drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    setDraggedIndex(position);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
        const newArtworks = [...gallery.artworks];
        const draggedItemContent = newArtworks.splice(dragItem.current, 1)[0];
        newArtworks.splice(dragOverItem.current, 0, draggedItemContent);
        onReorderArtworks(newArtworks);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateGallery(g => ({ ...g, [name]: value }));
  };

  const isAnyAILoading = activeAiTask !== null;

  return (
    <div className="relative flex flex-col h-full bg-white/50 dark:bg-black/20 rounded-lg p-4 md:p-6 overflow-y-auto">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('gallery.title.label')}</label>
        <div className="relative">
            <input
              type="text" name="title" id="title" value={gallery.title} onChange={handleInputChange}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder={t('gallery.title.placeholder')}
            />
            {gallery.artworks.length > 0 && (
                <button onClick={() => onSuggestTitle()} disabled={activeAiTask === 'title' || isAnyAILoading} title={t('gallery.title.suggest')} className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 disabled:opacity-50 w-8 h-8 flex items-center justify-center">
                    {activeAiTask === 'title' ? <SpinnerIcon className="w-5 h-5"/> : <MagicWandIcon className="w-5 h-5"/>}
                </button>
            )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('gallery.description.label')}</label>
        <div className="relative">
            <textarea
              name="description" id="description" value={gallery.description} onChange={handleInputChange} rows={3}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder={t('gallery.description.placeholder')}
            />
             {gallery.artworks.length > 0 && (
                <button onClick={() => onSuggestDescription()} disabled={activeAiTask === 'description' || isAnyAILoading || isTitleMissing} title={t('gallery.description.suggest')} className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800 disabled:opacity-50 w-8 h-8 flex items-center justify-center">
                    {activeAiTask === 'description' ? <SpinnerIcon className="w-5 h-5"/> : <MagicWandIcon className="w-5 h-5"/>}
                </button>
            )}
        </div>
      </div>

      { (gallery.curatorIntro !== undefined || activeAiTask === 'intro') && (
        <div className="mb-4 animate-fade-in">
            <label htmlFor="curatorIntro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('gallery.curatorIntro.title')}</label>
            <textarea
                name="curatorIntro"
                id="curatorIntro"
                value={gallery.curatorIntro || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder={activeAiTask === 'intro' ? t('gallery.curatorIntro.generating') : ''}
                disabled={activeAiTask === 'intro'}
            />
        </div>
      )}

      {gallery.audioGuide && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/40 border-l-4 border-green-500 rounded-r-lg flex items-center gap-3 animate-fade-in">
            <SpeakerWaveIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-800 dark:text-green-200">{t('gallery.audioGuide.ready')}</p>
        </div>
      )}

      { (suggestions.length > 0 || activeAiTask === 'suggestions') && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
          <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">{t('gallery.suggestions.title')}</h3>
          {activeAiTask === 'suggestions' ? (
             <div className="grid grid-cols-3 gap-2">
                <SuggestionSkeletonItem />
                <SuggestionSkeletonItem />
                <SuggestionSkeletonItem />
             </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {suggestions.map(art => (
                <div key={art.id} className="relative group cursor-pointer" onClick={() => onAddSuggestion(art)}>
                  <img src={art.imageUrl} alt={art.title} className="w-full h-auto object-cover aspect-[3/4] rounded-md group-hover:brightness-75 transition-all" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-center p-1">{art.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {gallery.artworks.length === 0 ? (
        <div className="flex-grow flex flex-col justify-center items-center text-center text-gray-500 p-8 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
          <GalleryIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('gallery.empty.visualPrompt')}</h3>
          <p className="mb-4">{t('gallery.empty.prompt')}</p>
          <Button onClick={() => setActiveView('discover')}>
            <SparklesIcon className="w-5 h-5 mr-2" />
            {t('gallery.empty.discoverButton')}
          </Button>
        </div>
      ) : (
        <>
            {isEditing && (
                <div className="mb-3 p-2 text-center text-sm bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-md animate-fade-in">
                    {t('gallery.editingMode.banner')}
                </div>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {gallery.artworks.map((art, index) => (
                <div
                    key={art.id}
                    draggable={isEditing}
                    onDragStart={isEditing ? (e) => handleDragStart(e, index) : undefined}
                    onDragEnter={isEditing ? (e) => handleDragEnter(e, index) : undefined}
                    onDragEnd={isEditing ? handleDragEnd : undefined}
                    onDragOver={(e) => e.preventDefault()}
                    className={`relative group aspect-[3/4] transition-all duration-300 ${isEditing ? 'cursor-move' : 'cursor-pointer'} ${draggedIndex === index ? 'opacity-30 scale-95' : 'opacity-100'}`}
                >
                  {isEditing && dragOverItem.current === index && draggedIndex !== null && dragOverItem.current !== draggedIndex && (
                    <div className="absolute inset-0 border-2 border-dashed border-amber-500 bg-amber-500/10 rounded-md" />
                  )}
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-full object-cover rounded-md shadow-md" 
                    onClick={!isEditing ? () => onViewArtworkDetails(art) : undefined}
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Bars3Icon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => onRemoveArtwork(art.id)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700"
                      aria-label={`Remove ${art.title}`}
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
        </>
      )}

        <button
            onClick={() => setIsAiAssistantOpen(true)}
            disabled={isAnyAILoading && activeAiTask !== 'title' && activeAiTask !== 'description'}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-amber-600 text-white rounded-full p-4 shadow-lg hover:bg-amber-700 transition-transform hover:scale-110 z-30 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
            title={t('gallery.aiAssistant.title')}
        >
            <SparklesIcon className="w-8 h-8" />
        </button>

        <Modal
            isOpen={isAiAssistantOpen}
            onClose={() => setIsAiAssistantOpen(false)}
            title={t('gallery.aiAssistant.modal.title')}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AIAssistantButton
                    title={t('gallery.suggestions.get.more')}
                    description={t('gallery.aiAssistant.button.suggestions.desc')}
                    icon={<PlusCircleIcon />}
                    onClick={() => { onGenerateSuggestions(); setIsAiAssistantOpen(false); }}
                    isLoading={activeAiTask === 'suggestions'}
                    isDisabled={isAnyAILoading || isTitleMissing}
                />
                 <AIAssistantButton
                    title={t('gallery.aiAssistant.button.reorder.title')}
                    description={t('gallery.aiAssistant.button.reorder.desc')}
                    icon={<ArrowPathIcon />}
                    onClick={() => { onSmartReorder(); setIsAiAssistantOpen(false); }}
                    isLoading={activeAiTask === 'reorder'}
                    isDisabled={isAnyAILoading || isTitleMissing || gallery.artworks.length < 3}
                />
                <AIAssistantButton
                    title={t('gallery.curatorIntro.generate')}
                    description={t('gallery.aiAssistant.button.intro.desc')}
                    icon={<DocumentTextIcon />}
                    onClick={() => { onGenerateIntro(); setIsAiAssistantOpen(false); }}
                    isLoading={activeAiTask === 'intro'}
                    isDisabled={isAnyAILoading || isTitleMissing || gallery.artworks.length === 0}
                />
                <AIAssistantButton
                    title={t('gallery.audioGuide.generate')}
                    description={t('gallery.aiAssistant.button.audio.desc')}
                    icon={<SpeakerWaveIcon />}
                    onClick={() => { onGenerateAudioGuide(); setIsAiAssistantOpen(false); }}
                    isLoading={activeAiTask === 'audioGuide'}
                    isDisabled={isAnyAILoading || isTitleMissing || gallery.artworks.length < 3}
                />
                 <AIAssistantButton
                    title={t('gallery.video.generate')}
                    description={t('gallery.aiAssistant.button.video.desc')}
                    icon={<PlayIcon />}
                    onClick={() => { onGenerateVideo(); setIsAiAssistantOpen(false); }}
                    isLoading={activeAiTask === 'video'}
                    isDisabled={isAnyAILoading || isTitleMissing || gallery.artworks.length < 3}
                />
                <AIAssistantButton
                    title={t('gallery.critique.generate')}
                    description={t('gallery.aiAssistant.button.critique.desc')}
                    icon={<QuestionMarkCircleIcon />}
                    onClick={() => { onGenerateCritique(); setIsAiAssistantOpen(false); }}
                    isLoading={activeAiTask === 'critique'}
                    isDisabled={isAnyAILoading || isTitleMissing || gallery.artworks.length < 3}
                />
            </div>
        </Modal>

    </div>
  );
};
