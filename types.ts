// Core Data Structures
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
  dimensions?: string;
  medium?: string;
  tags?: string[];
  colorPalette?: string[];
  comment?: string;
  isGenerated?: boolean; // True if created in the Studio
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  artworks: Artwork[];
  thumbnailUrl?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  projectId: string | null;
  audioGuide?: AudioGuide;
  tags?: string[];
  curatorProfile?: Profile; // For shared galleries
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
}

export interface Profile {
  username: string;
  bio: string;
  avatar: string; // e.g., 'avatar-1'
  featuredGalleryId?: string;
}

// AI Interaction Types
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

// App Configuration & State
export type ActiveView = 'workspace' | 'project' | 'discover' | 'gallerysuite' | 'gallery' | 'studio' | 'journal' | 'profile' | 'setup' | 'help';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  showDeletionConfirmation: boolean;
  compactMode: boolean;
  defaultViewOnStartup: ActiveView;
  reduceMotion: boolean;

  aiCreativity: 'focused' | 'balanced' | 'creative' | 'custom';
  aiTemperature: number;
  aiTopP: number;
  aiTopK: number;
  aiContentLanguage: 'ui' | 'en' | 'de';
  aiThinkingBudget: number;
  streamJournalResponses: boolean;

  promptEnhancementStyle: 'subtle' | 'descriptive' | 'artistic';
  autoEnhancePrompts: boolean;
  studioDefaultAspectRatio: string;
  clearPromptOnGenerate: boolean;
  defaultNegativePrompt: string;
  defaultRemixPrompt: string;

  slideshowSpeed: number;
  slideshowTransition: 'fade' | 'slide' | 'kenburns';
  exhibitAutoplay: boolean;
  exhibitLoopSlideshow: boolean;
  exhibitBackground: 'blur' | 'color' | 'none';
  exhibitEnableParallax: boolean;
  showArtworkInfoInSlideshow: boolean;
  showControlsOnHover: boolean;
  
  autoSaveJournal: boolean;
  defaultJournalTitle: string;
  journalEditorFontSize: 'sm' | 'base' | 'lg';

  audioGuideVoiceURI: string;
  audioGuideSpeed: number;
  audioGuidePitch: number;
  audioGuideVolume: number;

  showProfileActivity: boolean;
  showProfileAchievements: boolean;
}

// For sharing galleries via URL
export interface ShareableGalleryData {
    gallery: Gallery;
    profile: Profile;
}
