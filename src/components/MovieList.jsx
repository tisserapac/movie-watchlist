import MovieCard from './MovieCard';
import './MovieList.css';

function MovieList({ movies, onToggle, onDelete }) {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          year={movie.year}
          genre={movie.genre}
          watched={movie.watched}
          onToggle={() => onToggle(movie.id)}
          onDelete={() => onDelete(movie.id)}
        />
      ))}
    </div>
  );
}

export default MovieList;
