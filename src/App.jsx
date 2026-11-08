import MovieCard from './components/MovieCard';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Movie Watchlist</h1>
        <p className="app__tagline">Keep track of the movies you want to watch.</p>
      </header>

      <MovieCard title="Inception" year={2010} genre="Sci-Fi" watched={true} />
      <MovieCard title="Parasite" year={2019} genre="Drama" watched={false} />
    </div>
  );
}

export default App;
