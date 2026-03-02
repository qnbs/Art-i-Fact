# ✨ Art-i-Fact: Your Personal AI Art Curator

> **Where Human Vision Meets Artificial Intelligence. Discover, Create, and Curate the Future of Art.**

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/qnbs/Art-i-Fact)

<p align="left">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux" alt="Redux Toolkit">
  <img src="https://img.shields.io/badge/Google-Gemini_API-4285F4?logo=google" alt="Gemini API">
  <img src="https://img.shields.io/badge/PWA-Offline_First-d97706" alt="PWA Offline First">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Data-100%25_Client_Side-green" alt="100% Client Side">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
</p>

## 🌐 Live Demo

**➡️ [https://qnbs.github.io/Art-i-Fact/](https://qnbs.github.io/Art-i-Fact/)**

> **Note:** You need a free [Google Gemini API key](https://aistudio.google.com/apikey) to use AI features. Enter it in **Settings → Gemini API Key** after opening the app.

---

> **⚠️ Disclaimer:** Art-i-Fact is an educational tool for art exploration and curation. All artworks sourced from Wikimedia Commons are public domain or freely licensed. AI-generated content should not be considered authoritative art historical analysis. Always verify information with primary sources. This app does not provide professional advice of any kind.

---

**Art-i-Fact** is a sophisticated, AI-powered Progressive Web App (PWA) engineered for art enthusiasts, students, and professional curators. It seamlessly integrates your unique curatorial vision with the vast capabilities of Google's Gemini models, providing a state-of-the-art toolkit to discover, create, organize, and share stunning virtual art exhibitions with unparalleled finesse.

---

### Table of Contents

1. [Live Demo](#-live-demo)
2. [How to Set Up Your Gemini API Key](#-how-to-set-up-your-gemini-api-key)
3. [Architectural Blueprint & Engineering Philosophy](#-architectural-blueprint--engineering-philosophy)
4. [Feature Spotlight: The AI-Powered Curation Toolkit](#-feature-spotlight-the-ai-powered-curation-toolkit)
5. [The Curator's Journey: A Quick Start Guide](#-the-curators-journey-a-quick-start-guide)
6. [Technology Stack](#-technology-stack)
7. [Commitment to Quality & Performance](#-commitment-to-quality--performance)
8. [Running the Project Locally](#-running-the-project-locally)
9. [Deployment Instructions](#-deployment-instructions)
10. [Troubleshooting](#-troubleshooting)
11. [Future Roadmap](#-future-roadmap)
12. [License](#-license)

---

## 🔑 How to Set Up Your Gemini API Key

Art-i-Fact uses the **Google Gemini API** for all AI features. Your API key is stored **only in your browser** (IndexedDB) and is never sent to any server other than Google's API endpoints.

1. Visit [Google AI Studio](https://aistudio.google.com/apikey) and create a free API key.
2. Open Art-i-Fact and go to **Settings** (⚙️ icon).
3. In the **"Gemini API Key"** section, paste your key and click **Save**.
4. All AI features are now active!

> **Security Recommendation:** In Google AI Studio, restrict your API key to your domain (e.g., `qnbs.github.io`) under "API restrictions" for maximum security.

---

## 🏛️ Architectural Blueprint & Engineering Philosophy

Art-i-Fact is built upon a foundation of modern software engineering principles, prioritizing robustness, user empowerment, and long-term maintainability.

#### 1. Decoupled Service Layer (Repository Pattern)

The application enforces a strict separation of concerns. All external interactions—whether with the **Gemini API** (`geminiService.ts`), public art APIs like **Wikimedia** (`wikimediaService.ts`), or the browser's local database (`dbService.ts`)—are encapsulated within a dedicated service layer. This backend-agnostic architecture ensures that UI components remain pure, testable, and unaware of data origins, making the system highly modular and easy to extend or refactor.

#### 2. Advanced State Management & Optimistic UI

We leverage **Redux Toolkit (RTK)** for a predictable, type-safe, and scalable global state. The state is segmented into logical slices, with asynchronous operations and side effects handled cleanly by **Thunks**. This architecture facilitates **Optimistic UI Updates**: when a user performs an action (e.g., adding artwork), the UI responds instantaneously, assuming success. The thunk manages the background synchronization, only rolling back the UI change in the rare case of an error. This pattern, combined with memoized selectors for performance, creates a fluid and exceptionally responsive user experience.

#### 3. Compositional & Reusable UI (Atomic Design)

The user interface is constructed using a library of reusable, presentation-focused components (`components/ui`), following the principles of Atomic Design. This promotes visual consistency and development velocity. Complex functionality, such as drag-and-drop, is implemented using a **Composition over Inheritance** strategy. A Higher-Order Component (HOC) like `withDraggable` imbues any UI component with new capabilities without altering its core presentation logic, maximizing code reuse and maintainability.

#### 4. Offline-First PWA with Network Resilience

Art-i-Fact is a true Progressive Web App. A meticulously configured **Service Worker** employs a **Cache-First** strategy for the app shell and critical assets, ensuring instantaneous loading. All user data is persisted robustly in **IndexedDB**, making the entire curatorial workspace available and editable without an internet connection. Online-dependent features are gracefully disabled with informative tooltips, providing a seamless and reliable user experience in any network condition.

---

## ✨ Feature Spotlight: The AI-Powered Curation Toolkit

Art-i-Fact integrates cutting-edge AI into every facet of the curatorial process.

- ### The Workspace: Your Mission Control

  The foundational organizational unit. Projects act as dedicated containers for thematically related galleries and research journals, enabling focused, multi-faceted curatorial work from a centralized hub.

- ### Semantic Discovery Engine (`Discover`)

  Go beyond simple keywords. This portal leverages the Wikimedia API, enhanced by an intelligent AI layer.
  - **AI-Powered Thematic Search (`gemini-2.5-flash`):** The "Find Similar Art" feature uses AI to analyze a piece's style, subject, and mood, generating a sophisticated, conceptual search query. Discover art based on complex themes like "melancholic seascapes" or "geometric order in nature."

- ### Virtual Gallery Suite & The AI Co-Pilot (`Gallery Suite`)

  Your central hub for managing virtual exhibitions. Intuitive drag-and-drop reordering is complemented by a powerful AI assistant.
  - **AI Curatorial Critique (`gemini-2.5-flash`):** Receive a professional, constructive critique of your gallery's thematic cohesion, narrative flow, and artwork selection, complete with actionable suggestions.
  - **AI-Generated Audio Guide (`gemini-2.5-flash`):** Generate a complete, eloquent, AI-narrated audio guide script for your entire exhibition, including a captivating introduction and individual segments for each piece.
  - **Cinematic Trailer Generation (`veo-3.1-fast-generate-preview`):** Automatically create a short, atmospheric video trailer for your gallery, perfect for sharing a dynamic preview of your collection.
  - **AI Art Historical Deep Dive (`gemini-2.5-flash`):** Generate a detailed analysis of any artwork, covering its symbolism, historical context, and technical execution.

- ### The AI Studio: Your Personal Atelier (`Studio`)

  A complete toolkit for generative art, designed for both rapid experimentation and detailed creation.
  - **High-Fidelity Image Generation (`imagen-4.0-generate-001`):** Harness Google's premier image model to create photorealistic and artistic works from text.
  - **Prompt Alchemy Engine (`gemini-2.5-flash`):** Transform simple ideas into richly detailed, artistic prompts. Let the AI act as your co-writer to unlock superior generation results.
  - **Iterative Image Remix (`gemini-2.5-flash-image`):** Engage in a creative dialogue. Use natural language to apply edits, change styles, or add elements to any existing image, enabling continuous refinement.

- ### Intelligent Research Hub (`Journal`)

  A sophisticated research tool with a side-by-side Markdown editor and live preview.
  - **AI Research Assistant (`gemini-2.5-flash` with Google Search Grounding):** Click "Get Insights" on any topic, and the AI conducts real-time, grounded web research to provide a detailed, well-structured summary complete with source citations, turning your journal into a powerful academic tool.

- ### Zero-Data-Footprint Sharing

  Share your work via a secure, self-contained link. All gallery and profile data is compressed and Base64-encoded directly into the URL hash, ensuring **absolute privacy with zero data ever stored on a server**.

- ### Data-Driven Curator Identity (`Profile`)
  Your profile is a state-of-the-art dashboard reflecting your curatorial identity, featuring a "Curator's Palette" of your dominant colors, a chart of your preferred artistic movements, and an activity feed.

---

## 🚀 The Curator's Journey: A Quick Start Guide

1.  **Found Your Project:** Start in the **Workspace** by creating a new `Project`. This will be the home for your exhibition and research.
2.  **Discover or Create:** Use the **Discover** tab to find masterpieces, or visit the **Studio** to generate your own unique artworks.
3.  **Collect Your Pieces:** From an artwork's detail view, add it to a new or existing `Gallery` within your project.
4.  **Curate & Enhance:** In your `Gallery`, arrange your collection with drag-and-drop. Use the **AI Assistant** ✨ to get a critique, generate an audio guide, and more.
5.  **Research & Reflect:** Use the **Journal** to document your curatorial process and research topics with AI assistance.
6.  **Exhibit & Share:** When your masterpiece is ready, enter **Exhibition Mode** for an immersive viewing experience or **Share** it with the world via a single, private link.

---

## 🛠️ Technology Stack

| Category                  | Technology                             | Rationale & Purpose                                                                              |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Core Framework**        | React 19, TypeScript                   | Building a modern, type-safe, and performant user interface with the latest React features.      |
| **Styling**               | Tailwind CSS                           | A utility-first CSS framework for rapid, consistent, and maintainable UI development.            |
| **State Management**      | Redux Toolkit                          | Centralized, predictable state management with minimal boilerplate, enabling optimistic UI.      |
| **Data Persistence**      | IndexedDB (via `dbService`)            | Robust, client-side database for full offline functionality and 100% data sovereignty.           |
| **AI Text & Analysis**    | `gemini-2.5-flash`                     | Powers critiques, audio guides, research, and prompt enhancements with speed and intelligence.   |
| **AI Image Generation**   | `imagen-4.0-generate-001`              | For creating high-quality, original artworks from text prompts in the AI Studio.                 |
| **AI Image Editing**      | `gemini-2.5-flash-image`               | Used for the "Remix" feature, allowing iterative, conversational editing of existing images.     |
| **AI Video Generation**   | `veo-3.1-fast-generate-preview`        | Creates short, cinematic trailers for galleries, bringing collections to life.                   |
| **AI Web Research**       | `gemini-2.5-flash` w/ Search Grounding | Provides the "Get Insights" feature in the Journal with up-to-date, citation-backed information. |
| **Offline & Performance** | PWA + Service Worker                   | Ensures the app is installable, loads instantly, and is resilient to network conditions.         |
| **Module Loading**        | ESM via Import Maps                    | Modern, browser-native module loading for faster development and a dependency-free build step.   |

---

## 🌟 Commitment to Quality & Performance

- **Accessibility (A11y):** Designed to meet WCAG standards, incorporating proper ARIA roles, full keyboard navigation, and semantic HTML for an inclusive experience.
- **Performance:** We employ memoized selectors, `React.memo`, lazy loading of images, and virtualization for long lists to ensure a consistently fast and responsive interface, even with large collections.
- **Data Sovereignty:** With a 100% client-side storage model in IndexedDB and a serverless sharing mechanism, you retain complete control and privacy over your creative work. Your data never leaves your device.

---

## 🔮 Future Roadmap

Art-i-Fact is an evolving platform. Future state-of-the-art enhancements include:

- **Real-Time Collaboration:** An optional mode allowing multiple curators to co-create a single gallery in real-time using CRDTs or a WebSocket-based sync engine.
- **AI-Powered Auto-Tagging:** Utilize multimodal models to automatically analyze, tag, and extract color palettes from user-uploaded or generated artworks.
- **Augmented Reality (AR) Exhibition Mode:** Leverage WebXR to project your virtual galleries onto physical walls, creating a truly immersive mixed-reality experience.
- **Personalized Discovery Engine:** Train a client-side model to learn your curatorial preferences and proactively recommend new artworks for you to discover.

---

## 🚀 Running the Project Locally

Art-i-Fact is designed for a seamless, modern development experience, including first-class support for containerized environments.

### 1. Using VS Code Dev Containers (Recommended)

For a one-click, dependency-free setup, this repository is configured to use [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers).

1.  Open the repository in Visual Studio Code.
2.  When prompted, click "Reopen in Container".
3.  The container will build, install all dependencies (`npm install`), and start the development server (`npm start`) automatically. The application will be available at `http://localhost:3000`.

### 2. Manual Local Setup

If you prefer a traditional local setup:

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
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
4.  **Start the development server:**
    ```bash
    npm start
    ```

The application will be available at `http://localhost:3000`.

---

## 🚢 Deployment Instructions

Art-i-Fact is configured for automatic deployment to GitHub Pages:

1.  **Enable GitHub Pages:** Go to your repository → Settings → Pages → Source: **GitHub Actions**
2.  **Push to `main`:** Every push to `main` triggers the deployment workflow automatically.
3.  **Your live URL:** `https://qnbs.github.io/Art-i-Fact/`
4.  **Manual deployment:** Go to Actions → "Deploy to GitHub Pages" → "Run workflow"

---

## 🔧 Troubleshooting

| Problem                           | Solution                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Blank page after deployment**   | Ensure `base: '/Art-i-Fact/'` is set in `vite.config.ts`. Check browser console for 404 errors. |
| **Assets not loading**            | Verify that all asset paths are relative, not absolute. The Vite `base` config handles prefix.  |
| **AI features not working**       | Go to Settings → Gemini API Key and enter a valid key. Check browser console for API errors.    |
| **SPA routing broken on refresh** | The `404.html` file handles this. Ensure it exists in `public/`.                                |
| **PWA not installing**            | Ensure you're on HTTPS (GitHub Pages). Check `manifest.json` paths match the base URL.          |
| **Service Worker stale**          | Clear browser cache or unregister the SW in DevTools → Application → Service Workers.           |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

# ✨ Art-i-Fact: Ihr persönlicher KI-Kunstkurator

> **Wo menschliche Vision auf künstliche Intelligenz trifft. Entdecken, Erstellen und Kuratieren Sie die Zukunft der Kunst.**

## 🌐 Live-Demo

**➡️ [https://qnbs.github.io/Art-i-Fact/](https://qnbs.github.io/Art-i-Fact/)**

> **Hinweis:** Sie benötigen einen kostenlosen [Google Gemini API-Schlüssel](https://aistudio.google.com/apikey) für KI-Funktionen. Geben Sie ihn unter **Einstellungen → Gemini API-Schlüssel** ein.

---

> **⚠️ Haftungsausschluss:** Art-i-Fact ist ein Bildungstool zur Kunstexploration und -kuration. Alle von Wikimedia Commons bezogenen Kunstwerke sind gemeinfrei oder frei lizenziert. KI-generierte Inhalte sollten nicht als autoritative kunsthistorische Analyse betrachtet werden. Überprüfen Sie Informationen stets anhand von Primärquellen. Diese App bietet keinerlei professionelle Beratung.

---

**Art-i-Fact** ist eine hochentwickelte, KI-gestützte Progressive Web App (PWA), die für Kunstliebhaber, Studenten und professionelle Kuratoren entwickelt wurde.

---

### Inhaltsverzeichnis

1. [Architektonischer Entwurf & Ingenieursphilosophie](#-architektonischer-entwurf--ingenieursphilosophie)
2. [Feature-Spotlight: Das KI-gestützte Kurations-Toolkit](#-feature-spotlight-das-ki-gestützte-kurations-toolkit-1)
3. [Die Reise des Kurators: Eine Schnellstart-Anleitung](#-die-reise-des-kurators-eine-schnellstart-anleitung-1)
4. [Technologie-Stack](#-technologie-stack-1)
5. [Bekenntnis zu Qualität & Performance](#-bekenntnis-zu-qualität--performance)
6. [Zukünftige Roadmap](#-zukünftige-roadmap-1)
7. [Projekt lokal ausführen](#-projekt-lokal-ausführen-1)

---

## 🏛️ Architektonischer Entwurf & Ingenieursphilosophie

Art-i-Fact basiert auf modernen Software-Engineering-Prinzipien, die Robustheit, Benutzerautonomie und langfristige Wartbarkeit in den Vordergrund stellen.

#### 1. Entkoppelte Service-Schicht (Repository-Muster)

Die Anwendung erzwingt eine strikte Trennung der Zuständigkeiten. Alle externen Interaktionen – sei es mit der **Gemini API** (`geminiService.ts`), öffentlichen Kunst-APIs wie **Wikimedia** (`wikimediaService.ts`) oder der lokalen Browser-Datenbank (`dbService.ts`) – sind in einer dedizierten Service-Schicht gekapselt. Diese Backend-agnostische Architektur stellt sicher, dass UI-Komponenten rein, testbar und unabhängig von den Datenursprüngen bleiben, was das System hochmodular und leicht erweiterbar macht.

#### 2. Fortschrittliches State Management & Optimistic UI

Wir nutzen das **Redux Toolkit (RTK)** für einen vorhersagbaren, typsicheren und skalierbaren globalen Zustand. Der Zustand ist in logische Slices unterteilt, wobei asynchrone Operationen und Nebeneffekte sauber durch **Thunks** gehandhabt werden. Diese Architektur ermöglicht **Optimistic UI Updates**: Wenn ein Benutzer eine Aktion ausführt (z. B. ein Kunstwerk hinzufügt), reagiert die Benutzeroberfläche sofort und geht von einem Erfolg aus. Der Thunk verwaltet die Hintergrundsynchronisation und macht die UI-Änderung nur im seltenen Fehlerfall rückgängig. Dieses Muster schafft eine flüssige und außergewöhnlich reaktionsschnelle Benutzererfahrung.

#### 3. Kompositionsbasierte & wiederverwendbare UI (Atomic Design)

Die Benutzeroberfläche besteht aus einer Bibliothek wiederverwendbarer, reiner Präsentationskomponenten (`components/ui`), die den Prinzipien des Atomic Design folgen. Dies fördert visuelle Konsistenz und Entwicklungsgeschwindigkeit. Komplexe Funktionalität wie Drag-and-Drop wird durch eine **Composition over Inheritance**-Strategie implementiert. Eine Higher-Order Component (HOC) wie `withDraggable` verleiht jeder UI-Komponente neue Fähigkeiten, ohne ihre Kernlogik zu verändern, was die Wiederverwendbarkeit des Codes maximiert.

#### 4. Offline-First PWA mit Netzwerkresilienz

Art-i-Fact ist eine echte Progressive Web App. Ein sorgfältig konfigurierter **Service Worker** verwendet eine **Cache-First**-Strategie für die App-Shell und kritische Assets, was sofortige Ladezeiten gewährleistet. Alle Benutzerdaten werden robust in **IndexedDB** gespeichert, sodass der gesamte kuratorische Arbeitsbereich auch ohne Internetverbindung verfügbar und bearbeitbar ist. Online-abhängige Funktionen werden elegant deaktiviert, was eine nahtlose Benutzererfahrung unter allen Netzwerkbedingungen bietet.

---

## ✨ Feature-Spotlight: Das KI-gestützte Kurations-Toolkit

- ### Der Arbeitsbereich: Ihre Kommandozentrale

  Projekte dienen als dedizierte Container für thematisch zusammenhängende Galerien und Forschungsjournale und ermöglichen eine fokussierte, facettenreiche kuratorische Arbeit.

- ### Semantische Entdeckungs-Engine (`Entdecken`)
  - **KI-gestützte thematische Suche (`gemini-2.5-flash`):** Die "Ähnliche Kunst finden"-Funktion nutzt KI, um Stil, Sujet und Stimmung eines Werks zu analysieren und eine anspruchsvolle, konzeptuelle Suchanfrage zu generieren.

- ### Virtuelle Galerie & Der KI-Co-Pilot (`Galerien`)

  Ihr zentraler Hub für virtuelle Ausstellungen, ergänzt durch einen leistungsstarken KI-Assistenten.
  - **KI-Kurationskritik (`gemini-2.5-flash`):** Erhalten Sie eine professionelle, konstruktive Kritik Ihrer Galerie mit umsetzbaren Verbesserungsvorschlägen.
  - **KI-generierter Audioguide (`gemini-2.5-flash`):** Generieren Sie ein komplettes, eloquentes Audioguide-Skript für Ihre gesamte Ausstellung.
  - **Kinoreifer Trailer (`veo-3.1-fast-generate-preview`):** Erstellen Sie automatisch einen kurzen, atmosphärischen Video-Trailer für Ihre Galerie.
  - **KI-kunsthistorische Tiefenanalyse (`gemini-2.5-flash`):** Generieren Sie eine detaillierte Analyse zu Symbolik, historischem Kontext und Technik eines jeden Kunstwerks.

- ### Das KI-Studio: Ihr persönliches Atelier (`Studio`)

  Ein komplettes Toolkit für generative Kunst.
  - **Hochauflösende Bilderzeugung (`imagen-4.0-generate-001`):** Erschaffen Sie fotorealistische und künstlerische Werke aus Text.
  - **Prompt-Alchemie-Engine (`gemini-2.5-flash`):** Verwandeln Sie einfache Ideen in detailreiche, künstlerische Prompts.
  - **Iterativer Bild-Remix (`gemini-2.5-flash-image`):** Führen Sie einen kreativen Dialog mit der KI und bearbeiten Sie Bilder mit natürlicher Sprache.

- ### Intelligentes Forschungszentrum (`Journal`)

  Ein anspruchsvolles Recherche-Tool mit Markdown-Editor.
  - **KI-Recherche-Assistent (`gemini-2.5-flash` mit Google Search Grounding):** Erhalten Sie auf Knopfdruck eine detaillierte, gut strukturierte Zusammenfassung zu jedem Thema, gestützt auf Echtzeit-Web-Recherchen und komplett mit Quellenangaben.

- ### Teilen ohne Datenspuren
  Teilen Sie Ihre Arbeit über einen sicheren Link. Alle Galerie- und Profildaten werden komprimiert und Base64-kodiert direkt in den URL-Hash geschrieben, was **absolute Privatsphäre ohne serverseitige Datenspeicherung** gewährleistet.

---

## 🚀 Die Reise des Kurators: Eine Schnellstart-Anleitung

1.  **Projekt gründen:** Beginnen Sie im **Arbeitsbereich** mit einem neuen `Projekt`.
2.  **Entdecken oder Erschaffen:** Nutzen Sie den **Entdecken**-Tab, um Meisterwerke zu finden, oder das **Studio**, um eigene Kunstwerke zu generieren.
3.  **Werke sammeln:** Fügen Sie Kunstwerke zu einer neuen oder bestehenden `Galerie` hinzu.
4.  **Kuratieren & Veredeln:** Arrangieren Sie Ihre `Galerie` per Drag-and-Drop und nutzen Sie den **KI-Assistenten** ✨ für Kritik, Audioguides und mehr.
5.  **Forschen & Reflektieren:** Dokumentieren Sie Ihren Prozess im **Journal** und nutzen Sie KI-gestützte Recherche.
6.  **Ausstellen & Teilen:** Präsentieren Sie Ihre Arbeit im **Ausstellungsmodus** oder teilen Sie sie über einen privaten Link.

---

## 🛠️ Technologie-Stack

| Kategorie                 | Technologie                            | Begründung & Zweck                                                                            |
| ------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Kern-Framework**        | React 19, TypeScript                   | Erstellung einer modernen, typsicheren und performanten Benutzeroberfläche.                   |
| **Zustandsverwaltung**    | Redux Toolkit                          | Zentralisierte, vorhersagbare Zustandsverwaltung, die Optimistic UI ermöglicht.               |
| **Datenpersistenz**       | IndexedDB                              | Robuste, clientseitige Datenbank für volle Offline-Funktionalität und 100% Datensouveränität. |
| **KI Text & Analyse**     | `gemini-2.5-flash`                     | Ermöglicht Kritiken, Audioguides, Recherchen und Prompt-Verbesserungen.                       |
| **KI Bilderzeugung**      | `imagen-4.0-generate-001`              | Zur Erstellung hochwertiger, origineller Kunstwerke im KI-Studio.                             |
| **KI Bildbearbeitung**    | `gemini-2.5-flash-image`               | Wird für die "Remix"-Funktion verwendet, die eine iterative Bearbeitung von Bildern erlaubt.  |
| **KI Videoerzeugung**     | `veo-3.1-fast-generate-preview`        | Erstellt kinoreife Trailer für Galerien.                                                      |
| **KI Web-Recherche**      | `gemini-2.5-flash` w/ Search Grounding | Liefert die "Einblicke erhalten"-Funktion im Journal mit aktuellen, zitierten Infos.          |
| **Offline & Performance** | PWA + Service Worker                   | Stellt sicher, dass die App installierbar ist, sofort lädt und netzwerkresistent ist.         |

---

## 🌟 Bekenntnis zu Qualität & Performance

- **Barrierefreiheit (A11y):** Entwickelt nach WCAG-Standards, mit korrekten ARIA-Rollen, vollständiger Tastaturnavigation und semantischem HTML.
- **Performance:** Wir setzen auf memoized Selectors, `React.memo`, Lazy Loading von Bildern und Virtualisierung, um eine durchgehend schnelle und reaktionsfähige Oberfläche zu gewährleisten.
- **Datensouveränität:** Durch ein 100% clientseitiges Speichermodell behalten Sie die vollständige Kontrolle und Privatsphäre über Ihre kreative Arbeit. Ihre Daten verlassen niemals Ihr Gerät.

---

## 🔮 Zukünftige Roadmap

- **Echtzeit-Kollaboration:** Ein optionaler Modus, der es mehreren Kuratoren ermöglicht, gemeinsam an einer Galerie zu arbeiten.
- **KI-gestütztes Auto-Tagging:** Automatische Analyse, Verschlagwortung und Farbpaletten-Extraktion für hochgeladene oder generierte Kunstwerke.
- **Augmented Reality (AR) Ausstellungsmodus:** Projizieren Sie Ihre virtuellen Galerien mit WebXR an physische Wände.
- **Personalisierte Entdeckungs-Engine:** Ein clientseitiges Modell, das Ihre kuratorischen Vorlieben lernt und proaktiv neue Kunstwerke empfiehlt.

---

## 🚀 Projekt lokal ausführen

### 1. Mit VS Code Dev Containern (Empfohlen)

1.  Öffnen Sie das Repository in Visual Studio Code.
2.  Klicken Sie auf "Reopen in Container".
3.  Der Container wird erstellt, installiert alle Abhängigkeiten (`npm install`) und startet den Entwicklungsserver (`npm start`) automatisch. Die Anwendung ist unter `http://localhost:3000` verfügbar.

### 2. Manuelles lokales Setup

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
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
4.  **Entwicklungsserver starten:**
    ```bash
    npm start
    ```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

---

## 🚢 Deployment

1. Settings → Pages → Source: **GitHub Actions**
2. Push auf `main` löst automatisches Deployment aus
3. Live-URL: `https://qnbs.github.io/Art-i-Fact/`

---

## 📄 Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](LICENSE) lizenziert.
