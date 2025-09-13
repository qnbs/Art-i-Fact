import { Artwork } from '../types';
import { eraArtworks } from './artworks/eras';
import { emotionArtworks } from './artworks/emotions';
import { placeArtworks } from './artworks/places';
import { themeArtworks } from './artworks/themes';

// Consolidate all artworks from the modular files into one comprehensive library.
// This structure makes it easier to add new categories or artworks in the future.
export const realArtworks: Artwork[] = [
    ...eraArtworks,
    ...emotionArtworks,
    ...placeArtworks,
    ...themeArtworks,
];

// A helper function to perform a fuzzy search for an artwork in our library.
// This allows for minor variations in titles or artist names from the AI.
export const findArtwork = (title: string, artist: string): Artwork | null => {
    if (!title || !artist || title === 'Unknown Artwork' || artist === 'Unknown Artist') return null;

    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const normalizedTitle = normalize(title);
    const normalizedArtist = normalize(artist);

    // Create a Set of unique artworks based on their ID to avoid duplicates from different categories
    const uniqueArtworks = Array.from(new Map(realArtworks.map(art => [art.id, art])).values());

    // Prioritize exact matches first
    for (const art of uniqueArtworks) {
        if (normalize(art.title) === normalizedTitle && normalize(art.artist) === normalizedArtist) {
            return art;
        }
    }

    // Allow for partial matches if no exact match is found
    for (const art of uniqueArtworks) {
        if (normalize(art.title).includes(normalizedTitle) && normalize(art.artist).includes(normalizedArtist)) {
            return art;
        }
    }

    return null;
}