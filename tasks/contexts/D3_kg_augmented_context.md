## Project Context

You are working on the **movie-watchlist** React project.

**Task type:** refactoring

---

### Target Components


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

**App** (`src/App.jsx`)
- calls the target

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

- ⚠ Refactoring WatchlistPage's prop interface will require updating 1 caller(s): App.
- WatchlistPage event handlers: onClick→handleReset

