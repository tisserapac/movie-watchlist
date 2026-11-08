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

  return (
    <div className="app">
      <header className="app__header">
        <h1>Movie Watchlist</h1>
        <p className="app__tagline">Keep track of the movies you want to watch.</p>
      </header>

      <AddMovieForm onAdd={handleAdd} />

      <p className="app__summary">Total movies: {movies.length}</p>

      <MovieList movies={movies} />
    </div>
  );
}

export default App;
