import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import MoviesProvider from '../context/MoviesProvider';
import initialMovies from '../data/initialMovies';
import useLocalStorage from '../hooks/useLocalStorage';
import useMovies from '../hooks/useMovies';

describe('useLocalStorage', () => {
  test('uses the initial value when nothing is saved, then saves changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', [1, 2]));
    expect(result.current[0]).toEqual([1, 2]);
    act(() => result.current[1]([3]));
    expect(JSON.parse(localStorage.getItem('test-key'))).toEqual([3]);
  });

  test('falls back to the initial value when the saved value is corrupt', () => {
    localStorage.setItem('test-key', '{not json');
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});

describe('useMovies', () => {
  test('throws a clear error outside <MoviesProvider>', () => {
    expect(() => renderHook(() => useMovies())).toThrow('useMovies must be used inside <MoviesProvider>.');
  });

  test('exposes the movies, watchedCount and the actions', () => {
    const { result } = renderHook(() => useMovies(), { wrapper: MoviesProvider });
    expect(result.current.movies).toEqual(initialMovies);
    expect(result.current.watchedCount).toBe(3);

    act(() => result.current.toggleMovie(2));
    expect(result.current.watchedCount).toBe(4);

    act(() => result.current.addMovie({ id: 100, title: 'Heat', year: 1995, genre: 'Action', watched: false }));
    expect(result.current.movies).toHaveLength(9);

    act(() => result.current.deleteMovie(100));
    expect(result.current.movies.map((m) => m.id)).not.toContain(100);

    act(() => result.current.resetMovies());
    expect(result.current.movies).toEqual(initialMovies);
  });
});
