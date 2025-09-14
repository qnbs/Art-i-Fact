type LoadingMessages = {
    [lang in 'de' | 'en']: {
        generic: string[];
        search: string[];
        similar: string[];
        analyze: string[];
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
        generic: ['Konsultiere die Musen...', 'Mische die digitalen Farben...', 'Strecke die virtuelle Leinwand...', 'Analysiere Pinselstriche...'],
        search: ['Formuliere Suchanfrage...', 'Durchsuche die Archive...', 'Bewerte die Funde...', 'Stelle Ergebnisse zusammen...'],
        similar: ['Analysiere das Originalwerk...', 'Identifiziere Schlüsselmerkmale...', 'Suche nach stilistischen Echos...', 'Finde visuelle Verwandte...'],
        analyze: ['Verarbeite Bilddaten...', 'Vergleiche mit bekannter Kunst...', 'Extrahiere Metadaten...', 'Identifiziere das Werk...'],
        deepDive: ['Studiere die Komposition...', 'Untersuche den historischen Kontext...', 'Deute die Symbolik...', 'Formuliere die Analyse...'],
        critique: ['Bewerte die Auswahl der Kunstwerke...', 'Analysiere den narrativen Fluss...', 'Prüfe die thematische Kohärenz...', 'Formuliere Verbesserungsvorschläge...'],
        audioGuide: ['Entwickle ein Ausstellungskonzept...', 'Schreibe die Einleitung...', 'Verfasse Skripte für jedes Kunstwerk...', 'Stelle den Audioguide zusammen...'],
        video: ['Analysiere die Stimmung der Galerie...', 'Wähle Schlüsselbilder aus...', 'Plane filmische Sequenzen...', 'Rendere die Video-Assets...'],
        journal: ['Recherchiere das Thema...', 'Synthetisiere Informationen...', 'Strukturiere die Erkenntnisse...', 'Schreibe den Entwurf...'],
        enhance: ['Analysiere den ursprünglichen Prompt...', 'Füge künstlerische Details hinzu...', 'Beschreibe Licht und Stimmung...', 'Verfeinere die Komposition...'],
        studioGenerate: ['Interpretiere den Prompt...', 'Wähle einen Kunststil...', 'Generiere erste Konzepte...', 'Verfeinere das Bild...'],
        remix: ['Lade das Originalbild...', 'Analysiere die Remix-Anweisung...', 'Wende Änderungen an...', 'Generiere die neue Version...'],
    },
    'en': {
        generic: ['Consulting the muses...', 'Mixing the digital paints...', 'Stretching the virtual canvas...', 'Analyzing brushstrokes...'],
        search: ['Formulating search query...', 'Searching the archives...', 'Evaluating findings...', 'Compiling results...'],
        similar: ['Analyzing the source artwork...', 'Identifying key features...', 'Searching for stylistic echoes...', 'Finding visual relatives...'],
        analyze: ['Processing image data...', 'Comparing with known art...', 'Extracting metadata...', 'Identifying the artwork...'],
        deepDive: ['Studying the composition...', 'Researching historical context...', 'Interpreting symbolism...', 'Formulating the analysis...'],
        critique: ['Evaluating artwork selection...', 'Analyzing narrative flow...', 'Checking for thematic coherence...', 'Formulating suggestions...'],
        audioGuide: ['Developing an exhibition concept...', 'Writing the introduction...', 'Drafting scripts for each artwork...', 'Assembling the audio guide...'],
        video: ['Analyzing gallery mood...', 'Selecting key visuals...', 'Planning cinematic sequences...', 'Rendering video assets...'],
        journal: ['Researching the topic...', 'Synthesizing information...', 'Structuring the insights...', 'Writing the draft...'],
        enhance: ['Analyzing original prompt...', 'Adding artistic details...', 'Describing lighting and mood...', 'Refining composition...'],
        studioGenerate: ['Interpreting the prompt...', 'Selecting an art style...', 'Generating initial concepts...', 'Refining the image...'],
        remix: ['Loading the original image...', 'Analyzing the remix instruction...', 'Applying modifications...', 'Generating the new version...'],
    }
};