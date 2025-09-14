import { communityGalleries } from '../data/communityGalleries.ts';
import type { Gallery } from '../types.ts';

/**
 * Fetches the curated list of community galleries.
 * This function simulates a network request.
 * @returns A promise that resolves to an array of Gallery objects.
 */
export const getCommunityGalleries = async (): Promise<Gallery[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real application, this would be an API call:
    // const response = await fetch('/api/community-galleries');
    // const data = await response.json();
    // return data;

    return communityGalleries;
};
