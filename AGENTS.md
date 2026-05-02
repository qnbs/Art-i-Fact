# Hinweise für KI- und menschliche Mitwirkende

Dieses Repository ist **Art-i-Fact**: eine rein clientseitige React-PWA (Vite, Redux, IndexedDB, Gemini API). Kurzkontext für Agenten und Reviews:

| Bereich | Einstieg |
|--------|----------|
| App-Shell | `index.tsx` → `AppProviders` → `App` → `components/AppLayout.tsx` |
| Orchestrierung | `hooks/useAppController.ts`, `contexts/AppContext.tsx` |
| Persistenz | `services/dbService.ts`; API-Schlüssel `services/apiKeyService.ts` |
| Externe APIs | `services/geminiService.ts`, `services/wikimediaService.ts` |
| i18n | `i18n/locales.ts`, `i18n/prompts.ts`, `i18n/loadingMessages.ts` |

**Befehle:** `npm start` (Dev), `npm run build` (`tsc && vite build`), `npm run preview`.

**Dauerhafte Agenten-Regeln:** `.cursor/rules/art-i-fact.mdc`  
**Architektur & Copilot:** `.github/copilot-instructions.md`  
**Backlog / Audit:** `AUDIT.md`

Bitte Änderungen klein halten, bestehende Muster (Slices, Thunks, Services) fortsetzen und keine unnötigen Markdown- oder Refactoring-Runden außerhalb der Aufgabe.
