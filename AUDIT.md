# Art-i-Fact — Full Application Audit

> **Audit date:** 2026-04-14  
> **Scope:** Full app, repo configuration, DevContainer, security, performance, accessibility, i18n  
> **App version:** 1.0.0  

---

## Executive Summary

Art-i-Fact is a well-architected client-only React 19 + TypeScript PWA with clean separation of concerns: Redux Toolkit for state, IndexedDB for persistence, dedicated service layer for external APIs (Gemini AI, Wikimedia), and a comprehensive i18n system. The codebase demonstrates strong engineering fundamentals.

**Overall quality: GOOD** — Architecture is solid, patterns are consistent, the app is functional and feature-rich. The issues below are improvement opportunities, not fundamental flaws.

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 2 | 1 fixed, 1 false positive (verified safe) |
| HIGH | 8 | Documented for future work |
| MEDIUM | 12 | Backlog |
| LOW | 6 | Nice-to-have |

---

## Critical Issues

### ~~CRIT-01: Duplicate `AppLayout.tsx` at project root~~ ✅ FIXED
- **File:** `AppLayout.tsx` (root) — was empty, real implementation in `components/AppLayout.tsx`
- **Risk:** Ambiguous imports, developer confusion
- **Resolution:** Deleted the empty root-level file

### ~~CRIT-02: XSS in `sanitizeInput()` via innerHTML~~ ✅ FALSE POSITIVE
- **File:** `services/geminiService.ts` line 59–62
- **Initial report:** innerHTML-based sanitization is XSS-vulnerable
- **Verification:** The function uses `document.createTextNode(str)` which auto-escapes HTML entities, then reads `div.innerHTML` to return the escaped string. This is a **well-known safe pattern** — innerHTML is being *read* (not *set*). No XSS vulnerability exists.

---

## High Priority Issues

### HIGH-01: Race condition in `galleriesSlice.ts` — dispatch-in-thunk
- **File:** `store/galleriesSlice.ts`
- **Issue:** `addArtworkToGallery` dispatches `updateGallery` thunk from within a thunk. Concurrent calls can conflict, leading to lost updates.
- **Fix:** Batch updates in a single transaction or use optimistic updates with rollback.
- **Effort:** Medium — requires restructuring thunk logic

### HIGH-02: State mutation risk in `updateGallery`
- **File:** `store/galleriesSlice.ts`
- **Issue:** Modifies state in-place then saves to IndexedDB. If DB save fails, in-memory state is corrupted with no rollback mechanism.
- **Fix:** Persist first, then update in-memory state on success; or implement optimistic update with rollback on failure.
- **Effort:** Medium

### HIGH-03: Missing `.rejected` handler for `fetchWelcomeStatus` ✅ FIXED
- **File:** `store/appSlice.ts`
- **Issue:** No `.rejected` case — state stays 'loading' forever if DB read fails.
- **Resolution:** Added `.rejected` handler that sets `status: 'succeeded'` and `showWelcome: false` as safe fallback.

### HIGH-04: Excessive `any` types (23+ instances)
- **Files:** `components/ui/Button.tsx`, `components/Setup.tsx`, `hooks/useAppController.ts`, `contexts/AIStatusContext.tsx`, `contexts/TranslationContext.tsx`, `registerSW.ts`
- **Issue:** Undermines TypeScript type safety. Includes unsafe casts like `(locales as any)[language]` and `(import.meta as any).env`.
- **Fix:** Replace with proper union types, generics, or Vite's `ImportMeta` type.
- **Effort:** Medium — requires per-instance analysis

### HIGH-05: Hardcoded English strings in ChatModal
- **File:** `components/ChatModal.tsx`
- **Issue:** System prompt (line ~62: `"Give me a brief, fascinating insight..."`) and error messages are hardcoded English, bypassing the i18n system.
- **Fix:** Move to `i18n/prompts.ts` or `i18n/locales.ts` translation keys.
- **Effort:** Low

### HIGH-06: No keyboard accessibility for drag-and-drop
- **File:** `components/dnd/withDraggable.tsx`
- **Issue:** DnD is mouse/touch-only. Keyboard users cannot reorder gallery items.
- **Fix:** Add Ctrl+Arrow key shortcuts for keyboard reordering, or use an accessible DnD library.
- **Effort:** Medium

### HIGH-07: `copilot-instructions.md` had incorrect facts ✅ FIXED
- **File:** `.github/copilot-instructions.md`
- **Issues:** Claimed `npm start` uses `live-server` (actually Vite), claimed no SW registration (exists in `index.tsx`)
- **Resolution:** Corrected all inaccuracies and added new sections for Build & Deploy, PWA, DevContainer, Security, i18n.

### HIGH-08: Missing SEO meta tags ✅ FIXED
- **File:** `index.html`
- **Issue:** No `<meta name="description">` or Open Graph tags for social sharing/SEO.
- **Resolution:** Added description, og:title, og:description, og:type, og:url.

---

## Medium Priority Issues

### MED-01: `tsconfig.json` — strict mode disabled
- **File:** `tsconfig.json`
- **Issue:** No `strict: true`, `noImplicitAny`, or `strictNullChecks`. Allows implicit `any` types and unchecked null/property access.
- **Recommendation:** Enable gradually; start with `noImplicitAny` to catch the most impactful issues.

### MED-02: Hardcoded discovery inspiration labels
- **File:** `data/inspiration.ts`
- **Issue:** `discoverInspirationPrompts` has hardcoded English labels (`"Impressionism"`, `"Baroque"` etc.) instead of i18n keys.
- **Fix:** Use `t('discover.inspiration.impressionism')` pattern like `studioInspirationPrompts` does.

### MED-03: Missing i18n keys across components
- **Files:** `components/ArtworkDetails.tsx`, `components/ChatModal.tsx`, `components/ErrorBoundary.tsx`
- **Missing keys:** `artwork.details.sourceLink`, `chat.placeholder`, `chat.error`, `artwork.notes.empty`
- **Fix:** Add keys to `i18n/locales.ts` for both `de` and `en`.

### MED-04: Modal focus management incomplete
- **File:** `components/Modal.tsx`
- **Issue:** While base modal has Escape key handling, focus trapping could be tighter — Tab can sometimes escape the modal.
- **Fix:** Ensure focus is trapped within modal and restored to trigger element on close.

### MED-05: Missing `aria-live` on loading states
- **File:** `components/ui/LoadingOverlay.tsx`
- **Issue:** Loading messages don't announce to screen readers.
- **Fix:** Add `aria-live="polite"` to the loading message container.

### MED-06: `ArtworkItemUI` keyboard handling incomplete
- **File:** `components/ui/ArtworkItemUI.tsx`
- **Issue:** `onKeyDown` only handles `Enter` key. Standard button accessibility also requires `Space` key.
- **Fix:** Add `case ' ':` alongside `case 'Enter':` in the keydown handler.

### MED-07: API timeout missing for Wikimedia fetches
- **File:** `services/wikimediaService.ts`
- **Issue:** `fetch()` calls have no timeout. Searches can hang indefinitely on slow connections.
- **Fix:** Use `AbortController` with a reasonable timeout (e.g. 10s).

### MED-08: `apiKeyService.ts` silent error swallowing
- **File:** `services/apiKeyService.ts`
- **Issue:** Generic `catch` blocks return `null` without logging the error reason.
- **Fix:** Add `console.error` with error details for debugging.

### MED-09: GalleryView remove button mouse-only
- **File:** `components/GalleryView.tsx`
- **Issue:** Remove button has `onClick` but no `onKeyDown` — mouse-only interaction.
- **Fix:** Use `<button>` element instead of div, or add keyboard event handler.

### MED-10: Toast close button not translatable
- **File:** `components/ui/Toast.tsx`
- **Issue:** Close button `aria-label` is hardcoded "Close" instead of using i18n.
- **Fix:** Use `t('common.close')` or similar.

### MED-11: Console logs in service worker registration
- **File:** `registerSW.ts`
- **Issue:** Multiple `console.log` calls for service worker lifecycle events.
- **Fix:** Gate behind `import.meta.env.DEV` check or remove.

### MED-12: Two service worker files (confusing structure)
- **Files:** `service-worker.js` (root, v1), `public/service-worker.js` (v2)
- **Issue:** Root file is v1 (dev), public is v2 (production). Confusing structure. Root file may serve stale cache strategy during development.
- **Fix:** Align both files, or remove root file and configure Vite to serve from `public/` in dev too.

---

## Low Priority Issues

### LOW-01: `allowJs: true` in `tsconfig.json` unnecessary
- **File:** `tsconfig.json`
- **Issue:** Codebase is TypeScript-only. `allowJs` is unnecessary and could mask accidental `.js` files.
- **Fix:** Remove `allowJs: true`.

### LOW-02: `sitemap.xml` lastmod hardcoded ✅ FIXED
- **File:** `public/sitemap.xml`
- **Issue:** Was hardcoded to `2025-01-01`.
- **Resolution:** Updated to `2026-04-14`. Consider adding a build-time script to automate this.

### LOW-03: `feat_3` in featuredArtworks uses "Fair use" license
- **File:** `data/featuredArtworks.ts`
- **Issue:** All other featured artworks are "Public domain" but `feat_3` uses "Fair use". Verify this is intentional and the app's license display reflects this correctly.

### LOW-04: Missing skip-to-content link
- **File:** `components/AppLayout.tsx`
- **Issue:** No skip-to-content link for keyboard users to bypass navigation.
- **Fix:** Add `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>` at the top of layout.

### LOW-05: Missing `crossorigin` attribute on font preconnect
- **File:** `index.html`
- **Issue:** `<link rel="preconnect" href="https://fonts.googleapis.com">` missing `crossorigin` attribute (fonts.gstatic.com has it).
- **Fix:** Add `crossorigin` to the fonts.googleapis.com preconnect link.

### LOW-06: Tailwind loaded from CDN (production risk)
- **File:** `index.html`
- **Issue:** CSS framework loaded from `cdn.tailwindcss.com` — external dependency with no SRI hash. CDN outage or compromise would break the app.
- **Recommendation:** Long-term, consider local Tailwind build pipeline or add SRI hash to CDN script tag.

---

## Security Audit

### API Key Handling
| Aspect | Status | Notes |
|--------|--------|-------|
| Storage | ⚠️ XOR obfuscation | Not cryptographic. Adequate for browser-side client app where user owns the key. |
| In-memory cache | ⚠️ Plain text | `_cachedKey` in `apiKeyService.ts` holds unencrypted key. Observable in DevTools Memory profiler. |
| Component exposure | ✅ Safe | Key never leaves service layer. Components access AI via `geminiService.ts` only. |
| Build injection | ✅ Safe | Vite injects from `.env` with empty string fallback in production. |

### Input Sanitization
| Function | File | Status | Notes |
|----------|------|--------|-------|
| `sanitizeInput()` | `geminiService.ts` | ✅ Safe | Uses `createTextNode` (not innerHTML setter) — verified safe pattern |
| `sanitizeHtml()` | `wikimediaService.ts` | ⚠️ Adequate | DOMParser-based. Works but has no CSP allowlist for Wikimedia metadata keys. |

### External Dependencies
| Source | Usage | Risk |
|--------|-------|------|
| `cdn.tailwindcss.com` | CSS framework | ⚠️ No SRI hash |
| `esm.sh` | Import map modules | ⚠️ No SRI hash |
| `fonts.googleapis.com` | Web fonts | ✅ Low risk |
| Wikimedia Commons API | Artwork data | ✅ Sanitized |
| Gemini API | AI features | ✅ Via service layer |

---

## Performance Audit

### Bundle & Loading
| Aspect | Status | Notes |
|--------|--------|-------|
| Code splitting | ✅ Good | Manual chunks for react-vendor, redux-vendor, ai-vendor |
| Lazy loading views | ❌ Missing | All components imported eagerly in `MainContent.tsx`. Consider `React.lazy()` for route-level splitting. |
| Asset hashing | ✅ Good | Hash-based filenames prevent stale cache |
| Minification | ✅ Good | Terser enabled |
| Chunk warning limit | ⚠️ 600KB | Permissive; monitor for growth |

### React Performance
| Aspect | Status | Notes |
|--------|--------|-------|
| Memoization | ⚠️ Partial | Some components use `React.memo` (AccordionItem, ArtworkItemUI). Others like MainContent, GalleryView lack it. |
| Callback stability | ⚠️ Partial | `handleDragEnd` in GalleryView recreated on every render; should use `useCallback`. |
| Selector efficiency | ⚠️ | `galleryCountByProject()` in useAppController filters all galleries per call. Should be a memoized selector. |
| Translation lookup | ⚠️ | `getNestedTranslation()` walks the object tree on every `t()` call. Consider caching resolved keys. |

---

## Accessibility Audit

| Aspect | Status | Priority |
|--------|--------|----------|
| Keyboard navigation | ⚠️ Partial | HIGH — DnD mouse-only, some buttons missing keyboard handlers |
| ARIA attributes | ✅ Good | `aria-current`, `aria-expanded`, `aria-label` used consistently |
| Focus management | ⚠️ Partial | Modal has Escape key but focus trap could be tighter |
| Screen reader support | ⚠️ | Missing `aria-live` on loading states, `aria-busy` on overlays |
| Skip link | ❌ Missing | No skip-to-content link |
| Color contrast | ✅ | Amber/dark theme provides good contrast |
| Semantic HTML | ✅ Good | Proper heading hierarchy, landmark regions |

---

## i18n Audit

### Translation Coverage
| Area | Status | Notes |
|------|--------|-------|
| Core UI | ✅ Complete | All major views have DE/EN translations |
| AI prompts | ✅ Complete | `i18n/prompts.ts` has all 8 prompt types in both languages |
| Loading messages | ✅ Complete | `i18n/loadingMessages.ts` covers all AI task types |
| Error messages | ⚠️ Partial | ErrorBoundary, ChatModal have hardcoded English strings |
| Data labels | ⚠️ Partial | `discoverInspirationPrompts` labels hardcoded English |
| Toast messages | ⚠️ Partial | Some close buttons use hardcoded "Close" |

### Missing i18n Keys (to add to `locales.ts`)
```
artwork.details.sourceLink
chat.placeholder
chat.initialPrompt
chat.error
artwork.notes.empty
gallery.share.modalTitle
common.close (for Toast)
errorBoundary.title
errorBoundary.message
errorBoundary.reload
```

---

## DevContainer & Configuration Audit

### DevContainer
| Aspect | Status | Notes |
|--------|--------|-------|
| Base image | ✅ | `mcr.microsoft.com/devcontainers/typescript-node:20` |
| Extensions | ✅ | ESLint, Prettier, Tailwind CSS, GitLens, Copilot, TS Nightly |
| Auto-start | ✅ | `postAttachCommand: npm start` |
| Port forwarding | ✅ | Port 3000 with auto-preview |
| Format on save | ✅ | Prettier for TS/TSX |

### TypeScript Config
| Setting | Value | Recommendation |
|---------|-------|---------------|
| `target` | ES2022 | ✅ Appropriate for modern browsers |
| `strict` | not set | ⚠️ Enable gradually |
| `allowJs` | true | ⚠️ Unnecessary — codebase is TS-only |
| `moduleResolution` | bundler | ✅ Correct for Vite |
| `isolatedModules` | true | ✅ Required for Vite |

### Vite Config
| Aspect | Status |
|--------|--------|
| Base path | ✅ `/Art-i-Fact/` |
| Dev server | ✅ Port 3000, host 0.0.0.0 |
| React plugin | ✅ Enabled |
| Code splitting | ✅ 3 manual chunks |
| Env injection | ✅ Secure with fallback |

---

## Recommended Roadmap

### Immediate (next session)
1. Fix hardcoded English strings in ChatModal → move to i18n keys
2. Add missing i18n keys to `locales.ts`
3. Add `Space` key handling alongside `Enter` in ArtworkItemUI

### Short-term (1–2 sprints)
4. Restructure gallery thunks to prevent race conditions (HIGH-01, HIGH-02)
5. Replace `any` types with proper types (HIGH-04)
6. Add `React.lazy()` for view-level code splitting
7. Add `AbortController` timeouts to Wikimedia fetches
8. Add `useCallback` for event handlers in GalleryView

### Medium-term (backlog)
9. Enable TypeScript strict mode incrementally
10. Add keyboard accessibility for DnD reordering
11. Consolidate service worker files (v1/v2 discrepancy)
12. Add SRI hashes for CDN resources
13. Consider local Tailwind build pipeline
14. Add skip-to-content link
15. Implement proper focus trap in Modal

---

*This audit was generated as part of a comprehensive app review. Findings are documented for use as a development backlog. Items marked ✅ FIXED have been resolved in the accompanying commit.*
