# ✨ Art-i-Fact: Your Personal AI Art Curator

<p align="center">
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%23d97706'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='15' fill='url(%23g)'/%3E%3Cpath d='M25 80 L50 30 L75 80' stroke='white' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='50' cy='60' r='7' fill='white'/%3E%3C/svg%3E" alt="Art-i-Fact Logo" width="120">
</p>

<h3 align="center">Discover, Create, and Curate with the Power of Generative AI</h3>

**Art-i-Fact** is a sophisticated, AI-powered Progressive Web App (PWA) designed for art enthusiasts, students, and curators. It seamlessly blends your unique curatorial vision with the vast capabilities of Google's Gemini models, enabling you to discover, create, organize, and share stunning virtual art galleries.

---

## 🏛️ Project Philosophy & Architecture

Art-i-Fact is engineered with a focus on robustness, scalability, and user empowerment. Our architectural philosophy is built on several key pillars:

#### 1. Decoupled Service Layer
The application maintains a strict separation of concerns. All external interactions—whether with the **Gemini API** (`geminiService.ts`), public art APIs like **Wikimedia** (`wikimediaService.ts`), or the browser's local database (`dbService.ts`)—are encapsulated within dedicated service modules. This ensures that UI components remain pure, testable, and agnostic of the underlying data sources.

#### 2. Advanced State Management with Redux Toolkit
For a predictable and scalable state, we leverage **Redux Toolkit (RTK)**. The application state is segmented into logical slices (`projects`, `galleries`, `ui`, etc.), with asynchronous operations and side effects handled cleanly by **Thunks**. This centralized approach, combined with the `useAppSelector` and `useAppDispatch` hooks, prevents prop-drilling and ensures efficient, targeted re-renders. A lightweight `AppContext` acts as a facade, providing components with simple, semantic actions (e.g., `handleNewProject()`) that dispatch multiple complex RTK actions under the hood, keeping component logic exceptionally clean.

#### 3. Component-Driven & Reusable UI
The user interface is constructed using a library of reusable, presentation-focused components found in `components/ui`. This promotes visual consistency and development speed. To avoid code duplication, complex patterns like drag-and-drop are abstracted into Higher-Order Components (HOCs) like `withDraggable`, which can wrap any UI component to imbue it with new functionality without altering its core presentation logic.

#### 4. Offline-First PWA Strategy
Art-i-Fact is a true Progressive Web App. A meticulously configured **Service Worker** (`service-worker.js`) employs a "Cache First" strategy for the app shell and critical third-party libraries, ensuring instantaneous loading and basic offline functionality. All user-generated data (projects, galleries, notes) is persisted locally and robustly in **IndexedDB**, making the entire curatorial workspace available and editable without an active internet connection. Online-dependent features are gracefully disabled with informative tooltips, providing a seamless user experience.

---

## ✨ Key Features Deep Dive

-   **Workspace & Projects:** The core organizational unit. Projects act as dedicated containers for thematically related galleries and research journals, enabling focused, multi-faceted curatorial work.

-   **Art Discovery Engine:** A powerful portal to explore a vast universe of art. It leverages the Wikimedia API for access to millions of public domain works and uses AI-generated search queries (`gemini-2.5-flash`) to find art based on complex themes, styles, or emotions.

-   **AI Studio:** Your personal art generator.
    -   **Generate:** Create high-fidelity, original artworks from text prompts using Google's premier `imagen-4.0-generate-001` model.
    -   **Enhance Prompt:** Refine your creative ideas with `gemini-2.5-flash`, transforming simple phrases into richly detailed, artistic prompts.
    -   **Remix:** Iteratively edit and evolve existing images using the versatile `gemini-2.5-flash-image` model, blending your art with new AI-driven modifications.

-   **Virtual Gallery Curation:** The heart of the app. Build galleries with intuitive drag-and-drop reordering. Each gallery is a rich object containing artworks, metadata, and AI-generated enhancements.

-   **The AI Curatorial Assistant:** A suite of intelligent tools to elevate your exhibitions:
    -   **AI Critique:** Get a professional, constructive critique of your gallery's thematic cohesion and narrative flow.
    -   **AI Audio Guide:** Generate a complete, eloquent, AI-narrated audio guide script for your entire exhibition.
    -   **Cinematic Trailer:** Create a short, atmospheric video trailer for your gallery using the `veo-3.1-fast-generate-preview` model, perfect for sharing.

-   **Curator's Journal:** A sophisticated research tool.
    -   **Rich Text Editing:** A side-by-side Markdown editor and live preview for documenting your thoughts and research.
    -   **AI Research Assistant:** Utilize `gemini-2.5-flash` with **Google Search grounding** to get up-to-date, verifiable information on any topic directly within your notes, complete with source citations.

-   **Immersive Exhibition & Secure Sharing:**
    -   **Exhibition Mode:** A full-screen, immersive slideshow experience with autoplay, an interactive audio guide powered by Web Speech API, and subtle parallax effects.
    -   **Shareable Links:** Share your work via a secure, self-contained link. All gallery and profile data is Base64-encoded into the URL hash, ensuring no data is stored on a server.

-   **Data Sovereignty:** Your data is yours. The entire application state—all projects, galleries, settings, and journal entries—can be **exported to and imported from a single JSON file**. There is no vendor lock-in.

-   **Personalization & Command Palette:** Customize your curator profile, track your creative stats, and fine-tune the app's appearance and AI behavior. Use the Command Palette (`Ctrl+K`) for fast, keyboard-driven navigation and actions.

## 🚀 Getting Started

The workflow is designed to be intuitive and creative:

1.  **Create a Project:** Start in the **Workspace** by creating a new project. This will be the home for your new exhibition.
2.  **Discover or Create:** Use the **Discover** tab to find existing artworks, or visit the **Studio** to generate your own unique pieces.
3.  **Add to Gallery:** From the artwork's detail view, add it to a new or existing gallery within your project.
4.  **Curate & Enhance:** Open your gallery. Here, you can edit the title, description, and reorder the art. Use the **AI Assistant** ✨ to get a critique, generate an audio guide, and more.
5.  **Reflect and Research:** Use the **Journal** to document your curatorial process and research related topics with AI assistance.
6.  **Exhibit & Share:** Once you're happy with your gallery, click "Exhibit" to view it in an immersive slideshow mode or **"Share"** to get a link to send to others.

## 🌟 Commitment to Quality

-   **Accessibility (A11y):** The application is designed with accessibility in mind, incorporating proper ARIA roles, focus management for modals and the command palette, and keyboard navigation throughout.
-   **Performance:** Leveraging virtualized lists where needed, efficient Redux selectors, lazy loading of images, and the PWA caching strategy ensures a fast and responsive experience.
-   **Data Privacy:** With 100% client-side storage in IndexedDB and serverless sharing, you have complete control and privacy over your creative work.

## 🛠️ Technology Stack

-   **Frontend:** React 19, TypeScript, Tailwind CSS
-   **State Management:** Redux Toolkit
-   **Data Storage:** **IndexedDB** (via a custom `dbService` wrapper) for robust, client-side data persistence.
-   **AI (Google Gemini API):**
    -   **Text & Analysis:** `gemini-2.5-flash`
    -   **Image Generation:** `imagen-4.0-generate-001`
    -   **Image Editing (Remix):** `gemini-2.5-flash-image`
    -   **Video Generation:** `veo-3.1-fast-generate-preview`
    -   **Web Research:** `gemini-2.5-flash` with Google Search grounding

---
---

# ✨ Art-i-Fact: Ihr persönlicher KI-Kunstkurator

<p align="center">
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%23d97706'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='15' fill='url(%23g)'/%3E%3Cpath d='M25 80 L50 30 L75 80' stroke='white' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='50' cy='60' r='7' fill='white'/%3E%3C/svg%3E" alt="Art-i-Fact Logo" width="120">
</p>

<h3 align="center">Entdecken, Erstellen und Kuratieren mit der Kraft der Generativen KI</h3>

**Art-i-Fact** ist eine hochentwickelte, KI-gestützte Progressive Web App (PWA), die für Kunstliebhaber, Studenten und Kuratoren entwickelt wurde. Sie verbindet nahtlos Ihre einzigartige kuratorische Vision mit den umfassenden Fähigkeiten der Google Gemini-Modelle und ermöglicht es Ihnen, beeindruckende virtuelle Kunstgalerien zu entdecken, zu erstellen, zu organisieren und zu teilen.

---

## 🏛️ Projektphilosophie & Architektur

Art-i-Fact wurde mit Fokus auf Robustheit, Skalierbarkeit und Benutzerautonomie entwickelt. Unsere Architekturphilosophie basiert auf mehreren Grundpfeilern:

#### 1. Entkoppelte Service-Schicht
Die Anwendung wahrt eine strikte Trennung der Zuständigkeiten. Alle externen Interaktionen – sei es mit der **Gemini API** (`geminiService.ts`), öffentlichen Kunst-APIs wie **Wikimedia** (`wikimediaService.ts`) oder der lokalen Browser-Datenbank (`dbService.ts`) – sind in dedizierten Service-Modulen gekapselt. Dies stellt sicher, dass UI-Komponenten rein, testbar und unabhängig von den zugrunde liegenden Datenquellen bleiben.

#### 2. Fortschrittliches State Management mit Redux Toolkit
Für einen vorhersagbaren und skalierbaren Zustand nutzen wir das **Redux Toolkit (RTK)**. Der Anwendungszustand ist in logische Slices (`projects`, `galleries`, `ui` etc.) unterteilt, wobei asynchrone Operationen und Nebeneffekte sauber durch **Thunks** gehandhabt werden. Dieser zentralisierte Ansatz, kombiniert mit den `useAppSelector`- und `useAppDispatch`-Hooks, verhindert "Prop-Drilling" und sorgt für effiziente, gezielte Neu-Renderings. Ein leichtgewichtiger `AppContext` fungiert als Fassade und stellt Komponenten einfache, semantische Aktionen (z.B. `handleNewProject()`) zur Verfügung, die intern mehrere komplexe RTK-Aktionen auslösen und so die Komponentenlogik außergewöhnlich sauber halten.

#### 3. Komponentengesteuerte & wiederverwendbare UI
Die Benutzeroberfläche besteht aus einer Bibliothek wiederverwendbarer, reiner Präsentationskomponenten, die sich in `components/ui` befinden. Dies fördert visuelle Konsistenz und Entwicklungsgeschwindigkeit. Um Codeduplizierung zu vermeiden, werden komplexe Muster wie Drag-and-Drop in Higher-Order Components (HOCs) wie `withDraggable` abstrahiert, die jede UI-Komponente umschließen können, um ihr neue Funktionalität zu verleihen, ohne ihre Kernlogik zu verändern.

#### 4. Offline-First PWA-Strategie
Art-i-Fact ist eine echte Progressive Web App. Ein sorgfältig konfigurierter **Service Worker** (`service-worker.js`) verwendet eine "Cache First"-Strategie für die App-Shell und kritische Drittanbieter-Bibliotheken, was sofortige Ladezeiten und grundlegende Offline-Funktionalität gewährleistet. Alle benutzergenerierten Daten (Projekte, Galerien, Notizen) werden robust und lokal in **IndexedDB** gespeichert, sodass der gesamte kuratorische Arbeitsbereich auch ohne aktive Internetverbindung verfügbar und bearbeitbar ist. Online-abhängige Funktionen werden elegant mit informativen Tooltips deaktiviert, was für eine nahtlose Benutzererfahrung sorgt.

---

## ✨ Hauptfunktionen im Detail

-   **Arbeitsbereich & Projekte:** Die zentrale Organisationseinheit. Projekte fungieren als dedizierte Container für thematisch zusammenhängende Galerien und Forschungsjournale und ermöglichen eine fokussierte, facettenreiche kuratorische Arbeit.

-   **Kunst-Entdeckungs-Engine:** Ein leistungsstarkes Portal zur Erkundung eines riesigen Kunstuniversums. Es nutzt die Wikimedia-API für den Zugriff auf Millionen gemeinfreier Werke und verwendet KI-generierte Suchanfragen (`gemini-2.5-flash`), um Kunst basierend auf komplexen Themen, Stilen oder Emotionen zu finden.

-   **KI-Studio:** Ihr persönlicher Kunstgenerator.
    -   **Generieren:** Erstellen Sie hochauflösende, originelle Kunstwerke aus Text-Prompts mit Googles führendem `imagen-4.0-generate-001`-Modell.
    -   **Prompt-Verbesserung:** Verfeinern Sie Ihre kreativen Ideen mit `gemini-2.5-flash`, das einfache Phrasen in detailreiche, künstlerische Prompts umwandelt.
    -   **Remix:** Bearbeiten und entwickeln Sie bestehende Bilder iterativ mit dem vielseitigen `gemini-2.5-flash-image`-Modell weiter und verschmelzen Sie Ihre Kunst mit neuen KI-gesteuerten Modifikationen.

-   **Virtuelle Galerie-Kuration:** Das Herzstück der App. Erstellen Sie Galerien mit intuitiver Drag-and-Drop-Neuordnung. Jede Galerie ist ein reichhaltiges Objekt, das Kunstwerke, Metadaten und KI-generierte Erweiterungen enthält.

-   **Der KI-Kurations-Assistent:** Eine Suite intelligenter Werkzeuge zur Aufwertung Ihrer Ausstellungen:
    -   **KI-Kritik:** Erhalten Sie eine professionelle, konstruktive Kritik zur thematischen Kohäsion und zum narrativen Fluss Ihrer Galerie.
    -   **KI-Audioguide:** Generieren Sie ein komplettes, eloquentes, von der KI gesprochenes Audioguide-Skript für Ihre gesamte Ausstellung.
    -   **Kinotrailer:** Erstellen Sie mit dem `veo-3.1-fast-generate-preview`-Modell einen kurzen, atmosphärischen Video-Trailer für Ihre Galerie, perfekt zum Teilen.

-   **Kuratoren-Journal:** Ein anspruchsvolles Recherche-Tool.
    -   **Rich-Text-Bearbeitung:** Ein Side-by-Side-Markdown-Editor mit Live-Vorschau zur Dokumentation Ihrer Gedanken und Forschung.
    -   **KI-Recherche-Assistent:** Nutzen Sie `gemini-2.5-flash` mit **Google Search Grounding**, um aktuelle, überprüfbare Informationen zu jedem Thema direkt in Ihren Notizen zu erhalten, komplett mit Quellenangaben.

-   **Immersive Ausstellung & sicheres Teilen:**
    -   **Ausstellungsmodus:** Ein bildschirmfüllendes, immersives Diashow-Erlebnis mit Autoplay, einem interaktiven Audioguide, der von der Web Speech API angetrieben wird, und subtilen Parallax-Effekten.
    -   **Teilbare Links:** Teilen Sie Ihre Arbeit über einen sicheren, in sich geschlossenen Link. Alle Galerie- und Profildaten werden Base64-kodiert in die URL-Hash geschrieben, sodass keine Daten auf einem Server gespeichert werden.

-   **Datensouveränität:** Ihre Daten gehören Ihnen. Der gesamte Anwendungszustand – alle Projekte, Galerien, Einstellungen und Journaleinträge – kann in eine **einzige JSON-Datei exportiert und aus dieser importiert werden**. Es gibt kein Vendor-Lock-in.

-   **Personalisierung & Befehlspalette:** Passen Sie Ihr Kuratorenprofil an, verfolgen Sie Ihre kreativen Statistiken und stimmen Sie das Erscheinungsbild und das KI-Verhalten der App ab. Verwenden Sie die Befehlspalette (`Strg+K`) für schnelle, tastaturgesteuerte Navigation und Aktionen.

## 🚀 Erste Schritte

Der Arbeitsablauf ist intuitiv und kreativ gestaltet:

1.  **Projekt erstellen:** Beginnen Sie im **Arbeitsbereich**, indem Sie ein neues Projekt erstellen. Dies wird das Zuhause für Ihre neue Ausstellung sein.
2.  **Entdecken oder Erstellen:** Nutzen Sie den Tab **"Entdecken"**, um bestehende Kunstwerke zu finden, oder besuchen Sie das **"Studio"**, um Ihre eigenen einzigartigen Stücke zu generieren.
3.  **Zur Galerie hinzufügen:** Fügen Sie in der Detailansicht eines Kunstwerks dieses zu einer neuen oder bestehenden Galerie in Ihrem Projekt hinzu.
4.  **Kuratieren & Verbessern:** Öffnen Sie Ihre Galerie. Hier können Sie Titel und Beschreibung bearbeiten und die Kunstwerke neu anordnen. Nutzen Sie den **KI-Assistenten** ✨, um eine Kritik zu erhalten, einen Audioguide zu erstellen und vieles mehr.
5.  **Reflektieren und Forschen:** Nutzen Sie das **Journal**, um Ihren kuratorischen Prozess zu dokumentieren und verwandte Themen mit KI-Hilfe zu recherchieren.
6.  **Ausstellen & Teilen:** Sobald Sie mit Ihrer Galerie zufrieden sind, klicken Sie auf "Ausstellen", um sie in einem immersiven Diashow-Modus anzuzeigen, oder auf **"Teilen"**, um einen Link zum Versenden an andere zu erhalten.

## 🌟 Bekenntnis zur Qualität

-   **Barrierefreiheit (A11y):** Die Anwendung wurde mit Blick auf Barrierefreiheit entwickelt und beinhaltet korrekte ARIA-Rollen, Fokus-Management für Modale und die Befehlspalette sowie durchgehende Tastaturnavigation.
-   **Performance:** Der Einsatz von virtualisierten Listen, effizienten Redux-Selektoren, Lazy Loading von Bildern und der PWA-Caching-Strategie sorgt für ein schnelles und reaktionsschnelles Erlebnis.
-   **Datenschutz:** Durch 100% clientseitige Speicherung in IndexedDB und serverloses Teilen haben Sie die vollständige Kontrolle und Privatsphäre über Ihre kreative Arbeit.

## 🛠️ Technologie-Stack

-   **Frontend:** React 19, TypeScript, Tailwind CSS
-   **State Management:** Redux Toolkit
-   **Datenspeicherung:** **IndexedDB** (über einen benutzerdefinierten `dbService`-Wrapper) für robuste, clientseitige Datenpersistenz.
-   **KI (Google Gemini API):**
    -   **Text & Analyse:** `gemini-2.5-flash`
    -   **Bilderzeugung:** `imagen-4.0-generate-001`
    -   **Bildbearbeitung (Remix):** `gemini-2.5-flash-image`
    -   **Videoerzeugung:** `veo-3.1-fast-generate-preview`
    -   **Web-Recherche:** `gemini-2.5-flash` mit Google Search Grounding