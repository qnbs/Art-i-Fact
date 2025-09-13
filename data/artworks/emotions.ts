// FIX: Implemented full content for the emotionArtworks data file.
import { Artwork } from '../../types';

export const emotionArtworks: Artwork[] = [
  {
    id: 'joy_the_kiss',
    title: 'The Kiss',
    artist: 'Gustav Klimt',
    year: '1907-1908',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/joy_the_kiss.jpg',
    description: 'A masterpiece of the Art Nouveau period, this painting depicts a couple embracing, their bodies entwined in elaborate, gilded robes. It is a symbol of love, passion, and the joy of union.',
    medium: 'Oil and gold leaf on canvas',
    dimensions: '180 cm × 180 cm',
    location: 'Österreichische Galerie Belvedere, Vienna',
    tags: ['Art Nouveau', 'Symbolism', 'Joy', 'Love'],
  },
  {
    id: 'melancholy_wanderer_above_the_sea_of_fog',
    title: 'Wanderer above the Sea of Fog',
    artist: 'Caspar David Friedrich',
    year: 'c. 1818',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/melancholy_wanderer_above_the_sea_of_fog.jpg',
    description: 'A quintessential work of Romanticism, it depicts a lone figure looking out over a vast, fog-shrouded landscape. The painting evokes feelings of contemplation, solitude, and the sublime power of nature.',
    medium: 'Oil on canvas',
    dimensions: '94.8 cm × 74.8 cm',
    location: 'Hamburger Kunsthalle, Hamburg',
    tags: ['Romanticism', 'Landscape', 'Sublime', 'Solitude'],
  },
  {
    id: 'chaos_guernica',
    title: 'Guernica',
    artist: 'Pablo Picasso',
    year: '1937',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/chaos_guernica.jpg',
    description: 'One of the most powerful anti-war paintings in history, Guernica is a monumental black, white, and grey mural depicting the bombing of a Basque town during the Spanish Civil War. It portrays the suffering, violence, and chaos of war.',
    medium: 'Oil on canvas',
    dimensions: '349 cm × 776 cm',
    location: 'Museo Reina Sofía, Madrid',
    tags: ['Cubism', 'Anti-war', 'History Painting', 'Chaos'],
  },
];