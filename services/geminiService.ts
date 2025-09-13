

import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import { Artwork, DeepDive, Gallery, GalleryCritique, AudioGuide } from '../types';
import { findArtwork, realArtworks } from '../data/realArtworks';

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

/**
 * Generates a resized image URL from Google Cloud Storage.
 */
export const getResizedImageUrl = (url: string | undefined, width: number): string => {
  if (!url) return '';
  // Basic check for Google Storage URLs
  if (url.startsWith('https://storage.googleapis.com/')) {
    return `${url}?=w${width}`;
  }
  return url;
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
        return fallback;
    }
};

/**
 * Searches for artworks based on a text query.
 */
export const findArtworks = async (query: string, count: number): Promise<Artwork[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find ${count} famous artworks related to "${query}".`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        artist: { type: Type.STRING },
                    }
                }
            }
        }
    });

    const results = extractJson<{ title: string, artist: string }[]>(response, []);
    return results.map(art => findArtwork(art.title, art.artist)).filter(Boolean) as Artwork[];
};

/**
 * Analyzes an image file to identify the artwork.
 */
export const analyzeImage = async (file: File): Promise<Artwork | null> => {
    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: file.type, data: base64 } },
                { text: "Identify this artwork. What is its title and who is the artist?" }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    artist: { type: Type.STRING },
                }
            }
        }
    });

    const result = extractJson<{ title: string, artist: string }>(response, { title: '', artist: '' });
    return findArtwork(result.title, result.artist);
};

/**
 * Generates a "deep dive" analysis of a single artwork.
 */
export const generateDeepDive = async (artwork: Artwork): Promise<DeepDive> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide a "deep dive" analysis of the artwork "${artwork.title}" by ${artwork.artist}.`,
        config: {
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
export const generateCritique = async (gallery: Gallery): Promise<GalleryCritique> => {
    const artworkList = gallery.artworks.map(a => `"${a.title}" by ${a.artist}`).join(', ');
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Critique the thematic coherence of a virtual art gallery titled "${gallery.title}" which contains the following artworks: ${artworkList}.`,
        config: {
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
 * Generates a script for an audio guide for a gallery.
 */
export const generateAudioGuideScript = async (gallery: Gallery, profile: { username: string }): Promise<AudioGuide> => {
    const artworkData = gallery.artworks.map(a => ({ id: a.id, title: a.title, artist: a.artist }));
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [{ text: `Generate a script for an audio guide for a gallery titled "${gallery.title}", curated by ${profile.username}. The gallery contains these artworks: ${JSON.stringify(artworkData)}` }]
        },
        config: {
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
                            }
                        }
                    }
                }
            }
        }
    });

    return extractJson<AudioGuide>(response, { introduction: '', segments: [] });
};

/**
 * Generates insights for a journal entry based on a topic.
 */
export const generateJournalInsights = async (topic: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide some thoughtful insights and reflection points about the following topic in art: "${topic}". Write it as a single block of text.`,
    });
    return response.text;
};

/**
 * Starts a new art-focused chat session.
 */
export const startArtChat = (artwork: Artwork): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are an engaging and knowledgeable art historian. You are discussing the artwork "${artwork.title}" by ${artwork.artist}. Be conversational and provide interesting facts and interpretations. The artwork's description is: "${artwork.description}".`,
        }
    });
};


/**
 * Enhances a user's prompt for better image generation results.
 */
export const enhancePrompt = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Enhance this user prompt for an AI image generator to be more descriptive and evocative: "${prompt}"`,
    });
    return response.text.replace(/["']/g, ''); // Clean up quotes from response
};

/**
 * Generates an image from a text prompt.
 */
export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            aspectRatio: aspectRatio as any,
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
            // FIX: Updated responseModalities to use the Modality enum as per API guidelines.
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
            console.error("Video generation finished but no download link was provided.");
            return null;
        }
        return downloadLink;

    } catch (error) {
        console.error("Failed to generate video trailer:", error);
        return null;
    }
};