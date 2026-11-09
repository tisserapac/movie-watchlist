// deleteMovie removes movies by id, so two movies with the same title
// (a film and its remake) are deleted one at a time.
import { describe, expect, test } from 'vitest';
import { cardButton, getCard, movieTitles, renderApp, savedMovies, summaryText } from './helpers';

const twoHeats = [
  { id: 1, title: 'Heat', year: 1995, genre: 'Action', watched: false },
  { id: 2, title: 'Heat', year: 1986, genre: 'Drama', watched: true },
  { id: 3, title: 'Coco', year: 2017, genre: 'Comedy', watched: false },
];

describe('deleting a movie removes only that movie', () => {
  test('deleting one of two movies with the same title keeps the other', async () => {
    const { user } = renderApp({ movies: twoHeats });
    const cards = document.querySelectorAll('.movie-card');
    expect(cards).toHaveLength(3);

    // the first card is Heat (1995)
    await user.click(cards[0].querySelector('.movie-card__delete'));

    expect(movieTitles()).toEqual(['Heat', 'Coco']);
    expect(getCard('Heat')).toHaveTextContent('1986');
    expect(summaryText()).toBe('Total: 2 · Watched: 1 / 2');
    expect(savedMovies().map((m) => m.id)).toEqual([2, 3]);
  });

  test('deleting a movie with a unique title still works', async () => {
    const { user } = renderApp({ movies: twoHeats });
    await user.click(cardButton('Coco', 'Delete'));
    expect(movieTitles()).toEqual(['Heat', 'Heat']);
  });
});
