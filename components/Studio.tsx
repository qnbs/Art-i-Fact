import React, { useState, useCallback } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import * as gemini from '../services/geminiService.ts';
import type { Artwork, ImageAspectRatio } from '../types.ts';
import { studioInspirationPrompts } from '../data/inspiration.ts';

import { PaintBrushIcon, SparklesIcon, MagicWandIcon, ArrowPathIcon, PlusCircleIcon, ArrowDownTrayIcon, MagnifyingGlassPlusIcon } from './IconComponents.tsx';
import { Button } from './ui/Button.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { AccordionItem } from './ui/AccordionItem.tsx';
import { useModal } from '../contexts/ModalContext.tsx';

// Sub-component for the new image detail modal
const ImageDetailModalContent: React.FC<{
    artwork: Artwork;
    onAddToGallery: () => void;
    onRemix: () => void;
    onDownload: () => void;
}> = ({ artwork, onAddToGallery, onRemix, onDownload }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col md:flex-row gap-6 max-h-[80vh]">
            <div className="md:w-2/3 flex items-center justify-center">
                <img src={artwork.imageUrl} alt={artwork.title} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
            </div>
            <div className="md:w-1/3 flex flex-col">
                <h3 className="text-lg font-bold">{artwork.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{artwork.artist}, {artwork.year}</p>
                <div className="my-2 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex-grow overflow-y-auto">
                    <h4 className="font-semibold text-sm mb-1">Prompt:</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{artwork.description?.replace('Generated with prompt: "', '').slice(0, -1)}</p>
                </div>
                <div className="space-y-2 mt-4 flex-shrink-0">
                    <Button onClick={onAddToGallery} className="w-full">
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        {t('studio.addToGallery')}
                    </Button>
                    <Button onClick={onRemix} variant="secondary" className="w-full">
                        <ArrowPathIcon className="w-5 h-5 mr-2" />
                        {t('studio.remixThis')}
                    </Button>
                     <Button onClick={onDownload} variant="secondary" className="w-full">
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        {t('studio.download')}
                    </Button>
                </div>
            </div>
        </div>
    );
};


export const Studio: React.FC = () => {
    const { t } = useTranslation();
    const { settings, language, handleInitiateAdd } = useAppContext();
    const { handleAiTask } = useAI();
    const { showModal, hideModal } = useModal();

    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(settings.studioDefaultAspectRatio);
    const [generatedImages, setGeneratedImages] = useState<Artwork[]>([]);
    const [remixSource, setRemixSource] = useState<Artwork | null>(null);

    const handleGenerate = useCallback(() => {
        if (!prompt.trim()) return;
        handleAiTask<string>('studioGenerate', () => gemini.generateImage(prompt, aspectRatio), {
            onEnd: (base64) => {
                if (base64) {
                    const newArtwork: Artwork = {
                        id: `gen_${Date.now()}`,
                        title: prompt.substring(0, 50),
                        artist: 'AI Studio',
                        year: new Date().getFullYear().toString(),
                        imageUrl: `data:image/jpeg;base64,${base64}`,
                        isGenerated: true,
                        description: `Generated with prompt: "${prompt}"`,
                    };
                    setGeneratedImages(prev => [newArtwork, ...prev]);
                    if (settings.clearPromptOnGenerate) setPrompt('');
                }
            }
        });
    }, [prompt, aspectRatio, handleAiTask, settings.clearPromptOnGenerate]);

    const handleRemix = useCallback(() => {
        if (!prompt.trim() || !remixSource) return;
        const base64Data = remixSource.imageUrl.split(',')[1];
        handleAiTask<string>('remix', () => gemini.remixImage(base64Data, prompt), {
            onEnd: (base64) => {
                if (base64) {
                    const newArtwork: Artwork = {
                        id: `remix_${Date.now()}`,
                        title: `Remix of ${remixSource.title}`,
                        artist: 'AI Studio',
                        year: new Date().getFullYear().toString(),
                        imageUrl: `data:image/jpeg;base64,${base64}`,
                        isGenerated: true,
                        description: `Remixed from "${remixSource.title}" with prompt: "${prompt}"`,
                    };
                    setGeneratedImages(prev => [newArtwork, ...prev]);
                     if (settings.clearPromptOnGenerate) setPrompt('');
                    setRemixSource(null);
                }
            }
        });
    }, [prompt, remixSource, handleAiTask, settings.clearPromptOnGenerate]);
    
    const handleEnhancePrompt = useCallback(() => {
        if (!prompt.trim()) return;
        handleAiTask<string>('enhance', () => gemini.enhancePrompt(prompt, settings, language as 'de' | 'en'), {
            onEnd: (enhancedPrompt) => enhancedPrompt && setPrompt(enhancedPrompt)
        });
    }, [prompt, handleAiTask, settings, language]);

    const handleDownload = useCallback((artwork: Artwork) => {
        const link = document.createElement('a');
        link.href = artwork.imageUrl;
        link.download = `art-i-fact-studio-${artwork.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const handleViewImageDetails = useCallback((artwork: Artwork) => {
        showModal(artwork.title, <ImageDetailModalContent 
            artwork={artwork}
            onAddToGallery={() => {
                handleInitiateAdd(artwork);
                hideModal();
            }}
            onRemix={() => {
                setRemixSource(artwork);
                setPrompt(settings.defaultRemixPrompt);
                hideModal();
            }}
            onDownload={() => handleDownload(artwork)}
        />);
    }, [showModal, hideModal, handleInitiateAdd, settings.defaultRemixPrompt, handleDownload]);

    const handleAction = remixSource ? handleRemix : handleGenerate;
    const actionText = remixSource ? t('studio.remix') : t('studio.generate');
    const placeholderText = remixSource ? t('studio.placeholder.remix', { title: remixSource.title }) : t('studio.placeholder.generate');

    return (
        <div className="flex flex-col h-full">
            <PageHeader title={t('view.studio')} icon={<PaintBrushIcon className="w-8 h-8" />} />
            
            <div className="flex-grow flex flex-col md:flex-row gap-6">
                {/* Left Panel: Controls */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    {remixSource && (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-500/50 animate-fade-in">
                            <h3 className="font-semibold text-center mb-2">{t('studio.remixing')}</h3>
                            <img src={remixSource.imageUrl} alt={remixSource.title} className="rounded-md w-full h-auto object-contain max-h-40" />
                            <Button variant="secondary" size="sm" className="w-full mt-2" onClick={() => setRemixSource(null)}>{t('studio.cancelRemix')}</Button>
                        </div>
                    )}
                    
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={placeholderText}
                        className="w-full h-32 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                    />

                    <div className="flex gap-2">
                        <Button onClick={handleEnhancePrompt} variant="secondary" className="w-full">
                            <MagicWandIcon className="w-5 h-5 mr-2" />
                            {t('studio.enhance')}
                        </Button>
                        <Button onClick={handleAction} className="w-full">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            {actionText}
                        </Button>
                    </div>

                    {!remixSource && (
                         <div className="space-y-2">
                            <label className="text-sm font-medium">{t('studio.aspectRatio')}</label>
                            <div className="grid grid-cols-5 gap-2">
                                {(['1:1', '16:9', '9:16', '4:3', '3:4'] as ImageAspectRatio[]).map(ratio => (
                                    <button 
                                        key={ratio} 
                                        onClick={() => setAspectRatio(ratio)}
                                        className={`py-2 text-sm rounded-md border-2 ${aspectRatio === ratio ? 'bg-amber-500 border-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-800 border-transparent hover:border-amber-400'}`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                     <div className="space-y-1">
                        <h3 className="text-sm font-semibold mb-2">{t('studio.inspiration')}</h3>
                        {studioInspirationPrompts.map(cat => (
                            <AccordionItem key={cat.category} title={cat.category}>
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {cat.prompts.map(p => (
                                        <button 
                                            key={p} 
                                            onClick={() => setPrompt(p)} 
                                            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/50"
                                            title={p}
                                        >
                                            {p.substring(0, 30)}{p.length > 30 ? '...' : ''}
                                        </button>
                                    ))}
                                </div>
                            </AccordionItem>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Gallery */}
                <div className="w-full md:w-2/3 bg-gray-200/50 dark:bg-black/20 p-4 rounded-lg flex-grow overflow-y-auto">
                    {generatedImages.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-center text-gray-500">
                           <p>{t('studio.empty')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {generatedImages.map(img => (
                                <div key={img.id} className="group relative cursor-pointer" onClick={() => handleViewImageDetails(img)}>
                                    <img src={img.imageUrl} alt={img.title} className="w-full h-auto object-cover rounded-lg aspect-square transition-transform group-hover:scale-105" />
                                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <MagnifyingGlassPlusIcon className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};