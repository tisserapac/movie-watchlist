import './MovieCard.css';

function MovieCard({ title, year, genre, watched, onToggle, onDelete }) {
  return (
    <article className="movie-card">
      <h3 className="movie-card__title">{title}</h3>
      <p className="movie-card__meta">
        {year} · {genre}
      </p>
      <span className={watched ? 'badge done' : 'badge todo'}>
        {watched ? 'Watched' : 'To watch'}
      </span>
      <div className="movie-card__actions">
        <button type="button" onClick={onToggle}>
          {watched ? 'Mark unwatched' : 'Mark watched'}
        </button>
        <button type="button" className="movie-card__delete" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default MovieCard;
