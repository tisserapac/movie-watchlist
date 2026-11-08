import { useState } from 'react';
import './AddMovieForm.css';

const GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'];

function AddMovieForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('Action');

  function handleSubmit(e) {
    e.preventDefault(); // stop the page reload

    const newMovie = {
      id: Date.now(),
      title,
      year: Number(year),
      genre,
      watched: false,
    };
    onAdd(newMovie);

    // clear the inputs
    setTitle('');
    setYear('');
    setGenre('Action');
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
    </form>
  );
}

export default AddMovieForm;
