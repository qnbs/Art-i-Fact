
// FIX: Removed unused and incorrect imports for types that are defined locally or not needed.
export type ActiveView = 'workspace' | 'project' | 'discover' | 'gallery' | 'gallerysuite' | 'studio' | 'journal' | 'profile' | 'setup' | 'help' | 'community';

export interface Artwork {
    id: string;
    title: string;
    artist: string;
    year?: string;
    imageUrl: string;
    thumbnailUrl?: string;
    description?: string;
    sourceUrl?: string;
    license?: string;
    isGenerated?: boolean;
    comment?: string;
    colorPalette?: string[];
    medium?: string;
    dimensions?: string;
    location?: string;
    historicalContext?: string;
    tags?: string[];
}

export interface Gallery {
    id: string;
    title: string;
    description: string;
    artworks: Artwork[];
    status?: 'draft' | 'published';
    thumbnailUrl?: string;
    tags?: string[];
    audioGuide?: AudioGuide;
    trailerVideoUrl?: string;
    trailerVideoStatus?: 'none' | 'pending' | 'ready' | 'failed';
    projectId?: string | null;
    createdAt: string;
    updatedAt: string;
    curatorProfile?: Profile; // Added for community galleries
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

export type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface AppSettings {
    theme: 'light' | 'dark';
    showDeletionConfirmation: boolean;
    compactMode: boolean;
    defaultViewOnStartup: ActiveView;
    aiResultsCount: number;
    aiCreativity: 'focused' | 'balanced' | 'creative';
    aiContentLanguage: 'ui' | 'en' | 'de';
    aiThinkingBudget: number;
    streamJournalResponses: boolean;
    promptEnhancementStyle: 'subtle' | 'descriptive' | 'artistic';
    studioDefaultAspectRatio: ImageAspectRatio;
    studioAutoSave: boolean;
    clearPromptOnGenerate: boolean;
    defaultRemixPrompt: string;
    slideshowSpeed: number;
    slideshowTransition: 'fade' | 'slide';
    exhibitAutoplay: boolean;
    exhibitLoopSlideshow: boolean;
    showArtworkInfoInSlideshow: boolean;
    showControlsOnHover: boolean;
    autoSaveJournal: boolean;
    defaultJournalTitle: string;
    audioGuideVoiceURI: string;
    audioGuideSpeed: number;
}

export interface Profile {
    username: string;
    bio: string;
    avatar: string;
}

export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    projectId?: string | null;
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