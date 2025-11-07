export interface InspirationCategory {
  categoryKey: string;
  promptKeys: string[];
}

export interface InspirationPrompt {
  label: string;
  prompt: string;
}

export const studioInspirationPrompts: InspirationCategory[] = [
  {
    categoryKey: 'artisticStyles',
    promptKeys: [
      'cubistPortrait',
      'impressionistLandscape',
      'surrealistPainting',
      'popArtCollage',
      'minimalistPhoto',
      'abstractExpressionist',
      'rococoRobot',
      'ukiyoEfuturistic',
    ],
  },
  {
    categoryKey: 'themesAndConcepts',
    promptKeys: [
      'solitudeInCity',
      'timeTravelNebula',
      'floatingCastle',
      'sciFiCityscape',
      'zenGarden',
      'mythologicalBattle',
      'nostalgiaDandelions',
      'natureAndTechnology',
    ],
  },
  {
    categoryKey: 'impossibleMashups',
    promptKeys: [
      'astronautWhale',
      'waterLibrary',
      'turtleCity',
      'vanGoghOnMoon',
      'steampunkAnimals',
      'medievalLaserSword',
    ]
  }
];

export const discoverInspirationPrompts: InspirationPrompt[] = [
    // Movements
    { label: 'Impressionism', prompt: 'Impressionism' },
    { label: 'Cubism', prompt: 'Cubism' },
    { label: 'Surrealism', prompt: 'Surrealism' },
    { label: 'Baroque', prompt: 'Baroque painting' },
    { label: 'Renaissance', prompt: 'High Renaissance art' },
    { label: 'Pop Art', prompt: 'Pop Art' },
    { label: 'Abstract Expressionism', prompt: 'Abstract Expressionism' },
    // Techniques
    { label: 'Chiaroscuro', prompt: 'Chiaroscuro technique in painting' },
    { label: 'Impasto', prompt: 'Impasto oil painting' },
    { label: 'Ukiyo-e', prompt: 'Japanese Ukiyo-e woodblock prints' },
    // Subjects
    { label: 'Landscapes', prompt: 'Landscape painting' },
    { label: 'Portraits', prompt: 'Portraiture' },
    { label: 'Mythology', prompt: 'Mythological scenes in art' },
    { label: 'Still Life', prompt: 'Still life painting' },
    // Artists (as examples)
    { label: 'van Gogh', prompt: 'Vincent van Gogh' },
    { label: 'da Vinci', prompt: 'Leonardo da Vinci' },
    { label: 'Rembrandt', prompt: 'Rembrandt van Rijn' },
    { label: 'Monet', prompt: 'Claude Monet' },
];