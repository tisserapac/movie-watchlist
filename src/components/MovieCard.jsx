import './MovieCard.css';

function MovieCard({ title, year, genre, watched }) {
  return (
    <article className="movie-card">
      <h3 className="movie-card__title">{title}</h3>
      <p className="movie-card__meta">
        {year} · {genre}
      </p>
      <span className={watched ? 'badge done' : 'badge todo'}>
        {watched ? 'Watched' : 'To watch'}
      </span>
    </article>
  );
}

export default MovieCard;
