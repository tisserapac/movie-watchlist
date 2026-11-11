# Movie Watchlist

The Movie Watchlist app from the *React Basics* lab (Full Stack Application
Development), built with React + Vite in plain JavaScript. It is also the sample
project for the *Knowledge Graphs for React Code Generation* lecture demo.

## Quick start

The app runs the same on Windows, macOS and Linux. You need **Node.js 22.22 or
newer** (with npm, which comes with it) and **Git**.

1. **Install Node.js** if `node --version` shows nothing or a version below 22.22:
   - Windows and macOS: the LTS installer from https://nodejs.org.
   - Linux: your package manager may be too old; use https://nodejs.org or a
     version manager such as [fnm](https://github.com/Schniz/fnm) or
     [nvm](https://github.com/nvm-sh/nvm) (`.nvmrc` selects Node 24).
2. **Clone, install and start** (in PowerShell, Terminal or any shell):

   ```bash
   git clone https://github.com/tisserapac/movie-watchlist.git
   cd movie-watchlist
   npm install
   npm run dev
   ```

3. Open http://localhost:5173. The app starts with 8 sample movies.

### Check your setup before the session

Run these in the `movie-watchlist` folder. If all three work, you are ready.

| Command | You should see |
| --- | --- |
| `node --version` | `v22.22.0` or higher |
| `npm test` | `Tests  26 passed (26)` |
| `npm run dev` | the app at http://localhost:5173 (stop it with Ctrl+C) |

If `npm install` stops with `EBADENGINE`, your Node.js is too old: install a newer one (step 1).

### No Node.js on your laptop? Use GitHub Codespaces

On the repository's GitHub page, click **Code → Codespaces → Create codespace
on main**. A VS Code window opens in the browser with Node.js installed and
`npm install` already run (the setup is in `.devcontainer/`). Run `npm test` or
`npm run dev` in its terminal; the app opens in a new browser tab. With Docker
and VS Code installed, **Dev Containers: Reopen in Container** uses the same setup
on your laptop.

## What it does

- Add a movie (title, year, genre); empty titles and invalid years are rejected.
- Mark a movie watched or unwatched, or delete it.
- Filter: All · To watch · Watched, with a running "Watched: X / N" counter.
- A **Stats** page (`/stats`): totals, a progress bar and a per-genre table.
- Your list is saved in the browser (`localStorage`), so it survives a refresh.
- **Reset to sample movies** (bottom of the watchlist) brings back the 8 sample movies.

There is no backend or database: all data lives in the browser.

## Explore the knowledge graph (optional, needs Docker)

`knowledge_graph/` holds this app's knowledge graph, extracted with
the `codebase-kg` pipeline for the lecture *Knowledge Graphs
for React Code Generation*: `movie-watchlist/` is this version, `lab-solution/`
the smaller lab version. To explore it in Memgraph Lab:

```bash
docker compose up -d
docker compose exec memgraph bash -c "mgconsole < /knowledge_graph/movie-watchlist/full_dump.cypherl"
```

Open http://localhost:3000, click **Connect**, and run for example
`MATCH p=(:Function_Component {name:'App'})-[:USES_COMPONENT|ROUTES_TO]->() RETURN p`.
`docker compose down` stops it. If port 7687 or 3000 is taken, see the comment
at the top of `compose.yaml`.

## Project structure

```
src/
├── main.jsx                    # starts React, renders <App /> into #root
├── index.css                   # global styles and design tokens (CSS variables)
├── App.jsx / App.css           # router, provider, header and routes
├── context/
│   ├── MoviesContext.js        # createContext()
│   └── MoviesProvider.jsx      # owns the movie list; add / toggle / delete / reset
├── hooks/
│   ├── useLocalStorage.js      # useState that is also saved in localStorage
│   └── useMovies.js            # reads MoviesContext, adds watchedCount
├── pages/
│   ├── WatchlistPage.jsx       # form, filter, list (route /)
│   ├── StatsPage.jsx           # stats (route /stats)
│   └── NotFoundPage.jsx        # any other URL
├── components/
│   ├── NavBar.jsx              # links to Watchlist and Stats
│   ├── AddMovieForm.jsx        # controlled inputs, validation, calls onAdd
│   ├── FilterBar.jsx           # All / To watch / Watched
│   ├── MovieList.jsx           # one MovieCard per movie, empty-state message
│   ├── MovieCard.jsx           # title, year, genre, badge, toggle and delete buttons
│   └── StatCard.jsx            # one number with a label
├── data/
│   ├── initialMovies.js        # the 8 sample movies
│   └── genres.js               # Action, Comedy, Drama, Sci-Fi, Horror
└── __tests__/                  # Vitest + React Testing Library tests
tasks/                          # demo tasks D2 and D3: specs, tests, reference patches
knowledge_graph/                # the app's knowledge graph as CYPHERL (loads into Memgraph)
compose.yaml                    # Memgraph + Memgraph Lab, for exploring the graph
```

The movie list lives in `MoviesProvider` and is shared through React Context.
Components read it with the `useMovies()` custom hook instead of receiving it
as props. Inside a page, data still flows down as props and events flow back up
through functions (`onAdd`, `onToggle`, `onDelete`, `onFilterChange`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server on port 5173 |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Check the code with Oxlint |
| `npm test` | Run the tests once (Vitest + React Testing Library) |
| `npm run test:watch` | Run the tests and re-run them on every change |

## Versions of this app (git tags)

| Tag | Contents |
| --- | --- |
| `lab-solution` | The lab, exactly as the React lecture slides 57–64 ask. State lives in `App`. |
| `extended` | Same features, restructured with custom hooks, Context and React Router, plus a Stats page |
| `demo` | `extended` + Vitest tests + the demo tasks in `tasks/` (the version we use in the lecture) |

`git log --oneline` shows one commit per step. Use `git checkout <tag or commit>`
to see the app at any point, and `git diff lab-solution extended -- src` to see
what changed between the two versions.
