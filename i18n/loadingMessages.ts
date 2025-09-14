type LoadingMessages = {
    [lang in 'de' | 'en']: {
        generic: string[];
        deepDive: string[];
        critique: string[];
        audioGuide: string[];
        video: string[];
        journal: string[];
        enhance: string[];
        studioGenerate: string[];
        remix: string[];
    }
}

export const loadingMessages: LoadingMessages = {
    'de': {
        generic: ['KI-Assistent wird initialisiert...', 'Verarbeite Anfrage...', 'Moment bitte...'],
        deepDive: ['Studiere die Komposition...', 'Untersuche den historischen Kontext...', 'Deute die Symbolik...', 'Formuliere die Analyse...'],
        critique: ['Bewerte die Auswahl der Kunstwerke...', 'Analysiere den narrativen Fluss...', 'Prüfe die thematische Kohärenz...', 'Formuliere Verbesserungsvorschläge...'],
        audioGuide: ['Entwickle ein Ausstellungskonzept...', 'Schreibe die Einleitung...', 'Verfasse Skripte für jedes Kunstwerk...', 'Stelle den Audioguide zusammen...'],
        video: ['Analysiere die Stimmung der Galerie...', 'Wähle Schlüsselbilder aus...', 'Plane filmische Sequenzen...', 'Rendere die Video-Assets...'],
        journal: ['Recherchiere das Thema im Web...', 'Synthetisiere Informationen aus Quellen...', 'Strukturiere die Erkenntnisse...', 'Schreibe den Entwurf...'],
        enhance: ['Analysiere den ursprünglichen Prompt...', 'Füge künstlerische Details hinzu...', 'Beschreibe Licht und Stimmung...', 'Verfeinere die Komposition...'],
        studioGenerate: ['Interpretiere den Prompt...', 'Wähle einen Kunststil aus...', 'Generiere erste Konzepte...', 'Verfeinere das Bild...'],
        remix: ['Lade das Originalbild...', 'Analysiere die Remix-Anweisung...', 'Wende Änderungen an...', 'Generiere die neue Version...'],
    },
    'en': {
        generic: ['Initializing AI assistant...', 'Processing request...', 'One moment please...'],
        deepDive: ['Studying the composition...', 'Researching historical context...', 'Interpreting symbolism...', 'Formulating the analysis...'],
        critique: ['Evaluating artwork selection...', 'Analyzing narrative flow...', 'Checking for thematic coherence...', 'Formulating suggestions...'],
        audioGuide: ['Developing an exhibition concept...', 'Writing the introduction...', 'Drafting scripts for each artwork...', 'Assembling the audio guide...'],
        video: ['Analyzing gallery mood...', 'Selecting key visuals...', 'Planning cinematic sequences...', 'Rendering video assets...'],
        journal: ['Researching the topic on the web...', 'Synthesizing information from sources...', 'Structuring the insights...', 'Writing the draft...'],
        enhance: ['Analyzing original prompt...', 'Adding artistic details...', 'Describing lighting and mood...', 'Refining composition...'],
        studioGenerate: ['Interpreting the prompt...', 'Selecting an art style...', 'Generating initial concepts...', 'Refining the image...'],
        remix: ['Loading the original image...', 'Analyzing the remix instruction...', 'Applying modifications...', 'Generating the new version...'],
    }
};