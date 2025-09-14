
import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { useAI } from '../contexts/AIStatusContext';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useToast } from '../contexts/ToastContext';
import { PaintBrushIcon, SparklesIcon, SpinnerIcon, PlusCircleIcon, GalleryIcon, MagicWandIcon, CloseIcon } from './IconComponents';
import type { Artwork } from '../types';
import { Button } from './ui/Button';
import { Skeleton } from './ui/Skeleton';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { PageHeader } from './ui/PageHeader';
import * as gemini from '../services/geminiService';

interface StudioProps {
    onInitiateAdd: (artwork: Artwork) => void;
}

const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;
type AspectRatio = typeof aspectRatios[number];

const aspectRatioClasses: Record<AspectRatio, string> = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '4:3': 'aspect-[4/3]',
    '3:4': 'aspect-[3/4]',
};


export const Studio: React.FC<StudioProps> = ({ onInitiateAdd }) => {
    const { t, language } = useTranslation();
    const { handleAiTask, activeAiTask, loadingMessage } = useAI();
    const { appSettings } = useAppSettings();
    const { showToast } = useToast();
    
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [isRemixMode, setIsRemixMode] = useState(false);
    const [originalPrompt, setOriginalPrompt] = useState('');

    const isLoading = activeAiTask === 'studioGenerate' || activeAiTask === 'remix';
    const isEnhancing = activeAiTask === 'enhance';

    const handleGenerateOrRemix = async () => {
        if (!prompt.trim()) return;
        
        const taskName = isRemixMode ? 'remix' : 'studioGenerate';
        const apiFn = isRemixMode 
            ? () => gemini.remixImage(generatedImage!, prompt)
            : () => gemini.generateImage(prompt, aspectRatio);

        const result = await handleAiTask(taskName, apiFn) as string | undefined;

        if (result) {
            setIsImageVisible(false); // Hide before setting new image to re-trigger fade-in
            setGeneratedImage(result);
            if (isRemixMode) {
                setOriginalPrompt(prev => `${prev}, remixed with: "${prompt}"`);
                setPrompt('');
            } else {
                setOriginalPrompt(prompt);
            }
        }
    };
    
    const handleEnterRemixMode = () => {
        setIsRemixMode(true);
        setPrompt('');
    };
    
    const handleExitRemixMode = () => {
        setIsRemixMode(false);
        setPrompt(originalPrompt);
    };

    const handleEnhance = async () => {
        if (!prompt.trim()) return;
        const enhancedPrompt = await handleAiTask('enhance', () => gemini.enhancePrompt(prompt, appSettings, language)) as string | undefined;

        if (enhancedPrompt) {
            setPrompt(enhancedPrompt);
            showToast(t('toast.studio.promptEnhanced'), 'success');
        }
    };

    const handleAddToGalleryClick = () => {
        if (!generatedImage) return;
        const newArtwork: Artwork = {
            id: `ai_${Date.now()}`,
            title: originalPrompt.length > 50 ? originalPrompt.substring(0, 47) + '...' : originalPrompt,
            artist: 'Art-i-Fact AI Studio',
            year: new Date().getFullYear().toString(),
            imageUrl: `data:image/jpeg;base64,${generatedImage}`,
            description: `AI-generated artwork based on the prompt: "${originalPrompt}"`,
            isGenerated: true,
        };
        onInitiateAdd(newArtwork);
        setGeneratedImage(null);
        setIsRemixMode(false);
        setPrompt('');
        setOriginalPrompt('');
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader 
                title={t('studio.title')} 
                subtitle={t('studio.subtitle')}
                icon={<PaintBrushIcon className="w-8 h-8" />}
            />

            <div className="flex-grow flex flex-col md:flex-row gap-6">
                {/* Controls */}
                <div className="md:w-1/3 flex flex-col gap-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={isRemixMode ? t('studio.remix.placeholder') : t('studio.prompt.placeholder')}
                        className="w-full flex-grow bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none min-h-[150px]"
                        disabled={isLoading || isEnhancing}
                        aria-label={t('studio.prompt.placeholder')}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('studio.aspectRatio')}</label>
                        <div className={`grid grid-cols-5 gap-2 ${isRemixMode ? 'opacity-50' : ''}`}>
                            {aspectRatios.map(ar => (
                                <button
                                    key={ar}
                                    onClick={() => setAspectRatio(ar)}
                                    className={`py-2 px-1 text-sm rounded-md transition-colors ${aspectRatio === ar ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                    disabled={isLoading || isEnhancing || isRemixMode}
                                    aria-pressed={aspectRatio === ar}
                                >
                                    {ar}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!generatedImage ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleEnhance}
                                disabled={isLoading || isEnhancing || !prompt.trim() || isRemixMode}
                                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg p-3 flex items-center justify-center font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                title={t('studio.enhancePrompt')}
                                aria-label={t('studio.enhancePrompt')}
                            >
                                {isEnhancing ? <SpinnerIcon className="w-5 h-5" /> : <MagicWandIcon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={handleGenerateOrRemix}
                                disabled={isLoading || isEnhancing || !prompt.trim()}
                                className="flex-grow bg-amber-600 text-white rounded-lg px-4 py-3 flex items-center justify-center font-semibold hover:bg-amber-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon className="w-5 h-5 mr-2" />
                                        {t('studio.generating')}
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5 mr-2" />
                                        {t('studio.generate')}
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-2">
                             {isRemixMode && (
                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" onClick={handleExitRemixMode} size="sm" className="flex-grow">
                                        <CloseIcon className="w-4 h-4 mr-2" />
                                        {t('studio.remix.exit')}
                                    </Button>
                                    <button
                                        onClick={handleGenerateOrRemix}
                                        disabled={isLoading || isEnhancing || !prompt.trim()}
                                        className="flex-grow bg-amber-600 text-white rounded-lg px-4 py-2 flex items-center justify-center font-semibold hover:bg-amber-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={isRemixMode ? () => { setGeneratedImage(null); handleExitRemixMode(); } : handleEnterRemixMode} disabled={isLoading}>
                                    <PaintBrushIcon className="w-5 h-5 mr-2" />
                                    {t('studio.remix.button')}
                                </Button>
                                <Button
                                    onClick={handleAddToGalleryClick}
                                    className="flex-grow bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                                >
                                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                                    {t('studio.addToGallery')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Display */}
                <div className="md:w-2/3 flex-grow bg-gray-100 dark:bg-gray-900/50 rounded-lg flex items-center justify-center p-4 min-h-[300px] relative" role="region" aria-live="polite" aria-label="Generated image display">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center w-full h-full text-center" role="status" aria-label={loadingMessage}>
                            <div className={`w-full max-w-md ${aspectRatioClasses[aspectRatio]}`}>
                                <Skeleton className="w-full h-full" />
                            </div>
                            <p className="mt-4 text-gray-500 dark:text-gray-400 animate-pulse">{loadingMessage}</p>
                        </div>
                    ) : generatedImage ? (
                        <ImageWithFallback 
                            src={`data:image/jpeg;base64,${generatedImage}`} 
                            alt={prompt} 
                            fallbackText={prompt}
                            onLoad={() => setIsImageVisible(true)}
                            className={`max-w-full max-h-full object-contain rounded-md shadow-lg transition-opacity duration-500 ${isImageVisible ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ) : (
                        <div className="text-center text-gray-500">
                            <GalleryIcon className="w-16 h-16 mx-auto mb-4" />
                            <p>Your generated artwork will appear here.</p>
                        </div>
                    )}
                    {isRemixMode && (
                         <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full animate-fade-in">
                            {t('studio.remix.mode')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
