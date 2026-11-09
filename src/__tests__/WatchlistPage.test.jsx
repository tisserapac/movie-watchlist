import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import {
  addMovie, cardButton, movieTitles, renderApp, savedMovies, summaryText,
} from './helpers';

describe('Watchlist page', () => {
  test('starts with the 8 sample movies', () => {
    renderApp();
    expect(movieTitles()).toHaveLength(8);
    expect(movieTitles().slice(0, 3)).toEqual(['Inception', 'Parasite', 'Coco']);
    expect(summaryText()).toBe('Total: 8 · Watched: 3 / 8');
  });

  test('ignores a list saved by another app under the plain "movies" key', () => {
    localStorage.setItem('movies', JSON.stringify([{ id: 99, title: 'Lab movie', year: 2000, genre: 'Action', watched: false }]));
    renderApp();
    expect(movieTitles()).not.toContain('Lab movie');
    expect(movieTitles()).toHaveLength(8);
  });

  test('adds a movie with a trimmed title, as To watch, and clears the form', async () => {
    const { user } = renderApp();
    await addMovie(user, { title: '  The Matrix  ', year: 1999, genre: 'Sci-Fi' });

    expect(movieTitles()).toContain('The Matrix');
    expect(summaryText()).toBe('Total: 9 · Watched: 3 / 9');
    expect(cardButton('The Matrix', 'Mark watched')).toBeInTheDocument();
    expect(screen.getByLabelText('Movie title')).toHaveValue('');
    expect(screen.getByLabelText('Year')).toHaveValue(null);
  });

  test.each([
    ['an empty title', '', 1999, 'Please enter a movie title.'],
    ['a whitespace-only title', '   ', 1999, 'Please enter a movie title.'],
    ['a missing year', 'Amélie', '', /Please enter a year between 1888 and/],
    ['a year before 1888', 'Too early', 1700, /Please enter a year between 1888 and/],
  ])('rejects %s', async (_label, title, year, message) => {
    const { user } = renderApp();
    await addMovie(user, { title, year });
    expect(screen.getByRole('alert')).toHaveTextContent(message);
    expect(movieTitles()).toHaveLength(8);
  });

  test('clears the error after a valid add', async () => {
    const { user } = renderApp();
    await addMovie(user, { title: '', year: 1999 });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await addMovie(user, { title: 'Heat', year: 1995 });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('toggles watched on and off and updates the counter', async () => {
    const { user } = renderApp();
    await user.click(cardButton('Parasite', 'Mark watched'));
    expect(summaryText()).toBe('Total: 8 · Watched: 4 / 8');
    await user.click(cardButton('Parasite', 'Mark unwatched'));
    expect(summaryText()).toBe('Total: 8 · Watched: 3 / 8');
  });

  test('deletes a movie', async () => {
    const { user } = renderApp();
    await user.click(cardButton('Coco', 'Delete'));
    expect(movieTitles()).not.toContain('Coco');
    expect(summaryText()).toBe('Total: 7 · Watched: 3 / 7');
  });

  test('shows the empty message when every movie is deleted', async () => {
    const { user } = renderApp({ movies: [{ id: 1, title: 'Heat', year: 1995, genre: 'Action', watched: false }] });
    await user.click(cardButton('Heat', 'Delete'));
    expect(screen.getByText('Your watchlist is empty. Add a movie above.')).toBeInTheDocument();
    expect(summaryText()).toBe('Total: 0 · Watched: 0 / 0');
  });

  test('filters by All, To watch and Watched', async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole('button', { name: 'Watched' }));
    expect(movieTitles()).toEqual(['Inception', 'Mad Max: Fury Road', 'The Grand Budapest Hotel']);
    await user.click(screen.getByRole('button', { name: 'To watch' }));
    expect(movieTitles()).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(movieTitles()).toHaveLength(8);
  });

  test('says when a filter matches nothing', async () => {
    const { user } = renderApp({ movies: [{ id: 1, title: 'Heat', year: 1995, genre: 'Action', watched: false }] });
    await user.click(screen.getByRole('button', { name: 'Watched' }));
    expect(screen.getByText('No movies match this filter.')).toBeInTheDocument();
  });

  test('saves changes to localStorage', async () => {
    const { user } = renderApp();
    await user.click(cardButton('Coco', 'Delete'));
    expect(savedMovies()).toHaveLength(7);
  });

  test('loads a saved list instead of the sample movies', () => {
    renderApp({ movies: [{ id: 1, title: 'Heat', year: 1995, genre: 'Action', watched: true }] });
    expect(movieTitles()).toEqual(['Heat']);
  });

  test('Reset restores the sample movies and the All filter', async () => {
    const { user } = renderApp({ movies: [] });
    await user.click(screen.getByRole('button', { name: 'Watched' }));
    await user.click(screen.getByRole('button', { name: 'Reset to sample movies' }));
    expect(movieTitles()).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });
});
