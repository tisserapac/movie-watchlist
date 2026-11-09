// Task D3 (refactoring). Copied to src/__tests__/ before the candidate edit is applied.
// The hook's API is given in the task spec; the page must behave exactly as before.
import { act, renderHook, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import initialMovies from '../data/initialMovies';
import useMovieFilter from '../hooks/useMovieFilter';
import { movieTitles, renderApp } from './helpers';

const titles = (movies) => movies.map((m) => m.title);

describe('D3: useMovieFilter custom hook', () => {
  test('starts on "all" and returns every movie', () => {
    const { result } = renderHook(() => useMovieFilter(initialMovies));
    expect(result.current.filter).toBe('all');
    expect(result.current.visibleMovies).toEqual(initialMovies);
  });

  test('"watched" and "todo" return the matching movies', () => {
    const { result } = renderHook(() => useMovieFilter(initialMovies));

    act(() => result.current.setFilter('watched'));
    expect(result.current.filter).toBe('watched');
    expect(titles(result.current.visibleMovies)).toEqual(['Inception', 'Mad Max: Fury Road', 'The Grand Budapest Hotel']);

    act(() => result.current.setFilter('todo'));
    expect(titles(result.current.visibleMovies)).toEqual(['Parasite', 'Coco', 'Get Out', 'Interstellar', 'Whiplash']);
  });

  test('recalculates when the movie list changes', () => {
    const { result, rerender } = renderHook(({ movies }) => useMovieFilter(movies), {
      initialProps: { movies: initialMovies },
    });
    act(() => result.current.setFilter('watched'));
    rerender({ movies: initialMovies.slice(0, 2) });
    expect(titles(result.current.visibleMovies)).toEqual(['Inception']);
  });
});

describe('D3: the Watchlist page behaves as before', () => {
  test('filter buttons still filter the list', async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole('button', { name: 'To watch' }));
    expect(movieTitles()).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'To watch' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('Reset still returns the filter to All', async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole('button', { name: 'Watched' }));
    await user.click(screen.getByRole('button', { name: 'Reset to sample movies' }));
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(movieTitles()).toHaveLength(8);
  });
});
