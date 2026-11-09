# Movie Watchlist

The Movie Watchlist app from the *React Basics* lab (Full Stack Application
Development), built with React + Vite in plain JavaScript. It is also the sample
project for the *Knowledge Graphs for React Code Generation* lecture demo.

## Quick start

You need Node.js 22.22 or newer (the current LTS is fine) and npm.

```bash
git clone https://github.com/tisserapac/movie-watchlist.git
cd movie-watchlist
npm install
npm run dev
```

Open http://localhost:5173. The app starts with 8 sample movies.

## What it does

- Add a movie (title, year, genre); empty titles and invalid years are rejected.
- Mark a movie watched or unwatched, or delete it.
- Filter: All · To watch · Watched, with a running "Watched: X / N" counter.
- A **Stats** page (`/stats`): totals, a progress bar and a per-genre table.
- Your list is saved in the browser (`localStorage`), so it survives a refresh.
- **Reset to sample movies** (bottom of the watchlist) brings back the 8 sample movies.

There is no backend or database: all data lives in the browser.

> **Note for the lecture demo.** The latest version on `develop` contains one
> deliberate bug, for demo task D1: deleting a movie also deletes other movies
> with the same title. See [tasks/](tasks/README.md). The `extended` tag has the
> same app without the bug.

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
tasks/                          # demo tasks D1-D3: specs, tests, reference patches
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

`git log --oneline` shows one commit per step. Use `git checkout <tag or commit>`
to see the app at any point, and `git diff lab-solution extended -- src` to see
what changed between the two versions.
