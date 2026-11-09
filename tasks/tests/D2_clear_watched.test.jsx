// Task D2 (feature_addition). Copied to src/__tests__/ before the candidate edit is applied.
import { act, renderHook, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import MoviesProvider from '../context/MoviesProvider';
import useMovies from '../hooks/useMovies';
import { movieTitles, renderApp, savedMovies, summaryText } from './helpers';

describe('D2: Clear watched', () => {
  test('the button removes every watched movie and keeps the rest', async () => {
    const { user } = renderApp();
    expect(summaryText()).toBe('Total: 8 · Watched: 3 / 8');

    await user.click(screen.getByRole('button', { name: 'Clear watched' }));

    expect(movieTitles()).toEqual(['Parasite', 'Coco', 'Get Out', 'Interstellar', 'Whiplash']);
    expect(summaryText()).toBe('Total: 5 · Watched: 0 / 5');
    expect(savedMovies()).toHaveLength(5);
  });

  test('the button is disabled when no movie is watched', async () => {
    const { user } = renderApp();
    const button = screen.getByRole('button', { name: 'Clear watched' });
    expect(button).toBeEnabled();
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Clear watched' })).toBeDisabled();
  });

  test('useMovies exposes clearWatched', () => {
    const { result } = renderHook(() => useMovies(), { wrapper: MoviesProvider });
    act(() => result.current.clearWatched());
    expect(result.current.movies.every((m) => !m.watched)).toBe(true);
    expect(result.current.watchedCount).toBe(0);
  });
});
