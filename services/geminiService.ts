import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import type { Artwork, Gallery, DeepDive, AudioGuide, AppSettings, GalleryCritique, ResearchResult } from '../types';
import { findArtwork } from '../data/realArtworks';

// --- API Key Configuration ---
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // Fail early and provide a clear error message for developers
  throw new Error("API_KEY environment variable not set. Please ensure you have a .env file with a valid API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Model Constants ---
const GEMINI_MODEL = 'gemini-2.5-flash';
const IMAGEN_MODEL = 'imagen-4.0-generate-001';
const IMAGE_EDIT_MODEL = 'gemini-2.5-flash-image-preview';
const VIDEO_MODEL = 'veo-2.0-generate-001';


// A simple UUID generator for client-side ID creation
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


// --- Prompt Templates ---
const PROMPT_TEMPLATES = {
  GENERATE_ARTWORKS: (themeString: string, count: number, creativity: 'focused' | 'exploratory') => {
    const creativityInstruction = creativity === 'focused'
      ? `The results should be very closely and directly related to the user's request.`
      : `Feel free to be more interpretive and find surprising, tangential, or thematically linked artworks that might not be an obvious match but create an interesting collection.`;
    return `You are an expert art curator. A user is looking for artworks based on the following request: "${themeString}". Analyze their request, considering themes, styles, artists, moods, and objects mentioned. ${creativityInstruction} Generate a list of ${count} famous, real artworks that are in the public domain and match this request. For each artwork, provide its exact "title" and "artist". Do not invent artworks. Provide your response as a JSON array of objects.`;
  },
  REFINE_THEMES: (themeString: string, artworkTitles: string) => `A user searched for artworks with the request "${themeString}" and got results like "${artworkTitles}". Suggest 4 more specific, refined, or related sub-themes or styles to help them narrow their search. Examples: "Impressionist Portraits", "Symbolism in Mythology", "Abstract Expressionist Landscapes", "Cubism". Provide your response as a JSON array of strings. Each string should be a concise theme suggestion. Do not include any text outside of the JSON array.`,
  FIND_SIMILAR: (artwork: Artwork) => `Find 12 artworks that are visually or thematically similar to "${artwork.title}" by ${artwork.artist}. The results must be famous, real artworks in the public domain. Do not include the original artwork in the results. For each artwork, provide its exact 'title' and 'artist'.`,
  SUGGEST_ADDITIONS: (gallery: Gallery, galleryContext: string) => `I am curating a gallery with the title "${gallery.title}" and the description "${gallery.description}". It already contains these artworks: ${galleryContext}. Suggest 3 more famous, real, public domain artworks that would complement this collection thematically and aesthetically. For each, provide its exact 'title' and 'artist'.`,
  DETECT_STYLE: (artworkInfo: string) => `Analyze the following list of artworks: ${artworkInfo}. Identify the single, most dominant and recognized art style or movement (e.g., 'Impressionism', 'Surrealism', 'Baroque'). Do not invent new styles. If the collection is a mix of many styles with no clear dominant one, respond with null. Respond with *only* a JSON object of the format {"style": "StyleName"} or {"style": null}. Do not include any other text or markdown formatting.`,
  DESCRIBE_STYLE: (style: string) => `Provide a concise, one-paragraph description for the art style "${style}", suitable for a museum app. Focus on its key characteristics, notable artists, and historical context. The tone should be engaging and informative for a general audience. Do not include a title or any text other than the description paragraph.`,
  IDENTIFY_IMAGE: `You are an art historian AI. Analyze the provided image of an artwork. Identify its exact title and artist. The artwork is likely a famous piece from Western art history. Provide the response as a single JSON object with the keys "title" and "artist". If a value cannot be determined, use "Unknown".`,
  GENERATE_GALLERY_INTRO: (gallery: Gallery, galleryContext: string) => `You are a professional art curator. A user has created a gallery titled "${gallery.title}" with the description "${gallery.description}". It contains these artworks: ${galleryContext}. Write an engaging and insightful introductory paragraph (around 100 words) for this virtual exhibition. Explain the common themes, the flow of the pieces, and what a visitor should pay attention to. The tone should be accessible and elegant.`,
  GENERATE_DEEP_DIVE: (artwork: Artwork) => `You are an expert art historian providing a "Deep Dive" analysis for the artwork "${artwork.title}" by ${artwork.artist} (${artwork.year}). The artwork's description is: "${artwork.description}". Provide a detailed analysis covering three specific areas: Symbolism, Artist's Context, and Technique. Respond with a single JSON object.
  1.  **Symbolism**: Analyze the key symbols and allegorical elements in the painting. Explain their meanings and significance in the context of the work. If there are no prominent symbols, discuss the overall mood and message. (around 100 words).
  2.  **Artist's Context**: Briefly describe what was happening in the artist's life and career around the time this artwork was created. Mention any relevant personal events, artistic phases, or historical influences. (around 100 words).
  3.  **Technique**: Describe the primary artistic techniques used by the artist in this piece. Mention the medium, brushwork, use of color, light (e.g., chiaroscuro), and composition. (around 100 words).
  `,
  GENERATE_AUDIO_GUIDE: (gallery: Gallery, galleryContext: string) => `You are an eloquent museum audio guide narrator. You are creating an audio tour for a virtual gallery titled "${gallery.title}". The gallery's theme is: "${gallery.description}". The artworks are: ${galleryContext}.
  Your task is to generate a complete script for the audio guide. The script must be returned as a single JSON object.
  The JSON object should have two properties:
  1.  "introduction": A welcoming and captivating introduction (around 100 words) to the entire exhibition, setting the theme and tone.
  2.  "segments": An array of objects. Each object must have two properties: "artworkId" and "script".
      - The "artworkId" must match the ID of the artwork from the provided context.
      - The "script" should be a compelling 1-2 paragraph narration (around 120 words) for that specific artwork. It should connect the artwork to the gallery's theme, highlight interesting details, and smoothly transition from the previous piece.
  
  Make the narration engaging, accessible, and informative, as if you were speaking directly to a visitor.
  `,
  CRITIQUE_GALLERY: (gallery: Gallery, galleryContext: string) => `You are a professional, eloquent, and constructive art critic. A user has curated a virtual gallery and is asking for your feedback.
  Gallery Title: "${gallery.title}"
  Gallery Description: "${gallery.description}"
  Artworks in order: ${galleryContext}

  Please provide a thoughtful critique of this gallery. Your response must be a single JSON object, following the schema.
  1.  "critique": Write a one-paragraph critique (around 150 words). Comment on the strength of the theme, the flow and coherence of the selected artworks, and the effectiveness of the title and description. Be honest but encouraging.
  2.  "suggestions": Provide an array of 3 distinct, actionable suggestions for how the user could improve their gallery. Each suggestion should be a concise string. For example: "Consider adding a piece from the post-impressionist movement to bridge the gap between two eras." or "Try reordering the artworks to create a stronger narrative, starting with the darkest piece and moving towards the lightest."
  `,
  SUGGEST_GALLERY_TITLE: (galleryContext: string) => `Based on the following artworks: ${galleryContext}, suggest one creative, evocative, and concise title for an art gallery. The title should capture the essence of the collection. Respond with only the title text, no quotes or extra words.`,
  SUGGEST_GALLERY_DESCRIPTION: (galleryContext: string, title: string) => `You are an expert art curator. For a virtual art gallery titled "${title}" containing these artworks: ${galleryContext}, suggest a more evocative and engaging one-paragraph description (around 60-80 words). The description should capture the main themes and moods of the collection, making it appealing to a general audience. Respond with only the description text, without any preamble or title.`,
  SUGGEST_GALLERY_ORDER: (galleryContext: string, title: string) => `You are an expert art curator. A collection of artworks for a gallery titled "${title}" is provided below. The current order is arbitrary. Your task is to reorder the artworks to create the most compelling narrative or visual flow for a visitor.
  
  Artworks (with their IDs): ${galleryContext}
  
  Analyze the artworks based on their titles, artists, and themes. Decide on a curatorial strategy. Examples:
  - Chronological progression
  - Thematic arc (e.g., from chaos to peace)
  - Visual flow (e.g., color progression, from dark to light)
  - Juxtaposition of contrasting styles
  
  Your response must be a single JSON object with two properties:
  1. "reasoning": A brief, one-sentence explanation of your curatorial strategy. (e.g., "The artworks are ordered to show the evolution from early sketches to the final masterpiece.")
  2. "orderedIds": An array of strings, where each string is an artwork ID from the provided list, in the new, suggested order. The array must contain all and only the IDs provided.`,
  PROCESS_JOURNAL_TEXT: (text: string, action: 'expand' | 'summarize' | 'improve') => {
    let instruction = '';
    switch (action) {
        case 'expand':
            instruction = 'Take the following text and expand upon it, adding more detail, description, and depth, while maintaining the original tone and intent. Make it about twice as long.';
            break;
        case 'summarize':
            instruction = 'Take the following text and summarize it into a single, concise sentence that captures the main point.';
            break;
        case 'improve':
            instruction = 'Take the following text and improve it. Correct any grammatical errors, refine the sentence structure for better flow, and enhance the vocabulary to make it more eloquent and impactful, while preserving the core meaning.';
            break;
    }
    return `${instruction}\n\nText: "${text}"`;
  },
  ENHANCE_IMAGE_PROMPT: (prompt: string) => `You are an expert prompt engineer for generative art AIs like Imagen. Take the user's simple prompt and expand it into a detailed, descriptive, and evocative prompt that will produce a high-quality, artistic image. Focus on visual details, style (e.g., photorealistic, oil painting, watercolor, art deco), lighting (e.g., cinematic lighting, soft light), composition, and mood. The output should be ONLY the improved prompt text, without any preamble or explanation.

User Prompt: "${prompt}"`,
  GENERATE_VIDEO_PROMPT: (gallery: Gallery, galleryContext: string) => `Create a short, cinematic, atmospheric video trailer (5-10 seconds) for a virtual art gallery.
  Gallery Title: "${gallery.title}"
  Gallery Description: "${gallery.description}"
  Artworks included: ${galleryContext}
  
  The video should evoke the mood of the gallery. Do not show the artworks directly. Instead, create abstract visuals, colors, and motion that capture the essence of the collection's theme. For example, if the theme is "calm seascapes", the video could be slow, flowing blue and white shapes. If the theme is "urban chaos", it could be fast-paced, geometric, with flashes of red and grey. The mood should be artistic and intriguing.`
};

const artworkIdentifierSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        artist: { type: Type.STRING },
    },
    required: ["title", "artist"],
};

const baseGenerateContent = async (prompt: string): Promise<Artwork[]> => {
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: artworkIdentifierSchema,
                },
            },
        });

        const jsonString = response.text.trim();
        if (!jsonString) {
            console.warn("Gemini API returned an empty string for artworks.");
            return [];
        }
        
        let parsedIdentifiers: {title: string, artist: string}[];
        try {
            parsedIdentifiers = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("Failed to parse JSON response from Gemini API:", jsonString, parseError);
            throw new Error("The AI returned a response that was not in the expected format. Please try again.");
        }
        
        // Match identifiers with our local artwork library
        const foundArtworks = parsedIdentifiers
            .map(id => findArtwork(id.title, id.artist))
            .filter((art): art is Artwork => art !== null); // Filter out nulls and type guard

        return foundArtworks;

    } catch (error: any) {
        console.error("Error generating artworks from Gemini API:", error);
        if (error.message.startsWith("The AI returned a response")) {
            throw error;
        }
        throw new Error("Failed to get suggestions from the AI. The service might be temporarily unavailable. Please try a different theme or try again later.");
    }
}


export const generateArtworksForTheme = async (
    themes: string[] | string,
    settings: Pick<AppSettings, 'aiResultsCount' | 'aiCreativity'>
): Promise<Artwork[]> => {
    if ((Array.isArray(themes) && themes.length === 0) || (typeof themes === 'string' && themes.trim() === '')) {
        return [];
    }

    const themeString = Array.isArray(themes) ? themes.join(', ') : themes;
    const prompt = PROMPT_TEMPLATES.GENERATE_ARTWORKS(themeString, settings.aiResultsCount, settings.aiCreativity);
    return baseGenerateContent(prompt);
};

export const generateThemeRefinements = async (themes: string[] | string, artworks: Artwork[]): Promise<string[]> => {
    if ((Array.isArray(themes) && themes.length === 0) || (typeof themes === 'string' && themes.trim() === '')) {
      return [];
    }
    if (artworks.length === 0) return [];
    
    const themeString = Array.isArray(themes) ? themes.join(', ') : themes;
    const artworkTitles = artworks.slice(0, 5).map(a => a.title).join(', ');
    const prompt = PROMPT_TEMPLATES.REFINE_THEMES(themeString, artworkTitles);

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
            },
        });
        const jsonString = response.text.trim();
        if (!jsonString) {
            console.warn("Gemini API returned an empty string for theme refinements.");
            return [];
        }
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating theme refinements from Gemini API:", error);
        return [];
    }
};

export const findSimilarArtworks = async (artwork: Artwork): Promise<Artwork[]> => {
    const prompt = PROMPT_TEMPLATES.FIND_SIMILAR(artwork);
    return baseGenerateContent(prompt);
};

export const suggestGalleryAdditions = async (gallery: Gallery): Promise<Artwork[]> => {
    const galleryContext = gallery.artworks.map(art => `${art.title} by ${art.artist}`).join(', ');
    const prompt = PROMPT_TEMPLATES.SUGGEST_ADDITIONS(gallery, galleryContext);
    return baseGenerateContent(prompt);
};

export const detectDominantStyle = async (artworks: Artwork[]): Promise<string | null> => {
    if (artworks.length < 3) {
        return null;
    }
    const artworkInfo = artworks.map(a => `${a.title} by ${a.artist} (${a.tags?.join(', ') || 'no tags'})`).join('; ');
    const prompt = PROMPT_TEMPLATES.DETECT_STYLE(artworkInfo);

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        style: { type: Type.STRING, nullable: true }
                    },
                    required: ["style"]
                }
            }
        });
        const jsonString = response.text.trim();
        if (!jsonString) return null;
        const result = JSON.parse(jsonString);
        return result.style || null;
    } catch (error) {
        console.error("Error detecting dominant style from Gemini API:", error);
        return null;
    }
};

export const generateStyleDescription = async (style: string): Promise<string> => {
    const prompt = PROMPT_TEMPLATES.DESCRIBE_STYLE(style);
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating style description from Gemini API:", error);
        return `Could not load information for ${style}.`;
    }
};

export const identifyArtworkInLibrary = async (base64Image: string, mimeType: string): Promise<Artwork | null> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = { text: PROMPT_TEMPLATES.IDENTIFY_IMAGE };
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        artist: { type: Type.STRING },
                    },
                    required: ["title", "artist"]
                }
            }
        });

        const { title, artist } = JSON.parse(response.text);
        const matchedArtwork = findArtwork(title, artist);
        
        if (!matchedArtwork) {
            throw new Error("Artwork identified, but not found in our curated public domain library.");
        }
        return matchedArtwork;

    } catch (error) {
        console.error("Error analyzing image with Gemini API:", error);
        throw new Error("Failed to identify the artwork in our library. Please try another one.");
    }
};

export async function* generateGalleryIntroStream(gallery: Gallery): AsyncGenerator<string> {
    const galleryContext = gallery.artworks.map(art => `${art.title} by ${art.artist}`).join('; ');
    const prompt = PROMPT_TEMPLATES.GENERATE_GALLERY_INTRO(gallery, galleryContext);
    try {
        const responseStream = await ai.models.generateContentStream({
            model: GEMINI_MODEL,
            contents: prompt,
        });

        for await (const chunk of responseStream) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error generating gallery introduction from Gemini API:", error);
        throw new Error("Could not generate a curator's introduction for this gallery.");
    }
}

export const generateDeepDive = async (artwork: Artwork): Promise<DeepDive> => {
    const prompt = PROMPT_TEMPLATES.GENERATE_DEEP_DIVE(artwork);
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        symbolism: { type: Type.STRING },
                        artistContext: { type: Type.STRING },
                        technique: { type: Type.STRING },
                    },
                    required: ["symbolism", "artistContext", "technique"]
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating deep dive from Gemini API:", error);
        throw new Error("Failed to generate a deeper analysis for this artwork.");
    }
};

export const generateAudioGuide = async (gallery: Gallery): Promise<AudioGuide> => {
    const galleryContext = gallery.artworks.map(art => `Artwork ID: ${art.id}, Title: ${art.title} by ${art.artist}, Description: ${art.description}`).join('; ');
    const prompt = PROMPT_TEMPLATES.GENERATE_AUDIO_GUIDE(gallery, galleryContext);

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
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
                                    script: { type: Type.STRING }
                                },
                                required: ["artworkId", "script"]
                            }
                        }
                    },
                    required: ["introduction", "segments"]
                }
            }
        });
        const jsonString = response.text.trim();
        const parsedGuide = JSON.parse(jsonString);
        const validArtworkIds = new Set(gallery.artworks.map(a => a.id));
        parsedGuide.segments = parsedGuide.segments.filter((segment: any) => validArtworkIds.has(segment.artworkId));
        return parsedGuide;
    } catch (error) {
        console.error("Error generating audio guide from Gemini API:", error);
        throw new Error("Failed to generate an audio guide for this gallery.");
    }
};

export const generateGalleryCritique = async (gallery: Gallery): Promise<GalleryCritique> => {
    const galleryContext = gallery.artworks.map(art => `${art.title} by ${art.artist}`).join('; ');
    const prompt = PROMPT_TEMPLATES.CRITIQUE_GALLERY(gallery, galleryContext);

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        critique: { type: Type.STRING },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["critique", "suggestions"]
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating gallery critique from Gemini API:", error);
        throw new Error("Failed to generate a critique for this gallery.");
    }
};


export const startArtChat = (artwork: Artwork): Chat => {
  const systemInstruction = `You are a friendly, enthusiastic, and knowledgeable art historian AI named Art-i. Your goal is to engage the user in a conversation about a specific artwork.
  The artwork is "${artwork.title}" by ${artwork.artist} (${artwork.year}).
  Description: "${artwork.description || 'No description available.'}".
  Key Tags: ${artwork.tags?.join(', ') || 'No tags available'}.
  
  Do not just list facts. Ask insightful questions to encourage the user to share their own perspective. Keep your responses concise (2-3 sentences) and conversational. Start the conversation with a warm greeting and an open-ended question about the artwork. Do not repeat the artwork's title and artist in every message.`;

  const chat = ai.chats.create({
    model: GEMINI_MODEL,
    config: { systemInstruction },
  });
  return chat;
};

export const suggestGalleryTitle = async (gallery: Gallery): Promise<string> => {
    const galleryContext = gallery.artworks.map(art => `${art.title} by ${art.artist} (Tags: ${art.tags?.join(', ')})`).join('; ');
    const prompt = PROMPT_TEMPLATES.SUGGEST_GALLERY_TITLE(galleryContext);
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });
        return response.text.trim().replace(/"/g, ''); // Remove quotes
    } catch (error) {
        console.error("Error suggesting gallery title from Gemini API:", error);
        throw new Error("Could not suggest a title.");
    }
};

export const suggestGalleryDescription = async (gallery: Gallery): Promise<string> => {
    const galleryContext = gallery.artworks.map(art => `${art.title} by ${art.artist}`).join('; ');
    const prompt = PROMPT_TEMPLATES.SUGGEST_GALLERY_DESCRIPTION(galleryContext, gallery.title);
     try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error suggesting gallery description from Gemini API:", error);
        throw new Error("Could not suggest a description.");
    }
};

export const generateImageFromPrompt = async (prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: IMAGEN_MODEL,
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("The AI did not return an image.");
        }
    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        throw new Error("Failed to generate an image from the prompt. Please try again.");
    }
};

export const enhanceImagePrompt = async (prompt: string): Promise<string> => {
    const fullPrompt = PROMPT_TEMPLATES.ENHANCE_IMAGE_PROMPT(prompt);
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: fullPrompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error enhancing image prompt from Gemini API:", error);
        throw new Error("Failed to enhance the prompt.");
    }
};

export const remixImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const imagePart = { inlineData: { data: base64ImageData, mimeType } };
        const textPart = { text: prompt };
        const response = await ai.models.generateContent({
            model: IMAGE_EDIT_MODEL,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        const imagePartResponse = response.candidates?.[0]?.content.parts.find(part => part.inlineData);
        if (imagePartResponse?.inlineData) {
            return imagePartResponse.inlineData.data;
        }
        throw new Error("AI did not return an image from the remix operation.");
    } catch (error) {
        console.error("Error remixing image with Gemini API:", error);
        throw new Error("Failed to remix the image. Please try again.");
    }
};

export const suggestGalleryOrder = async (gallery: Gallery): Promise<{ reasoning: string, orderedIds: string[] }> => {
    const galleryContext = gallery.artworks.map(art => `ID: ${art.id}, Title: ${art.title} by ${art.artist} (Tags: ${art.tags?.join(', ')})`).join('; ');
    const prompt = PROMPT_TEMPLATES.SUGGEST_GALLERY_ORDER(galleryContext, gallery.title);
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        reasoning: { type: Type.STRING },
                        orderedIds: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["reasoning", "orderedIds"]
                }
            }
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        // Validate that all original IDs are present
        const originalIds = new Set(gallery.artworks.map(a => a.id));
        const returnedIds = new Set(result.orderedIds);
        if (originalIds.size !== returnedIds.size || ![...originalIds].every(id => returnedIds.has(id))) {
            throw new Error("AI response did not contain all the original artwork IDs.");
        }

        return result;
    } catch (error) {
        console.error("Error suggesting gallery order from Gemini API:", error);
        throw new Error("Failed to suggest a new order for the gallery.");
    }
};


export const processJournalText = async (text: string, action: 'expand' | 'summarize' | 'improve'): Promise<string> => {
    const prompt = PROMPT_TEMPLATES.PROCESS_JOURNAL_TEXT(text, action);
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error processing journal text from Gemini API:", error);
        throw new Error(`Failed to ${action} the text.`);
    }
};

export const researchTopic = async (topic: string): Promise<ResearchResult> => {
    const prompt = `Provide a concise, encyclopedic summary for the topic: "${topic}". Focus on key facts, dates, and significance.`;
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        const summary = response.text;
        const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = rawSources
            .map((s: any) => ({ uri: s.web?.uri, title: s.web?.title }))
            .filter((s: any): s is { uri: string, title: string } => s.uri && s.title);
        
        // Deduplicate sources by URI
        const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
        
        return { summary, sources: uniqueSources };
    } catch(error) {
        console.error("Error researching topic from Gemini API:", error);
        throw new Error(`Failed to research the topic "${topic}".`);
    }
};

export const generateGalleryVideo = async (gallery: Gallery): Promise<any> => {
    const galleryContext = gallery.artworks.slice(0, 10).map(art => `${art.title} (${art.tags?.join(', ')})`).join('; ');
    const prompt = PROMPT_TEMPLATES.GENERATE_VIDEO_PROMPT(gallery, galleryContext);
    try {
        const operation = await ai.models.generateVideos({
            model: VIDEO_MODEL,
            prompt: prompt,
            config: {
                numberOfVideos: 1
            }
        });
        return operation;
    } catch (error) {
        console.error("Error starting video generation with Gemini API:", error);
        throw new Error("Failed to start video generation for the gallery.");
    }
};

export const checkVideoOperationStatus = async (operation: any): Promise<any> => {
    try {
        const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch(error) {
        console.error("Error checking video operation status:", error);
        throw new Error("Failed to check video generation status.");
    }
};
