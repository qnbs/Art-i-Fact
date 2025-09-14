[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/qnbs/Art-i-Fact)

# Art-i-Fact: Your Personal AI Art Curator

**Art-i-Fact** is an innovative web application that empowers you to discover, create, organize, and share virtual art galleries using state-of-the-art AI curation tools. It acts as your intelligent assistant, blending your unique curatorial vision with the vast knowledge of AI to craft beautiful and insightful art experiences.

---

## ✨ Key Features

-   **Organize with Projects:** Structure your work in the **Workspace**. Each project is a dedicated container for related galleries and journal entries, helping you manage different themes or exhibitions seamlessly.
-   **Discover Art:** Explore a vast universe of art. Search for famous works from open-access collections or let the AI find pieces based on themes, styles, or emotions.
-   **AI Studio:** Become an artist! Generate unique, original artworks from your text descriptions. Use **Enhance Prompt** to enrich your ideas and iteratively refine your creations with the powerful **Remix** tool.
-   **Curate Virtual Galleries:** Build and organize your own galleries. Add artworks, give your gallery a compelling title and description, and arrange the pieces with intuitive drag-and-drop to tell a story.
-   **AI Assistant:** Enhance your curations with a suite of intelligent tools:
    -   **Critique:** Receive a professional, constructive critique of your gallery's theme and flow.
    -   **Audio Guide:** Generate a complete, AI-narrated audio guide for your exhibition.
    -   **Cinematic Trailer:** Create a short, atmospheric video trailer for your gallery to share online.
-   **Curator's Journal:** Keep a personal journal with a **rich text Markdown editor**. Document your thoughts, link entries to specific projects, and use AI to **research topics directly within your notes**, complete with web sources.
-   **Exhibit & Share:** Present your finished galleries in a beautiful, immersive **Exhibition Mode**. Share your creations with the world via a simple, data-encoded link for a read-only viewing experience.
-   **Installable & Offline-Ready (PWA):** Install Art-i-Fact on your device like a native app and use it even without an internet connection. All your work is saved locally in your browser.
-   **Full Data Control:** **Export and import your entire workspace** (projects, galleries, journal, settings) as a single JSON file. Your data belongs to you.
-   **Personalization:** Create a curator profile, track your stats, and customize the app's appearance and AI behavior in the settings.

## 🚀 Getting Started

The workflow is designed to be intuitive and creative:

1.  **Create a Project:** Start in the **Workspace** by creating a new project. This will be the home for your new exhibition.
2.  **Discover or Create:** Use the **Discover** tab to find existing artworks, or visit the **Studio** to generate your own unique pieces.
3.  **Add to Gallery:** From the artwork's detail view, add it to a new or existing gallery.
4.  **Curate & Enhance:** Open your gallery. Here, you can edit the title, description, and reorder the art. Use the **AI Assistant** ✨ to get a critique, generate an audio guide, and more.
5.  **Reflect and Research:** Use the **Journal** to document your curatorial process and research related topics with AI assistance.
6.  **Exhibit & Share:** Once you're happy with your gallery, click "Exhibit" to view it in an immersive slideshow mode or **"Share"** to get a link to send to others.

## 🛠️ Technology Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **Data Storage:** **IndexedDB** for robust, client-side data persistence.
-   **AI (Google Gemini API):**
    -   **Text & Analysis:** `gemini-2.5-flash`
    -   **Image Generation:** `imagen-4.0-generate-001`
    -   **Image Editing (Remix):** `gemini-2.5-flash-image-preview`
    -   **Video Generation:** `veo-2.0-generate-001`
    -   **Web Research:** `gemini-2.5-flash` with Google Search grounding

---
---

# Art-i-Fact: Ihr persönlicher KI-Kunstkurator

**Art-i-Fact** ist eine innovative Webanwendung, die es Ihnen ermöglicht, virtuelle Kunstgalerien mit Hilfe modernster KI-Kurationswerkzeuge zu entdecken, zu erstellen, zu organisieren und zu teilen. Sie fungiert als Ihr intelligenter Assistent, der Ihre einzigartige kuratorische Vision mit dem riesigen Wissen der KI verbindet, um wunderschöne und aufschlussreiche Kunsterlebnisse zu schaffen.

---

## ✨ Hauptfunktionen

-   **Mit Projekten organisieren:** Strukturieren Sie Ihre Arbeit im **Arbeitsbereich**. Jedes Projekt ist ein eigener Container für zusammengehörige Galerien und Journaleinträge, was Ihnen hilft, verschiedene Themen oder Ausstellungen nahtlos zu verwalten.
-   **Kunst entdecken:** Erforschen Sie ein riesiges Universum der Kunst. Suchen Sie nach berühmten Werken aus frei zugänglichen Sammlungen oder lassen Sie die KI Stücke basierend auf Themen, Stilen oder Emotionen finden.
-   **KI-Studio:** Werden Sie zum Künstler! Erstellen Sie einzigartige, originelle Kunstwerke aus Ihren Textbeschreibungen. Nutzen Sie die **Prompt-Verbesserung**, um Ihre Ideen anzureichern, und verfeinern Sie Ihre Kreationen iterativ mit dem leistungsstarken **Remix**-Werkzeug.
-   **Virtuelle Galerien kuratieren:** Bauen und organisieren Sie Ihre eigenen Galerien. Fügen Sie Kunstwerke hinzu, geben Sie Ihrer Galerie einen überzeugenden Titel sowie eine Beschreibung und ordnen Sie die Stücke per Drag-and-Drop an, um eine Geschichte zu erzählen.
-   **KI-Assistent:** Verbessern Sie Ihre Kurationen mit einer Reihe intelligenter Werkzeuge:
    -   **Kritik:** Erhalten Sie eine professionelle, konstruktive Kritik zum Thema und Aufbau Ihrer Galerie.
    -   **Audioguide:** Erstellen Sie einen kompletten, von der KI gesprochenen Audioguide für Ihre Ausstellung.
    -   **Kinotrailer:** Generieren Sie einen kurzen, atmosphärischen Video-Trailer für Ihre Galerie, um ihn online zu teilen.
-   **Kuratoren-Journal:** Führen Sie ein persönliches Journal mit einem **Rich-Text-Markdown-Editor**. Dokumentieren Sie Ihre Gedanken, verknüpfen Sie Einträge mit bestimmten Projekten und nutzen Sie die KI, um **Themen direkt in Ihren Notizen zu recherchieren**, komplett mit Web-Quellen.
-   **Ausstellen & Teilen:** Präsentieren Sie Ihre fertigen Galerien in einem schönen, immersiven **Ausstellungsmodus**. Teilen Sie Ihre Kreationen mit der Welt über einen einfachen, datenkodierten Link für ein schreibgeschütztes Seherlebnis.
-   **Installierbar & Offline-fähig (PWA):** Installieren Sie Art-i-Fact wie eine native App auf Ihrem Gerät und nutzen Sie sie auch ohne Internetverbindung. Alle Ihre Arbeiten werden lokal in Ihrem Browser gespeichert.
-   **Volle Datenkontrolle:** **Exportieren und importieren Sie Ihren gesamten Arbeitsbereich** (Projekte, Galerien, Journal, Einstellungen) als einzelne JSON-Datei. Ihre Daten gehören Ihnen.
-   **Personalisierung:** Erstellen Sie ein Kuratorenprofil, verfolgen Sie Ihre Statistiken und passen Sie das Aussehen und das KI-Verhalten der App in den Einstellungen an.

## 🚀 Erste Schritte

Der Arbeitsablauf ist intuitiv und kreativ gestaltet:

1.  **Projekt erstellen:** Beginnen Sie im **Arbeitsbereich**, indem Sie ein neues Projekt erstellen. Dies wird das Zuhause für Ihre neue Ausstellung sein.
2.  **Entdecken oder Erstellen:** Nutzen Sie den Tab **"Entdecken"**, um bestehende Kunstwerke zu finden, oder besuchen Sie das **"Studio"**, um Ihre eigenen einzigartigen Stücke zu generieren.
3.  **Zur Galerie hinzufügen:** Fügen Sie in der Detailansicht eines Kunstwerks dieses zu einer neuen oder bestehenden Galerie hinzu.
4.  **Kuratieren & Verbessern:** Öffnen Sie Ihre Galerie. Hier können Sie Titel und Beschreibung bearbeiten und die Kunstwerke neu anordnen. Nutzen Sie den **KI-Assistenten** ✨, um eine Kritik zu erhalten, einen Audioguide zu erstellen und vieles mehr.
5.  **Reflektieren und Forschen:** Nutzen Sie das **Journal**, um Ihren kuratorischen Prozess zu dokumentieren und verwandte Themen mit KI-Hilfe zu recherchieren.
6.  **Ausstellen & Teilen:** Sobald Sie mit Ihrer Galerie zufrieden sind, klicken Sie auf "Ausstellen", um sie in einem immersiven Diashow-Modus anzuzeigen, oder auf **"Teilen"**, um einen Link zum Versenden an andere zu erhalten.

## 🛠️ Technologie-Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **Datenspeicherung:** **IndexedDB** für robuste, clientseitige Datenpersistenz.
-   **KI (Google Gemini API):**
    -   **Text & Analyse:** `gemini-2.5-flash`
    -   **Bilderzeugung:** `imagen-4.0-generate-001`
    -   **Bildbearbeitung (Remix):** `gemini-2.5-flash-image-preview`
    -   **Videoerzeugung:** `veo-2.0-generate-001`
    -   **Web-Recherche:** `gemini-2.5-flash` mit Google Search Grounding
