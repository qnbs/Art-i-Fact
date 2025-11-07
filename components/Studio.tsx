import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import * as gemini from '../services/geminiService.ts';
import { studioInspirationPrompts } from '../data/inspiration.ts';
import type { Artwork } from '../types.ts';

import { PaintBrushIcon, SparklesIcon, MagicWandIcon, ArrowPathIcon, PlusCircleIcon } from './IconComponents.tsx';
import { PageHeader } from './ui/PageHeader.tsx';
import { Button } from './ui/Button.tsx';
import { ImageWithFallback } from './ui/ImageWithFallback.tsx';
import { ArtworkItemSkeleton } from './ui/ArtworkItemSkeleton.tsx';
import { AccordionItem } from './ui/AccordionItem.tsx';

export const Studio: React.FC = () => {
    const { t, language } = useTranslation();
    const { appSettings, handleInitiateAdd } = useAppContext();
    const { handleAiTask, activeAiTask } = useAI();

    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState(appSettings.defaultNegativePrompt);
    const [aspectRatio, setAspectRatio] = useState(appSettings.studioDefaultAspectRatio);
    const [generatedImage, setGeneratedImage] = useState<{ base64: string, prompt: string } | null>(null);
    const [isRemixing, setIsRemixing] = useState(false);
    const [remixPrompt, setRemixPrompt] = useState(appSettings.defaultRemixPrompt);

    useEffect(() => {
        setNegativePrompt(appSettings.defaultNegativePrompt);
        setAspectRatio(appSettings.studioDefaultAspectRatio);
    }, [appSettings.defaultNegativePrompt, appSettings.studioDefaultAspectRatio]);

    const isGenerating = activeAiTask === 'studioGenerate' || activeAiTask === 'enhance' || activeAiTask === 'remix';

    const handleGenerate = useCallback(async () => {
        let finalPrompt = prompt;
        if (appSettings.autoEnhancePrompts) {
            const enhanced = await handleAiTask('enhance', () => gemini.enhancePrompt(prompt, appSettings, language as 'de' | 'en'));
            if (enhanced) {
                finalPrompt = enhanced;
                setPrompt(enhanced);
            } else {
                return; // Enhancement failed, stop generation.
            }
        }

        handleAiTask<string>('studioGenerate', () => gemini.generateImage(finalPrompt, aspectRatio, negativePrompt), {
            onEnd: (result) => {
                if (result) {
                    setGeneratedImage({ base64: result, prompt: finalPrompt });
                    if (appSettings.clearPromptOnGenerate) {
                        setPrompt('');
                    }
                }
            }
        });
    }, [prompt, aspectRatio, negativePrompt, appSettings, language, handleAiTask]);

    const handleEnhancePrompt = useCallback(() => {
        handleAiTask<string>('enhance', () => gemini.enhancePrompt(prompt, appSettings, language as 'de' | 'en'), {
            onEnd: (result) => result && setPrompt(result)
        });
    }, [prompt, appSettings, language, handleAiTask]);
    
    const handleRemix = useCallback(() => {
        if (!generatedImage) return;
        handleAiTask<string>('remix', () => gemini.remixImage(generatedImage.base64, remixPrompt), {
            onEnd: (result) => {
                if (result) {
                    setGeneratedImage({ base64: result, prompt: remixPrompt });
                    setIsRemixing(false);
                }
            }
        });
    }, [generatedImage, remixPrompt, handleAiTask]);

    const handleAddToGallery = () => {
        if (!generatedImage) return;
        const newArtwork: Artwork = {
            id: `ai_${Date.now()}`,
            title: generatedImage.prompt.substring(0, 50) + '...',
            artist: 'AI Studio',
            imageUrl: `data:image/jpeg;base64,${generatedImage.base64}`,
            thumbnailUrl: `data:image/jpeg;base64,${generatedImage.base64}`,
            description: `Generated via AI Studio with prompt: "${generatedImage.prompt}"`,
            isGenerated: true,
        };
        handleInitiateAdd(newArtwork);
    };

    const aspectRatioOptions = ["1:1", "3:4", "4:3", "9:16", "16:9"];

    return (
        <div className="flex flex-col h-full pb-16 md:pb-0">
            <PageHeader
                title={t('studio.title')}
                subtitle={t('studio.subtitle')}
                icon={<PaintBrushIcon className="w-8 h-8" />}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                {/* Controls Column */}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('studio.prompt.label')}</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('studio.prompt.placeholder')}
                            className="w-full h-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2"
                            disabled={isGenerating}
                        />
                        <Button onClick={handleEnhancePrompt} size="sm" variant="ghost" className="mt-2" disabled={isGenerating || !prompt}>
                            <MagicWandIcon className="w-4 h-4 mr-2" />
                            {t('studio.prompt.enhance')}
                        </Button>
                    </div>
                    
                    <div>
                        <AccordionItem title={t('studio.inspiration.title')}>
                           {studioInspirationPrompts.map(category => (
                               <div key={category.categoryKey} className="mb-3">
                                   <h4 className="font-semibold text-sm mb-2">{t(`studio.inspiration.categories.${category.categoryKey}`)}</h4>
                                   <div className="flex flex-wrap gap-1">
                                       {category.promptKeys.map(key => {
                                           const promptText = t(`studio.inspiration.prompts.${key}`);
                                           return (
                                               <button 
                                                    key={key} 
                                                    onClick={() => setPrompt(promptText)} 
                                                    className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors text-left"
                                                >
                                                   {promptText}
                                               </button>
                                           );
                                       })}
                                   </div>
                               </div>
                           ))}
                        </AccordionItem>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">{t('studio.negativePrompt.label')}</label>
                        <input
                            type="text"
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder={t('studio.negativePrompt.placeholder')}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2"
                            disabled={isGenerating}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">{t('studio.aspectRatio')}</label>
                        <div className="flex flex-wrap gap-2">
                            {aspectRatioOptions.map(ar => (
                                <Button
                                    key={ar}
                                    variant={aspectRatio === ar ? 'primary' : 'secondary'}
                                    size="sm"
                                    onClick={() => setAspectRatio(ar)}
                                    disabled={isGenerating}
                                >
                                    {ar}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleGenerate} size="lg" className="w-full" isLoading={isGenerating} disabled={!prompt}>
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {t('studio.generate')}
                    </Button>

                </div>

                {/* Image Column */}
                <div className="flex flex-col gap-4">
                    <div className="relative w-full aspect-square bg-gray-200 dark:bg-gray-900/50 rounded-lg flex items-center justify-center p-4">
                        {activeAiTask === 'studioGenerate' ? (
                            <ArtworkItemSkeleton />
                        ) : generatedImage ? (
                            <ImageWithFallback
                                src={`data:image/jpeg;base64,${generatedImage.base64}`}
                                alt={generatedImage.prompt}
                                fallbackText="Generated Image"
                                className="max-w-full max-h-full object-contain rounded-md"
                            />
                        ) : (
                            <div className="text-center text-gray-500">
                                <PaintBrushIcon className="w-12 h-12 mx-auto mb-2" />
                                <p>{t('studio.result.empty')}</p>
                            </div>
                        )}
                    </div>
                    {generatedImage && (
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleAddToGallery} variant="secondary">
                                <PlusCircleIcon className="w-5 h-5 mr-2" />
                                {t('studio.result.addToGallery')}
                            </Button>
                            <Button onClick={() => setIsRemixing(s => !s)} variant="ghost">
                                 <ArrowPathIcon className="w-5 h-5 mr-2" />
                                 {t('studio.remix.title')}
                            </Button>
                        </div>
                    )}
                    
                    {isRemixing && generatedImage && (
                        <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg space-y-2 animate-fade-in">
                             <label className="block text-sm font-medium">{t('studio.remix.prompt')}</label>
                             <textarea
                                value={remixPrompt}
                                onChange={(e) => setRemixPrompt(e.target.value)}
                                placeholder={t('studio.remix.placeholder')}
                                className="w-full h-20 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2"
                                disabled={isGenerating}
                            />
                             <Button onClick={handleRemix} className="w-full" isLoading={activeAiTask === 'remix'}>
                                {t('studio.remix.button')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};