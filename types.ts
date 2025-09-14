
import type { Chat } from '@google/genai';

export type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  description?: string;
  medium?: string;
  dimensions?: string;
  location?: string;
  sourceUrl?: string;
  historicalContext?: string;
  tags?: string[];
  colorPalette?: string[];
  license?: string;
  comment?: string; // User-specific notes when in a gallery
  isGenerated?: boolean;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  artworks: Artwork[];
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  projectId?: string;
  // Trailer generation fields
  trailerVideoUrl?: string | null;
  trailerVideoStatus?: 'pending' | 'ready' | 'failed' | null;
  // Suite Features
  curatorNotes?: string;
  status?: 'draft' | 'published';
  tags?: string[];
  introduction?: string;
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
  segments: { artworkId: string; script: string }[];
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string; // Markdown content
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  linkedGalleryId?: string | null;
}

export interface Profile {
  username: string;
  bio: string;
  avatar: string; // seed for procedural avatar
}

export interface AppSettings {
  // General
  showDeletionConfirmation: boolean;
  compactMode: boolean;

  // AI
  aiResultsCount: number;
  aiCreativity: 'focused' | 'balanced' | 'creative';
  aiContentLanguage: 'ui' | 'de' | 'en';
  aiThinkingBudget: number; // For gemini-2.5-flash

  // Studio
  promptEnhancementStyle: 'subtle' | 'descriptive' | 'artistic';
  studioDefaultAspectRatio: ImageAspectRatio;
  studioAutoSave: boolean;

  // Exhibition
  slideshowSpeed: number; // in seconds
  slideshowTransition: 'fade' | 'slide';
  exhibitAutoplay: boolean;
  exhibitLoopSlideshow: boolean;
  showArtworkInfoInSlideshow: boolean;

  // Audio Guide
  audioGuideVoiceURI: string; // URI of the selected SpeechSynthesisVoice
  audioGuideSpeed: number; // Playback rate
}

export interface ShareableGalleryData {
  gallery: Gallery;
  profile: Profile;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIState {
  chatInstance: Chat | null;
}
