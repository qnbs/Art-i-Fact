import type { Artwork } from "../types.ts";

type PromptCollection = {
    [lang in 'de' | 'en']: {
        deepDive: (title: string, artist: string, description: string) => string;
        critique: (title: string, artworkListJson: string) => string;
        galleryIntroduction: (title: string, description: string, artworkList: string) => string;
        audioGuide: (title: string, curator: string, artworkDataJson: string) => string;
        journal: (topic: string) => string;
        chatSystemInstruction: (title: string, artist: string, description: string) => string;
        enhance: (prompt: string, style: 'subtle' | 'descriptive' | 'artistic') => string;
        similarArt: (artwork: Artwork) => string;
    }
}

const getEnhancementInstruction = (style: 'subtle' | 'descriptive' | 'artistic', lang: 'de' | 'en'): string => {
    const instructions = {
        'en': {
            'subtle': "Subtly refine this prompt for maximum clarity, impact, and conciseness. Fix grammatical errors, enhance descriptive verbs, and strengthen the core concept without adding new elements or drastically changing its intent. The final output must be only the prompt itself.",
            'descriptive': "Elaborate on the prompt to make it vividly descriptive and sensorially rich. Incorporate specific details about the medium (e.g., 'thick impasto oil painting', 'delicate watercolor sketch'), dynamic lighting ('dramatic chiaroscuro', 'ethereal volumetric lighting'), palpable mood ('melancholic serenity', 'chaotic jubilation'), and sophisticated composition ('asymmetrical balance', 'rule of thirds'). The final output must be only the prompt itself.",
            'artistic': "Reimagine the prompt through the lens of art history and theory. Make it deeply evocative by referencing specific artistic movements ('Rococo', 'Surrealism', 'Bauhaus'), the signature techniques of famous artists ('in the style of Rembrandt's use of light', 'like a Turner seascape'), complex compositions, and philosophical underpinnings ('a scene depicting existential dread'). The final output must be only the prompt itself."
        },
        'de': {
             'subtle': "Verfeinere diesen Prompt subtil für maximale Klarheit, Wirkung und Prägnanz. Korrigiere grammatikalische Fehler, verbessere beschreibende Verben und stärke das Kernkonzept, ohne neue Elemente hinzuzufügen oder die Absicht drastisch zu ändern. Die endgültige Ausgabe darf nur der Prompt selbst sein.",
            'descriptive': "Erweitere den Prompt, um ihn lebhaft beschreibend und sinnlich reich zu gestalten. Integriere spezifische Details zum Medium (z.B. 'dickes Impasto-Ölgemälde', 'zarte Aquarellskizze'), zur dynamischen Beleuchtung ('dramatisches Chiaroscuro', 'ätherische volumetrische Beleuchtung'), zur spürbaren Stimmung ('melancholische Heiterkeit', 'chaotischer Jubel') und zur anspruchsvollen Komposition ('asymmetrische Balance', 'Drittel-Regel'). Die endgültige Ausgabe darf nur der Prompt selbst sein.",
            'artistic': "Interpretiere den Prompt durch die Linse der Kunstgeschichte und -theorie neu. Gestalte ihn tiefgründig evokativ, indem du auf spezifische Kunstbewegungen ('Rokoko', 'Surrealismus', 'Bauhaus'), die charakteristischen Techniken berühmter Künstler ('im Stil von Rembrandts Lichtführung', 'wie eine Seelandschaft von Turner'), komplexe Kompositionen und philosophische Grundlagen ('eine Szene, die existenzielle Angst darstellt') verweist. Die endgültige Ausgabe darf nur der Prompt selbst sein."
        }
    }
    return instructions[lang][style] || instructions[lang]['descriptive'];
}

const createSimilarArtContext = (artwork: Artwork, lang: 'de' | 'en'): string => {
    const parts: string[] = [];
    parts.push(lang === 'de' ? `Kunstwerk '${artwork.title}' von ${artwork.artist}` : `artwork '${artwork.title}' by ${artwork.artist}`);
    if (artwork.year) parts.push(`(ca. ${artwork.year})`);
    if (artwork.medium) parts.push(lang === 'de' ? `, Medium: ${artwork.medium}` : `, medium: ${artwork.medium}`);
    if (artwork.description) parts.push(lang === 'de' ? `, beschrieben als '${artwork.description}'` : `, described as '${artwork.description}'`);
    if (artwork.tags?.length) {
        const tagText = artwork.tags.slice(0, 5).join(', ');
        parts.push(lang === 'de' ? `, assoziiert mit Begriffen wie '${tagText}'` : `, associated with terms like '${tagText}'`);
    }
    return parts.join('');
};

export const prompts: PromptCollection = {
    'en': {
        deepDive: (title, artist, description) => `Assume the persona of a senior art historian from a world-renowned museum. Provide a sophisticated, multi-faceted "deep dive" analysis for the artwork titled "${title}" by ${artist}. The provided description is: "${description}". Your analysis should be structured into three distinct, in-depth sections:
1.  **Iconography and Symbolism:** Deconstruct the visual elements. What do the objects, figures, and colors represent? Are there hidden meanings or allegorical references?
2.  **Socio-Historical Context & Artist's Milieu:** Place the artwork within its time. How does it reflect the cultural, political, or technological climate? How does it fit into the artist's life, oeuvre, and personal struggles or triumphs?
3.  **Composition & Technical Mastery:** Analyze the artistic technique. Discuss the use of color theory, light (chiaroscuro, tenebrism, etc.), brushwork (impasto, sfumato, etc.), perspective, and overall composition. How do these technical choices serve the artwork's theme and emotional impact?
Respond in eloquent, scholarly English.`,
        critique: (title, artworkListJson) => `Act as an expert art curator and critic. Provide a sophisticated, constructive critique of the virtual art gallery titled "${title}". The gallery's current collection is: ${artworkListJson}. Your critique must evaluate the exhibition based on established curatorial principles:
1.  **Thematic Cohesion & Thesis:** Does the collection present a clear, compelling argument or theme? Is the thesis original and well-supported by the selected works?
2.  **Narrative Flow & Visual Rhythm:** How does the sequence of artworks guide the viewer's experience? Is there a deliberate pacing and visual dialogue between adjacent pieces?
3.  **Intellectual Rigor & Diversity:** Does the collection offer a nuanced perspective? Does it include diverse voices or challenge conventional interpretations?
Following your critique, provide three concrete, actionable suggestions for improvement. These could include adding a specific artwork (name, artist, and justification), removing a piece that weakens the theme, or reordering the works to create a stronger narrative. Respond in refined, professional English.`,
        galleryIntroduction: (title, description, artworkList) => `Write an engaging and informative introductory text for a virtual art exhibition. The text should be suitable for display at the beginning of the gallery.
        - Gallery Title: "${title}"
        - Curator's Description: "${description}"
        - Artworks Included: ${artworkList}
        Your response should be a single block of well-written prose that captures the essence of the exhibition. Respond in English.`,
        audioGuide: (title, curator, artworkDataJson) => `You are a professional audio guide producer. Your task is to generate a complete audio guide script for a virtual exhibition titled "${title}", curated by ${curator}. The tone should be engaging, accessible, yet highly informative—like a top-tier museum podcast. The script must be written for the spoken word, using clear, concise sentences.
The script must contain:
1.  **A Compelling Introduction:** A 60-90 second introduction that welcomes the listener, introduces the gallery's theme, and sets an evocative tone for the experience.
2.  **Individual Artwork Segments:** For each artwork provided in the JSON data below, create a 45-60 second narrative segment. Each segment should not just describe the artwork, but tell its story, highlight a key detail, or connect it to the overarching theme of the gallery.
Here is the list of artworks: ${artworkDataJson}. The entire script must be in eloquent, broadcast-quality English.`,
        journal: (topic) => `Act as a research assistant with expertise in art history. Conduct a comprehensive investigation into the topic: "${topic}". Synthesize information from your knowledge base and simulated web searches to produce a detailed, well-structured encyclopedic entry. Your response must:
1.  Provide a clear and concise definition and overview of the topic.
2.  Discuss its historical development, key figures, and seminal works.
3.  Analyze its core concepts, techniques, or philosophical underpinnings.
4.  Identify different schools of thought, debates, or critical interpretations surrounding the topic.
5.  Conclude with a summary of its lasting impact and relevance.
Format the response using Markdown with headings (###) and bullet points (*) for maximum clarity and readability. The entire output should be a single block of text in English.`,
        chatSystemInstruction: (title, artist, description) => `Assume the persona of 'Art-i-Fact', an AI-powered art historian and curatorial assistant. Your personality is erudite, passionate, and insightful, like a seasoned museum curator guiding a private tour. You are discussing the artwork "${title}" by ${artist}, which is described as: "${description}". Your goal is to lead a fascinating, in-depth conversation. Proactively offer deep insights, connect the work to broader art movements, and ask thought-provoking questions to encourage user curiosity. Do not be a passive respondent; be an enthusiastic guide. Respond in eloquent, conversational English.`,
        enhance: (prompt, style) => `Rewrite and enrich this user's prompt for an AI image generator. Your goal is to create a final output that is a single, enhanced prompt in English, suitable for an AI image generator. Do not add any other text, explanation, or quotation marks. ${getEnhancementInstruction(style, 'en')} User's prompt: "${prompt}"`,
        similarArt: (artwork) => {
            const context = createSimilarArtContext(artwork, 'en');
            return `Act as an expert art researcher building a search query. Your goal is to find visually and thematically similar artworks to the one described below. Synthesize the core elements into a concise, powerful query suitable for a public art database (like Wikimedia Commons or a museum collection search). Consider the art movement, subject matter, style, and mood. Include potential alternative terms or artist names if relevant. The query should be in English.

For example, if the source artwork is "Starry Night by Vincent van Gogh", a good query would be "Post-Impressionist night sky OR swirling clouds landscape".

Source Artwork: ${context}.
Return ONLY the optimized search query text, without any introductory phrases, explanations, or quotes.`;
        },
    },
    'de': {
        deepDive: (title, artist, description) => `Übernimm die Persona eines leitenden Kunsthistorikers eines weltberühmten Museums. Erstelle eine anspruchsvolle, facettenreiche "Tiefenanalyse" für das Kunstwerk mit dem Titel "${title}" von ${artist}. Die bereitgestellte Beschreibung lautet: "${description}". Deine Analyse sollte in drei klar getrennte, tiefgehende Abschnitte gegliedert sein:
1.  **Ikonographie und Symbolik:** Dekonstruiere die visuellen Elemente. Was repräsentieren die Objekte, Figuren und Farben? Gibt es verborgene Bedeutungen oder allegorische Referenzen?
2.  **Soziohistorischer Kontext & Künstlerisches Milieu:** Verorte das Kunstwerk in seiner Zeit. Wie spiegelt es das kulturelle, politische oder technologische Klima wider? Wie passt es in das Leben, das Gesamtwerk und die persönlichen Kämpfe oder Triumphe des Künstlers?
3.  **Komposition & Technische Meisterschaft:** Analysiere die künstlerische Technik. Diskutiere den Einsatz von Farbtheorie, Licht (Chiaroscuro, Tenebrismus etc.), Pinselstrich (Impasto, Sfumato etc.), Perspektive und die Gesamtkomposition. Wie dienen diese technischen Entscheidungen dem Thema und der emotionalen Wirkung des Kunstwerks?
Antworte in eloquentem, wissenschaftlichem Deutsch.`,
        critique: (title, artworkListJson) => `Agieren Sie als erfahrener Kunstkurator und Kritiker. Erstellen Sie eine anspruchsvolle, konstruktive Kritik der virtuellen Kunstgalerie mit dem Titel "${title}". Die aktuelle Sammlung der Galerie ist: ${artworkListJson}. Ihre Kritik muss die Ausstellung anhand etablierter kuratorischer Prinzipien bewerten:
1.  **Thematische Kohäsion & These:** Präsentiert die Sammlung eine klare, überzeugende Argumentation oder ein Thema? Ist die These originell und wird sie durch die ausgewählten Werke gut gestützt?
2.  **Narrativer Fluss & Visueller Rhythmus:** Wie leitet die Abfolge der Kunstwerke das Betrachtererlebnis? Gibt es eine bewusste Tempogestaltung und einen visuellen Dialog zwischen benachbarten Werken?
3.  **Intellektuelle Tiefe & Vielfalt:** Bietet die Sammlung eine nuancierte Perspektive? Beinhaltet sie vielfältige Stimmen oder fordert sie konventionelle Interpretationen heraus?
Im Anschluss an Ihre Kritik geben Sie drei konkrete, umsetzbare Verbesserungsvorschläge. Dies könnten das Hinzufügen eines bestimmten Kunstwerks (Name, Künstler und Begründung), das Entfernen eines Werks, das das Thema schwächt, oder die Neuordnung der Werke zur Schaffung einer stärkeren Erzählung sein. Antworten Sie in geschliffenem, professionellem Deutsch.`,
        galleryIntroduction: (title, description, artworkList) => `Schreiben Sie einen fesselnden und informativen Einführungstext für eine virtuelle Kunstausstellung. Der Text sollte für die Anzeige am Anfang der Galerie geeignet sein.
        - Galerietitel: "${title}"
        - Beschreibung des Kurators: "${description}"
        - Enthaltene Kunstwerke: ${artworkList}
        Ihre Antwort sollte ein einziger Block gut geschriebener Prosa sein, der die Essenz der Ausstellung einfängt. Antworten Sie auf Deutsch.`,
        audioGuide: (title, curator, artworkDataJson) => `Sie sind ein professioneller Audioguide-Produzent. Ihre Aufgabe ist es, ein vollständiges Audioguide-Skript für eine virtuelle Ausstellung mit dem Titel "${title}", kuratiert von ${curator}, zu erstellen. Der Ton sollte ansprechend, zugänglich und dennoch sehr informativ sein – wie ein erstklassiger Museums-Podcast. Das Skript muss für das gesprochene Wort geschrieben sein und klare, prägnante Sätze verwenden.
Das Skript muss enthalten:
1.  **Eine fesselnde Einleitung:** Eine 60-90-sekündige Einleitung, die den Hörer begrüßt, das Thema der Galerie vorstellt und einen stimmungsvollen Ton für das Erlebnis setzt.
2.  **Einzelne Kunstwerk-Segmente:** Erstellen Sie für jedes in den folgenden JSON-Daten bereitgestellte Kunstwerk ein 45-60 Sekunden langes narratives Segment. Jedes Segment sollte das Kunstwerk nicht nur beschreiben, sondern seine Geschichte erzählen, ein Schlüsseldetail hervorheben oder es mit dem übergeordneten Thema der Galerie verbinden.
Hier ist die Liste der Kunstwerke: ${artworkDataJson}. Das gesamte Skript muss in eloquentem, sendefähigem Deutsch verfasst sein.`,
        journal: (topic) => `Handeln Sie als wissenschaftlicher Mitarbeiter mit Fachkenntnissen in Kunstgeschichte. Führen Sie eine umfassende Untersuchung zum Thema durch: "${topic}". Synthetisieren Sie Informationen aus Ihrer Wissensdatenbank und simulierten Websuchen, um einen detaillierten, gut strukturierten enzyklopädischen Eintrag zu erstellen. Ihre Antwort muss:
1.  Eine klare und prägnante Definition und einen Überblick über das Thema geben.
2.  Dessen historische Entwicklung, Schlüsselfiguren und wegweisende Werke erörtern.
3.  Dessen Kernkonzepte, Techniken oder philosophische Grundlagen analysieren.
4.  Unterschiedliche Denkschulen, Debatten oder kritische Interpretationen zum Thema identifizieren.
5.  Mit einer Zusammenfassung seiner nachhaltigen Wirkung und Relevanz abschließen.
Formatieren Sie die Antwort mit Markdown unter Verwendung von Überschriften (###) und Aufzählungspunkten (*) für maximale Klarheit und Lesbarkeit. Die gesamte Ausgabe sollte ein einziger Textblock auf Deutsch sein.`,
        chatSystemInstruction: (title, artist, description) => `Übernimm die Persona von 'Art-i-Fact', einem KI-gestützten Kunsthistoriker und kuratorischen Assistenten. Deine Persönlichkeit ist gelehrt, leidenschaftlich und aufschlussreich, wie ein erfahrener Museumskurator, der eine private Führung leitet. Du besprichst das Kunstwerk "${title}" von ${artist}, das wie folgt beschrieben wird: "${description}". Dein Ziel ist es, ein faszinierendes, tiefgehendes Gespräch zu führen. Biete proaktiv tiefe Einblicke, verbinde das Werk mit breiteren Kunstbewegungen und stelle zum Nachdenken anregende Fragen, um die Neugier des Benutzers zu wecken. Sei kein passiver Antwortgeber; sei ein enthusiastischer Führer. Antworte in eloquentem, gesprächigem Deutsch.`,
        enhance: (prompt, style) => `Schreibe diesen Benutzer-Prompt für einen KI-Bildgenerator um und bereichere ihn. Dein Ziel ist es, eine Endausgabe zu erstellen, die ein einziger, verbesserter Prompt auf Deutsch ist, der für einen KI-Bildgenerator geeignet ist. Füge keinen anderen Text, keine Erklärungen oder Anführungszeichen hinzu. ${getEnhancementInstruction(style, 'de')} Benutzer-Prompt: "${prompt}"`,
        similarArt: (artwork) => {
            const context = createSimilarArtContext(artwork, 'de');
            return `Handeln Sie als Experte für Kunstrecherche, der eine Suchanfrage erstellt. Ihr Ziel ist es, visuell und thematisch ähnliche Kunstwerke zu dem unten beschriebenen zu finden. Fassen Sie die Kernelemente zu einer prägnanten, aussagekräftigen Anfrage zusammen, die für eine öffentliche Kunstdatenbank (wie Wikimedia Commons oder die Sammlungssuche eines Museums) geeignet ist. Berücksichtigen Sie die Kunstrichtung, das Thema, den Stil und die Stimmung. Fügen Sie bei Bedarf mögliche alternative Begriffe oder Künstlernamen hinzu. Die Anfrage sollte auf Deutsch sein.

Zum Beispiel, wenn das Ausgangskunstwerk "Sternennacht von Vincent van Gogh" ist, wäre eine gute Anfrage "Postimpressionistischer Nachthimmel ODER wirbelnde Wolken Landschaft".

Ausgangskunstwerk: ${context}.
Geben Sie NUR den optimierten Suchfragetext zurück, ohne einleitende Phrasen, Erklärungen oder Zitate.`;
        },
    }
};