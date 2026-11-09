// Runs before every test file (vite.config.js -> test.setupFiles).
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

beforeEach(() => {
  // every test starts from the 8 sample movies, on the home page
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  cleanup();
});
