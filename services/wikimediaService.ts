
import type { Artwork } from '../types';

const stripHtml = (html: string): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const parseWikimediaResponse = (data: any): Artwork[] => {
    const artworks: Artwork[] = [];
    if (!data.query || !data.query.pages) {
        return artworks;
    }
    const pages = data.query.pages;
    for (const pageId in pages) {
        const page = pages[pageId];
        if (page.imageinfo && page.imageinfo.length > 0) {
            const imageInfo = page.imageinfo[0];
            const metadata = imageInfo.extmetadata || {};

            const artistValue = metadata.Artist?.value || metadata.credit?.value || 'Unknown Artist';
            const descriptionValue = metadata.ImageDescription?.value || 'No description available.';

            const artwork: Artwork = {
                id: `wiki_${page.pageid}`,
                title: page.title.replace(/^File:/, '').replace(/\.(jpg|jpeg|png|gif|svg)$/i, '').trim(),
                artist: stripHtml(artistValue),
                year: metadata.DateTimeOriginal?.value ? new Date(metadata.DateTimeOriginal.value).getFullYear().toString() : 'Unknown',
                imageUrl: imageInfo.url,
                thumbnailUrl: imageInfo.thumburl,
                description: stripHtml(descriptionValue),
                medium: stripHtml(metadata.Medium?.value),
                dimensions: stripHtml(metadata.Dimensions?.value),
                sourceUrl: imageInfo.descriptionurl,
                license: metadata.LicenseShortName?.value,
            };
            artworks.push(artwork);
        }
    }
    return artworks;
};


export const searchWikimedia = async (query: string, count: number = 10): Promise<Artwork[]> => {
    const API_ENDPOINT = "https://commons.wikimedia.org/w/api.php";
    const params = new URLSearchParams({
        action: "query",
        format: "json",
        generator: "search",
        gsrsearch: `${query} filetype:image`,
        gsrnamespace: "6",
        gsrlimit: String(count),
        prop: "imageinfo",
        iiprop: "url|extmetadata|size",
        iiurlwidth: "400",
        redirects: "1",
        origin: "*" // Required for CORS
    });

    try {
        const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Wikimedia API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return parseWikimediaResponse(data);
    } catch (error) {
        console.error("Error searching Wikimedia:", error);
        return [];
    }
};

/**
 * Constructs a URL for a resized version of a Wikimedia Commons image.
 * @param originalUrl The original full-resolution image URL.
 * @param width The desired width in pixels.
 * @returns The new URL for the resized image, or the original URL if it cannot be processed.
 */
export const getWikimediaImageUrl = (originalUrl: string | undefined, width: number): string => {
    if (!originalUrl || !originalUrl.includes('upload.wikimedia.org/wikipedia/commons')) {
        return originalUrl || '';
    }

    try {
        // Example URL: https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa.jpg
        // Thumb URL:   https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa.jpg/800px-Mona_Lisa.jpg
        const url = new URL(originalUrl);
        const pathParts = url.pathname.split('/commons/');
        if (pathParts.length !== 2) return originalUrl;

        const imagePath = pathParts[1];
        // Decode URI component to handle filenames with special characters
        const decodedImagePath = decodeURIComponent(imagePath);
        const filename = decodedImagePath.substring(decodedImagePath.lastIndexOf('/') + 1);
        
        // Re-encode for the URL, ensuring it's safe
        const encodedFilename = encodeURIComponent(filename);

        url.pathname = `/wikipedia/commons/thumb/${imagePath}/${width}px-${encodedFilename}`;
        return url.toString();
    } catch (e) {
        console.error("Failed to construct Wikimedia image URL:", e);
        return originalUrl; // Return original on failure
    }
};
