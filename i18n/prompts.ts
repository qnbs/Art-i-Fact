import type { Artwork } from "../types";

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
            'subtle': "Subtly refine this prompt for clarity and conciseness. Fix grammatical errors and strengthen the core concept without drastically changing it. The final output must be only the prompt itself.",
            'descriptive': "Make it more descriptive and visually rich. Incorporate specific details about the medium (e.g., 'oil painting', 'watercolor sketch'), lighting ('cinematic lighting', 'soft morning light'), mood ('serene', 'chaotic'), and composition. The final output must be only the prompt itself.",
            'artistic': "Make it more evocative by referencing specific art history styles ('Baroque', 'Cubism', 'Impressionism'), famous artist techniques ('chiaroscuro', 'impasto'), and complex compositions. The final output must be only the prompt itself."
        },
        'de': {
             'subtle': "Verfeinere diesen Prompt subtil für Klarheit und Prägnanz. Korrigiere grammatikalische Fehler und stärke das Kernkonzept, ohne es drastisch zu verändern. Die endgültige Ausgabe darf nur der Prompt selbst sein.",
            'descriptive': "Gestalte ihn beschreibender und visuell reicher. Integriere spezifische Details zum Medium (z.B. 'Ölgemälde', 'Aquarellskizze'), zur Beleuchtung ('filmische Beleuchtung', 'weiches Morgenlicht'), zur Stimmung ('heiter', 'chaotisch') und zur Komposition. Die endgültige Ausgabe darf nur der Prompt selbst sein.",
            'artistic': "Gestalte ihn evokativer, indem du auf spezifische kunsthistorische Stile ('Barock', 'Kubismus', 'Impressionismus'), Techniken berühmter Künstler ('Chiaroscuro', 'Impasto') und komplexe Kompositionen verweist. Die endgültige Ausgabe darf nur der Prompt selbst sein."
        }
    }
    return instructions[lang][style] || instructions[lang]['descriptive'];
}

export const prompts: PromptCollection = {
    'en': {
        deepDive: (title, artist, description) => `Provide a "deep dive" analysis for the artwork titled "${title}" by ${artist}. Here is a description of the artwork: "${description}". Focus on symbolism, the artist's context, and the technique used. Respond in English.`,
        critique: (title, artworkListJson) => `Critique the thematic coherence and narrative flow of a virtual art gallery titled "${title}". The gallery contains the following artworks (with descriptions): ${artworkListJson}. Provide a professional, constructive critique and offer three specific suggestions for other artworks that could enhance the theme. Respond in English.`,
        galleryIntroduction: (title, description, artworkList) => `Write an engaging and informative introductory text for a virtual art exhibition. The text should be suitable for display at the beginning of the gallery.
        - Gallery Title: "${title}"
        - Curator's Description: "${description}"
        - Artworks Included: ${artworkList}
        Your response should be a single block of well-written prose that captures the essence of the exhibition. Respond in English.`,
        audioGuide: (title, curator, artworkDataJson) => `Generate a script for an engaging, conversational audio guide for a gallery titled "${title}", curated by ${curator}. The script should have a welcoming introduction and a segment for each artwork. Here are the artworks: ${artworkDataJson}. The entire script must be in English.`,
        journal: (topic) => `Provide some thoughtful insights and reflection points about the following topic in art: "${topic}". Ground your response in verifiable facts and provide a comprehensive overview. Structure your response with headings (using '###') and bullet points (using '*') where appropriate for clarity. Write it as a single block of text in English.`,
        chatSystemInstruction: (title, artist, description) => `You are an engaging and knowledgeable art historian. You are discussing the artwork "${title}" by ${artist}. Be conversational and provide interesting facts and interpretations. The artwork's description is: "${description}". Respond in English.`,
        enhance: (prompt, style) => `Rewrite and enrich this user's prompt for an AI image generator. Your goal is to create a final output that is a single, enhanced prompt in English, suitable for an AI image generator. Do not add any other text, explanation, or quotation marks. ${getEnhancementInstruction(style, 'en')} User's prompt: "${prompt}"`,
        similarArt: (artwork) => `Given the artwork '${artwork.title}' by ${artwork.artist}, described as '${artwork.description}', which is associated with terms like '${artwork.tags?.slice(0, 5).join(', ')}', generate a concise search query for a public art database (like Wikimedia Commons) to find other artworks that are visually and thematically similar. The query should be in English. Return ONLY the search query text, without any introductory phrases or quotes.`,
    },
    'de': {
        deepDive: (title, artist, description) => `Erstelle eine "Tiefenanalyse" für das Kunstwerk mit dem Titel "${title}" von ${artist}. Hier ist eine Beschreibung des Kunstwerks: "${description}". Konzentriere dich auf Symbolik, den Kontext des Künstlers und die verwendete Technik. Antworte auf Deutsch.`,
        critique: (title, artworkListJson) => `Kritisiere die thematische Kohärenz und den narrativen Fluss einer virtuellen Kunstgalerie mit dem Titel "${title}". Die Galerie enthält die folgenden Kunstwerke (mit Beschreibungen): ${artworkListJson}. Liefere eine professionelle, konstruktive Kritik und mache drei konkrete Vorschläge für andere Kunstwerke, die das Thema bereichern könnten. Antworte auf Deutsch.`,
        galleryIntroduction: (title, description, artworkList) => `Schreibe einen fesselnden und informativen Einleitungstext für eine virtuelle Kunstausstellung. Der Text sollte für die Anzeige am Anfang der Galerie geeignet sein.
        - Titel der Galerie: "${title}"
        - Beschreibung des Kurators: "${description}"
        - Enthaltene Kunstwerke: ${artworkList}
        Deine Antwort sollte ein einzelner, gut geschriebener Prosatext sein, der die Essenz der Ausstellung einfängt. Antworte auf Deutsch.`,
        audioGuide: (title, curator, artworkDataJson) => `Erstelle ein Skript für einen ansprechenden, unterhaltsamen Audioguide für eine Galerie mit dem Titel "${title}", kuratiert von ${curator}. Das Skript sollte eine einladende Einleitung und einen Abschnitt für jedes Kunstwerk haben. Hier sind die Kunstwerke: ${artworkDataJson}. Das gesamte Skript muss auf Deutsch sein.`,
        journal: (topic) => `Gib einige durchdachte Einblicke und Reflexionspunkte zum folgenden Thema in der Kunst: "${topic}". Stütze deine Antwort auf überprüfbare Fakten und gib einen umfassenden Überblick. Strukturiere deine Antwort mit Überschriften (mit '###') und Aufzählungspunkten (mit '*') wo es für die Klarheit sinnvoll ist. Schreibe es als einen einzigen Textblock auf Deutsch.`,
        chatSystemInstruction: (title, artist, description) => `Du bist ein fesselnder und sachkundiger Kunsthistoriker. Du diskutierst das Kunstwerk "${title}" von ${artist}. Sei gesprächig und liefere interessante Fakten und Interpretationen. Die Beschreibung des Kunstwerks lautet: "${description}". Antworte auf Deutsch.`,
        enhance: (prompt, style) => `Schreibe den Prompt dieses Benutzers für einen KI-Bildgenerator um und reichere ihn an. Dein Ziel ist es, eine endgültige Ausgabe zu erstellen, die ein einzelner, verbesserter Prompt auf Englisch ist, der für einen KI-Bildgenerator geeignet ist. Füge keinen weiteren Text, keine Erklärungen oder Anführungszeichen hinzu. ${getEnhancementInstruction(style, 'de')} Benutzer-Prompt: "${prompt}"`,
        similarArt: (artwork) => `Gegeben das Kunstwerk '${artwork.title}' von ${artwork.artist}, beschrieben als '${artwork.description}', das mit Begriffen wie '${artwork.tags?.slice(0, 5).join(', ')}' assoziiert wird. Generiere eine prägnante Suchanfrage für eine öffentliche Kunst-Datenbank (wie Wikimedia Commons), um andere visuell und thematisch ähnliche Kunstwerke zu finden. Die Anfrage sollte auf Deutsch sein. Gib NUR den Text der Suchanfrage zurück, ohne einleitende Sätze oder Anführungszeichen.`,
    }
};