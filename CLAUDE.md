# CLAUDE.md — movie-watchlist

## Project

The Movie Watchlist app from the *React Basics* lab of the Full Stack Application
Development course (AIT). It is the sample project for the live demo in the
lecture *Knowledge Graphs for React Code Generation*: the app is extracted into a
knowledge graph with the `codebase-kg` pipeline
(`~/Study/Implementation/codebase-kg`), explored in Memgraph Lab, and used to
retrieve context for code-generation tasks.

React + Vite in plain JavaScript (`.jsx`): no TypeScript and no Next.js or other
framework. There is no backend; data lives in React state and `localStorage`.
Students clone this repo, so the code mirrors the idioms of the lecture slides.

## Read these first

- [docs/development-plan.md](docs/development-plan.md): the full plan, covering
  constraints, the three deliverable tags (`lab-solution`, `extended`, `demo`),
  phases, data and styling decisions, and how the app must fit `codebase-kg`.
- [docs/progress-tracker.md](docs/progress-tracker.md): what is done and what is
  next, plus decisions and notes made during the build. **Update it after every
  completed item.**
- [README.md](README.md): the student-facing quick start, features, project
  structure and scripts.

## Commands

```bash
npm run dev      # dev server on http://localhost:5173
npm run build    # production build into dist/
npm run lint     # Oxlint
npm test         # Vitest, src/**/*.test.{js,jsx} only (tasks/tests/ fail on purpose)
```

## Working rules

- Follow the conventions in the development plan: `function` components with
  destructured props, `export default` at the bottom, one `.css` file per
  component that uses the `var(--…)` tokens from `src/index.css`, and immutable
  state updates.
- Keep code `codebase-kg`-friendly. Never name a source file `seed.*` (the
  extractor skips it). Tests go in `__tests__/` or `*.test.jsx`.
- Ask before changing anything in the `codebase-kg` repository.
- `context/` holds the lecture materials (git-ignored); it is not part of the app.
- The demo tasks are D2 (feature) and D3 (refactor) in `tasks/`; see
  [tasks/README.md](tasks/README.md). There is no D1: the bug-fix task was
  dropped to fit the 1-hour session, and `src/` has no planted bug.
- After changing anything under `src/` or `tasks/`, run `npm test` and
  `bash tasks/verify.sh`. If the base code changes, update `git_commit` in
  `tasks/D*.yaml` and regenerate the patches.
