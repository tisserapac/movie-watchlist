# Demo runbook: Part 2, live demo and hands-on

For the presenter. Part 2 of *Knowledge Graphs for React Code Generation*
(slide 28: **Extract → Explore → Retrieve**), about 60 minutes. Students follow along
in [react-kg-lab](https://github.com/tisserapac/react-kg-lab) on their own laptops.

All timings below were measured on the presenter laptop (Ubuntu, 2026-11-12).

---

## 1. One week before

- [ ] **Decide how students get an LLM key** for Extract (step 1 of react-kg-lab). Each
      student needs `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`. Options: students bring their
      own; a course key with a spending limit, shared for the session and revoked after;
      or step 1 runs only on the projector and students start at step 2 (steps 2–4 need
      no key). One full run of step 1 is 17 small calls.
- [ ] **Send the setup message** (section 7) so students install everything at home.
      The big downloads (Docker images, about 300 MB; Node and Python packages) must
      not happen on the classroom network.
- [ ] Check both repos on GitHub `main` are what you expect:
      `movie-watchlist` has `knowledge_graph/`, `tasks/contexts/` and `compose.yaml`;
      `react-kg-lab` has the four scripts.

## 2. The day before: rehearse on the lecture laptop

Your research Memgraph (`codebase-kg`) uses ports 7687 and 3000, the same as the
students' setup. Stop it for the lecture, so every command on screen is exactly what
students type. Its data stays in the Docker volume; **never add `-v`**.

```bash
cd ~/Study/Implementation/codebase-kg && docker compose down        # research DB stops, data kept
cd ~/Lecture/movie-watchlist && docker compose down && docker compose up -d   # lecture DB on 7687 / Lab on 3000
cd ~/Lecture/react-kg-lab && git pull && uv sync
```

Then run the whole demo once (sections 4–5) and keep a copy of the outputs as the
offline fallback:

```bash
cd ~/Lecture/react-kg-lab
uv run python 01_extract_components.py            # ~10 s, needs network + key
uv run python 04_task_context.py D2 && uv run python 04_task_context.py D3
mkdir -p ~/lecture-backup && cp -r output ~/lecture-backup/
```

After the lecture, restore the research setup:

```bash
cd ~/Lecture/movie-watchlist && docker compose down
cd ~/Study/Implementation/codebase-kg && docker compose up -d
```

## 3. Fifteen minutes before

- [ ] `docker compose ps` in `movie-watchlist`: memgraph *healthy*, lab *up*.
- [ ] Load the full graph: `uv run python 02_import_graph.py movie-watchlist --yes`
      (expect `Graph loaded: 81 nodes, 118 relationships.`).
- [ ] Browser tabs: Memgraph Lab http://localhost:3000 (Connect), this runbook, the
      slides. Optional: the app (`npm run dev` in `movie-watchlist`, http://localhost:5173).
- [ ] If the app tab is open: click **Reset to sample movies** at the bottom of the
      watchlist, so it shows the 8 sample movies (`Total: 8 · Watched: 3 / 8`). Do the
      same after any rehearsal that added, toggled or deleted movies.
- [ ] In `movie-watchlist`: `git status` is clean (no leftover task test or patch).
- [ ] Terminal: large font, `cd ~/Lecture/react-kg-lab`, wide window (paths are long).
- [ ] Wi-Fi works: `uv run python 01_extract_components.py --file src/components/MovieCard.jsx` (~5 s).

## 4. The session (about 60 minutes)

| Time | Part | You show | Students do |
| --- | --- | --- | --- |
| 0–5 | Start | Slide 28; who has the setup check passing? | Pair up anyone without a working setup |
| 5–20 | **1 Extract** | Prompt, run, JSON | Run step 1 (if they have a key) |
| 20–40 | **2 Explore** | Import both graphs; queries in Lab | Steps 2–3, then their own query |
| 40–55 | **3 Retrieve** | D2 end to end | D3 on their own |
| 55–60 | Wrap-up | `docs/ideas.md` | Pick a question for their proposal |

### 4.1 Extract (5–20 min)

```bash
uv run python 01_extract_components.py --show-prompt --file src/components/MovieCard.jsx
```

Talking points, scrolling through the printed prompt:

- It is a conversation: instructions, then three worked examples (example file as the
  *user* turn, expected JSON as the *assistant* turn), then the real file. Open
  `prompts/function_components/examples/` to show the examples are just files.
- Example 2 has three components in one file; example 3 has none (a custom hook).
  Examples teach the edge cases the instructions only describe.
- Slide 22 showed the research pipeline's fields (`usesHooks`, `isRoot`, ...). This
  simpler prompt asks for `props` and `hooks` instead: the schema is a design choice.

```bash
uv run python 01_extract_components.py
```

~10 s for 17 files. Expect **11 components**, 0 errors. Point at:

- `MoviesProvider` → props `children`, hooks `useLocalStorage` (`../hooks/useLocalStorage`).
- `WatchlistPage` → hooks `useMovies`, `useState`, no props.
- Files with no components (`main.jsx`, `data/*.js`, the hooks, `MoviesContext.js`)
  return `{"components": []}`.

Then ask: *"What changes without the examples?"* Run `--zero-shot`: **the result is
identical** (also with Claude Haiku 5.5). Do not hide this. It is the first open
question in `docs/ideas.md`: on clean code with a clear schema a strong model does not
need examples; find the inputs where it does.

> **Fallback (no network or no key):** `ls ~/lecture-backup/output/components/` and
> `cat ~/lecture-backup/output/components.json`. `--show-prompt` needs no network.

> **Optional, research pipeline (on screen only, students do not have it):** with the
> cache warm and `src/` unchanged since extraction (commit `c35828c`), this re-extracts
> the full graph in **~4 s** with 0 API calls:
> `cd ~/Study/Implementation/codebase-kg && PIPELINE_DB__URI=bolt://localhost:7687 uv run pipeline extract --project movie-watchlist --reset`
> Without the cache it makes 192 LLM calls and takes about **70 minutes**: never start
> it live. It writes into the lecture DB (the same graph, so harmless).

### 4.2 Explore (20–40 min)

Small graph first, then the full one:

```bash
uv run python 02_import_graph.py lab-solution --yes      # 51 nodes, 71 relationships
```

In Lab, run `MATCH (n) RETURN n` and show the whole thing: five components, all state
in `App` and `AddMovieForm`, no hooks, no Context, no routes.

```bash
uv run python 02_import_graph.py movie-watchlist --yes   # 81 nodes, 118 relationships
```

*"What did the custom hooks, the Context and the router add?"* Then these queries in
Lab, in this order (the numbers are from `queries/explore.cypher`; paste the block):

1. **The cover graph**: `MATCH (n) RETURN n;` The whole app as a graph, as on the
   title slide. Compare it with the small graph you just showed.
2. **Slide 24's query**, as promised there:
   `MATCH (h)-[:CONSUMES_CONTEXT]->(c:Context) RETURN h.name, c.name;`
   → `useMovies`, `MoviesContext`. The same pattern as the shopping cart: components
   reach the Context through a custom hook.
3. **Query 3, component tree**: `main.jsx → App → pages → children`. Point out that the
   route pages are children of `App` too.
4. **Query 4, routes** (table): `/` → `WatchlistPage`, `/stats` → `StatsPage`,
   `*` → `NotFoundPage`, all from `App`. React Router's `<Route>` elements became
   `ROUTES_TO` relationships with the path on them.
5. **Query 9, context chain**: `WatchlistPage → useMovies → MoviesContext ← MoviesProvider`
   (and the same for `StatsPage`). This is the path D2 needs.
6. **Query 5, prop flow**: `WatchlistPage → MovieList → MovieCard`, carrying `onDelete`.
   Each `PASSES_PROP` edge holds one prop name.
7. **Query 12, impact**: who breaks if `MoviesContext` changes? `useMovies`, used by both pages.
8. **Query 6, interfaces** (table): `MovieCard` has 6 props. Ask: *step 1 said
   `MoviesProvider` has a `children` prop; does the graph?* (It does not: a prompt
   design difference, and a discussion about measuring extraction quality.)

If time is short, skip 4 and 8; they are tables, not pictures.

Students: `uv run python 03_explore_graph.py`, then write one query of their own.

> **Fallback (Lab will not load):** run the same queries in the terminal:
> `uv run python 03_explore_graph.py 3 4 9 5 12 6`.

### 4.3 Retrieve (40–55 min)

Open `tasks/D2.md` in react-kg-lab and walk through its table: each question a
developer asks before adding the "Clear watched" button, and the query that answers it.

```bash
uv run python 04_task_context.py D2 --print
```

Six queries run instantly; the block is ~5,500 characters (~1,400 tokens) with the
source of `WatchlistPage`, `MoviesProvider` and `useMovies`. Talking points:

- **D2-3** is the key query: the two files the change touches never mention each other;
  only the path through the hook and the Context connects them.
- Compare with the research pipeline's block,
  `movie-watchlist/tasks/contexts/D2_kg_augmented_context.md` (~1,300 tokens): its
  classifier picked the anchors itself; here we named them by hand.
- What the graph cannot say (from `tasks/D2.md`): what `deleteMovie` does, where the
  footer is, what `useMovies` returns.

> **Optional, close the loop** (in `movie-watchlist`, about 1 minute): show that the
> task is real and testable.
> ```bash
> cd ~/Lecture/movie-watchlist
> cp tasks/tests/D2_clear_watched.test.jsx src/__tests__/
> npx vitest run src/__tests__/D2_clear_watched.test.jsx    # fails: no button yet
> git apply tasks/patches/D2.diff
> npx vitest run src/__tests__/D2_clear_watched.test.jsx    # passes
> git checkout -- src && rm src/__tests__/D2_clear_watched.test.jsx   # undo: do not skip
> ```
> With `npm run dev` running, the button appears at http://localhost:5173 after the patch
> (show it before the undo line). If you click it, the watched movies are gone from the
> saved list: click **Reset to sample movies** afterwards.

Students do **D3** on their own: read `tasks/D3.md`, run
`uv run python 04_task_context.py D3`, and compare with the research block. Ask them:
*the classifier named `useMovieFilter` as an anchor; why did it match nothing?*

> **Fallback:** `cat ~/lecture-backup/output/D2_context.md`.

### 4.4 Wrap-up (55–60 min)

Open `docs/ideas.md`. Each student (or pair) picks one question for their proposal.
The demo showed the two ends; the middle (saving the JSON into the schema, choosing
anchors, measuring whether the context helps) is theirs.

## 5. Things that go wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Cannot reach Memgraph at bolt://localhost:7687` | Docker not running, or compose not started | Start Docker Desktop; `docker compose up -d` in `movie-watchlist` |
| `docker compose up` says port 7687 or 3000 is in use | Another Memgraph or app on that port (on your laptop: the research DB) | `MEMGRAPH_PORT=7688 LAB_PORT=3001 docker compose up -d`, then `MEMGRAPH_URI=bolt://localhost:7688` in react-kg-lab's `.env` |
| `No ANTHROPIC_API_KEY set` | No `.env`, or the key is in the wrong variable | `cp .env.example .env` and fill it in; for OpenAI also `LLM_PROVIDER=openai` |
| `Cannot find the movie-watchlist app` | Repos not cloned side by side | Clone next to each other, or `APP_DIR=...` in `.env` |
| `The graph in Memgraph has no custom hooks` (step 4) | `lab-solution` is loaded | `uv run python 02_import_graph.py movie-watchlist --yes` |
| Memgraph Lab asks for a host | Quick connect not used | Host `memgraph` and port `7687` inside Lab (or `localhost` from outside Docker) |
| Windows: Docker fails to start | WSL2 or virtualisation off | Pair with a neighbour; fix after class |
| `uv: command not found` | uv installed but shell not restarted | Open a new terminal |
| `npm install` stops with `EBADENGINE` | Node.js older than 22.22 | Install the current LTS from nodejs.org |
| Step 1 slow or rate-limited | Many students on one shared key | Students run `--file` on one file, or skip to step 2 |

## 6. Numbers to have at hand

| | Value |
| --- | --- |
| App source files read by the extractor | 17 |
| Full graph (`movie-watchlist`) | 81 nodes, 118 relationships; 11 components, 2 custom hooks, 1 Context, 3 routes |
| Lab graph (`lab-solution`) | 51 nodes, 71 relationships; 5 components |
| Lab step 1 (17 files, `claude-opus-5-5`) | ~10 s, 11 components |
| Research extraction | 192 LLM calls; ~70 min uncached (20 s delay between calls), ~4 s cached |
| Graph import from CYPHERL | 0.1–0.2 s |
| D2 / D3 context block (lab) | ~1,400 / ~1,100 tokens |
| D2 / D3 context block (research retriever) | ~1,300 / ~750 tokens |

## 7. Setup message for students (send a week before)

> For Part 2 of the lecture on Knowledge Graphs for React Code Generation we will work
> hands-on. Please set up your laptop **before** the session (about 20 minutes):
>
> 1. Install Git, Node.js 22.22 or newer, Docker Desktop, and uv
>    (https://docs.astral.sh/uv/).
> 2. In one folder, clone both repos:
>    `git clone https://github.com/tisserapac/movie-watchlist.git` and
>    `git clone https://github.com/tisserapac/react-kg-lab.git`
> 3. Follow "Check your setup before the session" in movie-watchlist's README
>    (`npm install`, `npm test` shows 26 passed).
> 4. Follow "Setup" in react-kg-lab's README (`uv sync`, `.env`, `docker compose up -d`),
>    then run `uv run python 02_import_graph.py movie-watchlist`. If it ends with
>    `Graph loaded: 81 nodes, 118 relationships.`, you are ready.
> 5. API key: *[your decision from section 1]*.
>
> If something fails, bring the error message to the session and sit next to someone
> whose setup works.
