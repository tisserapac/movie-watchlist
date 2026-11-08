# Progress Tracker

Update this file after every completed item. Anyone (or any AI agent) reading this
should immediately know what is done, what is in progress, and what is next.
The full plan is in [development-plan.md](development-plan.md); the stages below
follow its *Deliverables (git tags)*.

---

## Current Status

**Stage:** Stage 1 — `lab-solution`
**Last completed:** Planning (development plan approved)
**Next:** 01 Scaffold

---

## Progress

### Stage 1 — `lab-solution` (React slides 57–64)

- [ ] 01 Scaffold: Vite `react` template, Vite `.gitignore` (keep `context/`), clean slate (slide 13)
- [ ] 02 Lab Task 1: `MovieCard` component + `MovieCard.css`
- [ ] 03 Lab Task 2: display movies from state, `initialMovies.js` (8 sample movies)
- [ ] 04 Lab Task 3: `AddMovieForm` with controlled title / year / genre
- [ ] 05 Lab Task 4: toggle watched and delete (child-to-parent), watched counter
- [ ] 06 Lab Task 5: validation, empty state, `FilterBar`, `localStorage` + Reset to sample movies
- [ ] 07 Lab Task 6: polish: CSS tokens in `index.css`, responsive grid, README quick start
- [ ] 08 Slide 63 checklist passed; tag `lab-solution`

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

---

## Notes

- Toolchain at planning time: Node 24.18, npm 11.16, create-vite 9.3, React 19.3,
  React Router 8.5, Vitest 5.1.
- Item 12: check current React Router docs first (`react-router` vs `react-router-dom`);
  confirm in item 18 that ROUTES_TO edges are extracted for the chosen import.
