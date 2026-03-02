# Copilot Instructions for Art-i-Fact

## Big picture architecture
- This is a client-only React + TypeScript app served directly in the browser (`index.html` + `index.tsx`), not a bundled Node backend.
- Runtime composition is `index.tsx` -> `AppProviders` -> `App` -> `components/AppLayout.tsx`.
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
- Dev command: `npm start` (runs `live-server --port=3000 --open=index.html`).
- There are no built-in `test`/`lint` scripts in `package.json`; avoid assuming Jest/Vitest/ESLint tasks exist.
- Imports use explicit `.ts`/`.tsx` extensions throughout; keep that style for consistency.
- Styling is Tailwind via CDN + utility classes in `index.html`; no local Tailwind build pipeline is configured.

## Integration details and gotchas
- API key usage is browser-side via `process.env.API_KEY` in `services/geminiService.ts`; keep AI calls inside service layer.
- Online/offline status is exposed by `contexts/OnlineStatusContext.tsx`; use it to gate network-dependent UX.
- Gallery share links are generated in `components/ShareModal.tsx` as Base64 hash payloads (`#view=...`).
- Service worker file exists (`service-worker.js`) with cache-first logic, but there is no registration path in current app code.

## Preferred change strategy in this repo
- For new feature work: update service (if needed) -> thunk/slice -> `useAppController`/`AppContext` handlers -> view component.
- For bug fixes: prefer tracing through `AppContext` handlers and thunk payload flow before patching UI symptoms.
- Keep changes localized and avoid introducing alternative state channels when a slice/context pattern already exists.
