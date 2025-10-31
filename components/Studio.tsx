import React, { useState, useCallback } from 'react';
import { useTranslation } from '../contexts/TranslationContext.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useAI } from '../contexts/AIStatusContext.tsx';
import * as gemini from '../services/geminiService.ts';
import type { Artwork, ImageAspectRatio } from '../types.ts';
import { studioInspirationPrompts } from '../data/inspiration.ts';

import { PaintBrushIcon, SparklesIcon, MagicWandIcon, ArrowPathIcon } from './IconComponents.tsx';
import { Button } from './ui/Button.tsx';
import { PageHeader } from './ui/PageHeader.tsx';

export const Studio: React.FC = () => {
    const { t } = useTranslation();
    const { settings, language, handleInitiateAdd } = useAppContext();
    const { handleAiTask } = useAI();

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

    const handleAction = remixSource ? handleRemix : handleGenerate;
    const actionText = remixSource ? 'Remix Image' : 'Generate Image';
    const placeholderText = remixSource ? `Describe your edits for "${remixSource.title}"...` : 'A futuristic cityscape in the style of Van Gogh...';

    return (
        <div className="flex flex-col h-full">
            <PageHeader title={t('view.studio')} icon={<PaintBrushIcon className="w-8 h-8" />} />
            
            <div className="flex-grow flex flex-col md:flex-row gap-6">
                {/* Left Panel: Controls */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    {remixSource && (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-500/50 animate-fade-in">
                            <h3 className="font-semibold text-center mb-2">Remixing Artwork</h3>
                            <img src={remixSource.imageUrl} alt={remixSource.title} className="rounded-md w-full h-auto object-contain max-h-40" />
                            <Button variant="secondary" size="sm" className="w-full mt-2" onClick={() => setRemixSource(null)}>Cancel Remix</Button>
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
                            Enhance
                        </Button>
                        <Button onClick={handleAction} className="w-full">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            {actionText}
                        </Button>
                    </div>

                    {!remixSource && (
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Aspect Ratio</label>
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
                    
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Inspiration</h3>
                        {studioInspirationPrompts.map(cat => (
                            <div key={cat.category}>
                                <h4 className="text-xs text-gray-500 uppercase font-bold mb-1">{cat.category}</h4>
                                <div className="flex flex-wrap gap-1">
                                    {cat.prompts.map(p => (
                                        <button key={p} onClick={() => setPrompt(p)} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/50">
                                            {p.substring(0, 30)}...
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Gallery */}
                <div className="w-full md:w-2/3 bg-gray-200/50 dark:bg-black/20 p-4 rounded-lg flex-grow overflow-y-auto">
                    {generatedImages.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-center text-gray-500">
                           <p>Your generated images will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {generatedImages.map(img => (
                                <div key={img.id} className="group relative">
                                    <img src={img.imageUrl} alt={img.title} className="w-full h-auto object-cover rounded-lg aspect-square" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                        <Button size="sm" onClick={() => handleInitiateAdd(img)}>Add to Gallery</Button>
                                        <Button size="sm" variant="secondary" onClick={() => { setRemixSource(img); setPrompt(settings.defaultRemixPrompt); }}>
                                            <ArrowPathIcon className="w-4 h-4 mr-1"/> Remix
                                        </Button>
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
