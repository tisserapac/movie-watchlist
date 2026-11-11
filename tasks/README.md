# Demo tasks

Two code-generation tasks for the live demo of *Knowledge Graphs for React
Code Generation* (Stage 2: generating code with the graph). They use the same
format as the pilot tasks in `codebase-kg` (`tasks/pilot/P*.yaml`).

| Task | Type | In one line | Anchors |
| --- | --- | --- | --- |
| [D2](D2.yaml) | feature_addition | Add a "Clear watched" button | `WatchlistPage`, `MoviesProvider`, `useMovies` |
| [D3](D3.yaml) | refactoring | Move the filter logic into a `useMovieFilter` hook | `WatchlistPage` |

The two tasks are independent: each applies on the base commit (`git_commit`),
but not on top of the other, because both edit the top of `WatchlistPage`.

There is no D1 any more. A bug-fix task (deleting a movie also deleted other
movies with the same title) was dropped to fit the 1-hour hands-on session. The
bug is fixed in `src/`, and its test is now a regular test,
`src/__tests__/deleteMovie.test.jsx`.

## Files

- `D*.yaml`: the task: spec, expected anchors, base commit (`git_commit`), test and files.
- `tests/`: one test per task. It is copied to the path in `test_files`
  (under `src/__tests__/`) before a candidate edit is applied. It **fails** at
  `git_commit` and **passes** with the reference patch.
- `patches/`: the reference solution of each task, as a git diff.
- `contexts/`: what the knowledge graph gives the LLM for each task (see below).
- `verify.sh`: checks all of the above in a throwaway git worktree.

`npm test` only runs `src/**/*.test.*`, so these task tests never run by
accident. The `codebase-kg` extractor ignores this folder's contents:
`*.test.*` files are excluded, and `.yaml`, `.diff`, `.sh` and `.md` files are never read.

## What the graph gives the LLM (`contexts/`)

[D2_kg_augmented_context.md](contexts/D2_kg_augmented_context.md) and
[D3_kg_augmented_context.md](contexts/D3_kg_augmented_context.md) are the exact
context blocks that `codebase-kg`'s KG-augmented retriever built for each task,
unedited. This block is placed in the prompt before the task spec; the LLM sees
nothing else from the project. How it was built:

1. An LLM call classifies the spec (task type) and names the anchors
   (the components and hooks the spec is about).
2. The Cypher template for that task type runs on the graph in
   `knowledge_graph/movie-watchlist/`, starting from the anchors.
3. The full source of the anchors is read from disk; their neighbours (children,
   callers, routes, props, state) are summarised.

| | D2 (feature_addition) | D3 (refactoring) |
| --- | --- | --- |
| Anchors found | MoviesProvider, useMovies, WatchlistPage | WatchlistPage (and `useMovieFilter`, which does not exist yet, so it matches nothing) |
| Full source | MoviesProvider, WatchlistPage, useLocalStorage, useMovies | WatchlistPage, useMovies |
| Summarised | AddMovieForm, FilterBar, MovieList; the routing table | App (the caller), AddMovieForm, FilterBar, MovieList; the event handler |
| Size | about 1,300 tokens | about 750 tokens |

Compare that with pasting the whole `src/` folder: the graph picks the files a
task touches and the components around them. Things to notice:

- D2 needs `MoviesProvider` (to add `clearWatched`) and `WatchlistPage` (for the
  button). They are connected only through `useMovies` and `MoviesContext`,
  which is exactly the path the graph follows.
- D3 warns that changing `WatchlistPage`'s interface would affect its caller, `App`.
- Under *Related Components*, `AddMovieForm` shows `onAdd` four times. That is a
  known quirk of the retriever (a prop whose `isRequired` value is unknown, as
  is usual in JavaScript, is not de-duplicated), not four different props.

Generated on 2026-11-11 with `claude-sonnet-4-6` (condition `kg_augmented`), from
the code at the tasks' `git_commit`.

## Try a task by hand

```bash
cp tasks/tests/D2_clear_watched.test.jsx src/__tests__/
npx vitest run src/__tests__/D2_clear_watched.test.jsx   # fails
git apply tasks/patches/D2.diff
npx vitest run src/__tests__/D2_clear_watched.test.jsx   # passes
git checkout -- src && rm src/__tests__/D2_clear_watched.test.jsx   # undo
```

## Check every task

```bash
bash tasks/verify.sh
```
