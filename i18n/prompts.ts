type PromptCollection = {
    [lang in 'de' | 'en']: {
        deepDive: (title: string, artist: string, description: string) => string;
        critique: (title: string, artworkListJson: string) => string;
        audioGuide: (title: string, curator: string, artworkDataJson: string) => string;
        journal: (topic: string) => string;
        chatSystemInstruction: (title: string, artist: string, description: string) => string;
        enhance: (prompt: string) => string;
    }
}

export const prompts: PromptCollection = {
    'en': {
        deepDive: (title, artist, description) => `Provide a "deep dive" analysis for the artwork titled "${title}" by ${artist}. Here is a description of the artwork: "${description}". Focus on symbolism, the artist's context, and the technique used. Respond in English.`,
        critique: (title, artworkListJson) => `Critique the thematic coherence and narrative flow of a virtual art gallery titled "${title}". The gallery contains the following artworks (with descriptions): ${artworkListJson}. Provide a professional, constructive critique and offer three specific suggestions for other artworks that could enhance the theme. Respond in English.`,
        audioGuide: (title, curator, artworkDataJson) => `Generate a script for an engaging, conversational audio guide for a gallery titled "${title}", curated by ${curator}. The script should have a welcoming introduction and a segment for each artwork. Here are the artworks: ${artworkDataJson}. The entire script must be in English.`,
        journal: (topic) => `Provide some thoughtful insights and reflection points about the following topic in art: "${topic}". Ground your response in verifiable facts and provide a comprehensive overview. Write it as a single block of text in English.`,
        chatSystemInstruction: (title, artist, description) => `You are an engaging and knowledgeable art historian. You are discussing the artwork "${title}" by ${artist}. Be conversational and provide interesting facts and interpretations. The artwork's description is: "${description}". Respond in English.`,
        enhance: (prompt) => `Rewrite and enrich this user's prompt for an AI image generator. Your goal is to make it more descriptive, visually rich, and evocative, incorporating details about art styles (e.g., oil painting, watercolor, cubism), composition, lighting, and mood. The final output MUST be a single, enhanced prompt in English, suitable for an AI image generator. Do not add any other text, explanation, or quotation marks. User's prompt: "${prompt}"`
    },
    'de': {
        deepDive: (title, artist, description) => `Erstelle eine "Tiefenanalyse" für das Kunstwerk mit dem Titel "${title}" von ${artist}. Hier ist eine Beschreibung des Kunstwerks: "${description}". Konzentriere dich auf Symbolik, den Kontext des Künstlers und die verwendete Technik. Antworte auf Deutsch.`,
        critique: (title, artworkListJson) => `Kritisiere die thematische Kohärenz und den narrativen Fluss einer virtuellen Kunstgalerie mit dem Titel "${title}". Die Galerie enthält die folgenden Kunstwerke (mit Beschreibungen): ${artworkListJson}. Liefere eine professionelle, konstruktive Kritik und mache drei konkrete Vorschläge für andere Kunstwerke, die das Thema bereichern könnten. Antworte auf Deutsch.`,
        audioGuide: (title, curator, artworkDataJson) => `Erstelle ein Skript für einen ansprechenden, unterhaltsamen Audioguide für eine Galerie mit dem Titel "${title}", kuratiert von ${curator}. Das Skript sollte eine einladende Einleitung und einen Abschnitt für jedes Kunstwerk haben. Hier sind die Kunstwerke: ${artworkDataJson}. Das gesamte Skript muss auf Deutsch sein.`,
        journal: (topic) => `Gib einige durchdachte Einblicke und Reflexionspunkte zum folgenden Thema in der Kunst: "${topic}". Stütze deine Antwort auf überprüfbare Fakten und gib einen umfassenden Überblick. Schreibe es als einen einzigen Textblock auf Deutsch.`,
        chatSystemInstruction: (title, artist, description) => `Du bist ein fesselnder und sachkundiger Kunsthistoriker. Du diskutierst das Kunstwerk "${title}" von ${artist}. Sei gesprächig und liefere interessante Fakten und Interpretationen. Die Beschreibung des Kunstwerks lautet: "${description}". Antworte auf Deutsch.`,
        enhance: (prompt) => `Schreibe den Prompt dieses Benutzers für einen KI-Bildgenerator um und reichere ihn an. Dein Ziel ist es, ihn beschreibender, visuell reicher und evokativer zu machen, indem du Details zu Kunststilen (z.B. Ölgemälde, Aquarell, Kubismus), Komposition, Beleuchtung und Stimmung einbeziehst. Die endgültige Ausgabe MUSS ein einzelner, verbesserter Prompt auf Englisch sein, der für einen KI-Bildgenerator geeignet ist. Füge keinen weiteren Text, keine Erklärungen oder Anführungszeichen hinzu. Benutzer-Prompt: "${prompt}"`
    }
};