import { createContext } from 'react';

// Shares the movie list and its actions with every component below
// <MoviesProvider>, without passing props through each level.
const MoviesContext = createContext(null);

export default MoviesContext;
