import type { Artwork } from '../types.ts';

const WIKIMEDIA_API_ENDPOINT = 'https://commons.wikimedia.org/w/api.php';

interface WikimediaApiSearchResult {
    ns: number;
    title: string;
    pageid: number;
    size: number;
    wordcount: number;
    snippet: string;
    timestamp: string;
}

interface WikimediaApiImageInfo {
    timestamp: string;
    user: string;
    userid: number;
    comment: string;
    url: string;
    descriptionurl: string;
    descriptionshorturl: string;
    thumburl?: string;
    extmetadata: {
        [key: string]: {
            value: string;
            source: string;
            hidden?: string;
        };
    };
}

const fetchJson = async (url: string) => {
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) {
        throw new Error(`Wikimedia API request failed: ${response.statusText}`);
    }
    return response.json();
};

const extractMetadataValue = (metadata: any, key: string): string | undefined => {
    return metadata[key]?.value ? sanitizeHtml(metadata[key].value) : undefined;
};

const sanitizeHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

export const searchWikimedia = async (query: string, limit: number = 20): Promise<Artwork[]> => {
    const url = new URL(WIKIMEDIA_API_ENDPOINT);
    url.search = new URLSearchParams({
        action: 'query',
        format: 'json',
        generator: 'search',
        gsrsearch: `${query} filetype:image`,
        gsrnamespace: '6',
        gsrlimit: String(limit),
        prop: 'imageinfo',
        iiprop: 'url|extmetadata|user|comment',
        iiurlwidth: '400', // Request a 400px wide thumbnail
        redirects: '1',
        origin: '*',
    }).toString();

    const data = await fetchJson(url.toString());
    const pages = data.query?.pages;

    if (!pages) return [];

    const artworks: Artwork[] = Object.values(pages).map((page: any): Artwork | null => {
        const imageInfo: WikimediaApiImageInfo | undefined = page.imageinfo?.[0];
        if (!imageInfo) return null;
        
        const metadata = imageInfo.extmetadata;
        if (!metadata) return null;

        return {
            id: `wiki_${page.pageid}`,
            title: sanitizeHtml(extractMetadataValue(metadata, 'ObjectName') || page.title.replace('File:', '').replace(/\.[^/.]+$/, "")),
            artist: extractMetadataValue(metadata, 'Artist') || 'Unknown artist',
            year: extractMetadataValue(metadata, 'DateTimeOriginal')?.substring(0, 4) || undefined,
            imageUrl: imageInfo.url,
            thumbnailUrl: imageInfo.thumburl, // Use the thumburl provided by the API
            description: extractMetadataValue(metadata, 'ImageDescription'),
            sourceUrl: imageInfo.descriptionurl,
            license: extractMetadataValue(metadata, 'LicenseShortName'),
            dimensions: extractMetadataValue(metadata, 'Dimensions'),
            medium: extractMetadataValue(metadata, 'Medium'),
            tags: extractMetadataValue(metadata, 'Categories')?.split('|').filter(Boolean) || [],
        };
    }).filter((artwork): artwork is Artwork => artwork !== null);

    return artworks;
};