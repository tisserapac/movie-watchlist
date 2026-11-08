# Progress Tracker

Update this file after every completed item. Anyone (or any AI agent) reading this
should immediately know what is done, what is in progress, and what is next.
The full plan is in [development-plan.md](development-plan.md); the stages below
follow its *Deliverables (git tags)*.

---

## Current Status

**Stage:** Stage 2 — `extended`
**Last completed:** 08 Slide 63 checklist passed; tag `lab-solution`
**Next:** 09 `useLocalStorage` custom hook

---

## Progress

### Stage 1 — `lab-solution` (React slides 57–64)

- [x] 01 Scaffold: Vite `react` template, Vite `.gitignore` (keep `context/`), clean slate (slide 13), CSS tokens in `index.css`
- [x] 02 Lab Task 1: `MovieCard` component + `MovieCard.css`
- [x] 03 Lab Task 2: display movies from state, `initialMovies.js` (8 sample movies), `MovieList`
- [x] 04 Lab Task 3: `AddMovieForm` with controlled title / year / genre
- [x] 05 Lab Task 4: toggle watched and delete (child-to-parent), watched counter
- [x] 06 Lab Task 5: validation, empty state, `FilterBar`, `localStorage` + Reset to sample movies
- [x] 07 Lab Task 6: polish: responsive grid, README quick start
- [x] 08 Slide 63 checklist passed; tag `lab-solution`

### Stage 2 — `extended` (lecture slide 17: custom hooks, context, routing)

- [ ] 09 `useLocalStorage` custom hook (with try/catch fallback)
- [ ] 10 `MoviesContext` + `MoviesProvider` (movies state, add / toggle / delete / reset)
- [ ] 11 `useMovies` custom hook (consumes context, derived counts)
- [ ] 12 React Router: `NavBar`, `WatchlistPage` (`/`), `StatsPage` (`/stats`)
- [ ] 13 Same behaviour as `lab-solution` checked by hand; tag `extended`

### Stage 3 — `demo` (tests, Stage 2 tasks, KG check, runbook)

- [ ] 14 Vitest + React Testing Library setup, `localStorage.clear()` per test, smoke tests
- [ ] 15 D1 bug_fix task: planted bug, YAML, failing test, reference patch
- [ ] 16 D2 feature_addition task: "Clear watched", YAML, test, reference patch
- [ ] 17 D3 refactoring task: `useMovieFilter`, YAML, test, reference patch
- [ ] 18 Extraction with `codebase-kg` for `demo` and `lab-solution` (**ask before editing `codebase-kg`**)
- [ ] 19 Export both graphs as CYPHERL to `knowledge_graph/` (offline fallback)
- [ ] 20 Retriever run on D1–D3: anchors and context blocks checked
- [ ] 21 `docs/demo-runbook.md`: commands, Memgraph Lab queries, fallbacks, reset step
- [ ] 22 Demo dry run; tag `demo`

---

## Decisions Made During Build

- React + Vite, JavaScript (`.jsx`) only: no TypeScript, no Next.js or other framework.
- Three git tags: `lab-solution` (exactly the lab), `extended` (custom hooks + context +
  routing), `demo` (tests + tasks + planted D1 bug). One commit per lab task up to `lab-solution`.
- `MovieCard` signature matches lecture slide 22:
  `function MovieCard({ title, year, genre, watched, onToggle, onDelete })`, default export.
- No backend or database: React state + `localStorage`, sample movies from
  `src/data/initialMovies.js` when nothing is saved yet.
- Storage key `movie-watchlist:movies`, not `'movies'`, so a student's own lab data on
  `localhost:5173` can't replace the sample list.
- "Reset to sample movies" button to get back to a known state.
- Plain CSS, no Tailwind: one `.css` per component, tokens as CSS variables in
  `index.css`, component-prefixed class names, `badge done` / `badge todo` kept from slide 58.
- No file named `seed.*` (the `codebase-kg` extractor excludes that pattern).
- Linting is Oxlint (`npm run lint`, `.oxlintrc.json`): current create-vite templates ship
  Oxlint instead of ESLint. Not a JS/JSX file, so the extractor never sees it.
- CSS tokens went into `index.css` in the scaffold commit (01), not in polish (07), so every
  component used `var(--…)` from its first commit.
- `MovieList` was introduced in Lab Task 2 (slide 53's list component), not only in Task 4.
  It renders the empty state with an "if before return" (slide 44) and takes an
  `emptyMessage` prop from `App`.
- Validation: empty / whitespace title (slide 62), plus year must be an integer in
  1888..(current year + 5). Without the year check, `Number('')` would add a movie with year 0.
- Two empty messages: "Your watchlist is empty. Add a movie above." when there are no movies,
  "No movies match this filter." when only the filter hides them.
- Reset also sets the filter back to All.
- Sample movies: 8, 3 of them watched (Inception, Mad Max: Fury Road, The Grand Budapest
  Hotel), all 5 genres covered. First-run summary: `Total: 8 · Watched: 3 / 8`.
- Card grid `minmax(260px, 1fr)`: 3 columns at the 960px max width, so the two card buttons
  stay on one row; 1 column on phones.

---

## Notes

- Toolchain at planning time: Node 24.18, npm 11.16, create-vite 9.3, React 19.3,
  React Router 8.5, Vitest 5.1. Scaffold installed Vite 8.3, @vitejs/plugin-react 6.1,
  Oxlint 1.90.
- Stage 1 verification: `npm run lint` and `npm run build` clean on every commit (except the
  expected unused `setMovies` warning at Lab Task 2, matching the slide 59 hint). A headless
  Chrome script (puppeteer-core, kept outside the repo) ran 24 checks covering the slide 63
  checklist: fresh start shows 8 sample movies, a stale `'movies'` key is ignored, empty /
  whitespace / missing-year inputs rejected, add ×3 with trimmed title, toggle on/off updates
  the counter, all three filters, refresh persists, delete-all shows the empty message and
  stays empty after refresh, no-match filter message, Reset, no horizontal scroll at 390px,
  no console errors or key warnings. 24/24 passed. Light, dark and phone screenshots checked.
  A fresh `git clone` → `npm install` → `npm run build` works, and `context/` is not in the clone.
- Item 12: check current React Router docs first (`react-router` vs `react-router-dom`);
  confirm in item 18 that ROUTES_TO edges are extracted for the chosen import.
