import { BrowserRouter, Routes, Route } from 'react-router';
import NavBar from './components/NavBar';
import MoviesProvider from './context/MoviesProvider';
import NotFoundPage from './pages/NotFoundPage';
import StatsPage from './pages/StatsPage';
import WatchlistPage from './pages/WatchlistPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <MoviesProvider>
        <div className="app">
          <header className="app__header">
            <div>
              <h1>Movie Watchlist</h1>
              <p className="app__tagline">Keep track of the movies you want to watch.</p>
            </div>
            <NavBar />
          </header>

          <main>
            <Routes>
              <Route path="/" element={<WatchlistPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </MoviesProvider>
    </BrowserRouter>
  );
}

export default App;
