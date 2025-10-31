
export type Language = 'en' | 'de';

// FIX: Changed Locale to be a recursive type to allow for arbitrary nesting, fixing multiple type errors.
export type Locale = {
  [key: string]: string | Locale;
};

export const locales: { [key in Language]: Locale } = {
  en: {
    view: {
      workspace: 'Workspace',
      project: 'Project',
      discover: 'Discover',
      gallery: 'Gallery',
      gallerysuite: 'Gallery Suite',
      studio: 'AI Studio',
      journal: 'Journal',
      profile: 'Profile',
      setup: 'Settings',
      help: 'Help & Support',
      community: 'Community',
    },
    header: {
        openCommandPalette: 'Open Command Palette',
    },
    close: 'Close',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    remove: 'Remove',
    retry: 'Retry',
    loader: {
      generic: 'Loading Art-i-Fact...',
    },
    error: {
        api: {
            title: 'An Error Occurred',
        },
        taskFailed: 'Task Failed',
    },
    offline: {
        tooltip: 'This feature requires an internet connection.',
    },
    welcome: {
        title: 'Welcome to Art-i-Fact!',
        subtitle: 'Your personal AI-powered art curator. Here’s a quick guide to get you started:',
        cta: "Let's Begin Curating",
    },
    chat: {
      title: "Chat about '{{title}}'",
    },
    delete: {
        project: {
            title: "Delete Project",
            confirm: "Are you sure you want to permanently delete the project '{{title}}'? This will also delete all associated galleries and journal entries. This action cannot be undone."
        },
        gallery: {
            title: "Delete Gallery",
            confirm: "Are you sure you want to permanently delete the gallery '{{title}}'? This action cannot be undone."
        }
    },
    modal: {
      details: {
        addToGallery: "Add to Gallery",
        palette: "Dominant Colors",
        notes: "Curator's Notes",
      },
      addToGallery: {
        title: "Add to Gallery",
        create: "Create New Gallery",
        select: "Or add to an existing gallery",
        inProject: "In Current Project",
        other: "Other Galleries",
        empty: "You don't have any galleries yet. Create one to get started!",
      },
    },
    shareModal: {
        modal: {
            link: {
                title: 'Share with a Link',
                description: 'Copy this link to share a read-only version of your gallery. All data is encoded in the link itself.',
                copy: 'Copy Link',
            },
            export: {
                title: 'Export as File',
                description: 'Download the gallery data as a JSON file. This can be imported by another Art-i-Fact user.',
                button: 'Export Gallery File',
            }
        }
    },
    artwork: {
        detailsLabel: "View details for {{title}}",
    },
    discover: {
      title: "Discover Art",
      subtitle: "Find inspiration from millions of artworks in the public domain.",
      search: {
        placeholder: "Search for artists, movements, or subjects...",
      },
      inspiration: "Need inspiration?",
      featured: "Featured Artworks",
      error: "Failed to fetch artworks. Please check your connection and try again.",
      results: {
        none: "No results found.",
        title: "Results for \"{{query}}\"",
      },
    },
    gallery: {
      creator: {
        title: "Gallery Title",
        title_placeholder: "e.g., 'Masters of Impressionism'",
        description: "Gallery Description",
        description_placeholder: "e.g., 'An exploration of light and color...'",
      },
      new: "New Gallery",
      status: {
        draft: "Draft",
        published: "Published",
      },
      manager: {
        artworkCount_one: "1 Artwork",
        artworkCount_other: "{{count}} Artworks",
        empty: {
          title: "Your Suite is Empty",
          prompt: "Create your first gallery to start curating.",
        },
        create: "New Gallery",
      },
      suite: {
        title: "Gallery Suite",
      },
      actions: {
        duplicate: "Duplicate",
      },
      critique: {
        modal: {
          critique: "AI Critique",
          suggestions: "Suggestions for Improvement"
        }
      }
    },
    workspace: {
        title: "Workspace",
        newProject: "New Project",
        editProject: "Edit Project",
        empty: {
            title: "Welcome to your Workspace",
            prompt: "Create a project to organize your galleries and research.",
            button: "Create Your First Project",
        },
        project: {
            galleries_one: "1 Gallery",
            galleries_other: "{{count}} Galleries",
            journals_one: "1 Journal",
            journals_other: "{{count}} Journals",
            creator: {
                title: "Project Title",
                title_placeholder: "e.g., 'Baroque Art Research'",
                description: "Project Description",
                description_placeholder: "A brief summary of your project's goals.",
            },
            notFound: {
                title: "Project Not Found",
                message: "The project you are looking for does not exist or has been deleted.",
            }
        },
        // FIX: Renamed `newProject` to `newProjectDefaults` to avoid duplicate key error.
        newProjectDefaults: {
          defaultTitle: "New Project",
          defaultDesc: "A new collection of galleries and research.",
        }
    },
    journal: {
        empty: {
            title: "Your Journal is Empty",
            prompt: "Create your first entry to start your research.",
        },
        new: "New Entry",
    },
    profile: {
        title: "Curator Profile",
        edit: {
            title: "Edit Profile",
            button: "Edit Profile",
            username: "Username",
            bio: "Bio",
            avatar: "Avatar"
        },
        stats: {
            galleries: "Galleries Curated",
            discovered: "Artworks Discovered",
            created: "AI Artworks Created",
        },
    },
    settings: {
        title: "Settings",
        general: {
            title: "General",
            language: {
                label: "UI Language",
            },
            theme: {
                label: "Theme",
                dark: "Dark",
                light: "Light",
                darkMode: "Dark Mode",
                lightMode: "Light Mode",
                toggleDark: "Switch to Dark Mode",
                toggleLight: "Switch to Light Mode",
            },
            confirmDelete: {
                label: "Confirm Deletions",
                desc: "Show a confirmation dialog before deleting items.",
            }
        },
        ai: {
            title: "AI Assistant",
            creativity: {
                label: "AI Creativity",
                desc: "Control the 'temperature' of the AI's responses.",
                focused: "Focused",
                balanced: "Balanced",
                creative: "Creative",
            },
            results: {
                label: "AI Search Results",
                desc: "Number of artworks to find in AI-powered searches.",
            },
        },
        studio: {
            title: "Studio",
            enhancement: {
                label: "Prompt Enhancement Style",
                desc: "Choose the default style for prompt enhancement.",
                subtle: "Subtle",
                descriptive: "Descriptive",
                artistic: "Artistic",
            },
            clearPrompt: {
                label: "Clear Prompt After Generating",
                desc: "Automatically clears the prompt input after each image generation.",
            },
        },
        data: {
            title: "Data Management",
            export: {
                label: "Export Data",
                desc: "Save all your projects, galleries, and settings to a file.",
                button: "Export All Data",
            },
            import: {
                label: "Import Data",
                desc: "Import data from a previously exported file.",
                button: "Import from File",
            },
            reset: {
                label: "Reset Application",
                desc: "This will permanently delete all your data. This action cannot be undone.",
                button: "Reset All Data",
            },
        },
        about: {
            version: "Version 1.0.0",
            license: "All rights reserved.",
        }
    },
    help: {
      title: "Help & Support",
      glossary: {
        button: "Open Art History Glossary",
      },
      tutorial: {
        title: "Quick Start Guide",
        step1: {
          title: "1. Organize in the Workspace",
          content: "Create <strong>Projects</strong> to house your collections. Each project is a dedicated space for your galleries and research notes, keeping your work tidy and focused.",
        },
        step2: {
          title: "2. Discover & Collect",
          content: "Use the <strong>Discover</strong> page to search for millions of artworks. When you find something you like, click the 'Add to Gallery' button to save it.",
        },
        step3: {
          title: "3. Curate Your Gallery",
          content: "Build beautiful exhibitions in the <strong>Gallery Suite</strong>. Add artworks, write descriptions, and reorder them with simple drag-and-drop to create a narrative.",
        },
        step4: {
          title: "4. Create with the AI Studio",
          content: "Can't find the perfect piece? Create it! Use the <strong>AI Studio</strong> to generate unique images from text prompts or remix existing ones.",
        },
        step5: {
          title: "5. Research in the Journal",
          content: "Use the <strong>Journal</strong> to take notes. The 'Get Insights' feature uses AI to research topics and provide detailed summaries with sources, right where you're writing.",
        },
        step6: {
          title: "6. Exhibit & Share",
          content: "Present your work in the immersive <strong>Exhibition Mode</strong>. You can even generate an AI audio guide and share your gallery with others via a single link.",
        },
      },
      tips: {
        title: "Pro Tips & Tricks",
        tip1: {
          title: "Use the Command Palette",
          content: "Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>Cmd</kbd> + <kbd>K</kbd> on Mac) to open the Command Palette. It's the fastest way to navigate the app and perform actions.",
        },
        tip2: {
          title: "Enhance Your AI Prompts",
          content: "In the AI Studio, if you're unsure what to write, just type a simple idea and click 'Enhance'. The AI will expand it into a more descriptive and artistic prompt for better results.",
        },
        tip3: {
          title: "Get an AI Critique",
          content: "Once your gallery has a few pieces, use the 'Critique' function. The AI will provide feedback on your gallery's theme and flow, helping you improve your curation skills.",
        },
        tip4: {
          title: "Your Data is Yours",
          content: "Remember to periodically export your data in <strong>Settings → Data Management</strong>. This creates a full backup of all your work that you can save or import later.",
        },
      },
      faq: {
        title: "Frequently Asked Questions",
        q1: {
          q: "Is my data private?",
          a: "<strong>Yes.</strong> All of your data—projects, galleries, notes, and settings—is stored exclusively in your browser's local database (IndexedDB). Nothing is ever uploaded to a server, ensuring complete privacy.",
        },
        q2: {
          q: "Can I use this app offline?",
          a: "<strong>Yes.</strong> Art-i-Fact is a Progressive Web App (PWA). After your first visit, the core application is cached. You can open and edit all your existing projects and galleries without an internet connection. AI-powered features will require a connection.",
        },
        q3: {
          q: "How does sharing work without a server?",
          a: "When you create a share link, the entire contents of that specific gallery are compressed and encoded directly into the URL itself. When someone opens the link, the app decodes the data from the URL and displays the gallery without needing to fetch it from a server.",
        },
        q4: {
          q: "Are the AI-generated images free to use?",
          a: "The usage rights for images generated by AI models can be complex and depend on the model's terms of service. Please refer to Google's Generative AI terms for specific guidance on how you can use the generated content.",
        },
      },
      philosophy: {
        title: "Our Philosophy",
        content: "Art-i-Fact is designed to be a creative partner, not just a tool. We believe that AI should augment human creativity, not replace it. By combining your unique curatorial perspective with the analytical and generative power of AI, you can create richer, more insightful art experiences. Your data and your creations are your own, and this tool is here to help you bring them to life.",
      }
    },
    toast: {
        settings: {
            reset: "Settings have been reset to default.",
            exported: "Your data has been successfully exported.",
            imported: "Data imported successfully. The app will now reload.",
            importError: "Failed to import data. The file may be corrupt.",
            updated: "Settings updated successfully.",
        },
        ai: {
            thinking: "AI is thinking...",
        },
        error: {
            gemini: "The AI assistant is currently unavailable. Please try again later.",
        },
        artwork: {
            added: "Artwork added to '{{gallery}}'.",
        },
        project: {
            deleted: "Project '{{title}}' deleted.",
        },
        gallery: {
            deleted: "Gallery '{{title}}' deleted.",
            duplicated: "Gallery '{{title}}' duplicated.",
            imported: "Gallery '{{title}}' imported successfully.",
        },
        share: {
          linkCopied: "Share link copied to clipboard.",
        }
    },
    commandPalette: {
        placeholder: "Type a command or search...",
        noResults: "No results for \"{{query}}\"",
        sections: {
            general: "General",
        },
    },
    exhibition: {
        goToArtwork: "Go to artwork {{number}}",
        transcript: "Toggle Transcript",
        exitFullscreen: "Exit Fullscreen",
        toggleFullscreen: "Enter Fullscreen",
        curatedBy: "Curated by {{username}}",
        audioPlaying: "Audio Guide Active",
        audioMuted: "Audio Guide Muted",
    },
    camera: {
        error: {
            access: "Could not access the camera. Please check your browser permissions.",
        }
    },
    glossary: {
        title: "Art History Glossary",
        category: {
          techniques: "Techniques & Media",
          eras: "Movements & Eras",
          concepts: "Fundamental Concepts",
        },
        chiaroscuro: {
          term: "Chiaroscuro",
          def: "An artistic technique that uses strong tonal contrasts between light and dark to model three-dimensional forms, often for dramatic effect.",
        },
        impasto: {
          term: "Impasto",
          def: "A technique where paint is laid on an area of the surface in very thick layers, usually thick enough that the brush or painting-knife strokes are visible.",
        },
        sfumato: {
          term: "Sfumato",
          def: "A painting technique for softening the transition between colors, mimicking an area beyond what the human eye is focusing on, or the out-of-focus plane.",
        },
        tenebrism: {
          term: "Tenebrism",
          def: "A dramatic use of chiaroscuro, where the darkness becomes a dominating feature of the image. The technique was developed to add drama to an image through a spotlight effect.",
        },
        pointillism: {
          term: "Pointillism",
          def: "A technique of painting in which small, distinct dots of color are applied in patterns to form an image. The viewer's eye optically blends the colors.",
        },
        fresco: {
          term: "Fresco",
          def: "A technique of mural painting executed upon freshly laid, or wet lime plaster. Water is used as the vehicle for the dry-powder pigment to merge with the plaster.",
        },
        renaissance: {
          term: "Renaissance",
          def: "A period in European history (c. 14th-17th centuries) marking the transition from the Middle Ages to modernity, characterized by a revival of interest in classical antiquity.",
        },
        baroque: {
          term: "Baroque",
          def: "A highly ornate and often extravagant style of architecture, music, dance, painting, sculpture and other arts that flourished in Europe from the early 17th until the mid-18th century.",
        },
        rococo: {
          term: "Rococo",
          def: "An exceptionally ornamental and theatrical style of architecture, art and decoration which combines asymmetry, scrolling curves, and gilding.",
        },
        impressionism: {
          term: "Impressionism",
          def: "A 19th-century art movement characterized by relatively small, thin, yet visible brush strokes, open composition, emphasis on accurate depiction of light, and ordinary subject matter.",
        },
        cubism: {
          term: "Cubism",
          def: "An early-20th-century avant-garde art movement that revolutionized European painting and sculpture, and inspired related movements in music, literature and architecture.",
        },
        surrealism: {
          term: "Surrealism",
          def: "A cultural movement which developed in Europe in the aftermath of World War I and was largely influenced by Dada. The movement is best known for its visual artworks and writings.",
        },
        popart: {
          term: "Pop Art",
          def: "An art movement that emerged in the United Kingdom and the United States during the mid- to late-1950s. The movement presented a challenge to traditions of fine art by including imagery from popular and mass culture.",
        },
        minimalism: {
          term: "Minimalism",
          def: "An art movement that began in post–World War II Western art, most strongly with American visual arts in the 1960s and early 1970s. It derives from the reductive aspects of Modernism and is often interpreted as a reaction against abstract expressionism.",
        },
        composition: {
          term: "Composition",
          def: "The placement or arrangement of visual elements in a work of art. It is the organization of the elements of art according to the principles of art.",
        },
        palette: {
          term: "Palette",
          def: "The range of colors used by an artist in a particular painting or work.",
        },
        perspective: {
          term: "Perspective",
          def: "The art of drawing solid objects on a two-dimensional surface so as to give the right impression of their height, width, depth, and position in relation to each other when viewed from a particular point.",
        },
        iconography: {
          term: "Iconography",
          def: "The study of the identification, description, and the interpretation of the content of images: the subjects depicted, the particular compositions and details used to do so, and other elements that are distinct from artistic style.",
        },
    },
  },
  de: {
    view: {
      workspace: 'Arbeitsbereich',
      project: 'Projekt',
      discover: 'Entdecken',
      gallery: 'Galerie',
      gallerysuite: 'Galerie-Sammlung',
      studio: 'KI-Studio',
      journal: 'Journal',
      profile: 'Profil',
      setup: 'Einstellungen',
      help: 'Hilfe & Support',
      community: 'Community',
    },
    header: {
        openCommandPalette: 'Befehlspalette öffnen',
    },
    close: 'Schließen',
    back: 'Zurück',
    cancel: 'Abbrechen',
    save: 'Speichern',
    create: 'Erstellen',
    remove: 'Entfernen',
    retry: 'Erneut versuchen',
    loader: {
      generic: 'Art-i-Fact wird geladen...',
    },
    error: {
        api: {
            title: 'Ein Fehler ist aufgetreten',
        },
        taskFailed: 'Aufgabe fehlgeschlagen',
    },
    offline: {
        tooltip: 'Diese Funktion erfordert eine Internetverbindung.',
    },
    welcome: {
        title: 'Willkommen bei Art-i-Fact!',
        subtitle: 'Ihr persönlicher KI-gestützter Kunstkurator. Hier ist eine Kurzanleitung für den Einstieg:',
        cta: "Jetzt mit dem Kuratieren beginnen",
    },
    chat: {
      title: "Chat über '{{title}}'",
    },
    delete: {
        project: {
            title: "Projekt löschen",
            confirm: "Sind Sie sicher, dass Sie das Projekt '{{title}}' endgültig löschen möchten? Dadurch werden auch alle zugehörigen Galerien und Journaleinträge gelöscht. Diese Aktion kann nicht rückgängig gemacht werden."
        },
        gallery: {
            title: "Galerie löschen",
            confirm: "Sind Sie sicher, dass Sie die Galerie '{{title}}' endgültig löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        }
    },
    modal: {
      details: {
        addToGallery: "Zu Galerie hinzufügen",
        palette: "Dominante Farben",
        notes: "Notizen des Kurators",
      },
      addToGallery: {
        title: "Zu Galerie hinzufügen",
        create: "Neue Galerie erstellen",
        select: "Oder zu einer bestehenden Galerie hinzufügen",
        inProject: "Im aktuellen Projekt",
        other: "Andere Galerien",
        empty: "Sie haben noch keine Galerien. Erstellen Sie eine, um zu beginnen!",
      },
    },
    shareModal: {
        modal: {
            link: {
                title: 'Per Link teilen',
                description: 'Kopieren Sie diesen Link, um eine schreibgeschützte Version Ihrer Galerie zu teilen. Alle Daten sind im Link selbst kodiert.',
                copy: 'Link kopieren',
            },
            export: {
                title: 'Als Datei exportieren',
                description: 'Laden Sie die Galeriedaten als JSON-Datei herunter. Diese kann von einem anderen Art-i-Fact-Benutzer importiert werden.',
                button: 'Galerie-Datei exportieren',
            }
        }
    },
    artwork: {
        detailsLabel: "Details für {{title}} ansehen",
    },
    discover: {
      title: "Kunst entdecken",
      subtitle: "Finden Sie Inspiration in Millionen von gemeinfreien Kunstwerken.",
      search: {
        placeholder: "Suche nach Künstlern, Epochen oder Motiven...",
      },
      inspiration: "Brauchen Sie Inspiration?",
      featured: "Empfohlene Kunstwerke",
      error: "Kunstwerke konnten nicht geladen werden. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
      results: {
        none: "Keine Ergebnisse gefunden.",
        title: "Ergebnisse für \"{{query}}\"",
      },
    },
    gallery: {
      creator: {
        title: "Galerietitel",
        title_placeholder: "z.B. 'Meister des Impressionismus'",
        description: "Galeriebeschreibung",
        description_placeholder: "z.B. 'Eine Erkundung von Licht und Farbe...'",
      },
      new: "Neue Galerie",
      status: {
        draft: "Entwurf",
        published: "Veröffentlicht",
      },
      manager: {
        artworkCount_one: "1 Kunstwerk",
        artworkCount_other: "{{count}} Kunstwerke",
        empty: {
          title: "Ihre Sammlung ist leer",
          prompt: "Erstellen Sie Ihre erste Galerie, um mit dem Kuratieren zu beginnen.",
        },
        create: "Neue Galerie",
      },
      suite: {
        title: "Galerie-Sammlung",
      },
      actions: {
        duplicate: "Duplizieren",
      },
      critique: {
        modal: {
          critique: "KI-Kuratorenkritik",
          suggestions: "Verbesserungsvorschläge"
        }
      }
    },
    workspace: {
        title: "Arbeitsbereich",
        newProject: "Neues Projekt",
        editProject: "Projekt bearbeiten",
        empty: {
            title: "Willkommen in Ihrem Arbeitsbereich",
            prompt: "Erstellen Sie ein Projekt, um Ihre Galerien und Recherchen zu organisieren.",
            button: "Erstes Projekt erstellen",
        },
        project: {
            galleries_one: "1 Galerie",
            galleries_other: "{{count}} Galerien",
            journals_one: "1 Journal",
            journals_other: "{{count}} Journale",
            creator: {
                title: "Projekttitel",
                title_placeholder: "z.B. 'Recherche zur Barockkunst'",
                description: "Projektbeschreibung",
                description_placeholder: "Eine kurze Zusammenfassung der Ziele Ihres Projekts.",
            },
            notFound: {
                title: "Projekt nicht gefunden",
                message: "Das gesuchte Projekt existiert nicht oder wurde gelöscht.",
            }
        },
        // FIX: Renamed `newProject` to `newProjectDefaults` to avoid duplicate key error.
        newProjectDefaults: {
          defaultTitle: "Neues Projekt",
          defaultDesc: "Eine neue Sammlung von Galerien und Recherchen.",
        }
    },
    journal: {
        empty: {
            title: "Ihr Journal ist leer",
            prompt: "Erstellen Sie Ihren ersten Eintrag, um mit Ihrer Recherche zu beginnen.",
        },
        new: "Neuer Eintrag",
    },
    profile: {
        title: "Kuratorenprofil",
        edit: {
            title: "Profil bearbeiten",
            button: "Profil bearbeiten",
            username: "Benutzername",
            bio: "Biografie",
            avatar: "Avatar"
        },
        stats: {
            galleries: "Kuratierte Galerien",
            discovered: "Entdeckte Kunstwerke",
            created: "KI-Kunstwerke erstellt",
        },
    },
    settings: {
        title: "Einstellungen",
        general: {
            title: "Allgemein",
            language: {
                label: "UI-Sprache",
            },
            theme: {
                label: "Thema",
                dark: "Dunkel",
                light: "Hell",
                darkMode: "Dunkelmodus",
                lightMode: "Heller Modus",
                toggleDark: "Zum Dunkelmodus wechseln",
                toggleLight: "Zum Hellen Modus wechseln",
            },
            confirmDelete: {
                label: "Löschen bestätigen",
                desc: "Vor dem Löschen von Elementen einen Bestätigungsdialog anzeigen.",
            }
        },
        ai: {
            title: "KI-Assistent",
            creativity: {
                label: "KI-Kreativität",
                desc: "Steuern Sie die 'Temperatur' der KI-Antworten.",
                focused: "Fokussiert",
                balanced: "Ausgewogen",
                creative: "Kreativ",
            },
            results: {
                label: "KI-Suchergebnisse",
                desc: "Anzahl der Kunstwerke, die bei KI-gestützten Suchen gefunden werden sollen.",
            },
        },
        studio: {
            title: "Studio",
            enhancement: {
                label: "Stil der Prompt-Verbesserung",
                desc: "Wählen Sie den Standardstil für die Prompt-Verbesserung.",
                subtle: "Subtil",
                descriptive: "Beschreibend",
                artistic: "Künstlerisch",
            },
            clearPrompt: {
                label: "Prompt nach Generierung leeren",
                desc: "Leert automatisch die Prompteingabe nach jeder Bildgenerierung.",
            },
        },
        data: {
            title: "Datenverwaltung",
            export: {
                label: "Daten exportieren",
                desc: "Speichern Sie alle Ihre Projekte, Galerien und Einstellungen in einer Datei.",
                button: "Alle Daten exportieren",
            },
            import: {
                label: "Daten importieren",
                desc: "Importieren Sie Daten aus einer zuvor exportierten Datei.",
                button: "Aus Datei importieren",
            },
            reset: {
                label: "Anwendung zurücksetzen",
                desc: "Dies löscht alle Ihre Daten endgültig. Diese Aktion kann nicht rückgängig gemacht werden.",
                button: "Alle Daten zurücksetzen",
            },
        },
        about: {
            version: "Version 1.0.0",
            license: "Alle Rechte vorbehalten.",
        }
    },
     help: {
      title: "Hilfe & Support",
      glossary: {
        button: "Kunsthistorisches Glossar öffnen",
      },
      tutorial: {
        title: "Schnellstart-Anleitung",
        step1: {
          title: "1. Im Arbeitsbereich organisieren",
          content: "Erstellen Sie <strong>Projekte</strong>, um Ihre Sammlungen unterzubringen. Jedes Projekt ist ein dedizierter Raum für Ihre Galerien und Forschungsnotizen, um Ihre Arbeit ordentlich und fokussiert zu halten.",
        },
        step2: {
          title: "2. Entdecken & Sammeln",
          content: "Nutzen Sie die Seite <strong>Entdecken</strong>, um nach Millionen von Kunstwerken zu suchen. Wenn Sie etwas finden, das Ihnen gefällt, klicken Sie auf 'Zu Galerie hinzufügen', um es zu speichern.",
        },
        step3: {
          title: "3. Ihre Galerie kuratieren",
          content: "Erstellen Sie wunderschöne Ausstellungen in der <strong>Galerie-Sammlung</strong>. Fügen Sie Kunstwerke hinzu, schreiben Sie Beschreibungen und ordnen Sie sie per Drag-and-Drop neu an, um eine Erzählung zu schaffen.",
        },
        step4: {
          title: "4. Im KI-Studio erschaffen",
          content: "Finden Sie nicht das perfekte Werk? Erschaffen Sie es! Nutzen Sie das <strong>KI-Studio</strong>, um einzigartige Bilder aus Text-Prompts zu generieren oder bestehende zu remixen.",
        },
        step5: {
          title: "5. Im Journal recherchieren",
          content: "Verwenden Sie das <strong>Journal</strong>, um Notizen zu machen. Die Funktion 'Einblicke erhalten' nutzt KI, um Themen zu recherchieren und detaillierte Zusammenfassungen mit Quellen direkt in Ihrem Text bereitzustellen.",
        },
        step6: {
          title: "6. Ausstellen & Teilen",
          content: "Präsentieren Sie Ihre Arbeit im immersiven <strong>Ausstellungsmodus</strong>. Sie können sogar einen KI-Audioguide generieren und Ihre Galerie über einen einzigen Link mit anderen teilen.",
        },
      },
      tips: {
        title: "Profi-Tipps & Tricks",
        tip1: {
          title: "Nutzen Sie die Befehlspalette",
          content: "Drücken Sie <kbd>Strg</kbd> + <kbd>K</kbd> (oder <kbd>Cmd</kbd> + <kbd>K</kbd> auf dem Mac), um die Befehlspalette zu öffnen. Dies ist der schnellste Weg, um in der App zu navigieren und Aktionen auszuführen.",
        },
        tip2: {
          title: "Verbessern Sie Ihre KI-Prompts",
          content: "Wenn Sie im KI-Studio unsicher sind, was Sie schreiben sollen, geben Sie einfach eine simple Idee ein und klicken Sie auf 'Verbessern'. Die KI erweitert sie zu einem beschreibenderen und künstlerischeren Prompt für bessere Ergebnisse.",
        },
        tip3: {
          title: "Holen Sie sich eine KI-Kritik",
          content: "Sobald Ihre Galerie einige Werke enthält, verwenden Sie die 'Kritik'-Funktion. Die KI gibt Ihnen Feedback zum Thema und Fluss Ihrer Galerie und hilft Ihnen, Ihre kuratorischen Fähigkeiten zu verbessern.",
        },
        tip4: {
          title: "Ihre Daten gehören Ihnen",
          content: "Denken Sie daran, Ihre Daten regelmäßig unter <strong>Einstellungen → Datenverwaltung</strong> zu exportieren. Dadurch wird ein vollständiges Backup all Ihrer Arbeit erstellt, das Sie speichern oder später importieren können.",
        },
      },
      faq: {
        title: "Häufig gestellte Fragen",
        q1: {
          q: "Sind meine Daten privat?",
          a: "<strong>Ja.</strong> Alle Ihre Daten – Projekte, Galerien, Notizen und Einstellungen – werden ausschließlich in der lokalen Datenbank Ihres Browsers (IndexedDB) gespeichert. Nichts wird jemals auf einen Server hochgeladen, was vollständige Privatsphäre gewährleistet.",
        },
        q2: {
          q: "Kann ich diese App offline nutzen?",
          a: "<strong>Ja.</strong> Art-i-Fact ist eine Progressive Web App (PWA). Nach Ihrem ersten Besuch wird die Kernanwendung zwischengespeichert. Sie können alle Ihre bestehenden Projekte und Galerien ohne Internetverbindung öffnen und bearbeiten. KI-gestützte Funktionen benötigen eine Verbindung.",
        },
        q3: {
          q: "Wie funktioniert das Teilen ohne Server?",
          a: "Wenn Sie einen Freigabelink erstellen, wird der gesamte Inhalt dieser spezifischen Galerie komprimiert und direkt in die URL selbst kodiert. Wenn jemand den Link öffnet, entschlüsselt die App die Daten aus der URL und zeigt die Galerie an, ohne sie von einem Server abrufen zu müssen.",
        },
        q4: {
          q: "Dürfen die KI-generierten Bilder frei verwendet werden?",
          a: "Die Nutzungsrechte für von KI-Modellen generierte Bilder können komplex sein und hängen von den Nutzungsbedingungen des Modells ab. Bitte beziehen Sie sich auf die Nutzungsbedingungen von Google Generative AI für spezifische Anleitungen zur Verwendung der generierten Inhalte.",
        },
      },
      philosophy: {
        title: "Unsere Philosophie",
        content: "Art-i-Fact ist als kreativer Partner konzipiert, nicht nur als Werkzeug. Wir glauben, dass KI die menschliche Kreativität erweitern und nicht ersetzen sollte. Indem Sie Ihre einzigartige kuratorische Perspektive mit der analytischen und generativen Kraft der KI kombinieren, können Sie reichhaltigere, aufschlussreichere Kunsterlebnisse schaffen. Ihre Daten und Ihre Kreationen gehören Ihnen, und dieses Werkzeug soll Ihnen helfen, sie zum Leben zu erwecken.",
      }
    },
    toast: {
        settings: {
            reset: "Einstellungen wurden auf den Standard zurückgesetzt.",
            exported: "Ihre Daten wurden erfolgreich exportiert.",
            imported: "Daten erfolgreich importiert. Die App wird nun neu geladen.",
            importError: "Fehler beim Importieren der Daten. Die Datei ist möglicherweise beschädigt.",
            updated: "Einstellungen erfolgreich aktualisiert.",
        },
        ai: {
            thinking: "KI denkt nach...",
        },
        error: {
            gemini: "Der KI-Assistent ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.",
        },
        artwork: {
            added: "Kunstwerk zu '{{gallery}}' hinzugefügt.",
        },
        project: {
            deleted: "Projekt '{{title}}' gelöscht.",
        },
        gallery: {
            deleted: "Galerie '{{title}}' gelöscht.",
            duplicated: "Galerie '{{title}}' dupliziert.",
            imported: "Galerie '{{title}}' erfolgreich importiert.",
        },
        share: {
          linkCopied: "Freigabelink in die Zwischenablage kopiert.",
        }
    },
    commandPalette: {
        placeholder: "Befehl eingeben oder suchen...",
        noResults: "Keine Ergebnisse für \"{{query}}\"",
        sections: {
            general: "Allgemein",
        },
    },
    exhibition: {
        goToArtwork: "Gehe zu Kunstwerk {{number}}",
        transcript: "Transkript umschalten",
        exitFullscreen: "Vollbild beenden",
        toggleFullscreen: "Vollbild starten",
        curatedBy: "Kuratiert von {{username}}",
        audioPlaying: "Audioguide aktiv",
        audioMuted: "Audioguide stummgeschaltet",
    },
    camera: {
        error: {
            access: "Kamerazugriff fehlgeschlagen. Bitte überprüfen Sie Ihre Browser-Berechtigungen.",
        }
    },
    glossary: {
        title: "Kunsthistorisches Glossar",
        category: {
          techniques: "Techniken & Medien",
          eras: "Epochen & Strömungen",
          concepts: "Grundlegende Konzepte",
        },
        chiaroscuro: {
          term: "Chiaroscuro",
          def: "Eine künstlerische Technik, die starke Tonkontraste zwischen Hell und Dunkel verwendet, um dreidimensionale Formen zu modellieren, oft für dramatische Effekte.",
        },
        impasto: {
          term: "Impasto",
          def: "Eine Technik, bei der Farbe in sehr dicken Schichten auf eine Oberfläche aufgetragen wird, sodass die Pinsel- oder Spachtelstriche sichtbar sind.",
        },
        sfumato: {
          term: "Sfumato",
          def: "Eine Maltechnik zur Erweichung des Übergangs zwischen Farben, die einen Bereich nachahmt, der außerhalb des Fokus des menschlichen Auges liegt.",
        },
        tenebrism: {
          term: "Tenebrismus",
          def: "Eine dramatische Anwendung von Chiaroscuro, bei der die Dunkelheit ein dominierendes Merkmal des Bildes wird. Die Technik wurde entwickelt, um einem Bild durch einen Scheinwerfereffekt Dramatik zu verleihen.",
        },
        pointillism: {
          term: "Pointillismus",
          def: "Eine Maltechnik, bei der kleine, distinkte Farbpunkte in Mustern aufgetragen werden, um ein Bild zu formen. Das Auge des Betrachters mischt die Farben optisch.",
        },
        fresco: {
          term: "Fresko",
          def: "Eine Technik der Wandmalerei, die auf frisch gelegtem oder feuchtem Kalkputz ausgeführt wird. Wasser dient als Vehikel für das trockene Pigmentpulver, um mit dem Putz zu verschmelzen.",
        },
        renaissance: {
          term: "Renaissance",
          def: "Eine Periode der europäischen Geschichte (ca. 14.-17. Jh.), die den Übergang vom Mittelalter zur Neuzeit markiert und durch ein wiederbelebtes Interesse an der klassischen Antike gekennzeichnet ist.",
        },
        baroque: {
          term: "Barock",
          def: "Ein sehr kunstvoller und oft extravaganter Stil in Architektur, Musik, Tanz, Malerei, Skulptur und anderen Künsten, der in Europa vom frühen 17. bis Mitte des 18. Jahrhunderts blühte.",
        },
        rococo: {
          term: "Rokoko",
          def: "Ein außergewöhnlich ornamentaler und theatralischer Stil in Architektur, Kunst und Dekoration, der Asymmetrie, geschwungene Kurven und Vergoldungen kombiniert.",
        },
        impressionism: {
          term: "Impressionismus",
          def: "Eine Kunstbewegung des 19. Jahrhunderts, gekennzeichnet durch relativ kleine, dünne, aber sichtbare Pinselstriche, offene Komposition und die Betonung der genauen Darstellung des Lichts.",
        },
        cubism: {
          term: "Kubismus",
          def: "Eine avantgardistische Kunstbewegung des frühen 20. Jahrhunderts, die die europäische Malerei und Skulptur revolutionierte und verwandte Bewegungen in Musik, Literatur und Architektur inspirierte.",
        },
        surrealism: {
          term: "Surrealismus",
          def: "Eine Kulturbewegung, die sich in Europa nach dem Ersten Weltkrieg entwickelte und stark von Dada beeinflusst wurde. Am bekanntesten für ihre visuellen Kunstwerke und Schriften.",
        },
        popart: {
          term: "Pop Art",
          def: "Eine Kunstbewegung, die in den mittleren bis späten 1950er Jahren in Großbritannien und den USA aufkam. Sie forderte die Traditionen der bildenden Kunst heraus, indem sie Bilder aus der Populär- und Massenkultur einbezog.",
        },
        minimalism: {
          term: "Minimalismus",
          def: "Eine Kunstbewegung, die in der westlichen Kunst nach dem Zweiten Weltkrieg begann, am stärksten in der amerikanischen bildenden Kunst der 1960er und frühen 1970er Jahre. Sie leitet sich von den reduktiven Aspekten der Moderne ab.",
        },
        composition: {
          term: "Komposition",
          def: "Die Platzierung oder Anordnung visueller Elemente in einem Kunstwerk. Es ist die Organisation der Elemente der Kunst nach den Prinzipien der Kunst.",
        },
        palette: {
          term: "Palette",
          def: "Der Farbbereich, den ein Künstler in einem bestimmten Gemälde oder Werk verwendet.",
        },
        perspective: {
          term: "Perspektive",
          def: "Die Kunst, feste Objekte auf einer zweidimensionalen Oberfläche so zu zeichnen, dass der richtige Eindruck ihrer Höhe, Breite, Tiefe und Position im Verhältnis zueinander entsteht.",
        },
        iconography: {
          term: "Ikonographie",
          def: "Die Lehre von der Identifizierung, Beschreibung und Interpretation des Inhalts von Bildern: die dargestellten Motive, die dafür verwendeten Kompositionen und Details sowie andere Elemente, die sich vom künstlerischen Stil unterscheiden.",
        },
    },
  },
};