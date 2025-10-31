# ✨ Art-i-Fact: Your Personal AI Art Curator

> **Discover, Create, and Curate with the Power of Generative AI**

**Art-i-Fact** is a sophisticated, AI-powered Progressive Web App (PWA) designed for art enthusiasts, students, and curators. It seamlessly blends your unique curatorial vision with the vast capabilities of Google's Gemini models, enabling you to discover, create, organize, and share stunning virtual art galleries.

---

### Table of Contents
1. [Architectural Vision & Core Principles](#-architectural-vision--core-principles)
2. [Feature Spotlight: The AI-Powered Curation Toolkit](#-feature-spotlight-the-ai-powered-curation-toolkit)
3. [The Curator's Journey: A Quick Start Guide](#-the-curators-journey-a-quick-start-guide)
4. [Technology Stack](#-technology-stack)
5. [Future Roadmap](#-future-roadmap)
6. [Running the Project Locally](#-running-the-project-locally)

---

## 🏛️ Architectural Vision & Core Principles

Art-i-Fact is engineered with a focus on robustness, user empowerment, and long-term maintainability. Our architecture is built on several key pillars:

#### 1. Decoupled Service Layer
The application maintains a strict separation of concerns. All external interactions—whether with the **Gemini API** (`geminiService.ts`), public art APIs like **Wikimedia** (`wikimediaService.ts`), or the browser's local database (`dbService.ts`)—are encapsulated within dedicated service modules. This ensures that UI components remain pure, testable, and agnostic of the underlying data sources, making the system easier to debug and extend.

#### 2. Advanced State Management with Redux Toolkit
For a predictable and scalable global state, we leverage **Redux Toolkit (RTK)**. The application state is segmented into logical slices (`projects`, `galleries`, `ui`, etc.), with asynchronous operations and side effects handled cleanly by **Thunks**. This centralized approach, combined with the `useAppSelector` and `useAppDispatch` hooks, prevents prop-drilling and ensures efficient, targeted re-renders. A lightweight `AppContext` acts as a facade, providing components with simple, semantic actions (e.g., `handleNewProject()`) that dispatch multiple complex RTK actions under the hood, keeping component logic exceptionally clean.

#### 3. Component-Driven & Reusable UI
The user interface is constructed using a library of reusable, presentation-focused components found in `components/ui`. This promotes visual consistency and development speed. To avoid code duplication, complex patterns like drag-and-drop are abstracted into Higher-Order Components (HOCs) like `withDraggable`, which can wrap any UI component to imbue it with new functionality without altering its core presentation logic.

#### 4. Offline-First PWA Strategy
Art-i-Fact is a true Progressive Web App. A meticulously configured **Service Worker** employs a "Cache First" strategy for the app shell and critical third-party libraries, ensuring instantaneous loading. All user-generated data (projects, galleries, notes) is persisted robustly in **IndexedDB** via our `dbService`, making the entire curatorial workspace available and editable without an active internet connection. Online-dependent features are gracefully disabled with informative tooltips, providing a seamless and reliable user experience, anywhere.

---

## ✨ Feature Spotlight: The AI-Powered Curation Toolkit

-   **Workspace & Projects:** The core organizational unit. Projects act as dedicated containers for thematically related galleries and research journals, enabling focused, multi-faceted curatorial work.

-   **Art Discovery Engine:** A powerful portal to explore a vast universe of art. It leverages the Wikimedia API for access to millions of public domain works and uses AI-generated search queries (**`gemini-2.5-flash`**) to find art based on complex themes, styles, or emotions.

-   **AI Studio:** Your personal art generator.
    -   **Image Generation (`imagen-4.0-generate-001`):** Create high-fidelity, original artworks from text prompts using Google's premier image generation model.
    -   **Prompt Enhancement (`gemini-2.5-flash`):** Refine your creative ideas, transforming simple phrases into richly detailed, artistic prompts for superior results.
    -   **Image Remix (`gemini-2.5-flash-image`):** Iteratively edit and evolve existing images, blending your art with new AI-driven modifications.

-   **Virtual Gallery Curation:** The heart of the app. Build galleries with intuitive drag-and-drop reordering. Each gallery is a rich object containing artworks, metadata, and AI-generated enhancements.

-   **The AI Curatorial Assistant:** A suite of intelligent tools to elevate your exhibitions:
    -   **AI Critique (`gemini-2.5-flash`):** Get a professional, constructive critique of your gallery's thematic cohesion and narrative flow.
    -   **AI Audio Guide (`gemini-2.5-flash`):** Generate a complete, eloquent, AI-narrated audio guide script for your entire exhibition, ready for the Web Speech API.
    -   **Cinematic Trailer (`veo-3.1-fast-generate-preview`):** Create a short, atmospheric video trailer for your gallery, perfect for sharing.

-   **Curator's Journal:** A sophisticated research tool.
    -   **Rich Text Editing:** A side-by-side Markdown editor and live preview for documenting your thoughts and research.
    -   **AI Research Assistant (`gemini-2.5-flash` with Google Search Grounding):** Get up-to-date, verifiable information on any topic directly within your notes, complete with source citations.

-   **Immersive Exhibition & Secure Sharing:**
    -   **Exhibition Mode:** A full-screen, immersive slideshow experience with autoplay, an interactive audio guide, and subtle parallax effects.
    -   **Serverless Sharing:** Share your work via a secure, self-contained link. All gallery and profile data is compressed and Base64-encoded directly into the URL hash, ensuring absolute privacy with no data ever stored on a server.

-   **Data Sovereignty:** Your data is yours. The entire application state—all projects, galleries, settings, and journal entries—can be **exported to and imported from a single JSON file**. There is no vendor lock-in.

-   **Personalization & Command Palette:** Customize your curator profile, track your creative stats, and fine-tune the app's appearance and AI behavior. Use the Command Palette (`Ctrl+K`) for fast, keyboard-driven navigation and actions.

## 🚀 The Curator's Journey: A Quick Start Guide

1.  **Found Your Project:** Start in the **Workspace** by creating a new `Project`. This will be the home for your exhibition and research.
2.  **Discover or Create:** Use the **Discover** tab to find masterpieces, or visit the **Studio** to generate your own unique artworks.
3.  **Collect Your Pieces:** From an artwork's detail view, add it to a new or existing `Gallery` within your project.
4.  **Curate & Enhance:** In your `Gallery`, arrange your collection with drag-and-drop. Use the **AI Assistant** ✨ to get a critique, generate an audio guide, and more.
5.  **Research & Reflect:** Use the **Journal** to document your curatorial process and research topics with AI assistance.
6.  **Exhibit & Share:** When your masterpiece is ready, enter **Exhibition Mode** for an immersive viewing experience or **Share** it with the world via a single, private link.

## 🌟 Commitment to Quality

-   **Accessibility (A11y):** The application is designed with accessibility in mind, incorporating proper ARIA roles, focus management for modals and the command palette, and keyboard navigation throughout.
-   **Performance:** Leveraging efficient Redux selectors, lazy loading of images, and the PWA caching strategy ensures a fast and responsive experience.
-   **Data Privacy:** With 100% client-side storage in IndexedDB and serverless sharing, you have complete control and privacy over your creative work.

## 🛠️ Technology Stack

| Category              | Technology                                                 | Role / Purpose                                                                          |
| --------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Core Framework**    | React 19, TypeScript                                       | Building a modern, type-safe, and performant user interface.                              |
| **Styling**           | Tailwind CSS                                               | A utility-first CSS framework for rapid and consistent UI development.                    |
| **State Management**  | Redux Toolkit                                              | Centralized, predictable state management for the entire application.                   |
| **Data Persistence**  | IndexedDB (via a custom `dbService` wrapper)               | Robust, client-side database for full offline functionality and data sovereignty.       |
| **AI Text & Analysis**| `gemini-2.5-flash`                                         | Powers critiques, audio guides, research, and prompt enhancements.                      |
| **AI Image Generation**| `imagen-4.0-generate-001`                                  | For creating high-quality, original artworks from text prompts in the AI Studio.      |
| **AI Image Editing**  | `gemini-2.5-flash-image`                                   | Used for the "Remix" feature, allowing iterative editing of existing images.          |
| **AI Video Generation**| `veo-3.1-fast-generate-preview`                            | Creates cinematic trailers for galleries.                                               |
| **AI Web Research**   | `gemini-2.5-flash` with Google Search Grounding              | Provides the "Get Insights" feature in the Journal with up-to-date, cited information.  |
| **Offline Support**   | Progressive Web App (PWA) + Service Worker                 | Ensures the app is installable, loads instantly, and is functional offline.             |

## 🔮 Future Roadmap

Art-i-Fact is an evolving platform. Future enhancements may include:

-   **Multi-User Collaboration:** Allow multiple curators to collaborate on a single gallery in real-time.
-   **Advanced Analytics:** Provide insights into your curated collections, such as color palette distribution, historical timeline, and thematic density.
-   **Augmented Reality (AR) View:** Project your virtual galleries onto your physical walls using a mobile device.
-   **Community Hub:** A dedicated space to share and discover galleries created by other Art-i-Fact users.

## 🚀 Running the Project Locally

To run Art-i-Fact on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your environment:** Create a `.env` file in the root directory and add your Google AI API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```
4.  **Start the development server:**
    ```bash
    npm start
    ```

The application will be available at `http://localhost:3000`.

---
---

# ✨ Art-i-Fact: Ihr persönlicher KI-Kunstkurator

> **Entdecken, Erstellen und Kuratieren mit der Kraft der Generativen KI**

**Art-i-Fact** ist eine hochentwickelte, KI-gestützte Progressive Web App (PWA), die für Kunstliebhaber, Studenten und Kuratoren entwickelt wurde. Sie verbindet nahtlos Ihre einzigartige kuratorische Vision mit den umfassenden Fähigkeiten der Google Gemini-Modelle und ermöglicht es Ihnen, beeindruckende virtuelle Kunstgalerien zu entdecken, zu erstellen, zu organisieren und zu teilen.

---

### Inhaltsverzeichnis
1. [Architektonische Vision & Kernprinzipien](#-architektonische-vision--kernprinzipien)
2. [Feature-Spotlight: Das KI-gestützte Kurations-Toolkit](#-feature-spotlight-das-ki-gestützte-kurations-toolkit)
3. [Die Reise des Kurators: Eine Schnellstart-Anleitung](#-die-reise-des-kurators-eine-schnellstart-anleitung)
4. [Technologie-Stack](#-technologie-stack)
5. [Zukünftige Roadmap](#-zukünftige-roadmap)
6. [Projekt lokal ausführen](#-projekt-lokal-ausführen)

---

## 🏛️ Architektonische Vision & Kernprinzipien

Art-i-Fact wurde mit Fokus auf Robustheit, Benutzerautonomie und langfristige Wartbarkeit entwickelt. Unsere Architektur basiert auf mehreren Grundpfeilern:

#### 1. Entkoppelte Service-Schicht
Die Anwendung wahrt eine strikte Trennung der Zuständigkeiten. Alle externen Interaktionen – sei es mit der **Gemini API** (`geminiService.ts`), öffentlichen Kunst-APIs wie **Wikimedia** (`wikimediaService.ts`) oder der lokalen Browser-Datenbank (`dbService.ts`) – sind in dedizierten Service-Modulen gekapselt. Dies stellt sicher, dass UI-Komponenten rein, testbar und unabhängig von den zugrunde liegenden Datenquellen bleiben, was das System leichter zu debuggen und zu erweitern macht.

#### 2. Fortschrittliches State Management mit Redux Toolkit
Für einen vorhersagbaren und skalierbaren globalen Zustand nutzen wir das **Redux Toolkit (RTK)**. Der Anwendungszustand ist in logische Slices (`projects`, `galleries`, `ui` etc.) unterteilt, wobei asynchrone Operationen und Nebeneffekte sauber durch **Thunks** gehandhabt werden. Dieser zentralisierte Ansatz, kombiniert mit den `useAppSelector`- und `useAppDispatch`-Hooks, verhindert "Prop-Drilling" und sorgt für effiziente, gezielte Neu-Renderings. Ein leichtgewichtiger `AppContext` fungiert als Fassade und stellt Komponenten einfache, semantische Aktionen (z.B. `handleNewProject()`) zur Verfügung, die intern mehrere komplexe RTK-Aktionen auslösen und so die Komponentenlogik außergewöhnlich sauber halten.

#### 3. Komponentengesteuerte & wiederverwendbare UI
Die Benutzeroberfläche besteht aus einer Bibliothek wiederverwendbarer, reiner Präsentationskomponenten, die sich in `components/ui` befinden. Dies fördert visuelle Konsistenz und Entwicklungsgeschwindigkeit. Um Codeduplizierung zu vermeiden, werden komplexe Muster wie Drag-and-Drop in Higher-Order Components (HOCs) wie `withDraggable` abstrahiert, die jede UI-Komponente umschließen können, um ihr neue Funktionalität zu verleihen, ohne ihre Kernlogik zu verändern.

#### 4. Offline-First PWA-Strategie
Art-i-Fact ist eine echte Progressive Web App. Ein sorgfältig konfigurierter **Service Worker** verwendet eine "Cache First"-Strategie für die App-Shell und kritische Drittanbieter-Bibliotheken, was sofortige Ladezeiten gewährleistet. Alle benutzergenerierten Daten (Projekte, Galerien, Notizen) werden robust in **IndexedDB** über unseren `dbService` gespeichert, sodass der gesamte kuratorische Arbeitsbereich auch ohne aktive Internetverbindung verfügbar und bearbeitbar ist. Online-abhängige Funktionen werden elegant mit informativen Tooltips deaktiviert, was für eine nahtlose und zuverlässige Benutzererfahrung sorgt – überall.

---

## ✨ Feature-Spotlight: Das KI-gestützte Kurations-Toolkit

-   **Arbeitsbereich & Projekte:** Die zentrale Organisationseinheit. Projekte fungieren als dedizierte Container für thematisch zusammenhängende Galerien und Forschungsjournale und ermöglichen eine fokussierte, facettenreiche kuratorische Arbeit.

-   **Kunst-Entdeckungs-Engine:** Ein leistungsstarkes Portal zur Erkundung eines riesigen Kunstuniversums. Es nutzt die Wikimedia-API für den Zugriff auf Millionen gemeinfreier Werke und verwendet KI-generierte Suchanfragen (**`gemini-2.5-flash`**), um Kunst basierend auf komplexen Themen, Stilen oder Emotionen zu finden.

-   **KI-Studio:** Ihr persönlicher Kunstgenerator.
    -   **Bilderzeugung (`imagen-4.0-generate-001`):** Erstellen Sie hochauflösende, originelle Kunstwerke aus Text-Prompts mit Googles führendem Bilderzeugungsmodell.
    -   **Prompt-Verbesserung (`gemini-2.5-flash`):** Verfeinern Sie Ihre kreativen Ideen und wandeln Sie einfache Phrasen in detailreiche, künstlerische Prompts für überragende Ergebnisse um.
    -   **Bild-Remix (`gemini-2.5-flash-image`):** Bearbeiten und entwickeln Sie bestehende Bilder iterativ weiter und verschmelzen Sie Ihre Kunst mit neuen KI-gesteuerten Modifikationen.

-   **Virtuelle Galerie-Kuration:** Das Herzstück der App. Erstellen Sie Galerien mit intuitiver Drag-and-Drop-Neuordnung. Jede Galerie ist ein reichhaltiges Objekt, das Kunstwerke, Metadaten und KI-generierte Erweiterungen enthält.

-   **Der KI-Kurations-Assistent:** Eine Suite intelligenter Werkzeuge zur Aufwertung Ihrer Ausstellungen:
    -   **KI-Kritik (`gemini-2.5-flash`):** Erhalten Sie eine professionelle, konstruktive Kritik zur thematischen Kohäsion und zum narrativen Fluss Ihrer Galerie.
    -   **KI-Audioguide (`gemini-2.5-flash`):** Generieren Sie ein komplettes, eloquentes, von der KI gesprochenes Audioguide-Skript für Ihre gesamte Ausstellung, bereit für die Web Speech API.
    -   **Kinotrailer (`veo-3.1-fast-generate-preview`):** Erstellen Sie einen kurzen, atmosphärischen Video-Trailer für Ihre Galerie, perfekt zum Teilen.

-   **Kuratoren-Journal:** Ein anspruchsvolles Recherche-Tool.
    -   **Rich-Text-Bearbeitung:** Ein Side-by-Side-Markdown-Editor mit Live-Vorschau zur Dokumentation Ihrer Gedanken und Forschung.
    -   **KI-Recherche-Assistent (`gemini-2.5-flash` mit Google Search Grounding):** Erhalten Sie aktuelle, überprüfbare Informationen zu jedem Thema direkt in Ihren Notizen, komplett mit Quellenangaben.

-   **Immersive Ausstellung & sicheres Teilen:**
    -   **Ausstellungsmodus:** Ein bildschirmfüllendes, immersives Diashow-Erlebnis mit Autoplay, einem interaktiven Audioguide und subtilen Parallax-Effekten.
    -   **Serverloses Teilen:** Teilen Sie Ihre Arbeit über einen sicheren, in sich geschlossenen Link. Alle Galerie- und Profildaten werden komprimiert und Base64-kodiert direkt in die URL-Hash geschrieben, was absolute Privatsphäre gewährleistet, da keine Daten auf einem Server gespeichert werden.

-   **Datensouveränität:** Ihre Daten gehören Ihnen. Der gesamte Anwendungszustand – alle Projekte, Galerien, Einstellungen und Journaleinträge – kann in eine **einzige JSON-Datei exportiert und aus dieser importiert werden**. Es gibt kein Vendor-Lock-in.

-   **Personalisierung & Befehlspalette:** Passen Sie Ihr Kuratorenprofil an, verfolgen Sie Ihre kreativen Statistiken und stimmen Sie das Erscheinungsbild und das KI-Verhalten der App ab. Verwenden Sie die Befehlspalette (`Strg+K`) für schnelle, tastaturgesteuerte Navigation und Aktionen.

## 🚀 Die Reise des Kurators: Eine Schnellstart-Anleitung

1.  **Projekt gründen:** Beginnen Sie im **Arbeitsbereich**, indem Sie ein neues `Projekt` erstellen. Dies wird das Zuhause für Ihre Ausstellung und Forschung sein.
2.  **Entdecken oder Erschaffen:** Nutzen Sie den Tab **"Entdecken"**, um Meisterwerke zu finden, oder besuchen Sie das **"Studio"**, um Ihre eigenen einzigartigen Kunstwerke zu generieren.
3.  **Werke sammeln:** Fügen Sie in der Detailansicht eines Kunstwerks dieses zu einer neuen oder bestehenden `Galerie` in Ihrem Projekt hinzu.
4.  **Kuratieren & Veredeln:** In Ihrer `Galerie` können Sie Ihre Sammlung per Drag-and-Drop anordnen. Nutzen Sie den **KI-Assistenten** ✨, um eine Kritik zu erhalten, einen Audioguide zu erstellen und vieles mehr.
5.  **Forschen & Reflektieren:** Verwenden Sie das **Journal**, um Ihren kuratorischen Prozess zu dokumentieren und Themen mit KI-Hilfe zu recherchieren.
6.  **Ausstellen & Teilen:** Wenn Ihr Meisterwerk fertig ist, wechseln Sie in den **Ausstellungsmodus** für ein immersives Erlebnis oder **teilen** Sie es über einen einzigen, privaten Link mit der Welt.

## 🌟 Bekenntnis zur Qualität

-   **Barrierefreiheit (A11y):** Die Anwendung wurde mit Blick auf Barrierefreiheit entwickelt und beinhaltet korrekte ARIA-Rollen, Fokus-Management für Modale und die Befehlspalette sowie durchgehende Tastaturnavigation.
-   **Performance:** Der Einsatz von effizienten Redux-Selektoren, Lazy Loading von Bildern und der PWA-Caching-Strategie sorgt für ein schnelles und reaktionsschnelles Erlebnis.
-   **Datenschutz:** Durch 100% clientseitige Speicherung in IndexedDB und serverloses Teilen haben Sie die vollständige Kontrolle und Privatsphäre über Ihre kreative Arbeit.

## 🛠️ Technologie-Stack

| Kategorie               | Technologie                                                 | Rolle / Zweck                                                                              |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Kern-Framework**      | React 19, TypeScript                                        | Erstellung einer modernen, typsicheren und performanten Benutzeroberfläche.                |
| **Styling**             | Tailwind CSS                                                | Ein Utility-First-CSS-Framework für schnelle und konsistente UI-Entwicklung.               |
| **Zustandsverwaltung**  | Redux Toolkit                                               | Zentralisierte, vorhersagbare Zustandsverwaltung für die gesamte Anwendung.                |
| **Datenpersistenz**     | IndexedDB (über einen `dbService`-Wrapper)                  | Robuste, clientseitige Datenbank für volle Offline-Funktionalität und Datensouveränität.   |
| **KI Text & Analyse**   | `gemini-2.5-flash`                                          | Ermöglicht Kritiken, Audioguides, Recherchen und Prompt-Verbesserungen.                    |
| **KI Bilderzeugung**    | `imagen-4.0-generate-001`                                   | Zur Erstellung hochwertiger, origineller Kunstwerke im KI-Studio.                          |
| **KI Bildbearbeitung**  | `gemini-2.5-flash-image`                                    | Wird für die "Remix"-Funktion verwendet, die eine iterative Bearbeitung von Bildern erlaubt.|
| **KI Videoerzeugung**   | `veo-3.1-fast-generate-preview`                             | Erstellt kinoreife Trailer für Galerien.                                                   |
| **KI Web-Recherche**    | `gemini-2.5-flash` mit Google Search Grounding                | Liefert die "Einblicke erhalten"-Funktion im Journal mit aktuellen, zitierten Infos.       |
| **Offline-Unterstützung**| Progressive Web App (PWA) + Service Worker                  | Stellt sicher, dass die App installierbar ist, sofort lädt und offline funktioniert.     |

## 🔮 Zukünftige Roadmap

Art-i-Fact ist eine sich entwickelnde Plattform. Zukünftige Erweiterungen könnten umfassen:

-   **Multi-User-Kollaboration:** Ermöglicht mehreren Kuratoren, in Echtzeit an einer einzigen Galerie zusammenzuarbeiten.
-   **Erweiterte Analysen:** Bietet Einblicke in Ihre kuratierten Sammlungen, wie z.B. Farbpalettenverteilung, historische Zeitachsen und thematische Dichte.
-   **Augmented Reality (AR) Ansicht:** Projizieren Sie Ihre virtuellen Galerien mit einem Mobilgerät an Ihre physischen Wände.
-   **Community-Hub:** Ein dedizierter Bereich zum Teilen und Entdecken von Galerien, die von anderen Art-i-Fact-Nutzern erstellt wurden.

## 🚀 Projekt lokal ausführen

Um Art-i-Fact auf Ihrem lokalen Rechner auszuführen, folgen Sie diesen Schritten:

1.  **Repository klonen:**
    ```bash
    git clone <repository-url>
    ```
2.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    ```
3.  **Umgebung einrichten:** Erstellen Sie eine `.env`-Datei im Stammverzeichnis und fügen Sie Ihren Google AI API-Schlüssel hinzu:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```
4.  **Entwicklungsserver starten:**
    ```bash
    npm start
    ```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.
