// FIX: Implemented full content for the themeArtworks data file.
import { Artwork } from '../../types';

export const themeArtworks: Artwork[] = [
  {
    id: 'mythology_birth_of_venus',
    title: 'The Birth of Venus',
    artist: 'Sandro Botticelli',
    year: 'c. 1484–1486',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/mythology_birth_of_venus.jpg',
    description: 'A landmark of the Italian Renaissance, this painting depicts the goddess Venus arriving at the shore after her birth, when she had emerged from the sea fully-grown. It is a celebration of beauty and mythological themes.',
    medium: 'Tempera on canvas',
    dimensions: '172.5 cm × 278.5 cm',
    location: 'Uffizi Gallery, Florence',
    tags: ['Italian Renaissance', 'Mythology', 'Nude', 'Allegory'],
  },
  {
    id: 'portrait_girl_with_a_pearl_earring',
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: 'c. 1665',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/portrait_girl_with_a_pearl_earring.jpg',
    description: 'Often called the "Mona Lisa of the North," this captivating portrait (a "tronie") shows a European girl wearing an exotic dress, an oriental turban, and a large pearl earring. Her enigmatic expression has fascinated viewers for centuries.',
    medium: 'Oil on canvas',
    dimensions: '44.5 cm × 39 cm',
    location: 'Mauritshuis, The Hague',
    tags: ['Dutch Golden Age', 'Baroque', 'Portrait', 'Tronie'],
  },
  {
    id: 'still_life_sunflowers',
    title: 'Sunflowers',
    artist: 'Vincent van Gogh',
    year: '1888',
    imageUrl: 'https://storage.googleapis.com/gen-ai-samples/story-vision/still_life_sunflowers.jpg',
    description: 'Part of a series of still life paintings, this work depicts a vase of sunflowers in various stages of life. Van Gogh used a vibrant yellow palette and expressive brushwork to convey his feelings about life and nature.',
    medium: 'Oil on canvas',
    dimensions: '92.1 cm × 73 cm',
    location: 'National Gallery, London',
    tags: ['Post-Impressionism', 'Still Life', 'Floral', 'Symbolism'],
  },
];