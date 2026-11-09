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
