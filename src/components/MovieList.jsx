import MovieCard from './MovieCard';
import './MovieList.css';

function MovieList({ movies }) {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          year={movie.year}
          genre={movie.genre}
          watched={movie.watched}
        />
      ))}
    </div>
  );
}

export default MovieList;
