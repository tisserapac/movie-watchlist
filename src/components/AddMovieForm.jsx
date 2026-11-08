import { useState } from 'react';
import './AddMovieForm.css';

const GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'];
const FIRST_FILM_YEAR = 1888;
const LATEST_YEAR = new Date().getFullYear() + 5;

function AddMovieForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('Action');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault(); // stop the page reload

    if (title.trim() === '') {
      setError('Please enter a movie title.');
      return;
    }
    const yearNumber = Number(year);
    if (!Number.isInteger(yearNumber) || yearNumber < FIRST_FILM_YEAR || yearNumber > LATEST_YEAR) {
      setError(`Please enter a year between ${FIRST_FILM_YEAR} and ${LATEST_YEAR}.`);
      return;
    }

    const newMovie = {
      id: Date.now(),
      title: title.trim(),
      year: yearNumber,
      genre,
      watched: false,
    };
    onAdd(newMovie);

    // clear the inputs and the error
    setTitle('');
    setYear('');
    setGenre('Action');
    setError('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="add-form__field add-form__field--title">
        <label htmlFor="movie-title">Movie title</label>
        <input
          id="movie-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. The Matrix"
        />
      </div>

      <div className="add-form__field">
        <label htmlFor="movie-year">Year</label>
        <input
          id="movie-year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="1999"
        />
      </div>

      <div className="add-form__field">
        <label htmlFor="movie-genre">Genre</label>
        <select
          id="movie-genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="add-form__submit">
        Add
      </button>

      {error && (
        <p className="add-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default AddMovieForm;
