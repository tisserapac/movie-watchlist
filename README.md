# Movie Watchlist

The Movie Watchlist app from the *React Basics* lab (Full Stack Application
Development), built with React + Vite in plain JavaScript. It is also the sample
project for the *Knowledge Graphs for React Code Generation* lecture demo.

## Quick start

You need Node.js (current LTS) and npm.

```bash
git clone <this repository>
cd movie-watchlist
npm install
npm run dev
```

Open http://localhost:5173. The app starts with 8 sample movies.

## What it does

- Add a movie (title, year, genre); empty titles and invalid years are rejected.
- Mark a movie watched or unwatched, or delete it.
- Filter: All · To watch · Watched, with a running "Watched: X / N" counter.
- Your list is saved in the browser (`localStorage`), so it survives a refresh.
- **Reset to sample movies** (bottom of the page) brings back the 8 sample movies.

There is no backend or database: all data lives in the browser.

## Project structure

```
src/
├── main.jsx                 # starts React, renders <App /> into #root
├── index.css                # global styles and design tokens (CSS variables)
├── App.jsx / App.css        # movies + filter state, event handlers, localStorage
├── data/initialMovies.js    # the 8 sample movies
└── components/
    ├── AddMovieForm.jsx     # controlled inputs, validation, calls onAdd
    ├── FilterBar.jsx        # All / To watch / Watched
    ├── MovieList.jsx        # one MovieCard per movie, empty-state message
    └── MovieCard.jsx        # title, year, genre, badge, toggle and delete buttons
```

State lives in `App` and flows down as props; events flow back up through
functions passed as props (`onAdd`, `onToggle`, `onDelete`, `onFilterChange`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server on port 5173 |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Check the code with Oxlint |

## Versions of this app (git tags)

| Tag | Contents |
| --- | --- |
| `lab-solution` | The lab, exactly as the React lecture slides 57–64 ask |

`git log --oneline` shows one commit per lab task. Use `git checkout <commit>` to
see the app at any step.
