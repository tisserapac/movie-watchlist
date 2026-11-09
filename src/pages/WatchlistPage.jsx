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
