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
