import { useState } from 'react';
import AddMovieForm from './components/AddMovieForm';
import FilterBar from './components/FilterBar';
import MovieList from './components/MovieList';
import initialMovies from './data/initialMovies';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

// A key unique to this app, so another app on localhost:5173
// (for example your own lab version) cannot overwrite our list.
const STORAGE_KEY = 'movie-watchlist:movies';

function App() {
  // the sample movies are used only when nothing has been saved yet
  const [movies, setMovies] = useLocalStorage(STORAGE_KEY, initialMovies);
  const [filter, setFilter] = useState('all');

  function handleAdd(newMovie) {
    setMovies([...movies, newMovie]);
  }

  function handleToggle(id) {
    setMovies(movies.map((m) =>
      m.id === id ? { ...m, watched: !m.watched } : m
    ));
  }

  function handleDelete(id) {
    setMovies(movies.filter((m) => m.id !== id));
  }

  function handleReset() {
    setMovies(initialMovies);
    setFilter('all');
  }

  const watchedCount = movies.filter((m) => m.watched).length;

  // calculated, NOT stored in state
  const visibleMovies = movies.filter(
    (m) => filter === 'all' || (filter === 'watched') === m.watched
  );

  const emptyMessage = movies.length === 0
    ? 'Your watchlist is empty. Add a movie above.'
    : 'No movies match this filter.';

  return (
    <div className="app">
      <header className="app__header">
        <h1>Movie Watchlist</h1>
        <p className="app__tagline">Keep track of the movies you want to watch.</p>
      </header>

      <AddMovieForm onAdd={handleAdd} />

      <div className="app__toolbar">
        <p className="app__summary">
          Total: {movies.length} · Watched: {watchedCount} / {movies.length}
        </p>
        <FilterBar filter={filter} onFilterChange={setFilter} />
      </div>

      <MovieList
        movies={visibleMovies}
        emptyMessage={emptyMessage}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />

      <footer className="app__footer">
        <button type="button" className="app__reset" onClick={handleReset}>
          Reset to sample movies
        </button>
      </footer>
    </div>
  );
}

export default App;
