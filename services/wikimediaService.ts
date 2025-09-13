import { Artwork } from '../types';

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
