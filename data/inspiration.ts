export interface InspirationCategory {
  category: string;
  prompts: string[];
}

export interface InspirationPrompt {
  label: string;
  prompt: string;
}

export const studioInspirationPrompts: InspirationCategory[] = [
  {
    category: 'Artistic Styles',
    prompts: [
      'A cubist portrait of a person reading a book',
      'An impressionist landscape of a Parisian street in the rain',
      'A surrealist painting of a clock melting on a tree branch',
      'A pop art collage of vintage advertisements',
      'A minimalist black and white photograph of a single leaf',
      'An abstract expressionist painting with bold, chaotic brushstrokes',
      'Rococo painting of a robot tea party in a lush garden',
      'Ukiyo-e style print of a bustling futuristic city street',
    ],
  },
  {
    category: 'Themes & Concepts',
    prompts: [
      'A visual representation of solitude in a bustling city',
      'The concept of time travel illustrated as a vibrant nebula',
      'A fantasy scene of a floating castle in the clouds',
      'A sci-fi cityscape with flying vehicles and neon signs',
      'A peaceful scene of a zen garden with a koi pond',
      'A mythological battle between a dragon and a knight',
      'The feeling of nostalgia as a field of glowing dandelions',
      'The intersection of nature and technology, a bio-mechanical forest',
    ],
  },
  {
    category: 'Impossible Mashups',
    prompts: [
      'An astronaut riding a whale through the clouds',
      'A library where the books are made of flowing water',
      'A city built inside a giant, ancient turtle shell',
      'Van Gogh painting Starry Night on the surface of the moon',
      'Steampunk animals operating a complex clockwork machine',
      'A medieval knight with a laser sword',
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