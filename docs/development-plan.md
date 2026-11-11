# Movie Watchlist — development plan

A sample React app for the live demo in *Knowledge Graphs for React Code Generation*
(slide 28: Extract → Explore → Retrieve). It is the same app students build in the
45-minute lab of *React Basics* (slides 57–64), plus an extended version that
exercises the parts of the KG schema the lab doesn't reach (slide 17).

Students work hands-on in a second repo, [react-kg-lab](https://github.com/tisserapac/react-kg-lab),
cloned next to this one. It reads this repo's `src/`, `knowledge_graph/`, `tasks/` and
`compose.yaml`; students never clone `codebase-kg` (see Phase 5).

## Constraints

- React + Vite, **JavaScript (`.jsx`)**, no Next.js or other framework.
  Scaffold: `npm create vite@latest -- --template react` (React slide 6).
- Code mirrors the idioms in the React slides, so students recognise it:
  `function` components with destructured props, `export default` at the bottom,
  one `.css` file per component imported at the top (slide 24), `className`
  ternaries for badges (slide 58), immutable array updates (slide 49).
- No UI library, no TypeScript, no PropTypes, no state library (Redux is the
  schema's known gap, slide 26).
- No backend or database: state + `localStorage` (React slide 55 B), with
  bundled sample movies on first run. No Tailwind: plain CSS per component. See
  *Data and styling* below.
- Must extract cleanly with `codebase-kg` as it is today. Checked against
  `src/extraction/programmatic.py` and `cross_file.py`:
  - `.js`/`.jsx` are included; `src/main.jsx` is a recognised root file.
  - `vite.config.js`, `*.test.*`, `__tests__/`, `public/` are excluded
    automatically, so tests and config add no noise. Linting is Oxlint, whose
    `.oxlintrc.json` is not a JS file and is never read.
  - Avoid naming any source file `seed.*` (excluded pattern), so initial data
    lives in `src/data/initialMovies.js`.

Current toolchain: Node 24.18, npm 11.16, create-vite 9.3, React 19.3,
React Router 8.5, Vitest 5.1.

## Deliverables (git tags)

| Tag | What it is | Used for |
| --- | --- | --- |
| `lab-solution` | The lab, done exactly as slides 57–64 ask | "This is the app you built" |
| `extended` | Lab + custom hooks + context + routing | Feature-complete app |
| `demo` | `extended` + Vitest tests + demo tasks D2 and D3 + knowledge graphs + runbook | The repo we extract live |

`demo` is set after the dry run, on `main`, in both this repo and `react-kg-lab`
(a matching pair for the lecture).

History on the way to `lab-solution` is one commit per lab task (Task 1 … Task 6),
so students can step through it with `git log`.

Progress against these stages is tracked in [progress-tracker.md](progress-tracker.md).

## Data and styling

### No database: sample movies + `localStorage`

No backend. The movie list lives in React state and is saved to `localStorage`.
On first run, when nothing is saved yet, it starts from a bundled sample list.
Reasons for no database:

- It matches React slide 55 B and the lab task 5 bonus (slide 62).
- The KG schema is frontend-only, so a server would add no node or edge types,
  and its files would need `exclude_paths`.
- One process and no network make for a safer live demo and simpler tests.

How students see default movies after `git clone` → `npm install` → `npm run dev`:

1. `src/data/initialMovies.js` exports 8 movies covering all 5 genres, with a mix
   of watched and to-watch. It starts with the slide 64 three (Inception,
   Parasite, Coco). The ids are fixed integers 1–8; new movies use
   `Date.now()`, so ids never collide.
2. Lazy initial state, with the sample list as the fallback:
   ```js
   const [movies, setMovies] = useState(
     () => JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? initialMovies
   );
   ```
   A fresh browser has nothing saved, so the sample list loads; changes persist after that.
3. `STORAGE_KEY = 'movie-watchlist:movies'`, not `'movies'`. `localStorage` is
   per origin, so a student's own lab app on `localhost:5173` would otherwise
   replace our sample list with their data.
4. `??` only falls back when nothing is saved (`null`), not when the list is
   `[]`. Deleting everything still shows the lab's empty-state message.
5. A small **"Reset to sample movies"** button calls `setMovies(initialMovies)`,
   to get back to a known state without DevTools.
6. Robustness on `extended` only: `useLocalStorage` wraps `JSON.parse` in
   try/catch and falls back on corrupt data. `lab-solution` keeps the slide's
   plain version.

### Styling: plain CSS, no Tailwind

- One `Component.css` per component, imported at the top and applied with
  `className` (React slides 23–24).
- `src/index.css` holds design tokens as CSS custom properties (colours,
  spacing, radius, font), base styles, and light/dark via `prefers-color-scheme`.
  Component files use only the `var(--…)` tokens.
- Class names are prefixed by component (`movie-card`, `movie-card__title`,
  `add-form`, `filter-bar`), since plain CSS is global. The slide 58 badge classes
  stay `badge done` / `badge todo`.
- The layout is a responsive card grid (`repeat(auto-fill, minmax(220px, 1fr))`),
  readable on a projector and on a phone.
- KG impact: `.css` files are not extracted, so styling adds no graph noise.
  Tailwind's long `className` strings would sit inside the JSX the LLM reads and
  the retriever pastes into prompts.

---

## Phase 0 — Scaffold

1. Scaffold into a temp dir with the `react` template, then copy into this repo
   (it already has `LICENSE`, `README.md`, `.gitignore`).
2. Replace the current Next.js-flavoured `.gitignore` with Vite's, keeping `context/`.
3. Clean slate per React slide 13: empty `App.jsx`, `App.css`, `index.css`;
   delete the Vite logo assets.
4. `npm run dev` serves on :5173; `npm run lint` is clean.

## Phase 1 — `lab-solution` (React slides 57–64)

State lives in `App`, lifted up as on slide 53.

```
src/
├── main.jsx                 # slide 11 verbatim: createRoot(...).render(<StrictMode><App/></StrictMode>)
├── index.css                # design tokens (CSS variables), base styles, light/dark
├── App.jsx / App.css        # movies + filter state, handlers, derived visibleMovies, localStorage, reset
├── data/initialMovies.js    # 8 sample movies, starting with slide 64's three
└── components/
    ├── MovieCard.jsx/.css   # title, year, genre, watched, onToggle, onDelete
    ├── AddMovieForm.jsx/.css# controlled title/year/genre, trim() validation, onAdd
    ├── FilterBar.jsx/.css   # All · To watch · Watched; filter, onFilterChange
    └── MovieList.jsx/.css   # movies, emptyMessage, onToggle, onDelete; map + key; card grid
```

- `MovieCard` signature must match lecture slide 22 exactly:
  `function MovieCard({ title, year, genre, watched, onToggle, onDelete })`,
  default export. `MovieList` binds the id:
  `onToggle={() => onToggle(movie.id)}`.
- `App`: `useState` with lazy init from `localStorage`, falling back to
  `initialMovies`, and `useEffect` save (slide 55 B) under
  `movie-watchlist:movies`. Handlers `handleAdd`, `handleToggle`, `handleDelete`
  and `handleReset`; summary line `Total: 8 · Watched: 3 / 8`; `visibleMovies`
  calculated, not stored (slide 62).
- Genres: Action, Comedy, Drama, Sci-Fi, Horror (slide 60).
- Acceptance: the slide 63 checklist by hand: empty or whitespace-only title is
  rejected, toggling updates the counter, deleting everything shows the empty
  message, every filter works, no console key warnings, and the list survives a
  refresh. Plus: a fresh clone in a private window shows the 8 sample movies, a
  stale `'movies'` key on :5173 doesn't override them, and Reset restores them.
- `README.md`: quick start (`npm install`, `npm run dev`, open :5173) and a note
  about the sample movies and Reset.

KG coverage: Project, File, Library, Function_Component, Prop, EventHandler,
Library_Hook, State_Variable · RENDERS_ROOT_COMPONENT, USES_COMPONENT,
ACCEPTS_PROP, PASSES_PROP, HAS_HANDLER, DECLARES_STATE, USES_LIBRARY_HOOK. That
matches the lecture's cover graph (App → movies, useState, MovieCard → title, onDelete).

## Phase 2 — `extended` (lecture slide 17: custom hooks, context, routing)

Same UI, restructured the way real projects are (like the shopping-cart example).

```
src/
├── App.jsx                       # <BrowserRouter><MoviesProvider> header + <NavBar/> + <Routes>
├── context/
│   ├── MoviesContext.js          # createContext(null), its own file (Oxlint fast-refresh rule)
│   └── MoviesProvider.jsx        # movies via useLocalStorage; add / toggle / delete / reset; <MoviesContext.Provider>
├── hooks/
│   ├── useLocalStorage.js        # [value, setValue] persisted; try/catch fallback
│   └── useMovies.js              # useContext(MoviesContext) + derived watchedCount; throws outside provider
├── pages/
│   ├── WatchlistPage.jsx/.css    # AddMovieForm, FilterBar, MovieList, Reset; filter state is local here
│   ├── StatsPage.jsx/.css        # StatCard ×4, progress bar, per-genre table
│   └── NotFoundPage.jsx/.css     # any other URL, Link back home
├── components/
│   ├── NavBar.jsx/.css           # NavLink to / (end) and /stats
│   ├── StatCard.jsx/.css         # { value, label }
│   └── (MovieCard, FilterBar, MovieList unchanged; AddMovieForm imports GENRES)
└── data/
    ├── initialMovies.js
    └── genres.js                 # GENRES, shared by AddMovieForm and StatsPage
```

- Routes: `/` → `WatchlistPage`, `/stats` → `StatsPage`, `*` → `NotFoundPage`.
- Router: `react-router` 8. v8 removed `react-router-dom`, so `BrowserRouter`,
  `Routes`, `Route`, `NavLink` and `Link` are imported from `react-router`
  (checked against the React Router docs). The pipeline's CATEGORY_MAP already
  lists `react-router`, and the route prompt matches the `<Route path element>`
  JSX whatever the import. Confirm in Phase 4 that ROUTES_TO edges are produced.
  v8 needs Node ≥ 22.22.
- Hook chain `MoviesProvider → useLocalStorage → useState/useEffect`, and
  `useMovies → useContext`. That is the same shape as `useCart → useCartProducts`
  on lecture slides 13/17.
- The lecture's slide 24 query now runs on the students' own app:
  `MATCH (h)-[:CONSUMES_CONTEXT]->(c:Context) RETURN h.name, c.name` → `useMovies | MoviesContext`.
- The context is provided with `<MoviesContext.Provider value>`, as on lecture
  slide 17, not React 19's shorter `<MoviesContext value>`.

KG coverage adds Custom_Hook, Context · USES_CUSTOM_HOOK, PROVIDED_BY,
PROVIDES_CONTEXT, CONSUMES_CONTEXT, ROUTES_TO, DEPENDS_ON(react-router).
That is 10 of 11 node types; Class_Component is deliberately absent.

## Phase 3 — `demo`: tests and Stage 2 tasks

**Test setup:** Vitest 5 + jsdom + React Testing Library + user-event +
jest-dom. Config goes in `vite.config.js`, tests in `src/__tests__/`, so the
extractor ignores both. `test.include` is `src/**/*.test.{js,jsx}`, so the task
tests in `tasks/tests/` (which fail until patched) never run with `npm test`.
`src/__tests__/setup.js` runs `localStorage.clear()` and returns to `/` before
each test, so every test starts from `initialMovies`. `helpers.jsx` provides
`renderApp`, `addMovie` and similar helpers, shared with the task tests. 26
tests cover add, validation, toggle, delete (including two movies with the same
title), filters, persistence, reset, the Stats page, routing and the two hooks.

**Demo tasks:** in `tasks/`, in the same YAML shape as
`codebase-kg/tasks/pilot/P*.yaml`, with `project_id: movie-watchlist`, `spec`,
`expected_anchors`, `reference_patch`, `test_files` and `files_modified`. Two
tasks, for the feature_addition and refactoring Cypher templates:

| ID | Type | Spec (short) | Expected anchors | Files the fix touches |
| --- | --- | --- | --- | --- |
| D2 | feature_addition | Add a "Clear watched" button on the Watchlist page that removes all watched movies | `WatchlistPage`, `useMovies` | `context/MoviesProvider.jsx`, `pages/WatchlistPage.jsx` |
| D3 | refactoring | Move the filter logic out of `WatchlistPage` into a `useMovieFilter` custom hook | `WatchlistPage` | new `hooks/useMovieFilter.js`, `WatchlistPage.jsx` |

- Each task has a test written before its reference patch. The test fails at the
  base commit and passes with the patch. Patches go in `tasks/patches/`, tests in
  `tasks/tests/`, and are copied in at demo time as the harness does.
- Base commit (`git_commit` in both YAMLs): `extended` + test setup + footer as a
  flex row (so D2's button needs no CSS) + the D1 removal commit. `src/` has no
  planted bug.
- D2 and D3 each apply cleanly on the base commit. They are independent tasks,
  not meant to be applied together.
- **D1 dropped (2026-11-09).** A third task, D1 (bug_fix: deleting a movie also
  deleted other movies with the same title, planted by filtering on `title`
  instead of `id`), was removed so the 1-hour hands-on session, which also has
  to cover cloning and setup, fits D2 and D3. The bug is fixed in `src/` and its
  test became the regular test `src/__tests__/deleteMovie.test.jsx`. The
  bug_fix Cypher template is therefore not exercised in the demo.
- `tasks/verify.sh` checks all of this in a throwaway git worktree.
  `tasks/README.md` explains the folder.

**Cross-platform setup (2026-11-11):** students use Windows, macOS and Linux. The
app is not Dockerized: it runs natively with Node.js ≥ 22.22 (`engines` with
`engine-strict`, `.nvmrc`), `.gitattributes` keeps LF everywhere, the README has a
"check your setup" table to send before the session, and `.devcontainer/` gives a
GitHub Codespaces fallback. Docker is used only for Memgraph + Lab (see Phase 5).

## Phase 4 — Check it against `codebase-kg`

This phase touches your research repo, so I'll ask before doing it.

1. Symlink this working copy to
   `~/Study/Implementation/sample-projects/small/movie-watchlist`. Register
   `[projects.movie-watchlist]` in `pipeline.toml` (`exclude_paths = ["tasks", "context"]`);
   no aliases or base_url are needed. Extract into the lecture's own Memgraph from
   `compose.yaml` (`PIPELINE_DB__URI=bolt://localhost:7688`), never the research instance.
2. Start the lecture Memgraph (`docker compose up -d` here, on ports 7688 / 3001 while
   the research one runs), then `PIPELINE_DB__URI=bolt://localhost:7688 uv run pipeline
   extract --project movie-watchlist` and `pipeline status`. Not `make up`: that is the
   research instance. Compare node and edge counts with the inventory expected from
   Phases 1–2. Fix the app, not the pipeline, where the app is unidiomatic.
3. Extract `lab-solution` as well, so the demo can show the small graph against the larger one.
4. Export both graphs as CYPHERL into `knowledge_graph/` in this repo. That is
   the offline fallback: an import with no LLM calls (lecture slide 23).
5. Run the retriever on D2 and D3. Check the classifier's anchors and that each
   context block contains the files to edit. Keep the two context blocks in
   `tasks/contexts/` as samples for students. (A generation run per task was
   considered and is not needed: evaluation is left to the students.)

## Phase 5 — Student lab, runbook and dry run

Students do not clone `codebase-kg`, whose research is still ongoing (advisor's advice).
They get the idea and propose their own next steps:

- **`react-kg-lab`** (separate repo, fresh Python code, no research code or prompts):
  1. few-shot extraction of function components to JSON, with a simplified prompt of its
     own (official `anthropic` / `openai` SDKs);
  2. importing `knowledge_graph/movie-watchlist` or `lab-solution` into Memgraph, one at a time;
  3. prepared Cypher queries to explore the graph;
  4. for D2 and D3: what information each task needs, the queries that find it, and a
     context block built from them.
  Saving the JSON into the schema, choosing anchors and evaluation are open questions
  in its `docs/ideas.md`. Its `WORKSHEET.md` repeats the demo step by step for students
  who could not keep up.
- **`compose.yaml`** here starts Memgraph + Lab for students, with the plain
  `memgraph/memgraph` image (220 MB; MAGE is not used) and `knowledge_graph/` mounted.
- **Setup guide** for students, sent by the advisor before the lecture:
  `context/student-setup-guide.md` (git-ignored, not published).

`docs/demo-runbook.md`, for the presenter, covers:

- Checklists for a week before, the day before (rehearsal; stop the research Memgraph
  so the lecture one uses the default ports) and fifteen minutes before.
- A 60-minute timeline following slide 28, with the exact commands for Extract, Explore
  and Retrieve, their expected output and timings.
- The Memgraph Lab queries in running order: the cover graph, slide 24's
  `CONSUMES_CONTEXT` query, the component tree, routes, the hook/context chain, prop flow
  into MovieCard, "who depends on MoviesContext", and component interfaces.
- Fallbacks: the graphs load from CYPHERL with no LLM calls, and the outputs of a
  rehearsal are saved in `~/lecture-backup/output`, in case of no network.
- Reset step: click "Reset to sample movies" in the app, so it shows the 8 sample movies.
- A troubleshooting table and the setup message for students.

The dry run follows the runbook on the lecture laptop, from fresh clones of both repos;
then `demo` is tagged in both.

## Order of work and checkpoints

1. Phase 0–1 → you review the `lab-solution` app in the browser.
2. Phase 2 → you review `extended`.
3. Phase 3 → tests are green; each D-task fails before its patch and passes after.
4. Phase 4 (with your OK to edit `codebase-kg`) → extraction numbers reviewed.
5. Phase 5 → dry run of the demo.
