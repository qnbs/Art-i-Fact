import { GoogleGenAI, Type, Chat, GenerateContentResponse, Modality } from "@google/genai";
import type { Artwork, Gallery, Profile, AppSettings, DeepDive, GalleryCritique, AudioGuide } from '../types.ts';
import { prompts } from '../i18n/prompts.ts';

// Custom error for better handling upstream
class GeminiError extends Error {
    constructor(message: string, public reason?: string) {
        super(message);
        this.name = 'GeminiError';
    }
}

// FIX: Initialize the GoogleGenAI client.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

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

const handleApiCall = async <T>(apiFn: () => Promise<GenerateContentResponse>): Promise<T> => {
    try {
        const response = await apiFn();
        
        // FIX: Corrected safety check to use `response.promptFeedback` as `promptFeedback` is not on the candidate.
        // Check for safety blocks in text/json generation
        if (response.promptFeedback?.blockReason) {
            throw new GeminiError(`Request was blocked due to ${response.promptFeedback.blockReason}.`, response.promptFeedback.blockReason);
        }

        return JSON.parse(response.text) as T;

    } catch (error) {
        if (error instanceof GeminiError) {
            throw error; // Re-throw custom errors
        }
        console.error("Gemini API Error:", error);
        throw new Error("Failed to communicate with the AI assistant. Please check your connection and try again.");
    }
}


// Text and JSON Generation
// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateDeepDive = (artwork: Artwork, settings: AppSettings, language: 'de' | 'en'): Promise<DeepDive> => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    return handleApiCall<DeepDive>(() => ai.models.generateContent({
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
    }));
};

// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateCritique = (gallery: Gallery, settings: AppSettings, language: 'de' | 'en'): Promise<GalleryCritique> => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    const artworkList = gallery.artworks.map(a => ({ title: a.title, artist: a.artist, description: a.description })).slice(0, 10);
    return handleApiCall<GalleryCritique>(() => ai.models.generateContent({
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
    }));
};

// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateAudioGuideScript = (gallery: Gallery, profile: Profile, settings: AppSettings, language: 'de' | 'en'): Promise<AudioGuide> => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    const artworkData = gallery.artworks.map(a => ({ id: a.id, title: a.title, artist: a.artist }));
    return handleApiCall<AudioGuide>(() => ai.models.generateContent({
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
    }));
};

export const generateSimilarArtSearchQuery = async (artwork: Artwork, language: 'de' | 'en'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts[language].similarArt(artwork),
            config: {
                temperature: 0.3,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text.trim().replace(/^"(.*)"$/, '$1'); // Remove quotes if any
    } catch(error) {
         console.error("Gemini API Error:", error);
        throw new Error("Failed to generate search query. Please try again.");
    }
};


// Journal Research with Grounding
// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const generateJournalInsights = async (topic: string, settings: AppSettings, language: 'de' | 'en'): Promise<GenerateContentResponse> => {
    const creativity = getCreativitySettings(settings.aiCreativity);
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts[language].journal(topic),
            config: {
                ...creativity,
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: settings.aiThinkingBudget }
            }
        });
    } catch (error) {
         console.error("Gemini API Error:", error);
         throw new Error("Failed to get journal insights. Please try again.");
    }
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
// FIX: Rewrote `generateImage` to not use `handleApiCall` due to type incompatibilities with `generateImages` response.
// The new implementation has its own error handling, similar to `remixImage`.
export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio as any,
            },
        });

        if (response.generatedImages.length === 0) {
             throw new GeminiError("Image generation was blocked, likely due to the safety policy. Please adjust your prompt.", "SAFETY");
        }

        const imageBytes = response.generatedImages[0].image.imageBytes;
        if (!imageBytes) {
            throw new GeminiError("AI did not return an image for generation.", "NO_CONTENT");
        }

        return imageBytes;
    } catch (error) {
         if (error instanceof GeminiError) throw error;
         console.error("Gemini API Error:", error);
         throw new Error("Failed to generate the image. Please try again.");
    }
};

export const remixImage = async (base64ImageData: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: 'image/jpeg' } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new GeminiError("AI did not return an image for the remix, possibly due to a safety policy.", "SAFETY");
    } catch (error) {
         if (error instanceof GeminiError) throw error;
         console.error("Gemini API Error:", error);
         throw new Error("Failed to remix the image. Please try again.");
    }
};


// FIX: Corrected the type of the `language` parameter to only allow 'de' or 'en'.
export const enhancePrompt = async (prompt: string, settings: AppSettings, language: 'de' | 'en'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompts[language].enhance(prompt, settings.promptEnhancementStyle),
            config: {
                temperature: 0.5,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text.trim().replace(/^"(.*)"$/, '$1'); // Remove quotes if any
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to enhance prompt. Please try again.");
    }
};

// Video Generation
export const generateTrailerVideo = async (gallery: Gallery): Promise<string> => {
    const prompt = `Create a short, cinematic trailer for an art gallery titled "${gallery.title}". The theme is "${gallery.description}". Show a sequence of beautiful, evocative artworks in a similar style.`;
    
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: { 
                numberOfVideos: 1,
                resolution: '1080p',
                aspectRatio: '16:9'
            }
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
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate video. Please try again later.");
    }
};