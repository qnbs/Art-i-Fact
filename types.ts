
export interface Artwork {
    id: string;
    title: string;
    artist: string;
    year: string;
    imageUrl: string;
    thumbnailUrl?: string;
    description: string;
    medium?: string;
    dimensions?: string;
    location?: string;
    tags?: string[];
    sourceUrl?: string;
    colorPalette?: string[];
    historicalContext?: string;
    comment?: string;
    isGenerated?: boolean;
    license?: string;
}

export interface Gallery {
    id: string;
    title: string;
    description: string;
    artworks: Artwork[];
    createdAt: string;
    updatedAt: string;
    thumbnailUrl?: string;
    curatorIntro?: string;
    projectId?: string;
    trailerVideoUrl?: string;
    trailerVideoStatus?: 'pending' | 'ready' | 'failed';
}

export interface Profile {
    username: string;
    bio: string;
    avatar: string;
}

export interface AppSettings {
    aiCreativity: 'focused' | 'balanced' | 'creative';
    aiResultsCount: number;
    slideshowSpeed: number; // in seconds
    exhibitAutoplay: boolean;
    audioGuideVoiceURI: string | null;
    audioGuideSpeed: number; // rate multiplier
}

export interface DeepDive {
    symbolism: string;
    artistContext: string;
    technique: string;
}

export interface GalleryCritique {
    critique: string;
    suggestions: string[];
}

export interface AudioGuide {
    introduction: string;
    segments: {
        artworkId: string;
        script: string;
    }[];
}

export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    galleryIds: string[];
    projectId?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface ShareableGalleryData {
    gallery: Gallery;
    profile: Profile;
}

export type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
