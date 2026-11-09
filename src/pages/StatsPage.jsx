import StatCard from '../components/StatCard';
import GENRES from '../data/genres';
import useMovies from '../hooks/useMovies';
import './StatsPage.css';

function StatsPage() {
  const { movies, watchedCount } = useMovies();

  const total = movies.length;
  const toWatchCount = total - watchedCount;
  const watchedPercent = total === 0 ? 0 : Math.round((watchedCount / total) * 100);

  const genreRows = GENRES.map((genre) => {
    const inGenre = movies.filter((m) => m.genre === genre);
    return {
      genre,
      total: inGenre.length,
      watched: inGenre.filter((m) => m.watched).length,
    };
  });

  return (
    <section className="stats">
      <h2 className="stats__heading">Stats</h2>

      <div className="stats__cards">
        <StatCard value={total} label="Movies" />
        <StatCard value={watchedCount} label="Watched" />
        <StatCard value={toWatchCount} label="To watch" />
        <StatCard value={`${watchedPercent}%`} label="Progress" />
      </div>

      <div
        className="stats__progress"
        role="progressbar"
        aria-label="Movies watched"
        aria-valuenow={watchedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="stats__progress-bar" style={{ width: `${watchedPercent}%` }} />
      </div>

      <h3 className="stats__subheading">By genre</h3>
      <table className="stats__table">
        <thead>
          <tr>
            <th scope="col">Genre</th>
            <th scope="col">Movies</th>
            <th scope="col">Watched</th>
          </tr>
        </thead>
        <tbody>
          {genreRows.map((row) => (
            <tr key={row.genre}>
              <td>{row.genre}</td>
              <td>{row.total}</td>
              <td>{row.watched}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default StatsPage;
