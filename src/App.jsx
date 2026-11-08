import { useState } from 'react';
import AddMovieForm from './components/AddMovieForm';
import MovieList from './components/MovieList';
import initialMovies from './data/initialMovies';
import './App.css';

function App() {
  const [movies, setMovies] = useState(initialMovies);

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

  const watchedCount = movies.filter((m) => m.watched).length;

  return (
    <div className="app">
      <header className="app__header">
        <h1>Movie Watchlist</h1>
        <p className="app__tagline">Keep track of the movies you want to watch.</p>
      </header>

      <AddMovieForm onAdd={handleAdd} />

      <p className="app__summary">
        Total: {movies.length} · Watched: {watchedCount} / {movies.length}
      </p>

      <MovieList
        movies={movies}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
