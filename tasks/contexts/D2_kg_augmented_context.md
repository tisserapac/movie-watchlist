## Project Context

You are working on the **movie-watchlist** React project.

**Task type:** feature_addition

---

### Target Components


#### MoviesProvider (`src/context/MoviesProvider.jsx`)


```jsx
import MoviesContext from './MoviesContext';
import initialMovies from '../data/initialMovies';
import useLocalStorage from '../hooks/useLocalStorage';

// A key unique to this app, so another app on localhost:5173
// (for example your own lab version) cannot overwrite our list.
const STORAGE_KEY = 'movie-watchlist:movies';

function MoviesProvider({ children }) {
  // the sample movies are used only when nothing has been saved yet
  const [movies, setMovies] = useLocalStorage(STORAGE_KEY, initialMovies);

  function addMovie(newMovie) {
    setMovies([...movies, newMovie]);
  }

  function toggleMovie(id) {
    setMovies(movies.map((m) =>
      m.id === id ? { ...m, watched: !m.watched } : m
    ));
  }

  function deleteMovie(id) {
    setMovies(movies.filter((m) => m.id !== id));
  }

  function resetMovies() {
    setMovies(initialMovies);
  }

  return (
    <MoviesContext.Provider value={{ movies, addMovie, toggleMovie, deleteMovie, resetMovies }}>
      {children}
    </MoviesContext.Provider>
  );
}

export default MoviesProvider;

```



**Hooks used:** useLocalStorage


**State:** movies





#### WatchlistPage (`src/pages/WatchlistPage.jsx`)


```jsx
import { useState } from 'react';
import AddMovieForm from '../components/AddMovieForm';
import FilterBar from '../components/FilterBar';
import MovieList from '../components/MovieList';
import useMovies from '../hooks/useMovies';
import './WatchlistPage.css';

function WatchlistPage() {
  const { movies, watchedCount, addMovie, toggleMovie, deleteMovie, resetMovies } = useMovies();
  const [filter, setFilter] = useState('all');

  function handleReset() {
    resetMovies();
    setFilter('all');
  }

  // calculated, NOT stored in state
  const visibleMovies = movies.filter(
    (m) => filter === 'all' || (filter === 'watched') === m.watched
  );

  const emptyMessage = movies.length === 0
    ? 'Your watchlist is empty. Add a movie above.'
    : 'No movies match this filter.';

  return (
    <>
      <AddMovieForm onAdd={addMovie} />

      <div className="watchlist__toolbar">
        <p className="watchlist__summary">
          Total: {movies.length} · Watched: {watchedCount} / {movies.length}
        </p>
        <FilterBar filter={filter} onFilterChange={setFilter} />
      </div>

      <MovieList
        movies={visibleMovies}
        emptyMessage={emptyMessage}
        onToggle={toggleMovie}
        onDelete={deleteMovie}
      />

      <div className="watchlist__footer">
        <button type="button" className="watchlist__reset" onClick={handleReset}>
          Reset to sample movies
        </button>
      </div>
    </>
  );
}

export default WatchlistPage;

```



**Hooks used:** useState, useMovies


**State:** filter





#### useLocalStorage (`src/hooks/useLocalStorage.js`)


```jsx
import { useState, useEffect } from 'react';

// Works like useState, but the value is also saved in localStorage under `key`,
// so it survives a page refresh. `initialValue` is used when nothing is saved
// yet, or when the saved value cannot be read.
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  // save whenever the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked (e.g. some private windows): keep working in memory
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;

```








#### useMovies (`src/hooks/useMovies.js`)


```jsx
import { useContext } from 'react';
import MoviesContext from '../context/MoviesContext';

// The one way components reach the movie list: reads MoviesContext and adds
// values calculated from it, so no component has to recalculate them.
function useMovies() {
  const context = useContext(MoviesContext);
  if (context === null) {
    throw new Error('useMovies must be used inside <MoviesProvider>.');
  }

  const watchedCount = context.movies.filter((m) => m.watched).length;

  return { ...context, watchedCount };
}

export default useMovies;

```









---

### Related Components

**AddMovieForm** (`src/components/AddMovieForm.jsx`)
- is rendered by the target
- Props: onAdd, onAdd, onAdd, onAdd
- State: title, year, genre, error

**FilterBar** (`src/components/FilterBar.jsx`)
- is rendered by the target
- Props: filter, onFilterChange

**MovieList** (`src/components/MovieList.jsx`)
- is rendered by the target
- Props: movies, emptyMessage, onToggle, onDelete


---

### Cross-Cutting Notes

- Project routing table:
-   * → NotFoundPage (src/pages/NotFoundPage.jsx); router App (src/App.jsx)
-   / → WatchlistPage (src/pages/WatchlistPage.jsx); router App (src/App.jsx)
-   /stats → StatsPage (src/pages/StatsPage.jsx); router App (src/App.jsx)

