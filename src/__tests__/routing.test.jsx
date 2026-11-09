import { screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { cardButton, renderApp } from './helpers';

describe('Routing and the Stats page', () => {
  test('the NavBar marks the current page', () => {
    renderApp();
    expect(screen.getByRole('link', { name: 'Watchlist' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Stats' })).not.toHaveClass('active');
  });

  test('Stats shows totals and the per-genre table from the shared list', async () => {
    const { user } = renderApp();
    await user.click(cardButton('Parasite', 'Mark watched'));
    await user.click(screen.getByRole('link', { name: 'Stats' }));

    expect(window.location.pathname).toBe('/stats');
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Stats' })).toHaveClass('active');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');

    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
      .map((row) => within(row).getAllByRole('cell').map((cell) => cell.textContent).join('/'));
    expect(rows).toEqual(['Action/1/1', 'Comedy/2/1', 'Drama/2/1', 'Sci-Fi/2/1', 'Horror/1/0']);
  });

  test('Stats shows 0% when there are no movies', () => {
    renderApp({ path: '/stats', movies: [] });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('an unknown URL shows the not-found page with a link home', async () => {
    const { user } = renderApp({ path: '/no-such-page' });
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Back to your watchlist' }));
    expect(window.location.pathname).toBe('/');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(8);
  });
});
