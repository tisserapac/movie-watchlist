# Progress Tracker

Update this file after every completed item. Anyone (or any AI agent) reading this
should immediately know what is done, what is in progress, and what is next.
The full plan is in [development-plan.md](development-plan.md); the stages below
follow its *Deliverables (git tags)*.

---

## Current Status

**Stage:** Stage 3 — `demo`
**Last completed:** 22 Demo dry run; tag `demo` in both repos (all items complete)
**Next:** the lecture, following `docs/demo-runbook.md` (stop the research Memgraph the day before, restart it after)

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

- [x] 09 `useLocalStorage` custom hook (with try/catch fallback)
- [x] 10 `MoviesContext` + `MoviesProvider` (movies state, add / toggle / delete / reset); `WatchlistPage` split out of `App`
- [x] 11 `useMovies` custom hook (consumes context, derived counts)
- [x] 12 React Router: `NavBar`, `WatchlistPage` (`/`), `StatsPage` (`/stats`), `NotFoundPage` (`*`)
- [x] 13 Same behaviour as `lab-solution` checked; tag `extended`

### Stage 3 — `demo` (tests, Stage 2 tasks, KG check, runbook)

- [x] 14 Vitest + React Testing Library setup, `localStorage.clear()` per test, smoke tests
- [x] 15 ~~D1 bug_fix task: planted bug, YAML, failing test, reference patch~~ (dropped in 17b)
- [x] 16 D2 feature_addition task: "Clear watched", YAML, test, reference patch
- [x] 17 D3 refactoring task: `useMovieFilter`, YAML, test, reference patch
- [x] 17b Drop D1 to fit the 1-hour session: bug fixed in `src/`, D1 test kept as `src/__tests__/deleteMovie.test.jsx`, D2/D3 rebased
- [x] 17c Cross-platform setup: `engines` + `.npmrc` engine-strict, `.nvmrc`, `.gitattributes` (LF), README setup check, `.devcontainer/` for Codespaces
- [x] 18 Extraction with `codebase-kg` for `develop` (`movie-watchlist`) and `lab-solution`
- [x] 19 Export both graphs as CYPHERL to `knowledge_graph/` (offline fallback), plus `compose.yaml`
- [x] 20 Retriever run on D2 and D3: anchors and context blocks checked
- [x] 21 `docs/demo-runbook.md`: commands, Memgraph Lab queries, fallbacks, reset step
- [x] 22 Demo dry run; tag `demo` on `main` in both repos (`d837f85` here, `4363313` in react-kg-lab)

---

## Decisions Made During Build

- React + Vite, JavaScript (`.jsx`) only: no TypeScript, no Next.js or other framework.
- Three git tags: `lab-solution` (exactly the lab), `extended` (custom hooks + context +
  routing), `demo` (tests + demo tasks D2 and D3). One commit per lab task up to `lab-solution`.
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
- `.gitignore` ignores the lecture materials with `/context/` (root only), never a bare
  `context/`, which would also hide `src/context/`.
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
- Stage 2 is four working commits (items 09–12), each with lint, build and the browser
  checks green, so `git log` shows the refactor one idea at a time.
- `createContext` lives in `context/MoviesContext.js`, separate from
  `context/MoviesProvider.jsx`: Oxlint's `react/only-export-components` warns when a `.jsx`
  file exports a component and a non-component. It also gives the graph one clean Context
  node. The plan's D2 file paths now point to `MoviesProvider.jsx`.
- `<MoviesContext.Provider value>`, as on lecture slide 17, rather than React 19's
  `<MoviesContext value>`; the extraction prompts and the slide both use `.Provider`.
- React Router 8 (`react-router`). v8 removed the `react-router-dom` package, so the planned
  fallback to `react-router-dom` would mean pinning v7. Decide only if item 18 shows no
  ROUTES_TO edges. v8 needs Node ≥ 22.22 (README updated).
- `filter` state stays local to `WatchlistPage`. The Reset button moved there from the
  `App` footer so it can still reset the filter to All.
- `useMovies` returns the context plus `watchedCount`; `WatchlistPage` and `StatsPage` both use it.
- Added beyond the plan: `NotFoundPage` (`*` route, with a Link home), `StatCard`
  (`{ value, label }`, used 4× on the Stats page), and `data/genres.js` (GENRES shared by
  `AddMovieForm` and `StatsPage`, instead of a second copy).
- Tests: Vitest 5 config lives in `vite.config.js`, with `include: ['src/**/*.test.{js,jsx}']`
  so `tasks/tests/` (failing on purpose) is never part of `npm test`. Setup and helpers are
  in `src/__tests__/` (`setup.js`, `helpers.jsx`), which the extractor ignores. Names
  avoid `*.setup.*` and `setupTests.*` anyway. RTL `cleanup` is called in the setup file
  because globals are off.
- Task files follow the codebase-kg pilot format: `tasks/D*.yaml`, `tasks/tests/`,
  `tasks/patches/`. `test_files` is the destination under `src/__tests__/`, so a copied-in
  test can import `./helpers`.
- Task tests check behaviour (the UI, plus the hook API where the spec names it), so any
  correct solution passes. D3's spec fixes the hook's name, path and return shape because
  the test imports it.
- The footer is a flex row with gap (commit `afec4a5`), so D2's reference patch needs no CSS.
- D2 and D3 are independent: each applies on the base, but not on top of each other
  (both edit the top of WatchlistPage).
- Added beyond the plan: `tasks/verify.sh` (re-checks every task in a throwaway
  worktree) and `tasks/README.md`.
- D1 dropped (2026-11-09, item 17b): an hour of hands-on time also has to cover students
  cloning and setting up the repos, so the demo keeps only D2 (feature_addition) and D3
  (refactoring). `deleteMovie` filters by `id` again, as on `extended`. The D1 task test
  is now the regular test `src/__tests__/deleteMovie.test.jsx` (2 tests, same-title
  delete). D1's YAML and patch were removed, `verify.sh` no longer stacks D2/D3 on D1,
  and both YAMLs point `git_commit` at the D1 removal commit `bfb727d`. The bug_fix Cypher
  template is no longer exercised in the demo.
- Students use Windows, macOS and Linux (2026-11-11, item 17c). The app is **not**
  Dockerized: Node, Vite, Vitest and Oxlint already run on all three, the lockfile has the
  native bindings for every platform, and Docker Desktop (WSL2 on Windows), bind-mount file
  watching and per-OS `node_modules` would cost more setup time than they save. Instead:
  `engines` `>=22.22` with `engine-strict` (old Node fails with `EBADENGINE`), `.nvmrc` (24),
  `.gitattributes` `eol=lf`, a "check your setup" table in the README to send before the
  session, and `.devcontainer/devcontainer.json` as the fallback (GitHub Codespaces in the
  browser, or VS Code Dev Containers with Docker).
- Docker is still the right tool for Memgraph + Lab (they only ship as images). If students
  explore the graph on their own laptops, add a small Compose file here that starts both and
  loads the CYPHERL export from item 19, so no Python, `codebase-kg` or LLM calls are needed.
- The lecture graph lives in its **own Memgraph** (`compose.yaml`, project name
  `movie-watchlist-kg`), not in `codebase-kg`'s instance, which holds research data
  (takenote) and would be mixed with or changed by a second project (Stage 4 sets
  `isRoot = false` on every other project's components). On this machine it runs on
  Bolt 7688 / Lab 3001 (`MEMGRAPH_PORT=7688 MEMGRAPH_LOG_PORT=7445 LAB_PORT=3001`);
  students get the defaults 7687 / 3000. The same file is the students' way to explore
  the graph: it mounts `knowledge_graph/` read-only at `/knowledge_graph`.
- `codebase-kg` changes (item 18): only a `[projects.movie-watchlist]` entry in
  `pipeline.toml`, plus a symlink `sample-projects/small/movie-watchlist` → this repo and
  a clone `sample-projects/small/movie-watchlist-lab-solution` at the `lab-solution` tag
  (extracted with `--repo`, no TOML entry). Run output lands in
  `codebase-kg/graph_export/movie-watchlist/`, as for the other projects (not committed).
- `projectId` is a hash of the repo's absolute path (`3664369658ac` here), so it differs on
  every machine. Queries and the runbook select the project by name: `{name:'movie-watchlist'}`.
  Both graphs have that name (from `package.json`), so load one at a time.
- `lab-solution` was extracted with `PIPELINE_LLM__CALL_DELAY=2` (env only; `pipeline.toml`
  keeps 20 s). No rate-limit errors.
- Students do not clone `codebase-kg` (2026-11-12, advisor's advice: the research is ongoing).
  Instead a separate repo, `react-kg-lab` (`~/Lecture/react-kg-lab`, cloned next to this one),
  holds only fresh Python code for four steps: (1) few-shot extraction of function components
  to JSON (own simplified prompt, official `anthropic` / `openai` SDKs, default
  `claude-opus-5-5`); (2) importing `knowledge_graph/*` into Memgraph one graph at a time;
  (3) 13 exploration queries; (4) D2/D3: what information each task needs, its Cypher
  queries, and a context block built from them. Saving the JSON into the schema, anchor
  classification and evaluation are left to the students (`react-kg-lab/docs/ideas.md`).
  `react-kg-lab` reads this repo's `src/`, `knowledge_graph/` and `tasks/`, and uses this
  repo's `compose.yaml` for Memgraph, so those must be on `main` before the lecture.
- `compose.yaml` uses the plain `memgraph/memgraph:3.8.1` image, not `memgraph-mage`
  (2026-11-12): a 220 MB download instead of 2.3 GB per student, and nothing in the lab uses
  MAGE's algorithms. Both images exist for amd64 and arm64 (Apple Silicon). The README's
  `mgconsole` load command now empties Memgraph first, so loading twice no longer fails on
  the Project uniqueness constraint.
- Runbook (item 21) is for the presenter: before / day before / 15 minutes before checklists,
  a 60-minute timeline following slide 28 (Extract → Explore → Retrieve), the Lab queries in
  order (starting with slide 24's CONSUMES_CONTEXT query, promised there), fallbacks, a
  troubleshooting table and the setup message for students. Open decision recorded in it:
  how students get an LLM API key for step 1. On the lecture laptop the research Memgraph is
  stopped (`docker compose down`, never `-v`) so the lecture one uses the default ports.
- After the dry run (2026-11-12): the plan was brought in line with the later decisions
  (react-kg-lab, worksheet, setup guide, plain Memgraph image, separate lecture Memgraph
  instead of `make up`, Oxlint), and the runbook gained the app reset step, the cover graph
  and the routes query. The optional generation run per task (Phase 4, step 5) is not
  needed: evaluation is left to the students.
- Stats cards: Movies · Watched · To watch · Progress (%). The percentage card is labelled
  "Progress" so there aren't two "Watched" labels.

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
- Stage 2 verification: lint and build clean on items 09–12. The headless Chrome script was
  rebuilt (the scratchpad was cleared between sessions) and extended to 36 checks: the 24 core
  checks, plus corrupt saved data falling back to the sample movies, NavBar active state on
  both routes, client-side navigation to `/stats`, stat cards and the genre table reflecting
  shared state after a toggle, browser Back, deep link to `/stats`, unknown URL showing
  NotFoundPage and its link home, the stats page with 0 movies, and no horizontal scroll at
  390px on both routes. 36/36 passed on the dev server and on the production build
  (`vite preview`). Light, dark and phone screenshots checked.
- Caught by the fresh-clone check: the `.gitignore` rule `context/` (for the lecture
  materials) also matched `src/context/`, so `MoviesContext.js` and `MoviesProvider.jsx` were
  never committed. The app built locally but not from a clone. Fixed by anchoring the rule
  to `/context/`. The unpushed item 10 commit was amended to include both files and the
  fix, so every commit builds. Each Stage 2 commit was then linted and built from a clean
  clone, and the clone's production build passed 36/36. Lesson: always run the fresh-clone
  check before tagging.
- Phase 3 verification: `npm test` is 24/24 (and a mutation check, breaking `deleteMovie`,
  makes exactly the 4 delete-related tests fail). `bash tasks/verify.sh` gives 20/20: for D1,
  D2 and D3, and D2 and D3 on top of D1, the test fails before, the patch applies, and the
  task test and whole suite pass after. Each task test was also seen failing for the
  intended reason. Fresh clone: lint 0, build OK, 24/24, verify.sh all pass. The 36 browser
  checks still pass on the dev server.
- 17b verification: lint 0, `npm test` 26/26. D2's patch was regenerated (its hunk moved up
  one line); D3's is unchanged. In a scratch clone with the base committed, `verify.sh`
  gave 8/8 for D2 and D3, and again in this repo after the commits.
- `develop` no longer carries a planted bug (17b), so it is safe to merge into `main`.
- 17c verification: on a simulated Windows checkout (`core.autocrlf=true`, `core.eol=crlf`)
  `.gitattributes` gives LF files and both patches apply. (Without it the files are CRLF, but
  Git 2.43's `git apply` still converts, so patches were never the real risk.) With Node 20,
  `npm install` stops with `EBADENGINE`. In the dev-container image (Node 24.22): install,
  26/26 tests, lint 0, build OK, and the dev server serves the app.
- Item 22 dry run (2026-11-12, this laptop, following the runbook): research Memgraph stopped
  (takenote 398 nodes / 635 relationships before, identical after restart); student setup guide
  from fresh GitHub clones (`movie-watchlist` main `d837f85`, `react-kg-lab` main `4363313`):
  26/26 tests, `docker compose pull` + `up` on the default ports with the plain Memgraph image,
  Lab at :3000, `uv sync`. Session: `--show-prompt` 0.2 s; step 1, 17 files, 9.3 s (few-shot) and
  10.7 s (zero-shot), 11 components both; imports 0.4–0.7 s (51/71 and 81/118); slide 24's query
  returns useMovies → MoviesContext; explore queries 3 9 5 12 6 without errors; D2/D3 blocks
  0.4 s each (~1,380 / ~1,080 tokens). Optional segments: close-the-loop (test fails, patch,
  3/3 pass, undo leaves the tree clean) and the cached research extraction on :7687, 4.3 s,
  0 API calls, 192 cache hits. Fallback outputs saved in `~/lecture-backup/output`. Afterwards
  the research Memgraph was restarted (its `docker compose up` also starts its Lab on :3000)
  and the lecture one returned to :7688 / :3001.
- Item 18 results, `movie-watchlist` (develop at `c35828c`): 17 files, 192 LLM calls, 69.5 min
  (the 20 s `call_delay`), 0 failed. 81 nodes / 118 relationships: File 17, Prop 15, Library 14,
  Function_Component 11, EventHandler 10, State_Variable 7, Library_Hook 3, Custom_Hook 2,
  Context 1; ROUTES_TO 3 (`/`, `/stats`, `*`, so React Router 8 works and no fallback is needed),
  USES_COMPONENT 10, USES_CUSTOM_HOOK 3, PROVIDES_CONTEXT 1 (valueExpression lists the five
  actions), CONSUMES_CONTEXT 1 (useMovies), RENDERS_ROOT_COMPONENT 1. Matches the inventory
  from the source except two reasonable extras: `movies` (from `useLocalStorage`) counted as
  state of MoviesProvider, and the three route pages also as USES_COMPONENT children of App
  (`usage: prop_value`), so D3's refactoring query finds App as WatchlistPage's caller.
  The D2 chain WatchlistPage → useMovies → MoviesContext ← MoviesProvider is present.
- Item 18 results, `lab-solution` (7 files): 24 LLM calls, 97 s, 0 failed. 5 components,
  6 state variables (App: movies, filter; AddMovieForm: 4), no hooks, context or routes.
- Cached re-extraction (unchanged files, `--reset`): 192 cache hits, 0 API calls, **3.8 s**,
  same 81 / 118. That is the live "Extract" step for the lecture, if the cache is warm.
- Item 20: `codebase-kg`'s `KGAugmentedRetriever` (`claude_primary` + `kg_augmented`,
  claude-sonnet-4-6, strict anchors), called directly from a scratch script against the lecture
  Memgraph on :7688 with `movie-watchlist` loaded; no wipe or import. The pilot orchestrator was
  not used: `ensure_project_kg_loaded` wipes whichever DB it is pointed at.
  - D2: classified feature_addition, anchors MoviesProvider, useMovies, WatchlistPage (all three
    expected; no route). Context: full source of MoviesProvider, WatchlistPage, useLocalStorage,
    useMovies; AddMovieForm, FilterBar, MovieList as related; the routing table. Both files to
    edit are included. 1.9 s, ~5.1k chars (~1.3k tokens; the retriever's word-based estimate
    says 738).
  - D3: classified refactoring, anchors WatchlistPage plus `useMovieFilter`, the hook the task
    asks for, which does not exist yet and so matches nothing (harmless in strict mode).
    Context: full source of WatchlistPage and useMovies, related components, "1 caller: App",
    and the handleReset handler. The file to edit is included. 1.5 s, ~3.0k chars.
  - `codebase-kg` finding (not fixed; reported): Memgraph's `collect(DISTINCT map)` does not
    deduplicate maps that contain a null, so with `isRequired` null (JavaScript projects) a
    neighbour's props repeat once per state variable ("Props: onAdd, onAdd, onAdd, onAdd").
    The TypeScript pilot graphs also have some null `isRequired` props (react-shopping-cart 5 of 16),
    but no logged pilot prompt shows a duplicate. Written up for later in
    `codebase-kg/docs/phase_2/known-issue-duplicate-props-null-isrequired.md` (uncommitted there).
  - The two rendered contexts are kept, unedited, in `tasks/contexts/` as samples for students,
    with an explanation in `tasks/README.md`.
- Item 19: `pipeline export` writes `full_dump.cypherl` + `manifest.json`. Loading
  `knowledge_graph/movie-watchlist/full_dump.cypherl` into an empty Memgraph takes 0.14 s and
  gives the same 81 / 118, with the helper `__mg_vertex__` labels removed. File paths in the
  graph are repo-relative. `Project.file_path` was replaced with `.` in both exports (it held
  this laptop's absolute path; nothing reads it back, and `projectId` is unchanged).
