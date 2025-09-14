
export type Language = 'en' | 'de';

export interface Locale {
  [key: string]: string | Locale;
}

const en: Locale = {
  // General
  back: 'Back',
  save: 'Save',
  cancel: 'Cancel',
  create: 'Create',
  remove: 'Remove',
  close: 'Close',
  retry: 'Retry',
  generate: 'Generate',
  
  // Views
  view: {
    workspace: 'Workspace',
    discover: 'Discover',
    studio: 'AI Studio',
    journal: 'Journal',
    profile: 'Profile',
    setup: 'Settings',
    help: 'Help & About',
    project: 'Project',
    gallery: 'Gallery',
    community: 'Community',
  },

  // Profile
  profile: {
      title: "Curator's Profile",
      stats: {
          galleries: 'Galleries Curated',
          discovered: 'Artworks Discovered',
          created: 'AI Artworks Created',
      }
  },

  // Errors
  error: {
    api: {
      title: 'AI Assistant Error',
      message: 'The AI assistant encountered an issue. Please check your connection and try again.'
    }
  },
  
  // Toasts
  toast: {
      settings: {
          reset: 'Settings have been reset to default.',
          exported: 'Your data has been successfully exported.',
          imported: 'Data imported successfully! The app will now reload.',
          importError: 'Error importing data. The file might be corrupt.'
      },
      artwork: {
          added: 'Artwork added to "{{gallery}}".'
      },
      journal: {
          deleted: 'Journal entry deleted.'
      },
      share: {
          linkCopied: 'Shareable link copied to clipboard.'
      },
      studio: {
        promptEnhanced: 'Prompt enhanced successfully!'
      },
      gallery: {
        imported: 'Gallery "{{title}}" imported successfully!'
      },
      error: {
        gemini: "Gemini API request failed."
      }
  },
  
  artwork: {
    detailsLabel: 'View details for {{title}}',
    moveUp: 'Move {{title}} up in order',
    moveDown: 'Move {{title}} down in order',
  },
  modal: {
    details: {
      palette: 'Dominant Colors',
      notes: "Curator's Notes",
      'notes.placeholder': "Add your personal notes and interpretation here...",
      attribution: 'Attribution',
      imageFile: 'Image file',
      infoPage: 'Information page',
      source: 'Source',
      about: 'About this Piece',
      context: 'Historical Context',
      tags: 'Tags',
      deepDive: 'AI Deep Dive',
      'deepDive.symbolism': 'Symbolism & Iconography',
      'deepDive.artistContext': "Artist's Context",
      'deepDive.technique': 'Technique & Style',
      findSimilar: 'Find Similar Art',
      removeFromGallery: 'Remove from Gallery',
      addToGallery: 'Add to Gallery',
      medium: 'Medium',
      dimensions: 'Dimensions',
      location: 'Location',
    },
    addToGallery: {
      title: 'Add to Gallery',
      create: 'Create New Gallery & Add',
      select: '...or add to an existing one:',
    }
  },
  chat: {
    title: 'Chat about {{title}}',
    error: {
        start: 'Sorry, I had trouble starting this conversation. Please try again later.',
        response: 'I seem to be having trouble responding right now. Please try again.'
    },
    placeholder: 'Ask something about the artwork...',
    button: 'Discuss with AI'
  },
  gallery: {
    new: 'New Gallery',
    status: {
        draft: 'Draft',
        published: 'Published',
    },
    manager: {
        artworkCount: '{{count}} artworks',
        empty: {
            title: 'No Galleries Here Yet',
            prompt: 'Create your first gallery to start curating.',
        },
        create: 'New Gallery'
    },
    suite: {
        title: 'Gallery Suite'
    },
    exhibit: {
        button: 'Exhibit'
    },
    ai: {
        critique: 'Critique Gallery',
        audioGuide: 'Generate Audio Guide',
        trailer: 'Generate Video Trailer'
    },
    critique: {
        modal: {
            critique: "Curator's Critique",
            suggestions: 'Suggestions'
        }
    },
    actions: {
        duplicate: 'Duplicate'
    },
    creator: {
        title: 'Gallery Title',
        description: 'Description',
        'title.placeholder': 'e.g., "Impressionist Landscapes"',
        'description.placeholder': 'e.g., "A collection of works exploring light and nature."',
    }
  },
  journal: {
    title: 'Journal',
    new: 'New Entry',
    delete: {
        confirm: 'Are you sure you want to delete the entry "{{title}}"?',
    },
    research: {
        heading: 'AI Research: {{topic}}',
        placeholder: 'Research a topic with AI...',
    },
    preview: 'Live Preview',
    editor: {
        placeholder: 'Start writing your thoughts...'
    },
    empty: {
        title: 'Your Journal is Empty',
        prompt: 'Create your first entry to start recording your thoughts and research.'
    },
    select: {
        title: 'Select an Entry',
        prompt: 'Choose an entry from the list to view or edit it.'
    }
  },
  workspace: {
      title: 'Workspace',
      newProject: 'New Project',
      editProject: 'Edit Project Details',
      project: {
          galleries: '{{count}} Galleries',
          journals: '{{count}} Journals',
      },
      delete: {
          projectLabel: 'Delete project {{title}}'
      },
      empty: {
          title: 'Welcome to your Workspace!',
          prompt: 'Projects are containers for your galleries and research. Create a project to get started.',
          button: 'Create First Project'
      }
  },
  settings: {
    title: "Settings",
    about: {
      version: "Version 1.0.0",
      license: "All rights reserved."
    },
    general: {
      title: "General",
      language: {
        label: "Display Language"
      },
      theme: {
        label: "Appearance",
        dark: "Dark",
        light: "Light"
      },
      confirmDelete: {
        label: "Confirm Deletions",
        desc: "Show a confirmation dialog before deleting items."
      }
    },
    ai: {
        title: "AI Assistant",
        creativity: {
            label: "Creativity Level",
            desc: "Controls the randomness of AI responses. 'Creative' may be less factual.",
            focused: "Focused",
            balanced: "Balanced",
            creative: "Creative"
        },
        results: {
            label: "Search Results Count",
            desc: "Number of artworks to fetch in 'Discover' searches."
        }
    },
    studio: {
        title: "AI Studio",
        enhancement: {
            label: "Prompt Enhancement Style",
            desc: "Determines how the AI enhances your prompts.",
            subtle: "Subtle",
            descriptive: "Descriptive",
            artistic: "Artistic"
        },
        clearPrompt: {
            label: "Clear Prompt After Generating",
            desc: "Automatically clears the text box after creating an image."
        }
    },
    data: {
        title: "Data Management",
        export: {
            label: "Export Data",
            desc: "Save all your projects, galleries, and settings to a file.",
            button: "Export All Data"
        },
        import: {
            label: "Import Data",
            desc: "Load data from a backup file. This will overwrite current data.",
            button: "Import from File"
        },
        reset: {
            label: "Reset Application",
            desc: "Delete all your data and restore default settings. This cannot be undone.",
            button: "Reset App Data"
        }
    }
  },
  help: {
    title: "Help & About",
    glossary: {
      button: "Browse the Art History Glossary"
    },
    tutorial: {
      title: "Getting Started Tutorial",
      step1: {
        title: "1. Create a Project",
        content: "Start in the <b>Workspace</b>. Projects are like folders to organize your research and galleries."
      },
      step2: {
        title: "2. Discover Art",
        content: "Use the <b>Discover</b> tab to search for famous artworks from open-source collections."
      },
      step3: {
        title: "3. Curate a Gallery",
        content: "Add artworks you find to a new or existing <b>Gallery</b> within your project."
      },
      step4: {
        title: "4. Create with AI",
        content: "Visit the <b>AI Studio</b> to generate unique images from your own text prompts."
      },
      step5: {
        title: "5. Record Your Thoughts",
        content: "Use the <b>Journal</b> to write notes, conduct AI-powered research, and develop your ideas."
      },
      step6: {
        title: "6. Present Your Work",
        content: "Enter <b>Exhibition Mode</b> from any gallery to view your collection in a full-screen, immersive slideshow."
      }
    },
    tips: {
      title: "Pro Tips",
      tip1: {
        title: "Use the AI Assistant in your Gallery",
        content: "Get a professional critique of your curation, or generate an entire audio guide script for your exhibition."
      },
      tip2: {
        title: "Drag and Drop to Reorder",
        content: "Inside a gallery, you can drag artworks to change their order for the perfect narrative flow."
      },
      tip3: {
        title: "Enhance Your AI Prompts",
        content: "In the AI Studio, use the 'Enhance Prompt' button to let the AI add rich, artistic detail to your ideas before generating an image."
      },
      tip4: {
        title: "Chat with an Artwork",
        content: "In an artwork's detail view, click 'Discuss with AI' to start a conversation and learn more about its history and meaning."
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: { q: "Where does the artwork data come from?", a: "Most of the discoverable artwork is sourced from Wikimedia Commons and other open-access museum collections. We rely on the metadata provided by these institutions." },
      q2: { q: "Is my data private?", a: "Yes. All your data—projects, galleries, journal entries, and settings—is stored locally in your browser. Nothing is uploaded to a server unless you choose to share a gallery." },
      q3: { q: "How does the AI work?", a: "This application uses Google's Gemini family of models for all AI-powered features, from image generation to text analysis and chat." },
      q4: { q: "Can I share my galleries?", a: "Yes! In any gallery, click the 'Share' button. You can generate a shareable link that encodes your gallery data for others to view, or export a file they can import into their own app." }
    },
    philosophy: {
      title: "Our Philosophy",
      content: "Art-i-Fact is designed to be a personal digital studio and curatorial assistant. It empowers you to explore, understand, create, and share art in new ways. We believe that combining human creativity with powerful AI tools can unlock new avenues for learning and expression."
    }
  },
  glossary: {
    title: "Art History Glossary",
    category: {
      techniques: "Techniques & Media",
      eras: "Movements & Eras",
      concepts: "Concepts & Terms",
    },
    chiaroscuro: { term: "Chiaroscuro", def: "The use of strong contrasts between light and dark, usually bold contrasts affecting a whole composition." },
    impasto: { term: "Impasto", def: "A technique used in painting, where paint is laid on an area of the surface in very thick layers, usually thick enough that the brush or painting-knife strokes are visible." },
    sfumato: { term: "Sfumato", def: "A painting technique for softening the transition between colours, mimicking an area beyond what the human eye is focusing on, or the out-of-focus plane. Leonardo da Vinci was the most prominent practitioner." },
    tenebrism: { term: "Tenebrism", def: "A style of painting using profoundly pronounced chiaroscuro, where there are violent contrasts of light and dark, and where darkness becomes a dominating feature of the image. Caravaggio is a key practitioner." },
    pointillism: { term: "Pointillism", def: "A technique of painting in which small, distinct dots of color are applied in patterns to form an image. Georges Seurat and Paul Signac developed the technique in 1886." },
    fresco: { term: "Fresco", def: "A technique of mural painting executed upon freshly laid ('wet') lime plaster. Water is used as the vehicle for the dry-powder pigment to merge with the plaster, and with the setting of the plaster, the painting becomes an integral part of the wall." },
    renaissance: { term: "Renaissance", def: "A period in European history, from the 14th to the 17th century, regarded as the cultural bridge between the Middle Ages and modern history. It started as a cultural movement in Italy in the Late Medieval period and later spread to the rest of Europe." },
    baroque: { term: "Baroque", def: "A style of architecture, music, dance, painting, sculpture and other arts that flourished in Europe from the early 17th century until the 1740s. It was encouraged by the Catholic Church as a means to counter the simplicity and austerity of Protestant architecture, art and music." },
    rococo: { term: "Rococo", def: "An exceptionally ornamental and theatrical style of architecture, art and decoration which combines asymmetry, scrolling curves, gilding, white and pastel colors, sculpted molding, and trompe-l'œil frescoes to create surprise and the illusion of motion and drama." },
    impressionism: { term: "Impressionism", def: "A 19th-century art movement characterized by relatively small, thin, yet visible brush strokes, open composition, emphasis on accurate depiction of light in its changing qualities, ordinary subject matter, and inclusion of movement as a crucial element of human perception and experience." },
    cubism: { term: "Cubism", def: "An early-20th-century avant-garde art movement that revolutionized European painting and sculpture. In Cubist artwork, objects are analyzed, broken up and reassembled in an abstracted form—instead of depicting objects from a single viewpoint, the artist depicts the subject from a multitude of viewpoints to represent the subject in a greater context." },
    surrealism: { term: "Surrealism", def: "A cultural movement which developed in Europe in the aftermath of World War I and was largely influenced by Dada. The movement is best known for its visual artworks and writings, which feature element of surprise, unexpected juxtapositions and non sequitur." },
    popart: { term: "Pop Art", def: "An art movement that emerged in the United Kingdom and the United States during the mid- to late-1950s. The movement presented a challenge to traditions of fine art by including imagery from popular and mass culture, such as advertising, comic books and mundane cultural objects." },
    minimalism: { term: "Minimalism", def: "An art movement that began in post–World War II Western art, most strongly with American visual arts in the 1960s and early 1970s. The term is used to describe a trend in design and architecture wherein the subject is reduced to its necessary elements." },
    composition: { term: "Composition", def: "The placement or arrangement of visual elements or 'ingredients' in a work of art, as distinct from the subject. It can also be thought of as the organization of the elements of art according to the principles of art." },
    palette: { term: "Palette", def: "The range of colors used by a particular artist or in a particular picture. It can also refer to the board on which an artist mixes paints." },
    perspective: { term: "Perspective", def: "The art of drawing solid objects on a two-dimensional surface so as to give the right impression of their height, width, depth, and position in relation to each other when viewed from a particular point." },
    iconography: { term: "Iconography", def: "The branch of art history which studies the identification, description, and the interpretation of the content of images: the subjects depicted, the particular compositions and details used to do so, and other elements that are distinct from artistic style." }
  },
  welcome: {
      title: "Welcome to Art-i-Fact",
      subtitle: "Your personal space to discover, create, and curate art with the power of AI.",
      cta: "Let's Get Started"
  },
  exhibition: {
    goToArtwork: 'Go to artwork {{number}}',
    transcript: 'View Transcript',
    toggleFullscreen: 'Enter Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    audioPlaying: 'Audio Guide Playing',
    audioMuted: 'Audio Guide Muted',
    curatedBy: 'Curated by {{username}}'
  },
  camera: {
    error: {
        access: 'Could not access the camera. Please check permissions.'
    }
  },
  community: {
      title: 'Community Galleries',
      subtitle: 'Explore and import galleries curated by others.',
      curatedBy: 'Curated by',
      preview: 'Preview',
      import: 'Import',
      empty: {
          title: 'Could Not Load Galleries',
          prompt: 'There was an issue fetching galleries from the community. Please check your connection and try again.'
      }
  },
  share: {
      modal: {
          title: 'Share or Export Gallery',
          link: {
              title: 'Share a Link',
              description: "Copy a unique link to share this gallery. Others can view it in their browser or import it into their own Art-i-Fact app.",
              copy: 'Copy Shareable Link'
          },
          export: {
              title: 'Export as File',
              description: 'Download the gallery data as a JSON file. This is useful for backups or for sharing directly with others.',
              button: 'Export .json File'
          }
      }
  },
  studio: {
    title: "AI Studio",
    subtitle: "Create unique artworks from text prompts.",
    prompt: {
        placeholder: "e.g., A cubist portrait of a person reading a book...",
    },
    inspiration: "Need inspiration? Try one of these:",
    aspectRatio: "Aspect Ratio",
    enhancePrompt: "Enhance Prompt",
    generate: "Generate",
    generating: "Generating...",
    addToGallery: "Save to a Gallery",
    remix: {
        placeholder: "e.g., Add a surreal element, make it more vibrant...",
        button: "Remix",
        mode: "Remix Mode",
        exit: "Cancel Remix",
    }
  },
  discover: {
    title: "Discover Art",
    subtitle: "Search for artworks from public collections.",
    search: {
        placeholder: "Search by artist, title, or theme...",
        button: "Search",
    },
    results: {
        title: "Search Results for \"{{query}}\"",
        none: "No results found. Try a different search term.",
    },
    featured: "Featured Artworks",
    error: "Could not fetch artworks. Please try again later.",
  }
};

const de: Locale = {
  // General
  back: 'Zurück',
  save: 'Speichern',
  cancel: 'Abbrechen',
  create: 'Erstellen',
  remove: 'Entfernen',
  close: 'Schließen',
  retry: 'Erneut versuchen',
  generate: 'Generieren',

  // Views
  view: {
    workspace: 'Arbeitsbereich',
    discover: 'Entdecken',
    studio: 'KI-Studio',
    journal: 'Journal',
    profile: 'Profil',
    setup: 'Einstellungen',
    help: 'Hilfe & Info',
    project: 'Projekt',
    gallery: 'Galerie',
    community: 'Community',
  },

  // Profile
  profile: {
      title: "Kuratorprofil",
      stats: {
          galleries: 'Kuratierte Galerien',
          discovered: 'Entdeckte Kunstwerke',
          created: 'Erstellte KI-Kunstwerke',
      }
  },

  // Errors
  error: {
    api: {
      title: 'Fehler des KI-Assistenten',
      message: 'Der KI-Assistent hat ein Problem festgestellt. Bitte überprüfe deine Verbindung und versuche es erneut.'
    }
  },

  // Toasts
  toast: {
      settings: {
          reset: 'Die Einstellungen wurden auf die Standardwerte zurückgesetzt.',
          exported: 'Deine Daten wurden erfolgreich exportiert.',
          imported: 'Daten erfolgreich importiert! Die App wird jetzt neu geladen.',
          importError: 'Fehler beim Importieren der Daten. Die Datei könnte beschädigt sein.'
      },
      artwork: {
          added: 'Kunstwerk zu "{{gallery}}" hinzugefügt.'
      },
      journal: {
          deleted: 'Journaleintrag gelöscht.'
      },
      share: {
          linkCopied: 'Link zum Teilen in die Zwischenablage kopiert.'
      },
      studio: {
        promptEnhanced: 'Prompt erfolgreich verbessert!'
      },
      gallery: {
        imported: 'Galerie "{{title}}" erfolgreich importiert!'
      },
      error: {
        gemini: "Anfrage an die Gemini API fehlgeschlagen."
      }
  },
  
  artwork: {
    detailsLabel: 'Details für {{title}} anzeigen',
    moveUp: '{{title}} nach oben verschieben',
    moveDown: '{{title}} nach unten verschieben',
  },
  modal: {
    details: {
      palette: 'Dominante Farben',
      notes: "Notizen des Kurators",
      'notes.placeholder': "Füge hier deine persönlichen Notizen und Interpretationen hinzu...",
      attribution: 'Urheberschaft',
      imageFile: 'Bilddatei',
      infoPage: 'Informationsseite',
      source: 'Quelle',
      about: 'Über dieses Werk',
      context: 'Historischer Kontext',
      tags: 'Schlagwörter',
      deepDive: 'KI-Tiefenanalyse',
      'deepDive.symbolism': 'Symbolik & Ikonografie',
      'deepDive.artistContext': "Kontext des Künstlers",
      'deepDive.technique': 'Technik & Stil',
      findSimilar: 'Ähnliche Kunst finden',
      removeFromGallery: 'Aus Galerie entfernen',
      addToGallery: 'Zur Galerie hinzufügen',
      medium: 'Medium',
      dimensions: 'Abmessungen',
      location: 'Standort',
    },
    addToGallery: {
      title: 'Zur Galerie hinzufügen',
      create: 'Neue Galerie erstellen & hinzufügen',
      select: '...oder zu einer bestehenden hinzufügen:',
    }
  },
  chat: {
    title: 'Chat über {{title}}',
    error: {
        start: 'Entschuldigung, ich hatte Probleme, dieses Gespräch zu beginnen. Bitte versuche es später erneut.',
        response: 'Ich habe im Moment Schwierigkeiten zu antworten. Bitte versuche es erneut.'
    },
    placeholder: 'Frage etwas über das Kunstwerk...',
    button: 'Mit KI diskutieren'
  },
  gallery: {
    new: 'Neue Galerie',
    status: {
        draft: 'Entwurf',
        published: 'Veröffentlicht',
    },
    manager: {
        artworkCount: '{{count}} Kunstwerke',
        empty: {
            title: 'Noch keine Galerien hier',
            prompt: 'Erstelle deine erste Galerie, um mit dem Kuratieren zu beginnen.',
        },
        create: 'Neue Galerie'
    },
    suite: {
        title: 'Galerie-Übersicht'
    },
    exhibit: {
        button: 'Ausstellen'
    },
    ai: {
        critique: 'Galerie kritisieren',
        audioGuide: 'Audioguide erstellen',
        trailer: 'Videotrailer erstellen'
    },
    critique: {
        modal: {
            critique: "Kritik des Kurators",
            suggestions: 'Vorschläge'
        }
    },
    actions: {
        duplicate: 'Duplizieren'
    },
    creator: {
        title: 'Titel der Galerie',
        description: 'Beschreibung',
        'title.placeholder': 'z.B. "Impressionistische Landschaften"',
        'description.placeholder': 'z.B. "Eine Sammlung von Werken, die Licht und Natur erforschen."',
    }
  },
  journal: {
    title: 'Journal',
    new: 'Neuer Eintrag',
    delete: {
        confirm: 'Bist du sicher, dass du den Eintrag "{{title}}" löschen möchtest?',
    },
    research: {
        heading: 'KI-Recherche: {{topic}}',
        placeholder: 'Recherchiere ein Thema mit KI...',
    },
    preview: 'Live-Vorschau',
    editor: {
        placeholder: 'Beginne, deine Gedanken niederzuschreiben...'
    },
    empty: {
        title: 'Dein Journal ist leer',
        prompt: 'Erstelle deinen ersten Eintrag, um deine Gedanken und Recherchen festzuhalten.'
    },
    select: {
        title: 'Wähle einen Eintrag',
        prompt: 'Wähle einen Eintrag aus der Liste, um ihn anzuzeigen oder zu bearbeiten.'
    }
  },
  workspace: {
      title: 'Arbeitsbereich',
      newProject: 'Neues Projekt',
      editProject: 'Projektdetails bearbeiten',
      project: {
          galleries: '{{count}} Galerien',
          journals: '{{count}} Journaleinträge',
      },
      delete: {
          projectLabel: 'Projekt {{title}} löschen'
      },
      empty: {
          title: 'Willkommen in deinem Arbeitsbereich!',
          prompt: 'Projekte sind Ordner für deine Galerien und Recherchen. Erstelle ein Projekt, um loszulegen.',
          button: 'Erstes Projekt erstellen'
      }
  },
  settings: {
    title: "Einstellungen",
    about: {
      version: "Version 1.0.0",
      license: "Alle Rechte vorbehalten."
    },
    general: {
      title: "Allgemein",
      language: {
        label: "Anzeigesprache"
      },
      theme: {
        label: "Erscheinungsbild",
        dark: "Dunkel",
        light: "Hell"
      },
      confirmDelete: {
        label: "Löschen bestätigen",
        desc: "Ein Bestätigungsdialogfeld vor dem Löschen von Elementen anzeigen."
      }
    },
    ai: {
        title: "KI-Assistent",
        creativity: {
            label: "Kreativitätsstufe",
            desc: "Steuert die Zufälligkeit der KI-Antworten. 'Kreativ' kann weniger faktenbasiert sein.",
            focused: "Fokussiert",
            balanced: "Ausgewogen",
            creative: "Kreativ"
        },
        results: {
            label: "Anzahl der Suchergebnisse",
            desc: "Anzahl der Kunstwerke, die bei der Suche in 'Entdecken' abgerufen werden."
        }
    },
    studio: {
        title: "KI-Studio",
        enhancement: {
            label: "Stil der Prompt-Verbesserung",
            desc: "Bestimmt, wie die KI deine Prompts verbessert.",
            subtle: "Subtil",
            descriptive: "Beschreibend",
            artistic: "Künstlerisch"
        },
        clearPrompt: {
            label: "Prompt nach Generierung leeren",
            desc: "Löscht das Textfeld automatisch nach der Erstellung eines Bildes."
        }
    },
    data: {
        title: "Datenverwaltung",
        export: {
            label: "Daten exportieren",
            desc: "Sichere all deine Projekte, Galerien und Einstellungen in einer Datei.",
            button: "Alle Daten exportieren"
        },
        import: {
            label: "Daten importieren",
            desc: "Lade Daten aus einer Sicherungsdatei. Dies überschreibt aktuelle Daten.",
            button: "Aus Datei importieren"
        },
        reset: {
            label: "Anwendung zurücksetzen",
            desc: "Lösche alle deine Daten und stelle die Standardeinstellungen wieder her. Dies kann nicht rückgängig gemacht werden.",
            button: "App-Daten zurücksetzen"
        }
    }
  },
  help: {
    title: "Hilfe & Info",
    glossary: {
      button: "Kunsthistorisches Glossar durchsuchen"
    },
    tutorial: {
      title: "Einführungstutorial",
      step1: {
        title: "1. Erstelle ein Projekt",
        content: "Beginne im <b>Arbeitsbereich</b>. Projekte sind wie Ordner, um deine Recherchen und Galerien zu organisieren."
      },
      step2: {
        title: "2. Entdecke Kunst",
        content: "Nutze den <b>Entdecken</b>-Tab, um nach berühmten Kunstwerken aus Open-Source-Sammlungen zu suchen."
      },
      step3: {
        title: "3. Kuratiere eine Galerie",
        content: "Füge gefundene Kunstwerke zu einer neuen oder bestehenden <b>Galerie</b> in deinem Projekt hinzu."
      },
      step4: {
        title: "4. Erschaffe mit KI",
        content: "Besuche das <b>KI-Studio</b>, um einzigartige Bilder aus deinen eigenen Text-Prompts zu generieren."
      },
      step5: {
        title: "5. Halte deine Gedanken fest",
        content: "Nutze das <b>Journal</b>, um Notizen zu schreiben, KI-gestützte Recherchen durchzuführen und deine Ideen zu entwickeln."
      },
      step6: {
        title: "6. Präsentiere deine Arbeit",
        content: "Wechsle vom Galeriemenü in den <b>Ausstellungsmodus</b>, um deine Sammlung in einer bildschirmfüllenden, immersiven Diashow zu betrachten."
      }
    },
    tips: {
      title: "Profi-Tipps",
      tip1: {
        title: "Nutze den KI-Assistenten in deiner Galerie",
        content: "Erhalte eine professionelle Kritik deiner Kuration oder erstelle ein komplettes Audioguide-Skript für deine Ausstellung."
      },
      tip2: {
        title: "Drag-and-Drop zum Neuanordnen",
        content: "Innerhalb einer Galerie kannst du Kunstwerke ziehen, um ihre Reihenfolge für den perfekten narrativen Fluss zu ändern."
      },
      tip3: {
        title: "Verbessere deine KI-Prompts",
        content: "Im KI-Studio kannst du den 'Prompt verbessern'-Button nutzen, um die KI reichhaltige, künstlerische Details zu deinen Ideen hinzufügen zu lassen, bevor ein Bild generiert wird."
      },
      tip4: {
        title: "Chatte mit einem Kunstwerk",
        content: "Klicke in der Detailansicht eines Kunstwerks auf 'Mit KI diskutieren', um ein Gespräch zu beginnen und mehr über seine Geschichte und Bedeutung zu erfahren."
      }
    },
    faq: {
      title: "Häufig gestellte Fragen",
      q1: { q: "Woher stammen die Kunstwerksdaten?", a: "Die meisten auffindbaren Kunstwerke stammen von Wikimedia Commons und anderen Open-Access-Museumssammlungen. Wir verlassen uns auf die von diesen Institutionen bereitgestellten Metadaten." },
      q2: { q: "Sind meine Daten privat?", a: "Ja. Alle deine Daten – Projekte, Galerien, Journaleinträge und Einstellungen – werden lokal in deinem Browser gespeichert. Nichts wird auf einen Server hochgeladen, es sei denn, du entscheidest dich, eine Galerie zu teilen." },
      q3: { q: "Wie funktioniert die KI?", a: "Diese Anwendung nutzt die Gemini-Modellfamilie von Google für alle KI-gestützten Funktionen, von der Bilderzeugung bis zur Textanalyse und zum Chat." },
      q4: { q: "Kann ich meine Galerien teilen?", a: "Ja! Klicke in jeder Galerie auf den 'Teilen'-Button. Du kannst einen teilbaren Link generieren, der deine Galeriedaten für andere zur Ansicht kodiert, oder eine Datei exportieren, die sie in ihre eigene App importieren können." }
    },
    philosophy: {
      title: "Unsere Philosophie",
      content: "Art-i-Fact ist als persönliches digitales Studio und kuratorischer Assistent konzipiert. Es ermöglicht dir, Kunst auf neue Weisen zu erforschen, zu verstehen, zu erschaffen und zu teilen. Wir glauben, dass die Kombination von menschlicher Kreativität mit leistungsstarken KI-Werkzeugen neue Wege für Lernen und Ausdruck eröffnen kann."
    }
  },
  glossary: {
    title: "Kunsthistorisches Glossar",
    category: {
      techniques: "Techniken & Medien",
      eras: "Bewegungen & Epochen",
      concepts: "Konzepte & Begriffe",
    },
    chiaroscuro: { term: "Chiaroscuro (Helldunkelmalerei)", def: "Die Verwendung starker Kontraste zwischen Licht und Dunkel, die meist die gesamte Komposition beeinflussen." },
    impasto: { term: "Impasto", def: "Eine Technik in der Malerei, bei der Farbe in sehr dicken Schichten aufgetragen wird, sodass die Pinsel- oder Spachtelstriche sichtbar bleiben." },
    sfumato: { term: "Sfumato", def: "Eine Maltechnik zur Erweichung der Übergänge zwischen Farben, die einen Bereich nachahmt, der außerhalb des menschlichen Blickfeldes liegt oder unscharf ist. Leonardo da Vinci war der prominenteste Anwender." },
    tenebrism: { term: "Tenebrismus", def: "Ein Malstil, der ein stark ausgeprägtes Chiaroscuro verwendet, bei dem es heftige Kontraste von Licht und Dunkel gibt und die Dunkelheit zu einem dominierenden Merkmal des Bildes wird. Caravaggio ist ein wichtiger Vertreter." },
    pointillism: { term: "Pointillismus", def: "Eine Maltechnik, bei der kleine, getrennte Farbpunkte in Mustern aufgetragen werden, um ein Bild zu formen. Georges Seurat und Paul Signac entwickelten die Technik 1886." },
    fresco: { term: "Fresko", def: "Eine Technik der Wandmalerei, die auf frisch aufgetragenem ('nassem') Kalkputz ausgeführt wird. Wasser dient als Träger für das Trockenpigment, um mit dem Putz zu verschmelzen, und mit dem Aushärten des Putzes wird das Gemälde ein integraler Bestandteil der Wand." },
    renaissance: { term: "Renaissance", def: "Eine Epoche der europäischen Geschichte vom 14. bis zum 17. Jahrhundert, die als kulturelle Brücke zwischen dem Mittelalter und der Neuzeit gilt. Sie begann als Kulturbewegung in Italien im Spätmittelalter und verbreitete sich später im übrigen Europa." },
    baroque: { term: "Barock", def: "Ein Stil in Architektur, Musik, Tanz, Malerei, Skulptur und anderen Künsten, der in Europa vom frühen 17. Jahrhundert bis in die 1740er Jahre blühte. Er wurde von der katholischen Kirche gefördert, um der Einfachheit und Strenge protestantischer Architektur, Kunst und Musik entgegenzuwirken." },
    rococo: { term: "Rokoko", def: "Ein außergewöhnlich ornamentaler und theatralischer Stil in Architektur, Kunst und Dekoration, der Asymmetrie, geschwungene Kurven, Vergoldungen, weiße und pastellfarbene Töne, skulptierte Zierleisten und Trompe-l'œil-Fresken kombiniert, um Überraschung und die Illusion von Bewegung und Drama zu erzeugen." },
    impressionism: { term: "Impressionismus", def: "Eine Kunstbewegung des 19. Jahrhunderts, gekennzeichnet durch relativ kleine, dünne, aber sichtbare Pinselstriche, offene Komposition, Betonung der genauen Darstellung des Lichts in seinen wechselnden Qualitäten, gewöhnliche Sujets und die Einbeziehung von Bewegung als entscheidendes Element menschlicher Wahrnehmung." },
    cubism: { term: "Kubismus", def: "Eine Avantgarde-Kunstbewegung des frühen 20. Jahrhunderts, die die europäische Malerei und Skulptur revolutionierte. In kubistischen Kunstwerken werden Objekte analysiert, zerlegt und in einer abstrahierten Form wieder zusammengesetzt – anstatt Objekte aus einem einzigen Blickwinkel darzustellen, zeigt der Künstler das Sujet aus einer Vielzahl von Perspektiven, um es in einem größeren Kontext zu repräsentieren." },
    surrealism: { term: "Surrealismus", def: "Eine kulturelle Bewegung, die sich nach dem Ersten Weltkrieg in Europa entwickelte und stark vom Dadaismus beeinflusst war. Die Bewegung ist am besten für ihre visuellen Kunstwerke und Schriften bekannt, die Elemente der Überraschung, unerwartete Gegenüberstellungen und das Unlogische aufweisen." },
    popart: { term: "Pop Art", def: "Eine Kunstbewegung, die in den späten 1950er Jahren im Vereinigten Königreich und den Vereinigten Staaten entstand. Die Bewegung forderte die Traditionen der bildenden Kunst heraus, indem sie Bilder aus der Populär- und Massenkultur wie Werbung, Comics und alltägliche Kulturgegenstände einbezog." },
    minimalism: { term: "Minimalismus", def: "Eine Kunstbewegung, die nach dem Zweiten Weltkrieg in der westlichen Kunst begann, am stärksten in der amerikanischen bildenden Kunst der 1960er und frühen 1970er Jahre. Der Begriff wird verwendet, um einen Trend in Design und Architektur zu beschreiben, bei dem das Subjekt auf seine notwendigen Elemente reduziert wird." },
    composition: { term: "Komposition", def: "Die Platzierung oder Anordnung visueller Elemente in einem Kunstwerk, im Gegensatz zum Sujet. Es kann auch als Organisation der Kunstelemente nach den Prinzipien der Kunst verstanden werden." },
    palette: { term: "Palette", def: "Die Bandbreite der Farben, die ein bestimmter Künstler oder in einem bestimmten Bild verwendet. Es kann sich auch auf das Brett beziehen, auf dem ein Künstler Farben mischt." },
    perspective: { term: "Perspektive", def: "Die Kunst, feste Objekte auf einer zweidimensionalen Oberfläche so zu zeichnen, dass der richtige Eindruck von ihrer Höhe, Breite, Tiefe und Position zueinander entsteht, wenn sie von einem bestimmten Punkt aus betrachtet werden." },
    iconography: { term: "Ikonografie", def: "Der Zweig der Kunstgeschichte, der die Identifizierung, Beschreibung und Interpretation des Inhalts von Bildern untersucht: die dargestellten Sujets, die besonderen Kompositionen und Details, die dafür verwendet werden, und andere Elemente, die sich vom künstlerischen Stil unterscheiden." }
  },
  welcome: {
      title: "Willkommen bei Art-i-Fact",
      subtitle: "Dein persönlicher Raum, um Kunst mit der Kraft der KI zu entdecken, zu erschaffen und zu kuratieren.",
      cta: "Los geht's"
  },
  exhibition: {
    goToArtwork: 'Gehe zu Kunstwerk {{number}}',
    transcript: 'Transkript anzeigen',
    toggleFullscreen: 'Vollbildmodus aktivieren',
    exitFullscreen: 'Vollbildmodus beenden',
    audioPlaying: 'Audioguide spielt',
    audioMuted: 'Audioguide stummgeschaltet',
    curatedBy: 'Kuratiert von {{username}}'
  },
  camera: {
    error: {
        access: 'Auf die Kamera konnte nicht zugegriffen werden. Bitte überprüfe die Berechtigungen.'
    }
  },
  community: {
      title: 'Community-Galerien',
      subtitle: 'Entdecke und importiere von anderen kuratierte Galerien.',
      curatedBy: 'Kuratiert von',
      preview: 'Vorschau',
      import: 'Importieren',
      empty: {
          title: 'Galerien konnten nicht geladen werden',
          prompt: 'Beim Abrufen der Community-Galerien ist ein Fehler aufgetreten. Bitte überprüfe deine Verbindung und versuche es erneut.'
      }
  },
  share: {
      modal: {
          title: 'Galerie teilen oder exportieren',
          link: {
              title: 'Link teilen',
              description: "Kopiere einen einzigartigen Link, um diese Galerie zu teilen. Andere können sie im Browser ansehen oder in ihre eigene Art-i-Fact-App importieren.",
              copy: 'Link zum Teilen kopieren'
          },
          export: {
              title: 'Als Datei exportieren',
              description: 'Lade die Galeriedaten als JSON-Datei herunter. Dies ist nützlich für Backups oder zum direkten Teilen mit anderen.',
              button: '.json-Datei exportieren'
          }
      }
  },
  studio: {
    title: "KI-Studio",
    subtitle: "Erschaffe einzigartige Kunstwerke aus Text-Prompts.",
    prompt: {
        placeholder: "z.B. Ein kubistisches Porträt einer Person, die ein Buch liest...",
    },
    inspiration: "Brauchst du Inspiration? Versuche es mit einem dieser Vorschläge:",
    aspectRatio: "Seitenverhältnis",
    enhancePrompt: "Prompt verbessern",
    generate: "Generieren",
    generating: "Generiere...",
    addToGallery: "In einer Galerie speichern",
    remix: {
        placeholder: "z.B. Füge ein surreales Element hinzu, mache es lebendiger...",
        button: "Remix",
        mode: "Remix-Modus",
        exit: "Remix abbrechen",
    }
  },
  discover: {
    title: "Kunst entdecken",
    subtitle: "Suche nach Kunstwerken aus öffentlichen Sammlungen.",
    search: {
        placeholder: "Suche nach Künstler, Titel oder Thema...",
        button: "Suchen",
    },
    results: {
        title: "Suchergebnisse für \"{{query}}\"",
        none: "Keine Ergebnisse gefunden. Versuche einen anderen Suchbegriff.",
    },
    featured: "Vorgestellte Kunstwerke",
    error: "Kunstwerke konnten nicht abgerufen werden. Bitte versuche es später erneut.",
  }
};


export const locales: { [key in Language]: Locale } = {
  en,
  de,
};
