import MoviesProvider from './context/MoviesProvider';
import WatchlistPage from './pages/WatchlistPage';
import './App.css';

function App() {
  return (
    <MoviesProvider>
      <div className="app">
        <header className="app__header">
          <h1>Movie Watchlist</h1>
          <p className="app__tagline">Keep track of the movies you want to watch.</p>
        </header>

        <main>
          <WatchlistPage />
        </main>
      </div>
    </MoviesProvider>
  );
}

export default App;
