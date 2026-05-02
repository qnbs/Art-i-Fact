# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Removed empty duplicate `AppLayout.tsx` at project root (real implementation is in `components/AppLayout.tsx`)
- Added missing `.rejected` handler for `fetchWelcomeStatus` thunk in `appSlice.ts` — previously state could remain stuck at 'loading' if IndexedDB read failed
- Updated outdated `lastmod` date in `public/sitemap.xml`
- `index.html`: `crossorigin` on Google Fonts `preconnect` for `fonts.googleapis.com` (audit LOW-05)

### Added
- SEO meta description and Open Graph tags in `index.html`
- `CHANGELOG.md` following Keep a Changelog standard
- `AUDIT.md` comprehensive app audit documentation
- `AGENTS.md` — concise conventions for contributors and AI agents
- `.cursor/rules/art-i-fact.mdc` — Cursor always-on project rules
- `.vscode/extensions.json` — recommended editor extensions

### Changed
- Updated and expanded `.github/copilot-instructions.md` with corrected runtime facts and new sections (Build & Deploy, PWA, DevContainer, Security, i18n)
- GitHub Actions workflow renamed and extended to **CI and Deploy to GitHub Pages**: build on PRs and pushes to `main`; Pages publish on `main` pushes and on manual `workflow_dispatch` when run on `main`
- `README.md`: technology stack accuracy (Vite bundling, Tailwind CDN), CI/deploy wording, links to `AGENTS.md` / copilot instructions; TypeScript badge wording
- `AUDIT.md`: tooling section for Cursor and CI; LOW-05 marked fixed; audit metadata refreshed

## [1.0.0] - 2025-01-01

### Added
- **AI-Powered Art Discovery** — Search and discover artworks from Wikimedia Commons with Gemini AI-enhanced metadata and analysis
- **Virtual Gallery Curation** — Create, organize, and manage themed art galleries with drag-and-drop reordering
- **Project System** — Organize galleries into projects with AI-generated descriptions
- **Deep Dive Analysis** — AI-powered detailed art analysis covering symbolism, technique, historical context, and more
- **Gallery Critique** — AI art critic providing nuanced feedback on curated gallery compositions
- **Audio Guide Generation** — AI-generated audio tour scripts for galleries
- **Studio Mode** — AI image generation and remixing capabilities using Gemini's image generation
- **Interactive Chat** — Context-aware AI chat about artworks and art history
- **Camera Analysis** — Real-time artwork analysis via device camera
- **Art Journal** — Personal journaling with AI-assisted reflection prompts
- **Artist Profile** — Customizable curator profile with AI biography generation
- **Exhibition Mode** — Full-screen slideshow presentation of gallery artworks
- **Gallery Sharing** — Share galleries via Base64-encoded URL hash payloads
- **Color Palette Extraction** — Extract and display dominant color palettes from artworks
- **Glossary** — Searchable art terminology glossary
- **Command Palette** — Quick-access keyboard shortcut overlay (Ctrl+K)
- **Dark/Light Theme** — System-aware theme with manual toggle
- **Bilingual i18n** — Full German and English language support
- **Progressive Web App** — Offline-capable PWA with service worker caching
- **IndexedDB Persistence** — All data stored client-side in IndexedDB via custom `dbService`
- **Redux Toolkit State Management** — Centralized state with thunk-based async operations
- **Responsive Design** — Mobile-first layout with bottom navigation bar and desktop sidebar
- **Accessibility** — Keyboard navigation, ARIA attributes, focus management
- **Welcome Portal** — Interactive onboarding tutorial for new users
- **Featured Artworks** — Curated starter collection of 12 notable artworks

### Security
- API key stored with XOR obfuscation in IndexedDB (note: not cryptographic, browser-side only)
- Input sanitization via `sanitizeInput()` using safe `createTextNode` HTML escaping pattern
- HTML sanitization for Wikimedia metadata via `DOMParser`-based `sanitizeHtml()`

[Unreleased]: https://github.com/qnbs/Art-i-Fact/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/qnbs/Art-i-Fact/releases/tag/v1.0.0
