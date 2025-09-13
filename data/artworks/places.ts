// FIX: Implemented full content for the placeArtworks data file.
import { Artwork } from '../../types';

export const placeArtworks: Artwork[] = [
  {
    id: 'city_nighthawks',
    title: 'Nighthawks',
    artist: 'Edward Hopper',
    year: '1942',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/city_nighthawks.jpg',
    description: 'An iconic depiction of urban isolation, this painting portrays four figures in a brightly lit downtown diner late at night. The work explores themes of loneliness and alienation in modern American life.',
    medium: 'Oil on canvas',
    dimensions: '84.1 cm × 152.4 cm',
    location: 'Art Institute of Chicago, Chicago',
    tags: ['American Realism', 'Modernism', 'Urban', 'Loneliness'],
  },
  {
    id: 'nature_starry_night',
    title: 'The Starry Night',
    artist: 'Vincent van Gogh',
    year: '1889',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/nature_starry_night.jpg',
    description: 'Painted from the window of his asylum room, this masterpiece is a turbulent and expressive depiction of a night sky over a quiet village. The swirling cypress tree, stars, and moon convey intense emotion.',
    medium: 'Oil on canvas',
    dimensions: '73.7 cm × 92.1 cm',
    location: 'Museum of Modern Art, New York',
    tags: ['Post-Impressionism', 'Landscape', 'Nocturne', 'Nature'],
  },
  {
    id: 'sea_the_great_wave',
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
    year: 'c. 1829–1833',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/sea_the_great_wave.jpg',
    description: 'A woodblock print that is one of the most recognized works of Japanese art in the world. It shows a massive, claw-like wave threatening boats off the coast, with Mount Fuji visible in the background.',
    medium: 'Woodblock print; ink and color on paper',
    dimensions: '25.7 cm × 37.8 cm',
    location: 'Metropolitan Museum of Art, New York (and others)',
    tags: ['Ukiyo-e', 'Japanese Art', 'Seascape', 'Nature'],
  },
];