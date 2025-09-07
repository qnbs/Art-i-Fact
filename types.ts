import { Modality } from "@google/genai";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  imageUrl: string;
  description?: string;
  visualDescription?: string;
  colorPalette?: string[];
  comment?: string;
  tags?: string[];
  isGenerated?: boolean;
  sourceUrl?: string;
}

export interface AudioGuideSegment {
  artworkId: string;
  script: string;
}

export interface AudioGuide {
  introduction: string;
  segments: AudioGuideSegment[];
}

export interface Profile {
  username: string;
  bio: string;
  avatar: string; // identifier for a predefined avatar
}

export interface Gallery {
  id: string; // Unique ID for each gallery
  title: string;
  description: string;
  artworks: Artwork[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  curatorIntro?: string;
  audioGuide?: AudioGuide;
  curatorProfile?: Profile;
  thumbnailUrl?: string; // Auto-generated SVG data URL
  projectId?: string; // Link to a project
  trailerVideoUrl?: string; // Blob URL for the generated video
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

export interface AppSettings {
  aiCreativity: 'focused' | 'exploratory';
  aiResultsCount: 8 | 12 | 16;
  slideshowSpeed: number; // in seconds
  exhibitAutoplay: boolean;
  audioGuideVoiceURI: string | null;
  audioGuideSpeed: number; // e.g., 0.5 to 2
}

export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
    linkedGalleryId?: string;
    projectId?: string; // Link to a project
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
    galleries: Gallery[];
    profile: Profile;
    settings: AppSettings;
    journal: JournalEntry[];
    projects: Project[];
}

export interface ResearchResult {
    summary: string;
    sources: { uri: string; title: string }[];
}
