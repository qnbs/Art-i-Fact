# Copilot Instructions for Art-i-Fact

## Big picture architecture
- This is a client-only React 19 + TypeScript app built with **Vite**, deployed to GitHub Pages at `/Art-i-Fact/`.
- Runtime composition: `index.tsx` → `AppProviders` → `App` → `components/AppLayout.tsx`.
- Global app orchestration lives in `contexts/AppContext.tsx` and `hooks/useAppController.ts`.
- Redux Toolkit slices hold canonical state; IndexedDB (`services/dbService.ts`) is the persistence boundary.
- External integrations are isolated in services (`services/geminiService.ts`, `services/wikimediaService.ts`). Keep components API-agnostic.

## State and data flow conventions
- Follow the existing slice pattern: `fetch*` thunks for initial load, mutation thunks that persist immediately to IndexedDB, then reducers update in-memory state.
- `useAppController` is the façade for selecting state + dispatching thunk-backed actions; `AppContext` adds UI workflows (modals, toasts, AI actions).
- IDs are timestamp-based string prefixes (`proj_`, `gal_`, `jnl_`); preserve this convention when creating entities.
- Keep navigation state in `store/uiSlice.ts` (`activeView`, `activeProjectId`, `activeGalleryId`) instead of local component state.

## AI integration pattern
- Add new AI features through `services/geminiService.ts`, then invoke from UI via `useAI().handleAiTask(...)` (`contexts/AIStatusContext.tsx`).
- `handleAiTask` is the standard loading/error/retry pipeline; do not duplicate ad-hoc loading logic in feature components.
- Existing AI tasks are keyed by `AiTask` union in `AIStatusContext.tsx`; extend that union for new long-running tasks.
- Prompt templates are centralized in `i18n/prompts.ts` and should stay language-aware (`de`/`en`).

## UI and component patterns
- Reusable presentational primitives are in `components/ui/*`; prefer extending these before creating new one-off controls.
- Drag-and-drop behavior is composed via HOC (`components/dnd/withDraggable.tsx`), e.g. `GalleryView` wraps `ArtworkItemUI`.
- App-wide overlays are centralized: modal (`ModalContext`), toast (`ToastContext`), AI loading overlay (`AppLayout` + `AIStatusContext`).
- Keep string literals out of components; use `useTranslation().t(...)` keys from `i18n/locales.ts`.

## Runtime and workflow facts (important)
- Dev command: `npm start` (runs Vite dev server on port 3000).
- Build command: `npm run build` (runs `tsc && vite build`, outputs to `dist/`).
- Preview production build: `npm run preview`.
- There are no built-in `test`/`lint` scripts in `package.json`; avoid assuming Jest/Vitest/ESLint tasks exist.
- Imports use explicit `.ts`/`.tsx` extensions throughout; keep that style for consistency.
- Styling is Tailwind via CDN (`cdn.tailwindcss.com`) with inline config in `index.html`; no local Tailwind build pipeline is configured.

## Build and deploy
- Vite config in `vite.config.ts` with `base: "/Art-i-Fact/"` for GitHub Pages.
- Code-splitting: `react-vendor`, `redux-vendor`, `ai-vendor` manual chunks.
- Environment variables: `GEMINI_API_KEY` injected via Vite's `define` from `.env` file (empty string fallback in production).
- Deploy: `npm run build` → push `dist/` to GitHub Pages (or use CI workflow).

## PWA setup
- `manifest.json` at project root with proper scope and start_url for `/Art-i-Fact/`.
- Service worker registered in `index.tsx` via `registerServiceWorker()` from `registerSW.ts`.
- Two SW files: `service-worker.js` (root, dev) and `public/service-worker.js` (copied to dist during build). Cache-first strategy with `art-i-fact-cache-v2`.

## i18n conventions
- Two supported languages: German (`de`, default) and English (`en`).
- Translation keys in `i18n/locales.ts`; access via `useTranslation().t('nested.key')`.
- Template variables in translations use `{{variableName}}` syntax.
- AI prompt templates in `i18n/prompts.ts` — both languages must be kept in sync.
- Loading messages per AI task in `i18n/loadingMessages.ts`.

## Integration details and gotchas
- API key is managed via `services/apiKeyService.ts` with XOR obfuscation in IndexedDB (not cryptographic — browser-side only). Cached in memory for performance.
- Input sanitization uses safe `createTextNode`-based HTML escaping in `geminiService.ts::sanitizeInput()`.
- Wikimedia metadata sanitized via `DOMParser`-based `sanitizeHtml()` in `wikimediaService.ts`.
- Online/offline status is exposed by `contexts/OnlineStatusContext.tsx`; use it to gate network-dependent UX.
- Gallery share links are generated in `components/ShareModal.tsx` as Base64 hash payloads (`#view=...`).

## DevContainer
- `.devcontainer/devcontainer.json` uses `mcr.microsoft.com/devcontainers/typescript-node:20`.
- Auto-installs extensions: ESLint, Prettier, Tailwind CSS IntelliSense, GitLens, Copilot, TypeScript Nightly.
- `postCreateCommand`: `npm install`. `postAttachCommand`: `npm start` (auto-starts dev server).
- Port 3000 forwarded with auto-preview.

## Security notes
- API keys are stored browser-side only; XOR obfuscation in `apiKeyService.ts` is not cryptographic.
- All AI service calls should remain in `services/geminiService.ts`; never expose raw API keys in components.
- `sanitizeInput()` in geminiService is safe (uses `createTextNode`, not `innerHTML` setter).
- External content from Wikimedia is sanitized before rendering; extend sanitization if new external sources are added.

## Preferred change strategy in this repo
- For new feature work: update service (if needed) → thunk/slice → `useAppController`/`AppContext` handlers → view component.
- For bug fixes: prefer tracing through `AppContext` handlers and thunk payload flow before patching UI symptoms.
- Keep changes localized and avoid introducing alternative state channels when a slice/context pattern already exists.
- Consult `AUDIT.md` for documented issues prioritized by severity before starting large refactors.
