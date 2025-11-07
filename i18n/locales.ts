export type Language = 'en' | 'de';

export type Locale = {
  [key: string]: string | Locale;
};

const en: Locale = {
  // General UI
  back: 'Back',
  cancel: 'Cancel',
  close: 'Close',
  create: 'Create',
  remove: 'Remove',
  retry: 'Retry',
  save: 'Save',

  // Views
  view: {
    workspace: 'Workspace',
    project: 'Project',
    discover: 'Discover',
    gallerysuite: 'Gallery Suite',
    gallery: 'Gallery',
    studio: 'Studio',
    journal: 'Journal',
    profile: 'Profile',
    setup: 'Settings',
    help: 'Help & About',
  },

  // Header
  header: {
    openCommandPalette: 'Open command palette',
  },

  // Loader
  loader: {
    generic: 'Loading Art-i-Fact...',
  },

  // Errors
  error: {
    api: {
      title: 'An Error Occurred',
    },
  },
  
  // Toasts
  toast: {
    error: {
      gemini: 'The AI assistant failed to respond. Please try again.',
      taskFailed: 'AI Task Failed',
    },
    share: {
      linkCopied: 'Shareable link copied to clipboard!',
    },
    project: {
      created: 'Project created successfully!',
      updated: 'Project details updated.',
      deleted: 'Project and its contents deleted.',
    },
    gallery: {
      deleted: 'Gallery deleted.',
      duplicated: 'Gallery duplicated successfully!',
    },
    artwork: {
      added: 'Artwork added to gallery.',
      addedAndCreated: 'Artwork added and new gallery created!',
    },
    profile: {
      updated: 'Profile updated.',
      featured: 'Featured gallery updated on your profile.',
    },
    settings: {
      exported: 'All data exported successfully!',
      imported: 'Data imported! The app will now reload.',
      importError: 'Failed to import data. The file may be corrupt.',
      reset: 'All application data has been reset.',
    }
  },

  // Confirmations
  confirm: {
    delete: {
      project: 'Are you sure you want to delete the project "{{title}}"? This will also delete all galleries and journal entries inside it. This action cannot be undone.',
      gallery: 'Are you sure you want to delete the gallery "{{title}}"? This action cannot be undone.',
      allData: 'Are you sure you want to delete ALL your data? This includes all projects, galleries, and settings. This action is irreversible.',
    }
  },

  // Welcome Portal
  welcome: {
    title: 'Welcome to Art-i-Fact',
    subtitle: 'Your Personal AI-Powered Art Curation Studio',
    cta: 'Start Creating',
  },

  // Discover / Art Library
  discover: {
    title: 'Discover Art',
    subtitle: 'Search public domain archives or find inspiration.',
    search: {
      placeholder: 'Search for artists, movements, or subjects...',
    },
    inspiration: 'Need inspiration?',
    featured: 'Featured Artworks',
    error: 'Failed to fetch artworks. Please check your connection and try again.',
    results: {
      title: 'Search Results for "{{query}}"',
      none: 'No results found.',
    }
  },

  // Featured Artworks
  featuredArtworks: {
    feat_1_title: 'The Starry Night',
    feat_1_desc: 'A famous oil on canvas painting by Dutch Post-Impressionist painter Vincent van Gogh.',
    feat_2_title: 'Mona Lisa',
    feat_2_desc: 'A half-length portrait painting by the Italian Renaissance artist Leonardo da Vinci that has been described as "the best known, the most visited, the most written about, the most sung about, the most parodied work of art in the world".',
    feat_3_title: 'The Persistence of Memory',
    feat_3_desc: 'A 1931 painting by artist Salvador Dalí, and one of his most recognizable works.',
    feat_4_title: 'The Great Wave off Kanagawa',
    feat_4_desc: 'A woodblock print by the Japanese ukiyo-e artist Hokusai. It is Hokusai\'s most famous work and one of the most recognizable works of Japanese art in the world.',
    feat_5_title: 'Girl with a Pearl Earring',
    feat_5_desc: 'An oil painting by Dutch Golden Age painter Johannes Vermeer. It is a tronie of a girl with a headscarf and a pearl earring.',
    feat_6_title: 'Wanderer above the Sea of Fog',
    feat_6_desc: 'A painting by the German Romantic artist Caspar David Friedrich. It has been considered one of the masterpieces of Romanticism and one of its most representative works.',
    feat_7_title: 'The Kiss',
    feat_7_desc: 'An oil-on-canvas painting with added gold leaf, silver and platinum by the Austrian Symbolist painter Gustav Klimt.',
    feat_8_title: 'American Gothic',
    feat_8_desc: 'A painting by Grant Wood in the collection of the Art Institute of Chicago. Wood was inspired to paint what is now known as the American Gothic House in Eldon, Iowa, along with "the kind of people I fancied should live in that house."',
    feat_9_title: 'The Scream',
    feat_9_desc: 'The popular name given to a composition created by Norwegian Expressionist artist Edvard Munch in 1893.',
    feat_10_title: 'Liberty Leading the People',
    feat_10_desc: 'A painting by Eugène Delacroix commemorating the July Revolution of 1830, which toppled King Charles X of France.',
    feat_11_title: 'The Birth of Venus',
    feat_11_desc: 'A painting by the Italian artist Sandro Botticelli, probably made in the mid-1480s. It depicts the goddess Venus arriving at the shore after her birth, when she had emerged from the sea fully-grown.',
    feat_12_title: 'Nighthawks',
    feat_12_desc: 'A 1942 oil on canvas painting by Edward Hopper that portrays four people in a downtown diner late at night as viewed through the diner\'s large glass window.'
  },

  // Workspace
  workspace: {
    title: 'Workspace',
    newProject: 'New Project',
    editProject: 'Edit Project "{{title}}"',
    empty: {
      title: 'Your Workspace is Empty',
      prompt: 'Create a Project to begin organizing your galleries and research.',
      button: 'Create First Project',
    },
    project: {
      creator: {
        title: {
          label: 'Project Title',
          placeholder: 'e.g., "Studies in Surrealism"',
        },
        description: {
          label: 'Project Description',
          placeholder: 'e.g., "An exploration of Dalí and his contemporaries."',
        },
      },
      galleries_one: '1 Gallery',
      galleries_other: '{{count}} Galleries',
      journals_one: '1 Journal Entry',
      journals_other: '{{count}} Journal Entries',
      notFound: {
        title: 'Project Not Found',
        message: 'The selected project could not be found. It may have been deleted.',
      }
    }
  },
  
  // Gallery
  gallery: {
    new: 'New Gallery',
    suite: {
        title: 'Gallery Suite',
    },
    status: {
      draft: 'Draft',
      published: 'Published',
    },
    creator: {
      title: {
        label: 'Gallery Title',
        placeholder: 'e.g., "The Persistence of Dreams"',
      },
      description: {
        label: 'Gallery Description / Curatorial Statement',
        placeholder: 'e.g., "A collection exploring the theme of time in surrealist art."',
      },
    },
    manager: {
        create: 'Create Gallery',
        artworkCount_one: '1 Artwork',
        artworkCount_other: '{{count}} Artworks',
        empty: {
            title: 'No Galleries Yet',
            prompt: 'Create your first gallery to start curating.',
        }
    },
    empty: {
      title: 'This Gallery is Empty',
      prompt: 'Find some art in the "Discover" tab to add to this collection.',
    },
    notFound: {
      title: 'Gallery Not Found',
      prompt: 'The selected gallery could not be found. It may have been deleted.',
    },
    actions: {
        critique: 'Get AI Critique',
        audioGuide: 'Generate Audio Guide',
        trailer: 'Generate Trailer (Veo)',
        share: 'Share / Export',
        exhibit: 'Exhibit',
        edit: 'Edit Details',
        duplicate: 'Duplicate',
        featureOnProfile: 'Feature on Profile',
    },
    editDetails: 'Edit Gallery "{{title}}"',
    critique: {
        modal: {
            title: 'Curatorial Critique',
            critique: 'Critique',
            suggestions: 'Suggestions',
        }
    },
    audioGuide: {
        modal: {
            title: 'Audio Guide Generated',
            message: 'The audio guide script has been generated and saved with this gallery. You can now use it in Exhibition Mode.',
            ok: 'Okay',
        }
    }
  },

  // Studio
  studio: {
    title: 'AI Studio',
    subtitle: 'Create original artworks with AI.',
    prompt: {
      label: 'Prompt',
      placeholder: 'A majestic cat in a spacesuit, oil painting, detailed',
      enhance: 'Enhance Prompt',
    },
    negativePrompt: {
      label: 'Negative Prompt (optional)',
      placeholder: 'e.g., blurry, text, watermark',
    },
    aspectRatio: 'Aspect Ratio',
    generate: 'Generate',
    inspiration: {
      title: 'Inspiration',
      prompt: 'Try a prompt',
      categories: {
        artisticStyles: 'Artistic Styles',
        themesAndConcepts: 'Themes & Concepts',
        impossibleMashups: 'Impossible Mashups',
      },
      prompts: {
        cubistPortrait: 'A cubist portrait of a person reading a book',
        impressionistLandscape: 'An impressionist landscape of a Parisian street in the rain',
        surrealistPainting: 'A surrealist painting of a clock melting on a tree branch',
        popArtCollage: 'A pop art collage of vintage advertisements',
        minimalistPhoto: 'A minimalist black and white photograph of a single leaf',
        abstractExpressionist: 'An abstract expressionist painting with bold, chaotic brushstrokes',
        rococoRobot: 'Rococo painting of a robot tea party in a lush garden',
        ukiyoEfuturistic: 'Ukiyo-e style print of a bustling futuristic city street',
        solitudeInCity: 'A visual representation of solitude in a bustling city',
        timeTravelNebula: 'The concept of time travel illustrated as a vibrant nebula',
        floatingCastle: 'A fantasy scene of a floating castle in the clouds',
        sciFiCityscape: 'A sci-fi cityscape with flying vehicles and neon signs',
        zenGarden: 'A peaceful scene of a zen garden with a koi pond',
        mythologicalBattle: 'A mythological battle between a dragon and a knight',
        nostalgiaDandelions: 'The feeling of nostalgia as a field of glowing dandelions',
        natureAndTechnology: 'The intersection of nature and technology, a bio-mechanical forest',
        astronautWhale: 'An astronaut riding a whale through the clouds',
        waterLibrary: 'A library where the books are made of flowing water',
        turtleCity: 'A city built inside a giant, ancient turtle shell',
        vanGoghOnMoon: 'Van Gogh painting Starry Night on the surface of the moon',
        steampunkAnimals: 'Steampunk animals operating a complex clockwork machine',
        medievalLaserSword: 'A medieval knight with a laser sword',
      }
    },
    remix: {
      title: 'Remix Artwork',
      prompt: 'Remix instructions',
      placeholder: 'e.g., change the background to a starry night',
      button: 'Remix',
    },
    result: {
      empty: 'Your generated artwork will appear here.',
      addToGallery: 'Add to Gallery',
    },
  },

  // Journal
  journal: {
    title: 'Research Journal',
    new: 'New Entry',
    getInsights: 'Get AI Insights',
    placeholder: 'Start writing your notes here... (Markdown supported)',
    selectPrompt: 'Select an entry to view or edit.',
    empty: {
      title: 'No Journal Entries',
      prompt: 'Create your first entry to start your research.',
    },
  },

  // Profile
  profile: {
    title: 'Curator Profile',
    edit: {
      button: 'Edit Profile',
      username: 'Username',
      bio: 'Bio',
      avatar: 'Avatar',
    },
    featuredGallery: 'Featured Gallery',
    stats: {
        galleries: 'Galleries Curated',
        discovered: 'Artworks Discovered',
        created: 'AI Artworks Created',
    },
    movements: {
        title: 'Favorite Movements',
        empty: 'Curate some art to see your favorite movements here.',
        other: 'Other',
    },
    palette: {
        title: 'Common Color Palette',
        empty: 'Curate some art to discover your preferred color palette.',
    },
    activity: {
        title: 'Recent Activity',
        empty: 'No recent activity.',
        galleryCreated: 'Created gallery',
        journalCreated: 'Started journal entry',
    },
    achievements: {
        title: 'Achievements',
        firstGallery: { name: 'First Steps', desc: 'Curated your first gallery.' },
        prolificCurator: { name: 'Prolific Curator', desc: 'Curated 5 or more galleries.' },
        aiPioneer: { name: 'AI Pioneer', desc: 'Created your first original artwork in the Studio.' },
        artHistorian: { name: 'Art Historian', desc: 'Wrote 3 or more journal entries.' },
        discoverer: { name: 'Discoverer', desc: 'Discovered 10 or more artworks.' },
    },
  },

  // Help
  help: {
    title: 'Help & About',
    glossary: {
        button: 'View Art History Glossary',
    },
    tutorial: {
      title: 'Quick Start Guide',
      step1: { title: '1. Create a Project', content: 'Use the <strong>Workspace</strong> to create projects. Each project is a dedicated space for your galleries and research notes.' },
      step2: { title: '2. Discover Art', content: 'Go to the <strong>Discover</strong> tab to search for public domain artworks. Click on any piece to see its details.' },
      step3: { title: '3. Curate a Gallery', content: 'From the artwork details, click "Add to Gallery". You can add to an existing gallery or create a new one on the fly.' },
      step4: { title: '4. Generate AI Art', content: 'Visit the <strong>Studio</strong> to create your own unique images. Experiment with prompts and add your creations to your galleries.' },
      step5: { title: '5. Research & Write', content: 'Use the <strong>Journal</strong> to take notes, draft ideas, or get AI-powered insights on any art-related topic.' },
      step6: { title: '6. Exhibit Your Work', content: 'Inside any gallery, click the <strong>Exhibit</strong> button to enter a full-screen, immersive slideshow mode.' },
    },
    tips: {
      title: 'Tips & Tricks',
      tip1: { title: 'Use the Command Palette', content: 'Press <strong>Ctrl+K</strong> (or <strong>Cmd+K</strong> on Mac) to open the command palette. It\'s the fastest way to navigate and perform actions.' },
      tip2: { title: 'Get AI-Powered Feedback', content: 'Inside a gallery, use the "Get AI Critique" feature to receive feedback on your curation and suggestions for improvement.' },
      tip3: { title: 'Enhance Your Prompts', content: 'In the AI Studio, use the "Enhance Prompt" button to let the AI improve your ideas for better image generation results.' },
      tip4: { title: 'Share Your Galleries', content: 'Use the "Share" button in a gallery to generate a special link that allows others to view your creation, even if they don\'t have the app.' },
    },
    faq: {
      title: 'Frequently Asked Questions',
      q1: { q: 'Where is my data stored?', a: 'All your data—projects, galleries, notes, and settings—is stored locally in your browser. It does not leave your device unless you explicitly export it.' },
      q2: { q: 'Can I use this on multiple devices?', a: 'Because data is stored locally, it will not automatically sync between devices. You can use the Export/Import feature in Settings to manually transfer your data.' },
      q3: { q: 'Is the AI free to use?', a: 'This application uses the Gemini API. Use of the API may be subject to usage limits and potential costs depending on the API provider\'s policies. Please refer to the Gemini documentation for details.' },
      q4: { q: 'How does the "Discover" feature work?', a: 'The Discover tab searches the Wikimedia Commons database, which contains millions of public domain and freely-licensed educational media files.' },
    },
    philosophy: {
      title: 'Our Philosophy',
      content: 'Art-i-Fact is designed to be a creative partner for art lovers, students, and curators. It blends human curation with the power of artificial intelligence to spark new ideas, deepen understanding, and provide new avenues for artistic expression. Your workspace is your own private museum, and you are the chief curator.'
    }
  },

  // Glossary
  glossary: {
    title: 'Art History Glossary',
    category: {
      techniques: 'Techniques & Mediums',
      eras: 'Movements & Eras',
      concepts: 'Core Concepts',
    },
    chiaroscuro: { term: 'Chiaroscuro', def: 'The use of strong contrasts between light and dark, usually bold contrasts affecting a whole composition. It is a hallmark of artists like Caravaggio and Rembrandt.' },
    impasto: { term: 'Impasto', def: 'A technique where paint is laid on an area of the surface in very thick layers, usually thick enough that the brush or painting-knife strokes are visible.' },
    sfumato: { term: 'Sfumato', def: 'A painting technique for softening the transition between colors, mimicking an area beyond what the human eye is focusing on. Leonardo da Vinci was a famous practitioner.' },
    tenebrism: { term: 'Tenebrism', def: 'A dramatic use of chiaroscuro, where the darkness becomes a dominating feature of the image. The style was developed to add drama to an image through a spotlight effect.' },
    pointillism: { term: 'Pointillism', def: 'A technique of painting in which small, distinct dots of color are applied in patterns to form an image. Georges Seurat and Paul Signac developed the technique.' },
    fresco: { term: 'Fresco', def: 'A mural painting technique that involves painting on freshly laid lime plaster with water-based pigments. The Sistine Chapel ceiling by Michelangelo is a famous example.' },
    renaissance: { term: 'Renaissance', def: 'A period in European history (c. 1400-1600) marking the transition from the Middle Ages to modernity, characterized by a revival of interest in classical antiquity.' },
    baroque: { term: 'Baroque', def: 'A highly ornate and often extravagant style of architecture, art, and music that flourished in Europe from the early 17th until the mid-18th century. It is characterized by drama, tension, and grandeur.' },
    rococo: { term: 'Rococo', def: 'An exceptionally ornamental and theatrical style of architecture, art and decoration which combines asymmetry, scrolling curves, and pastel colors. It is often described as the final expression of the Baroque movement.' },
    impressionism: { term: 'Impressionism', def: 'A 19th-century art movement characterized by relatively small, thin, yet visible brush strokes, open composition, and an emphasis on accurate depiction of light in its changing qualities.' },
    cubism: { term: 'Cubism', def: 'An early-20th-century avant-garde art movement that revolutionized European painting and sculpture. Objects are analyzed, broken up and reassembled in an abstracted form.' },
    surrealism: { term: 'Surrealism', def: 'A cultural movement which developed in Europe in the aftermath of World War I and was largely influenced by Dada. The movement is best known for its visual artworks and writings, which feature element of surprise and unexpected juxtapositions.' },
    popart: { term: 'Pop Art', def: 'An art movement that emerged in the United Kingdom and the United States during the mid- to late-1950s. The movement presented a challenge to traditions of fine art by including imagery from popular and mass culture, such as advertising and comic books.' },
    minimalism: { term: 'Minimalism', def: 'An art movement that began in post–World War II Western art. The movement is often interpreted as a reaction against abstract expressionism and modernism; it anticipates contemporary postminimal art practices.' },
    composition: { term: 'Composition', def: 'The placement or arrangement of visual elements in a work of art. It is the organization of the elements of art according to the principles of art.' },
    palette: { term: 'Palette', def: 'The range of colors used by a particular artist or in a particular picture.' },
    perspective: { term: 'Perspective', def: 'The art of drawing solid objects on a two-dimensional surface so as to give the right impression of their height, width, depth, and position in relation to each other when viewed from a particular point.' },
    iconography: { term: 'Iconography', def: 'The branch of art history which studies the identification, description, and the interpretation of the content of images: the subjects depicted, the particular compositions and details used to do so, and other elements that are distinct from artistic style.' },
  },

  // Modals
  modal: {
    details: {
      addToGallery: 'Add to Gallery',
      notes: 'Curator\'s Notes',
      palette: 'Dominant Colors',
    },
    addToGallery: {
      create: 'Create New Gallery',
      select: 'Or select an existing gallery',
      inProject: 'In This Project',
      other: 'Other Galleries',
      empty: 'You haven\'t created any galleries yet.',
    },
  },

  // Artwork Item
  artwork: {
    detailsLabel: 'View details for {{title}}',
    details: {
      deepDive: 'AI Deep Dive',
      findSimilar: 'Find Similar Art',
      chat: 'Chat about this art',
    }
  },
  
  // Exhibition Mode
  exhibition: {
    goToArtwork: 'Go to artwork {{number}}',
    transcript: 'Show/Hide Transcript',
    toggleFullscreen: 'Enter Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    curatedBy: 'Curated by {{username}}',
    aria: {
      play: 'Play Slideshow',
      pause: 'Pause Slideshow',
      previous: 'Previous Artwork',
      next: 'Next Artwork',
    },
    audioPlaying: 'Audio guide is active',
    audioMuted: 'Audio guide is muted',
  },

  // Camera Modal
  camera: {
    error: {
      access: 'Could not access the camera. Please ensure you have granted permission in your browser settings.',
    }
  },
  
  // Command Palette
  commandPalette: {
    placeholder: 'Type a command or search...',
    noResults: 'No commands found for "{{query}}"',
    sections: {
      general: 'General',
      navigation: 'Navigation',
      actions: 'Actions',
      language: 'Language'
    },
    actions: {
        setLangEn: 'Switch language to English',
        setLangDe: 'Switch language to German',
    }
  },
  
  // Share Modal
  shareModal: {
    modal: {
      link: {
        title: 'Share with a Link',
        description: 'Copy a special link to share a view-only version of this gallery with others. Their view will include your profile name.',
        copy: 'Copy Link',
      },
      export: {
        title: 'Export as File',
        description: 'Download a JSON file of this gallery. This file does not include image data and is meant for backup or use in other tools.',
        button: 'Export Gallery (.json)',
      }
    }
  },

  // VEO Modal
  veo: {
    modal: {
      title: 'API Key Required for Video Generation',
      description: 'The Veo model for video generation requires you to select your own API key. This is a one-time setup.',
      billingInfo: 'Please note that generating videos may incur costs on your Google Cloud project. For details, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" class="text-amber-500 hover:underline">Google AI billing documentation</a>.',
      selectKeyButton: 'Select API Key',
    }
  },

  // Settings
  settings: {
    title: 'Settings',
    about: {
      version: 'Version 1.0.0',
      license: 'All rights reserved.'
    },
    general: {
      title: 'General',
      theme: {
        label: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        toggleLight: 'Switch to Light Mode',
        toggleDark: 'Switch to Dark Mode',
      },
      language: {
        label: 'UI Language',
        desc: 'Changes the language of the application interface.',
        en: 'English',
        de: 'Deutsch (German)',
      },
      defaultView: {
        label: 'Default View on Startup',
        desc: 'Choose which screen to show when you open the app.',
      },
      compactMode: {
        label: 'Compact Mode',
        desc: 'Reduces spacing to show more content on screen.',
      },
      reduceMotion: {
        label: 'Reduce Motion',
        desc: 'Disables non-essential animations for a simpler experience.',
      },
      confirmDelete: {
        label: 'Confirm Deletions',
        desc: 'Show a confirmation dialog before deleting items.',
      },
    },
    ai: {
      title: 'AI Assistant',
      creativity: {
        label: 'AI Creativity Level',
        desc: 'Controls the randomness and "imagination" of the AI.',
        focused: 'Focused',
        balanced: 'Balanced',
        creative: 'Creative',
        custom: 'Custom',
      },
      temperature: { label: 'Temperature' },
      topP: { label: 'Top-P' },
      topK: { label: 'Top-K' },
      language: {
        label: 'AI Content Language',
        desc: 'The language for AI-generated content like critiques or deep dives.',
        ui: 'Match UI Language',
        en: 'English',
        de: 'German',
      },
      thinkingBudget: {
        label: 'AI "Thinking" Budget',
        desc: 'For complex tasks, allows the AI to use more processing time for better results (e.g., in Journal).',
      },
      stream: {
        label: 'Stream AI Responses',
        desc: 'Show AI responses as they are generated, word-by-word.',
      }
    },
    studio: {
      title: 'AI Studio',
      aspectRatio: {
        label: 'Default Aspect Ratio',
        desc: 'The default image shape for new AI generations.',
        '1:1': 'Square (1:1)',
        '3:4': 'Portrait (3:4)',
        '4:3': 'Landscape (4:3)',
        '9:16': 'Tall Portrait (9:16)',
        '16:9': 'Widescreen (16:9)',
      },
      enhancement: {
        label: 'Prompt Enhancement Style',
        desc: 'The style the AI uses when you ask it to enhance a prompt.',
        subtle: 'Subtle',
        descriptive: 'Descriptive',
        artistic: 'Artistic',
      },
      autoEnhance: {
        label: 'Auto-Enhance Prompts',
        desc: 'Automatically run your prompts through the enhancer before generating.',
      },
      clearPrompt: {
        label: 'Clear Prompt on Generate',
        desc: 'Start with a fresh, empty prompt after each generation.',
      },
      negPrompt: {
        label: 'Default Negative Prompt',
        desc: 'These terms will be automatically added to try and exclude them from generations.',
      },
      remixPrompt: {
        label: 'Default Remix Prompt',
        desc: 'The default starting instruction when you remix an image.',
      },
    },
    exhibit: {
      title: 'Exhibition Mode',
      speed: {
        label: 'Slideshow Speed',
        desc: 'How long each artwork is displayed in autoplay mode.',
      },
      transition: {
        label: 'Slideshow Transition',
        fade: 'Fade',
        slide: 'Slide',
        kenburns: 'Ken Burns (Zoom/Pan)',
      },
      background: {
        label: 'Exhibition Background',
        desc: 'The style of the background behind the artwork.',
        blur: 'Blurred Artwork',
        color: 'Solid Color',
        none: 'None',
      },
      showInfo: {
        label: 'Show Info Overlay',
        desc: 'Display artwork title and artist briefly during slideshow.',
      },
      showControls: {
        label: 'Show Controls on Hover',
        desc: 'Hide controls after a few seconds of inactivity.',
      },
      autoplay: {
        label: 'Autoplay on Start',
        desc: 'Automatically start the slideshow when entering exhibit mode.',
      },
      loop: {
        label: 'Loop Slideshow',
        desc: 'Automatically restart the slideshow after the last artwork.',
      },
      parallax: {
        label: 'Enable Parallax Effect',
        desc: 'Adds a subtle 3D effect to the artwork based on mouse/device movement.',
      }
    },
    audio: {
      title: 'Audio Guide',
      voice: {
        label: 'Text-to-Speech Voice',
        desc: 'The voice used for generated audio guides (browser dependent).',
      },
      speed: { label: 'Speech Speed' },
      pitch: { label: 'Speech Pitch' },
      volume: { label: 'Speech Volume' },
    },
    journal: {
      title: 'Journal',
      fontSize: {
        label: 'Editor Font Size',
        sm: 'Small',
        base: 'Medium',
        lg: 'Large',
      },
      autoSave: {
        label: 'Auto-Save Entries',
        desc: 'Automatically save your journal entries as you type.',
      },
      defaultTitle: {
        label: 'Default Entry Title',
        desc: 'The title used when creating a new journal entry.',
      },
    },
    profile: {
      title: 'Profile & Sharing',
      showActivity: {
        label: 'Show Activity Feed',
        desc: 'Display your recent activity on your profile page.',
      },
      showAchievements: {
        label: 'Show Achievements',
        desc: 'Display your earned achievements on your profile page.',
      },
    },
    data: {
      title: 'Data Management',
      export: {
        label: 'Export All Data',
        desc: 'Save all your projects, galleries, and settings to a JSON file.',
        button: 'Export Data',
      },
      import: {
        label: 'Import Data',
        desc: 'Load data from a previously exported JSON file. This will overwrite current data.',
        button: 'Import Data',
      },
      reset: {
        label: 'Reset Application',
        desc: 'Delete all your data and restore the application to its initial state. This cannot be undone.',
        button: 'Reset All Data',
      },
    },
  },
};

const de: Locale = {
  // General UI
  back: 'Zurück',
  cancel: 'Abbrechen',
  close: 'Schließen',
  create: 'Erstellen',
  remove: 'Entfernen',
  retry: 'Erneut versuchen',
  save: 'Speichern',

  // Views
  view: {
    workspace: 'Arbeitsbereich',
    project: 'Projekt',
    discover: 'Entdecken',
    gallerysuite: 'Galerien',
    gallery: 'Galerie',
    studio: 'Studio',
    journal: 'Journal',
    profile: 'Profil',
    setup: 'Einstellungen',
    help: 'Hilfe & Info',
  },

  // Header
  header: {
    openCommandPalette: 'Befehlspalette öffnen',
  },

  // Loader
  loader: {
    generic: 'Lade Art-i-Fact...',
  },

  // Errors
  error: {
    api: {
      title: 'Ein Fehler ist aufgetreten',
    },
  },
  
  // Toasts
  toast: {
    error: {
      gemini: 'Der KI-Assistent hat nicht geantwortet. Bitte erneut versuchen.',
      taskFailed: 'KI-Aufgabe fehlgeschlagen',
    },
    share: {
      linkCopied: 'Teilbarer Link in die Zwischenablage kopiert!',
    },
    project: {
      created: 'Projekt erfolgreich erstellt!',
      updated: 'Projektdetails aktualisiert.',
      deleted: 'Projekt und alle Inhalte gelöscht.',
    },
    gallery: {
      deleted: 'Galerie gelöscht.',
      duplicated: 'Galerie erfolgreich dupliziert!',
    },
    artwork: {
      added: 'Kunstwerk zur Galerie hinzugefügt.',
      addedAndCreated: 'Kunstwerk hinzugefügt und neue Galerie erstellt!',
    },
    profile: {
      updated: 'Profil aktualisiert.',
      featured: 'Vorgestellte Galerie im Profil aktualisiert.',
    },
    settings: {
      exported: 'Alle Daten erfolgreich exportiert!',
      imported: 'Daten importiert! Die App wird jetzt neu geladen.',
      importError: 'Import der Daten fehlgeschlagen. Die Datei ist möglicherweise beschädigt.',
      reset: 'Alle Anwendungsdaten wurden zurückgesetzt.',
    }
  },

  // Confirmations
  confirm: {
    delete: {
      project: 'Sind Sie sicher, dass Sie das Projekt "{{title}}" löschen möchten? Dadurch werden auch alle darin enthaltenen Galerien und Journaleinträge gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
      gallery: 'Sind Sie sicher, dass Sie die Galerie "{{title}}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      allData: 'Sind Sie sicher, dass Sie ALLE Ihre Daten löschen möchten? Dies umfasst alle Projekte, Galerien und Einstellungen. Diese Aktion ist unumkehrbar.',
    }
  },

  // Welcome Portal
  welcome: {
    title: 'Willkommen bei Art-i-Fact',
    subtitle: 'Ihr persönliches KI-gestütztes Kunstkurations-Studio',
    cta: 'Jetzt erstellen',
  },

  // Discover / Art Library
  discover: {
    title: 'Kunst entdecken',
    subtitle: 'Durchsuchen Sie Public-Domain-Archive oder finden Sie Inspiration.',
    search: {
      placeholder: 'Suchen Sie nach Künstlern, Bewegungen oder Themen...',
    },
    inspiration: 'Brauchen Sie Inspiration?',
    featured: 'Vorgestellte Kunstwerke',
    error: 'Abrufen der Kunstwerke fehlgeschlagen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
    results: {
      title: 'Suchergebnisse für "{{query}}"',
      none: 'Keine Ergebnisse gefunden.',
    }
  },

  // Featured Artworks
  featuredArtworks: {
    feat_1_title: 'Die Sternennacht',
    feat_1_desc: 'Ein berühmtes Ölgemälde auf Leinwand des niederländischen postimpressionistischen Malers Vincent van Gogh.',
    feat_2_title: 'Mona Lisa',
    feat_2_desc: 'Ein Porträtgemälde der italienischen Renaissance von Leonardo da Vinci, das als "das bekannteste, meistbesuchte, am meisten beschriebene, am meisten besungene und am meisten parodierte Kunstwerk der Welt" gilt.',
    feat_3_title: 'Die Beständigkeit der Erinnerung',
    feat_3_desc: 'Ein Gemälde des Künstlers Salvador Dalí aus dem Jahr 1931 und eines seiner bekanntesten Werke.',
    feat_4_title: 'Die große Welle vor Kanagawa',
    feat_4_desc: 'Ein Holzschnitt des japanischen Ukiyo-e-Künstlers Hokusai. Es ist Hokusais berühmtestes Werk und eines der bekanntesten Werke japanischer Kunst weltweit.',
    feat_5_title: 'Das Mädchen mit dem Perlenohrring',
    feat_5_desc: 'Ein Ölgemälde des niederländischen Malers des Goldenen Zeitalters, Johannes Vermeer. Es ist ein Tronie eines Mädchens mit einem Kopftuch und einem Perlenohrring.',
    feat_6_title: 'Der Wanderer über dem Nebelmeer',
    feat_6_desc: 'Ein Gemälde des deutschen Romantikers Caspar David Friedrich. Es gilt als eines der Meisterwerke der Romantik und als eines ihrer repräsentativsten Werke.',
    feat_7_title: 'Der Kuss',
    feat_7_desc: 'Ein Ölgemälde auf Leinwand mit Blattgold, Silber und Platin des österreichischen symbolistischen Malers Gustav Klimt.',
    feat_8_title: 'American Gothic',
    feat_8_desc: 'Ein Gemälde von Grant Wood in der Sammlung des Art Institute of Chicago. Wood wurde inspiriert, das heute als American Gothic House bekannte Haus in Eldon, Iowa, zusammen mit "der Art von Menschen, die ich mir vorstellte, die in diesem Haus leben sollten", zu malen.',
    feat_9_title: 'Der Schrei',
    feat_9_desc: 'Der populäre Name für eine Komposition des norwegischen expressionistischen Künstlers Edvard Munch aus dem Jahr 1893.',
    feat_10_title: 'Die Freiheit führt das Volk',
    feat_10_desc: 'Ein Gemälde von Eugène Delacroix zum Gedenken an die Julirevolution von 1830, die König Karl X. von Frankreich stürzte.',
    feat_11_title: 'Die Geburt der Venus',
    feat_11_desc: 'Ein Gemälde des italienischen Künstlers Sandro Botticelli, wahrscheinlich Mitte der 1480er Jahre entstanden. Es stellt die Göttin Venus dar, die nach ihrer Geburt am Ufer ankommt, nachdem sie ausgewachsen aus dem Meer gestiegen war.',
    feat_12_title: 'Nighthawks',
    feat_12_desc: 'Ein Ölgemälde auf Leinwand von Edward Hopper aus dem Jahr 1942, das vier Personen in einem Innenstadt-Diner spät in der Nacht darstellt, gesehen durch das große Glasfenster des Diners.'
  },

  // Workspace
  workspace: {
    title: 'Arbeitsbereich',
    newProject: 'Neues Projekt',
    editProject: 'Projekt "{{title}}" bearbeiten',
    empty: {
      title: 'Ihr Arbeitsbereich ist leer',
      prompt: 'Erstellen Sie ein Projekt, um Ihre Galerien und Recherchen zu organisieren.',
      button: 'Erstes Projekt erstellen',
    },
    project: {
      creator: {
        title: {
          label: 'Projekttitel',
          placeholder: 'z.B. "Studien zum Surrealismus"',
        },
        description: {
          label: 'Projektbeschreibung',
          placeholder: 'z.B. "Eine Untersuchung von Dalí und seinen Zeitgenossen."',
        },
      },
      galleries_one: '1 Galerie',
      galleries_other: '{{count}} Galerien',
      journals_one: '1 Journaleintrag',
      journals_other: '{{count}} Journaleinträge',
      notFound: {
        title: 'Projekt nicht gefunden',
        message: 'Das ausgewählte Projekt konnte nicht gefunden werden. Es wurde möglicherweise gelöscht.',
      }
    }
  },
  
  // Gallery
  gallery: {
    new: 'Neue Galerie',
    suite: {
        title: 'Galerien',
    },
    status: {
      draft: 'Entwurf',
      published: 'Veröffentlicht',
    },
    creator: {
      title: {
        label: 'Galerietitel',
        placeholder: 'z.B. "Die Beständigkeit der Träume"',
      },
      description: {
        label: 'Galeriebeschreibung / Kuratorisches Statement',
        placeholder: 'z.B. "Eine Sammlung, die das Thema Zeit in der surrealistischen Kunst untersucht."',
      },
    },
    manager: {
        create: 'Galerie erstellen',
        artworkCount_one: '1 Kunstwerk',
        artworkCount_other: '{{count}} Kunstwerke',
        empty: {
            title: 'Noch keine Galerien',
            prompt: 'Erstellen Sie Ihre erste Galerie, um mit dem Kuratieren zu beginnen.',
        }
    },
    empty: {
      title: 'Diese Galerie ist leer',
      prompt: 'Finden Sie Kunst im "Entdecken"-Tab, um sie dieser Sammlung hinzuzufügen.',
    },
    notFound: {
      title: 'Galerie nicht gefunden',
      prompt: 'Die ausgewählte Galerie konnte nicht gefunden werden. Sie wurde möglicherweise gelöscht.',
    },
    actions: {
        critique: 'KI-Kritik anfordern',
        audioGuide: 'Audioguide erstellen',
        trailer: 'Trailer erstellen (Veo)',
        share: 'Teilen / Exportieren',
        exhibit: 'Ausstellen',
        edit: 'Details bearbeiten',
        duplicate: 'Duplizieren',
        featureOnProfile: 'Im Profil zeigen',
    },
    editDetails: 'Galerie "{{title}}" bearbeiten',
    critique: {
        modal: {
            title: 'Kuratorische Kritik',
            critique: 'Kritik',
            suggestions: 'Vorschläge',
        }
    },
    audioGuide: {
        modal: {
            title: 'Audioguide erstellt',
            message: 'Das Audioguide-Skript wurde erstellt und mit dieser Galerie gespeichert. Sie können es jetzt im Ausstellungsmodus verwenden.',
            ok: 'Okay',
        }
    }
  },

  // Studio
  studio: {
    title: 'KI-Studio',
    subtitle: 'Erstellen Sie originelle Kunstwerke mit KI.',
    prompt: {
      label: 'Prompt',
      placeholder: 'Eine majestätische Katze im Raumanzug, Ölgemälde, detailliert',
      enhance: 'Prompt verbessern',
    },
    negativePrompt: {
      label: 'Negativer Prompt (optional)',
      placeholder: 'z.B. unscharf, Text, Wasserzeichen',
    },
    aspectRatio: 'Seitenverhältnis',
    generate: 'Generieren',
    inspiration: {
      title: 'Inspiration',
      prompt: 'Prompt versuchen',
      categories: {
        artisticStyles: 'Künstlerische Stile',
        themesAndConcepts: 'Themen & Konzepte',
        impossibleMashups: 'Unmögliche Kombinationen',
      },
      prompts: {
        cubistPortrait: 'Ein kubistisches Porträt einer Person, die ein Buch liest',
        impressionistLandscape: 'Eine impressionistische Landschaft einer Pariser Straße im Regen',
        surrealistPainting: 'Ein surrealistisches Gemälde einer Uhr, die auf einem Ast schmilzt',
        popArtCollage: 'Eine Pop-Art-Collage aus Vintage-Werbungen',
        minimalistPhoto: 'Ein minimalistisches Schwarz-Weiß-Foto eines einzelnen Blattes',
        abstractExpressionist: 'Ein abstrakt-expressionistisches Gemälde mit kühnen, chaotischen Pinselstrichen',
        rococoRobot: 'Rokoko-Gemälde einer Roboter-Teeparty in einem üppigen Garten',
        ukiyoEfuturistic: 'Druck im Ukiyo-e-Stil einer belebten futuristischen Stadtstraße',
        solitudeInCity: 'Eine visuelle Darstellung der Einsamkeit in einer geschäftigen Stadt',
        timeTravelNebula: 'Das Konzept der Zeitreise, dargestellt als lebendiger Nebel',
        floatingCastle: 'Eine Fantasieszene eines schwebenden Schlosses in den Wolken',
        sciFiCityscape: 'Ein Sci-Fi-Stadtbild mit fliegenden Fahrzeugen und Neonschildern',
        zenGarden: 'Eine friedliche Szene eines Zen-Gartens mit einem Koi-Teich',
        mythologicalBattle: 'Ein mythologischer Kampf zwischen einem Drachen und einem Ritter',
        nostalgiaDandelions: 'Das Gefühl der Nostalgie als ein Feld leuchtender Pusteblumen',
        natureAndTechnology: 'Die Schnittstelle von Natur und Technologie, ein biomechanischer Wald',
        astronautWhale: 'Ein Astronaut, der auf einem Wal durch die Wolken reitet',
        waterLibrary: 'Eine Bibliothek, in der die Bücher aus fließendem Wasser bestehen',
        turtleCity: 'Eine Stadt, die im Inneren eines riesigen, uralten Schildkrötenpanzers gebaut ist',
        vanGoghOnMoon: 'Van Gogh malt die Sternennacht auf der Mondoberfläche',
        steampunkAnimals: 'Steampunk-Tiere bedienen eine komplexe Uhrwerkmaschine',
        medievalLaserSword: 'Ein mittelalterlicher Ritter mit einem Laserschwert',
      }
    },
    remix: {
      title: 'Kunstwerk remixen',
      prompt: 'Remix-Anweisungen',
      placeholder: 'z.B. ändere den Hintergrund in einen Sternenhimmel',
      button: 'Remixen',
    },
    result: {
      empty: 'Ihr generiertes Kunstwerk erscheint hier.',
      addToGallery: 'Zur Galerie hinzufügen',
    },
  },

  // Journal
  journal: {
    title: 'Forschungsjournal',
    new: 'Neuer Eintrag',
    getInsights: 'KI-Einblicke erhalten',
    placeholder: 'Beginnen Sie hier mit Ihren Notizen... (Markdown wird unterstützt)',
    selectPrompt: 'Wählen Sie einen Eintrag zum Anzeigen oder Bearbeiten aus.',
    empty: {
      title: 'Keine Journaleinträge',
      prompt: 'Erstellen Sie Ihren ersten Eintrag, um mit Ihrer Recherche zu beginnen.',
    },
  },

  // Profile
  profile: {
    title: 'Kuratorprofil',
    edit: {
      button: 'Profil bearbeiten',
      username: 'Benutzername',
      bio: 'Biografie',
      avatar: 'Avatar',
    },
    featuredGallery: 'Vorgestellte Galerie',
    stats: {
        galleries: 'Kuratierte Galerien',
        discovered: 'Entdeckte Kunstwerke',
        created: 'KI-Kunstwerke erstellt',
    },
    movements: {
        title: 'Bevorzugte Strömungen',
        empty: 'Kuratiere Kunst, um deine Lieblingsströmungen hier zu sehen.',
        other: 'Andere',
    },
    palette: {
        title: 'Häufige Farbpalette',
        empty: 'Kuratiere Kunst, um deine bevorzugte Farbpalette zu entdecken.',
    },
    activity: {
        title: 'Letzte Aktivitäten',
        empty: 'Keine kürzlichen Aktivitäten.',
        galleryCreated: 'Galerie erstellt',
        journalCreated: 'Journaleintrag begonnen',
    },
    achievements: {
        title: 'Erfolge',
        firstGallery: { name: 'Erste Schritte', desc: 'Deine erste Galerie kuratiert.' },
        prolificCurator: { name: 'Produktiver Kurator', desc: '5 oder mehr Galerien kuratiert.' },
        aiPioneer: { name: 'KI-Pionier', desc: 'Dein erstes eigenes Kunstwerk im Studio erstellt.' },
        artHistorian: { name: 'Kunsthistoriker', desc: '3 oder mehr Journaleinträge verfasst.' },
        discoverer: { name: 'Entdecker', desc: '10 oder mehr Kunstwerke entdeckt.' },
    },
  },

  // Help
  help: {
    title: 'Hilfe & Info',
    glossary: {
        button: 'Kunsthistorisches Glossar ansehen',
    },
    tutorial: {
      title: 'Schnellstart-Anleitung',
      step1: { title: '1. Projekt erstellen', content: 'Nutzen Sie den <strong>Arbeitsbereich</strong>, um Projekte zu erstellen. Jedes Projekt ist ein dedizierter Raum für Ihre Galerien und Forschungsnotizen.' },
      step2: { title: '2. Kunst entdecken', content: 'Gehen Sie zum <strong>Entdecken</strong>-Tab, um nach gemeinfreien Kunstwerken zu suchen. Klicken Sie auf ein Werk, um Details anzuzeigen.' },
      step3: { title: '3. Galerie kuratieren', content: 'Klicken Sie in den Werkdetails auf "Zur Galerie hinzufügen". Sie können es zu einer bestehenden Galerie hinzufügen oder eine neue erstellen.' },
      step4: { title: '4. KI-Kunst generieren', content: 'Besuchen Sie das <strong>Studio</strong>, um Ihre eigenen einzigartigen Bilder zu erstellen. Experimentieren Sie mit Prompts und fügen Sie Ihre Kreationen Ihren Galerien hinzu.' },
      step5: { title: '5. Forschen & Schreiben', content: 'Nutzen Sie das <strong>Journal</strong>, um Notizen zu machen, Ideen zu entwerfen oder KI-gestützte Einblicke zu jedem kunstbezogenen Thema zu erhalten.' },
      step6: { title: '6. Ihre Arbeit ausstellen', content: 'Klicken Sie in einer Galerie auf den <strong>Ausstellen</strong>-Button, um einen immersiven Vollbild-Diashow-Modus zu starten.' },
    },
    tips: {
      title: 'Tipps & Tricks',
      tip1: { title: 'Befehlspalette nutzen', content: 'Drücken Sie <strong>Strg+K</strong> (oder <strong>Cmd+K</strong> auf dem Mac), um die Befehlspalette zu öffnen. Das ist der schnellste Weg, um zu navigieren und Aktionen auszuführen.' },
      tip2: { title: 'KI-Feedback erhalten', content: 'Nutzen Sie in einer Galerie die Funktion "KI-Kritik anfordern", um Feedback zu Ihrer Kuration und Verbesserungsvorschläge zu erhalten.' },
      tip3: { title: 'Prompts verbessern', content: 'Im KI-Studio können Sie den "Prompt verbessern"-Button verwenden, um die KI Ihre Ideen für bessere Bildergebnisse optimieren zu lassen.' },
      tip4: { title: 'Galerien teilen', content: 'Verwenden Sie den "Teilen"-Button in einer Galerie, um einen speziellen Link zu generieren, mit dem andere Ihre Kreation ansehen können, auch ohne die App.' },
    },
    faq: {
      title: 'Häufig gestellte Fragen',
      q1: { q: 'Wo werden meine Daten gespeichert?', a: 'Alle Ihre Daten – Projekte, Galerien, Notizen und Einstellungen – werden lokal in Ihrem Browser gespeichert. Sie verlassen Ihr Gerät nicht, es sei denn, Sie exportieren sie explizit.' },
      q2: { q: 'Kann ich dies auf mehreren Geräten verwenden?', a: 'Da die Daten lokal gespeichert werden, werden sie nicht automatisch zwischen Geräten synchronisiert. Sie können die Export/Import-Funktion in den Einstellungen verwenden, um Ihre Daten manuell zu übertragen.' },
      q3: { q: 'Ist die Nutzung der KI kostenlos?', a: 'Diese Anwendung verwendet die Gemini API. Die Nutzung der API kann je nach den Richtlinien des API-Anbieters Nutzungslimits und potenziellen Kosten unterliegen. Bitte konsultieren Sie die Gemini-Dokumentation für Details.' },
      q4: { q: 'Wie funktioniert die "Entdecken"-Funktion?', a: 'Der Entdecken-Tab durchsucht die Datenbank von Wikimedia Commons, die Millionen von gemeinfreien und frei lizenzierten Bildungsmedien enthält.' },
    },
    philosophy: {
      title: 'Unsere Philosophie',
      content: 'Art-i-Fact ist als kreativer Partner für Kunstliebhaber, Studenten und Kuratoren konzipiert. Es verbindet menschliche Kuration mit der Kraft der künstlichen Intelligenz, um neue Ideen zu entfachen, das Verständnis zu vertiefen und neue Wege für den künstlerischen Ausdruck zu eröffnen. Ihr Arbeitsbereich ist Ihr eigenes privates Museum, und Sie sind der Chefkurator.'
    }
  },

  // Glossary
  glossary: {
    title: 'Kunsthistorisches Glossar',
    category: {
      techniques: 'Techniken & Medien',
      eras: 'Strömungen & Epochen',
      concepts: 'Grundbegriffe',
    },
    chiaroscuro: { term: 'Chiaroscuro', def: 'Die Verwendung starker Kontraste zwischen Hell und Dunkel, meist kühne Kontraste, die eine ganze Komposition beeinflussen. Es ist ein Markenzeichen von Künstlern wie Caravaggio und Rembrandt.' },
    impasto: { term: 'Impasto', def: 'Eine Technik, bei der Farbe in sehr dicken Schichten auf eine Oberfläche aufgetragen wird, meist so dick, dass die Pinsel- oder Spachtelstriche sichtbar sind.' },
    sfumato: { term: 'Sfumato', def: 'Eine Maltechnik zur Erweichung des Übergangs zwischen Farben, die einen Bereich nachahmt, der außerhalb des Fokus des menschlichen Auges liegt. Leonardo da Vinci war ein berühmter Anwender.' },
    tenebrism: { term: 'Tenebrismus', def: 'Eine dramatische Anwendung von Chiaroscuro, bei der die Dunkelheit zu einem dominierenden Merkmal des Bildes wird. Der Stil wurde entwickelt, um einem Bild durch einen Scheinwerfereffekt Dramatik zu verleihen.' },
    pointillism: { term: 'Pointillismus', def: 'Eine Maltechnik, bei der kleine, deutliche Farbpunkte in Mustern aufgetragen werden, um ein Bild zu formen. Georges Seurat und Paul Signac entwickelten die Technik.' },
    fresco: { term: 'Fresko', def: 'Eine Wandmaltechnik, bei der mit wasserbasierten Pigmenten auf frisch aufgetragenen Kalkputz gemalt wird. Die Decke der Sixtinischen Kapelle von Michelangelo ist ein berühmtes Beispiel.' },
    renaissance: { term: 'Renaissance', def: 'Eine Periode der europäischen Geschichte (ca. 1400-1600), die den Übergang vom Mittelalter zur Neuzeit markiert und durch ein wiederbelebtes Interesse an der klassischen Antike gekennzeichnet ist.' },
    baroque: { term: 'Barock', def: 'Ein sehr kunstvoller und oft extravaganter Stil in Architektur, Kunst und Musik, der in Europa vom frühen 17. bis Mitte des 18. Jahrhunderts blühte. Er ist durch Drama, Spannung und Pracht gekennzeichnet.' },
    rococo: { term: 'Rokoko', def: 'Ein außergewöhnlich ornamentaler und theatralischer Stil in Architektur, Kunst und Dekoration, der Asymmetrie, geschwungene Kurven und Pastellfarben kombiniert. Er wird oft als der letzte Ausdruck der Barockbewegung beschrieben.' },
    impressionism: { term: 'Impressionismus', def: 'Eine Kunstbewegung des 19. Jahrhunderts, die durch relativ kleine, dünne, aber sichtbare Pinselstriche, eine offene Komposition und eine Betonung der genauen Darstellung des Lichts in seinen wechselnden Qualitäten gekennzeichnet ist.' },
    cubism: { term: 'Kubismus', def: 'Eine Avantgarde-Kunstbewegung des frühen 20. Jahrhunderts, die die europäische Malerei und Skulptur revolutionierte. Objekte werden analysiert, zerlegt und in einer abstrahierten Form wieder zusammengesetzt.' },
    surrealism: { term: 'Surrealismus', def: 'Eine kulturelle Bewegung, die sich in Europa nach dem Ersten Weltkrieg entwickelte und stark vom Dadaismus beeinflusst war. Die Bewegung ist am besten für ihre visuellen Kunstwerke und Schriften bekannt, die Überraschungselemente und unerwartete Gegenüberstellungen aufweisen.' },
    popart: { term: 'Pop-Art', def: 'Eine Kunstbewegung, die in den mittleren bis späten 1950er Jahren im Vereinigten Königreich und in den Vereinigten Staaten entstand. Die Bewegung stellte eine Herausforderung für die Traditionen der bildenden Kunst dar, indem sie Bilder aus der Populär- und Massenkultur wie Werbung und Comics einbezog.' },
    minimalism: { term: 'Minimalismus', def: 'Eine Kunstbewegung, die in der westlichen Kunst nach dem Zweiten Weltkrieg begann. Die Bewegung wird oft als Reaktion auf den abstrakten Expressionismus und die Moderne interpretiert; sie nimmt zeitgenössische postminimale Kunstpraktiken vorweg.' },
    composition: { term: 'Komposition', def: 'Die Platzierung oder Anordnung visueller Elemente in einem Kunstwerk. Es ist die Organisation der Elemente der Kunst nach den Prinzipien der Kunst.' },
    palette: { term: 'Palette', def: 'Die Bandbreite der Farben, die von einem bestimmten Künstler oder in einem bestimmten Bild verwendet werden.' },
    perspective: { term: 'Perspektive', def: 'Die Kunst, feste Objekte auf einer zweidimensionalen Oberfläche so zu zeichnen, dass der richtige Eindruck von ihrer Höhe, Breite, Tiefe und Position zueinander entsteht, wenn sie von einem bestimmten Punkt aus betrachtet werden.' },
    iconography: { term: 'Ikonographie', def: 'Der Zweig der Kunstgeschichte, der sich mit der Identifizierung, Beschreibung und Interpretation des Inhalts von Bildern befasst: die dargestellten Sujets, die besonderen Kompositionen und Details, die dafür verwendet werden, und andere Elemente, die sich vom künstlerischen Stil unterscheiden.' },
  },

  // Modals
  modal: {
    details: {
      addToGallery: 'Zur Galerie hinzufügen',
      notes: 'Notizen des Kurators',
      palette: 'Dominante Farben',
    },
    addToGallery: {
      create: 'Neue Galerie erstellen',
      select: 'Oder eine bestehende Galerie auswählen',
      inProject: 'In diesem Projekt',
      other: 'Andere Galerien',
      empty: 'Sie haben noch keine Galerien erstellt.',
    },
  },

  // Artwork Item
  artwork: {
    detailsLabel: 'Details für {{title}} anzeigen',
    details: {
      deepDive: 'KI-Tiefenanalyse',
      findSimilar: 'Ähnliche Kunst finden',
      chat: 'Über diese Kunst chatten',
    }
  },
  
  // Exhibition Mode
  exhibition: {
    goToArtwork: 'Zu Kunstwerk {{number}} gehen',
    transcript: 'Transkript ein-/ausblenden',
    toggleFullscreen: 'Vollbildmodus aktivieren',
    exitFullscreen: 'Vollbildmodus beenden',
    curatedBy: 'Kuratiert von {{username}}',
    aria: {
      play: 'Diashow abspielen',
      pause: 'Diashow anhalten',
      previous: 'Voriges Kunstwerk',
      next: 'Nächstes Kunstwerk',
    },
    audioPlaying: 'Audioguide ist aktiv',
    audioMuted: 'Audioguide ist stummgeschaltet',
  },

  // Camera Modal
  camera: {
    error: {
      access: 'Zugriff auf die Kamera fehlgeschlagen. Bitte stellen Sie sicher, dass Sie die Berechtigung in Ihren Browsereinstellungen erteilt haben.',
    }
  },
  
  // Command Palette
  commandPalette: {
    placeholder: 'Befehl eingeben oder suchen...',
    noResults: 'Keine Befehle für "{{query}}" gefunden',
    sections: {
      general: 'Allgemein',
      navigation: 'Navigation',
      actions: 'Aktionen',
      language: 'Sprache'
    },
    actions: {
        setLangEn: 'Sprache auf Englisch umstellen',
        setLangDe: 'Sprache auf Deutsch umstellen',
    }
  },
  
  // Share Modal
  shareModal: {
    modal: {
      link: {
        title: 'Mit einem Link teilen',
        description: 'Kopieren Sie einen speziellen Link, um eine schreibgeschützte Version dieser Galerie mit anderen zu teilen. Deren Ansicht enthält Ihren Profilnamen.',
        copy: 'Link kopieren',
      },
      export: {
        title: 'Als Datei exportieren',
        description: 'Laden Sie eine JSON-Datei dieser Galerie herunter. Diese Datei enthält keine Bilddaten und ist für Backups oder die Verwendung in anderen Tools gedacht.',
        button: 'Galerie exportieren (.json)',
      }
    }
  },

  // VEO Modal
  veo: {
    modal: {
      title: 'API-Schlüssel für Videogenerierung erforderlich',
      description: 'Das Veo-Modell zur Videogenerierung erfordert die Auswahl Ihres eigenen API-Schlüssels. Dies ist eine einmalige Einrichtung.',
      billingInfo: 'Bitte beachten Sie, dass das Generieren von Videos Kosten in Ihrem Google Cloud-Projekt verursachen kann. Details finden Sie in der <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" class="text-amber-500 hover:underline">Google AI Abrechnungsdokumentation</a>.',
      selectKeyButton: 'API-Schlüssel auswählen',
    }
  },

  // Settings
  settings: {
    title: 'Einstellungen',
    about: {
      version: 'Version 1.0.0',
      license: 'Alle Rechte vorbehalten.'
    },
    general: {
      title: 'Allgemein',
      theme: {
        label: 'Thema',
        light: 'Hell',
        dark: 'Dunkel',
        system: 'System',
        lightMode: 'Heller Modus',
        darkMode: 'Dunkler Modus',
        toggleLight: 'Zum hellen Modus wechseln',
        toggleDark: 'Zum dunklen Modus wechseln',
      },
      language: {
        label: 'UI-Sprache',
        desc: 'Ändert die Sprache der Benutzeroberfläche der Anwendung.',
        en: 'English (Englisch)',
        de: 'Deutsch',
      },
      defaultView: {
        label: 'Standardansicht beim Start',
        desc: 'Wählen Sie den Bildschirm, der beim Öffnen der App angezeigt wird.',
      },
      compactMode: {
        label: 'Kompakter Modus',
        desc: 'Reduziert den Abstand, um mehr Inhalt auf dem Bildschirm anzuzeigen.',
      },
      reduceMotion: {
        label: 'Bewegung reduzieren',
        desc: 'Deaktiviert nicht wesentliche Animationen für ein einfacheres Erlebnis.',
      },
      confirmDelete: {
        label: 'Löschungen bestätigen',
        desc: 'Vor dem Löschen von Elementen einen Bestätigungsdialog anzeigen.',
      },
    },
    ai: {
      title: 'KI-Assistent',
      creativity: {
        label: 'KI-Kreativitätsstufe',
        desc: 'Steuert die Zufälligkeit und "Fantasie" der KI.',
        focused: 'Fokussiert',
        balanced: 'Ausgewogen',
        creative: 'Kreativ',
        custom: 'Benutzerdefiniert',
      },
      temperature: { label: 'Temperatur' },
      topP: { label: 'Top-P' },
      topK: { label: 'Top-K' },
      language: {
        label: 'KI-Inhaltssprache',
        desc: 'Die Sprache für von der KI generierte Inhalte wie Kritiken oder Tiefenanalysen.',
        ui: 'UI-Sprache anpassen',
        en: 'Englisch',
        de: 'Deutsch',
      },
      thinkingBudget: {
        label: 'KI-"Denk"-Budget',
        desc: 'Ermöglicht der KI bei komplexen Aufgaben mehr Verarbeitungszeit für bessere Ergebnisse (z.B. im Journal).',
      },
      stream: {
        label: 'KI-Antworten streamen',
        desc: 'Zeigt KI-Antworten an, während sie Wort für Wort generiert werden.',
      }
    },
    studio: {
      title: 'KI-Studio',
      aspectRatio: {
        label: 'Standard-Seitenverhältnis',
        desc: 'Die Standardbildform für neue KI-Generationen.',
        '1:1': 'Quadrat (1:1)',
        '3:4': 'Hochformat (3:4)',
        '4:3': 'Querformat (4:3)',
        '9:16': 'Hohes Hochformat (9:16)',
        '16:9': 'Breitbild (16:9)',
      },
      enhancement: {
        label: 'Prompt-Verbesserungsstil',
        desc: 'Der Stil, den die KI verwendet, wenn Sie sie bitten, einen Prompt zu verbessern.',
        subtle: 'Subtil',
        descriptive: 'Beschreibend',
        artistic: 'Künstlerisch',
      },
      autoEnhance: {
        label: 'Prompts automatisch verbessern',
        desc: 'Führt Ihre Prompts vor der Generierung automatisch durch den Verbesserer.',
      },
      clearPrompt: {
        label: 'Prompt nach Generierung leeren',
        desc: 'Nach jeder Generierung mit einem frischen, leeren Prompt beginnen.',
      },
      negPrompt: {
        label: 'Standard-Negativ-Prompt',
        desc: 'Diese Begriffe werden automatisch hinzugefügt, um zu versuchen, sie von den Generierungen auszuschließen.',
      },
      remixPrompt: {
        label: 'Standard-Remix-Prompt',
        desc: 'Die standardmäßige Startanweisung, wenn Sie ein Bild remixen.',
      },
    },
    exhibit: {
      title: 'Ausstellungsmodus',
      speed: {
        label: 'Diashow-Geschwindigkeit',
        desc: 'Wie lange jedes Kunstwerk im Autoplay-Modus angezeigt wird.',
      },
      transition: {
        label: 'Diashow-Übergang',
        fade: 'Überblenden',
        slide: 'Schieben',
        kenburns: 'Ken Burns (Zoom/Schwenken)',
      },
      background: {
        label: 'Ausstellungshintergrund',
        desc: 'Der Stil des Hintergrunds hinter dem Kunstwerk.',
        blur: 'Verschwommenes Kunstwerk',
        color: 'Einfarbig',
        none: 'Keiner',
      },
      showInfo: {
        label: 'Info-Overlay anzeigen',
        desc: 'Zeigt während der Diashow kurz den Titel und Künstler des Kunstwerks an.',
      },
      showControls: {
        label: 'Steuerung bei Hover anzeigen',
        desc: 'Steuerelemente nach einigen Sekunden Inaktivität ausblenden.',
      },
      autoplay: {
        label: 'Autoplay beim Start',
        desc: 'Startet die Diashow automatisch beim Betreten des Ausstellungsmodus.',
      },
      loop: {
        label: 'Diashow wiederholen',
        desc: 'Startet die Diashow nach dem letzten Kunstwerk automatisch neu.',
      },
      parallax: {
        label: 'Parallax-Effekt aktivieren',
        desc: 'Fügt dem Kunstwerk einen subtilen 3D-Effekt hinzu, der auf Maus-/Gerätebewegungen basiert.',
      }
    },
    audio: {
      title: 'Audioguide',
      voice: {
        label: 'Text-zu-Sprache-Stimme',
        desc: 'Die für generierte Audioguides verwendete Stimme (browserabhängig).',
      },
      speed: { label: 'Sprechgeschwindigkeit' },
      pitch: { label: 'Sprechtonhöhe' },
      volume: { label: 'Sprechlautstärke' },
    },
    journal: {
      title: 'Journal',
      fontSize: {
        label: 'Editor-Schriftgröße',
        sm: 'Klein',
        base: 'Mittel',
        lg: 'Groß',
      },
      autoSave: {
        label: 'Einträge automatisch speichern',
        desc: 'Speichert Ihre Journaleinträge automatisch während des Tippens.',
      },
      defaultTitle: {
        label: 'Standard-Eintragstitel',
        desc: 'Der Titel, der beim Erstellen eines neuen Journaleintrags verwendet wird.',
      },
    },
    profile: {
      title: 'Profil & Teilen',
      showActivity: {
        label: 'Aktivitätsfeed anzeigen',
        desc: 'Zeigt Ihre letzten Aktivitäten auf Ihrer Profilseite an.',
      },
      showAchievements: {
        label: 'Erfolge anzeigen',
        desc: 'Zeigt Ihre errungenen Erfolge auf Ihrer Profilseite an.',
      },
    },
    data: {
      title: 'Datenverwaltung',
      export: {
        label: 'Alle Daten exportieren',
        desc: 'Speichern Sie all Ihre Projekte, Galerien und Einstellungen in einer JSON-Datei.',
        button: 'Daten exportieren',
      },
      import: {
        label: 'Daten importieren',
        desc: 'Laden Sie Daten aus einer zuvor exportierten JSON-Datei. Dies überschreibt die aktuellen Daten.',
        button: 'Daten importieren',
      },
      reset: {
        label: 'Anwendung zurücksetzen',
        desc: 'Löschen Sie all Ihre Daten und setzen Sie die Anwendung auf den Anfangszustand zurück. Dies kann nicht rückgängig gemacht werden.',
        button: 'Alle Daten zurücksetzen',
      },
    },
  },
};

export const locales = { en, de };