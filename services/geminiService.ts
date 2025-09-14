import { GoogleGenAI, Type, Chat, GenerateContentResponse, Modality } from "@google/genai";
import type { Artwork, Gallery, Profile, AppSettings, DeepDive, GalleryCritique, AudioGuide } from '../types.ts';
import { prompts } from '../i18n/prompts.ts';

// FIX: Initialize the GoogleGenAI client.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

const getCreativitySettings = (creativity: AppSettings['aiCreativity']) => {
    switch (creativity) {
        case 'focused':
            return { temperature: 0.2, topP: 0.8, topK: 20 };
        case 'creative':
            return { temperature: 1.0, topP: 0.95, topK: 64 };
        case 'balanced':
        default:
            return { temperature: 0.7, topP: 0.9, topK: 40 };
    }
};

export const sanitizeInput = (str: string): string => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

// Text and JSON Generation
// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateDeepDive = async (artwork: Artwork, settings: AppSettings, language: 'de' | 'en'): Promise<DeepDive> => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompts[language].deepDive(artwork.title, artwork.artist, artwork.description || ''),
        config: {
            ...creativity,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    symbolism: { type: Type.STRING },
                    artistContext: { type: Type.STRING },
                    technique: { type: Type.STRING },
                }
            }
        }
    });

    const json = JSON.parse(response.text);
    return json as DeepDive;
};

// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateCritique = async (gallery: Gallery, settings: AppSettings, language: 'de' | 'en'): Promise<GalleryCritique> => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    const artworkList = gallery.artworks.map(a => ({ title: a.title, artist: a.artist, description: a.description })).slice(0, 10);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].critique(gallery.title, JSON.stringify(artworkList)),
        config: {
            ...creativity,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    critique: { type: Type.STRING },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            }
        }
    });

    return JSON.parse(response.text) as GalleryCritique;
};

// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateAudioGuideScript = async (gallery: Gallery, profile: Profile, settings: AppSettings, language: 'de' | 'en'): Promise<AudioGuide> => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    const artworkData = gallery.artworks.map(a => ({ id: a.id, title: a.title, artist: a.artist }));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].audioGuide(gallery.title, profile.username, JSON.stringify(artworkData)),
        config: {
            ...creativity,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    introduction: { type: Type.STRING },
                    segments: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                artworkId: { type: Type.STRING },
                                script: { type: Type.STRING },
                            }
                        }
                    }
                }
            }
        }
    });
    return JSON.parse(response.text) as AudioGuide;
};

export const generateSimilarArtSearchQuery = async (artwork: Artwork, language: 'de' | 'en'): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].similarArt(artwork),
        config: {
            temperature: 0.3,
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return response.text.trim().replace(/^"(.*)"$/, '$1'); // Remove quotes if any
};


// Journal Research with Grounding
// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateJournalInsights = (topic: string, settings: AppSettings, language: 'de' | 'en'): Promise<GenerateContentResponse> => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    return ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].journal(topic),
        config: {
            ...creativity,
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: settings.aiThinkingBudget }
        }
    });
};

// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateJournalInsightsStream = (topic: string, settings: AppSettings, language: 'de' | 'en') => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    return ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompts[language].journal(topic),
        config: {
            ...creativity,
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: settings.aiThinkingBudget }
        }
    });
};


// Chat
// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const startArtChat = (artwork: Artwork, settings: AppSettings, language: 'de' | 'en'): Chat => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: prompts[language].chatSystemInstruction(artwork.title, artwork.artist, artwork.description || ''),
            ...creativity,
            thinkingConfig: { thinkingBudget: 0 } // low latency for chat
        }
    });
};

// Image Generation & Editing
export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio as any,
        },
    });
    return response.generatedImages[0].image.imageBytes;
};

export const remixImage = async (base64ImageData: string, prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: base64ImageData, mimeType: 'image/jpeg' } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("AI did not return an image for the remix.");
};


// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const enhancePrompt = async (prompt: string, settings: AppSettings, language: 'de' | 'en'): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].enhance(prompt, settings.promptEnhancementStyle),
        config: {
            temperature: 0.5,
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return response.text.trim().replace(/^"(.*)"$/, '$1'); // Remove quotes if any
};

// Video Generation
export const generateTrailerVideo = async (gallery: Gallery): Promise<string> => {
    const prompt = `Create a short, cinematic trailer for an art gallery titled "${gallery.title}". The theme is "${gallery.description}". Show a sequence of beautiful, evocative artworks in a similar style.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: { numberOfVideos: 1 }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed to produce a download link.");
    }
    
    return downloadLink;
};