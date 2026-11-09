import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // https://vitest.dev/config/
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    // Only the app's own tests. The demo-task tests in tasks/tests/ fail on
    // purpose until their patch is applied, so they are not part of `npm test`.
    include: ['src/**/*.test.{js,jsx}'],
  },
})
