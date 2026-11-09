import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

export const STORAGE_KEY = 'movie-watchlist:movies';

// Render the whole app at `path`, optionally starting from a saved list.
export function renderApp({ path = '/', movies } = {}) {
  if (movies) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }
  window.history.pushState({}, '', path);
  const user = userEvent.setup();
  render(<App />);
  return { user };
}

export function movieTitles() {
  return screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent);
}

export function getCard(title) {
  return screen.getByRole('heading', { level: 3, name: title }).closest('article');
}

export function cardButton(title, name) {
  return within(getCard(title)).getByRole('button', { name });
}

export function summaryText() {
  return screen.getByText(/^Total:/).textContent.replace(/\s+/g, ' ').trim();
}

export function savedMovies() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

export async function addMovie(user, { title, year, genre = 'Action' }) {
  const titleInput = screen.getByLabelText('Movie title');
  const yearInput = screen.getByLabelText('Year');
  await user.clear(titleInput);
  if (title) await user.type(titleInput, title);
  await user.clear(yearInput);
  if (year !== undefined && year !== '') await user.type(yearInput, String(year));
  await user.selectOptions(screen.getByLabelText('Genre'), genre);
  await user.click(screen.getByRole('button', { name: 'Add' }));
}
