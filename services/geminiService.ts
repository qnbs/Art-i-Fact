
import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import type { Artwork, DeepDive, Gallery, GalleryCritique, AudioGuide, ImageAspectRatio, AppSettings, Profile } from '../types';
import { searchWikimedia } from './wikimediaService';
import { prompts } from "../i18n/prompts";

// Initialize the Google AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Sanitizes user input to prevent XSS by escaping HTML characters.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Helper function to extract JSON from a model's text response
const extractJson = <T>(response: GenerateContentResponse, fallback: T): T => {
    try {
        const text = response.text.trim();
        // The response might be wrapped in ```json ... ```
        const jsonStr = text.startsWith('```json') ? text.substring(7, text.length - 3).trim() : text;
        return JSON.parse(jsonStr) as T;
    } catch (e) {
        console.error("Failed to parse JSON from response:", e);
        throw new Error("The AI returned an invalid JSON response.");
    }
};

const getTemperature = (creativity: AppSettings['aiCreativity']): number => {
    switch (creativity) {
        case 'focused': return 0.2;
        case 'balanced': return 0.7;
        case 'creative': return 1.0;
        default: return 0.7;
    }
};

const searchArtTool = {
    functionDeclarations: [
        {
            name: "search_artwork_on_wikimedia",
            description: "Searches for artworks on Wikimedia Commons based on a user's query. This must be used for any request to find or see art.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    query: {
                        type: Type.STRING,
                        description: "The user's search query, e.g., 'Mona Lisa' or 'Van Gogh Starry Night'."
                    }
                },
                required: ["query"]
            }
        }
    ]
};

export const findArtworks = async (query: string, count: number): Promise<Artwork[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User query: "${query}"`,
            config: {
                systemInstruction: `You are a search query router. Your ONLY job is to call the 'search_artwork_on_wikimedia' function.
- **Analyze the User Query:** Your task is to determine the most effective search term for the 'query' parameter based on the user's input.
- **Rule for Curated Themes:** If the user query is a specific art term or phrase like "Renaissance-Porträts", "Barockes Chiaroscuro", or "Impasto-Textur", you MUST use this term EXACTLY as provided for the 'query' parameter. These are expert terms, do not modify them.
- **Rule for Conversational Queries:** If the user query is a natural language question (e.g., "show me pictures of the mona lisa"), you MUST convert it into a simple, effective keyword-based search term (e.g., "Mona Lisa").
- **Strict Output:** Your ONLY output must be a function call to 'search_artwork_on_wikimedia'. You are forbidden from generating any other text or responding directly to the user.`,
                tools: [searchArtTool]
            }
        });

        const call = response.candidates?.[0]?.content?.parts?.[0]?.functionCall;

        if (call?.name === 'search_artwork_on_wikimedia' && call.args?.query) {
            const searchTerm = call.args.query as string;
            if (!searchTerm.trim()) {
                 console.warn("Gemini returned an empty search query. Falling back to original query.");
                 return await searchWikimedia(query, count);
            }
            return await searchWikimedia(searchTerm, count);
        } else {
            console.warn("Gemini did not return a function call. Performing direct search as fallback.");
            return await searchWikimedia(query, count);
        }
    } catch (error) {
        console.error("Error in findArtworks:", error);
        throw new Error("Failed to find artworks. The AI or search service may be unavailable.");
    }
};

export const analyzeImage = async (file: File): Promise<Artwork | null> => {
    try {
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });

        const identifyResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: file.type, data: base64 } },
                    { text: "Identify this artwork. What is its title and who is the artist? Just give the title and artist." }
                ]
            }
        });

        const identificationText = identifyResponse.text.trim();
        if (!identificationText) return null;

        const searchResults = await findArtworks(identificationText, 1);
        return searchResults.length > 0 ? searchResults[0] : null;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze the image.");
    }
};

/**
 * Generates a "deep dive" analysis of a single artwork.
 */
export const generateDeepDive = async (artwork: Artwork, appSettings: AppSettings, language: 'de' | 'en'): Promise<DeepDive> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].deepDive(artwork.title, artwork.artist, artwork.description || ''),
        config: {
            temperature: getTemperature(appSettings.aiCreativity),
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    symbolism: { type: Type.STRING, description: "Analyze the symbolism and iconography." },
                    artistContext: { type: Type.STRING, description: "Discuss the artwork in the context of the artist's life and other works." },
                    technique: { type: Type.STRING, description: "Describe the artistic technique and its effect." },
                }
            }
        }
    });
    return extractJson<DeepDive>(response, { symbolism: '', artistContext: '', technique: '' });
};

/**
 * Generates a critique and suggestions for a gallery.
 */
export const generateCritique = async (gallery: Gallery, appSettings: AppSettings, language: 'de' | 'en'): Promise<GalleryCritique> => {
    const artworkList = gallery.artworks.map(a => ({ title: a.title, artist: a.artist, description: a.description }));
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].critique(gallery.title, JSON.stringify(artworkList)),
        config: {
            temperature: getTemperature(appSettings.aiCreativity),
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    critique: { type: Type.STRING, description: "A brief critique of the gallery's theme and curation." },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Three concrete suggestions for improvement." }
                }
            }
        }
    });
    return extractJson<GalleryCritique>(response, { critique: '', suggestions: [] });
};

/**
 * Generates an introduction for a gallery.
 */
export const generateGalleryIntroduction = async (gallery: Gallery, appSettings: AppSettings, language: 'de' | 'en'): Promise<string> => {
    const artworkList = gallery.artworks.map(a => `${a.title} by ${a.artist}`).join(', ');
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].galleryIntroduction(gallery.title, gallery.description, artworkList),
        config: {
            temperature: getTemperature(appSettings.aiCreativity),
        }
    });
    return response.text;
};


/**
 * Generates a script for an audio guide for a gallery.
 */
export const generateAudioGuideScript = async (gallery: Gallery, profile: Profile, appSettings: AppSettings, language: 'de' | 'en'): Promise<AudioGuide> => {
    const artworkData = gallery.artworks.map(a => ({ id: a.id, title: a.title, artist: a.artist, description: a.description }));
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].audioGuide(gallery.title, profile.username, JSON.stringify(artworkData)),
        config: {
            temperature: getTemperature(appSettings.aiCreativity),
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    introduction: { type: Type.STRING, description: "A welcoming introduction for the entire gallery." },
                    segments: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                artworkId: { type: Type.STRING },
                                script: { type: Type.STRING, description: "A 1-2 paragraph script for this specific artwork." }
                            },
                            required: ["artworkId", "script"]
                        }
                    }
                },
                required: ["introduction", "segments"]
            }
        }
    });

    return extractJson<AudioGuide>(response, { introduction: '', segments: [] });
};


/**
 * Generates insights for a journal entry based on a topic in a streaming fashion.
 */
export const generateJournalInsightsStream = async (topic: string, appSettings: AppSettings, language: 'de' | 'en'): Promise<AsyncGenerator<GenerateContentResponse>> => {
    return ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompts[language].journal(topic),
        config: {
            temperature: getTemperature(appSettings.aiCreativity),
            tools: [{ googleSearch: {} }],
        },
    });
};


/**
 * Starts a new art-focused chat session.
 */
export const startArtChat = (artwork: Artwork, appSettings: AppSettings, language: 'de' | 'en'): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: prompts[language].chatSystemInstruction(artwork.title, artwork.artist, artwork.description || ''),
            temperature: getTemperature(appSettings.aiCreativity),
        }
    });
};


/**
 * Enhances a user's prompt for better image generation results.
 */
export const enhancePrompt = async (prompt: string, appSettings: AppSettings, language: 'de' | 'en'): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[language].enhance(prompt, appSettings.promptEnhancementStyle),
        config: {
            temperature: getTemperature(appSettings.aiCreativity),
        },
    });
    return response.text.replace(/["']/g, ''); // Clean up quotes from response
};

/**
 * Generates an image from a text prompt.
 */
export const generateImage = async (prompt: string, aspectRatio: ImageAspectRatio): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            aspectRatio: aspectRatio,
            outputMimeType: 'image/jpeg',
        }
    });
    return response.generatedImages[0].image.imageBytes;
};

/**
 * Edits an existing image based on a text prompt (remix).
 */
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

    const imagePart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
        return imagePart.inlineData.data;
    }
    throw new Error("Remix did not return an image.");
};

/**
 * Generates a video trailer for a gallery.
 */
export const generateTrailerVideo = async (gallery: Gallery): Promise<string | null> => {
    const artworkTitles = gallery.artworks.map(a => a.title).slice(0, 5).join(', ');
    const prompt = `Create a short, atmospheric, cinematic trailer for a virtual art exhibition titled "${gallery.title}". The exhibition features artworks like ${artworkTitles}. The mood should be contemplative and elegant. Use slow panning shots and gentle transitions. No text overlays.`;

    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: { numberOfVideos: 1 }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation finished but no download link was provided.");
        }
        return `${downloadLink}&key=${process.env.API_KEY!}`;

    } catch (error) {
        console.error("Failed to generate video trailer:", error);
        throw new Error("Failed to generate video trailer.");
    }
};
