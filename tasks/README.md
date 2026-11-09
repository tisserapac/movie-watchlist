# Demo tasks

Three code-generation tasks for the live demo of *Knowledge Graphs for React
Code Generation* (Stage 2: generating code with the graph). They use the same
format as the pilot tasks in `codebase-kg` (`tasks/pilot/P*.yaml`).

| Task | Type | In one line | Anchors |
| --- | --- | --- | --- |
| [D1](D1.yaml) | bug_fix | Deleting a movie also deletes other movies with the same title | `MoviesProvider` |
| [D2](D2.yaml) | feature_addition | Add a "Clear watched" button | `WatchlistPage`, `MoviesProvider`, `useMovies` |
| [D3](D3.yaml) | refactoring | Move the filter logic into a `useMovieFilter` hook | `WatchlistPage` |

The D1 bug is **planted on purpose** in this version of the app (commit
`30f2bb6`). The `extended` tag has the correct code.

## Files

- `D*.yaml`: the task: spec, expected anchors, base commit (`git_commit`), test and files.
- `tests/`: one test per task. It is copied to the path in `test_files`
  (under `src/__tests__/`) before a candidate edit is applied. It **fails** at
  `git_commit` and **passes** with the reference patch.
- `patches/`: the reference solution of each task, as a git diff.
- `verify.sh`: checks all of the above in a throwaway git worktree.

`npm test` only runs `src/**/*.test.*`, so these task tests never run by
accident. The `codebase-kg` extractor ignores this folder's contents:
`*.test.*` files are excluded, and `.yaml`, `.diff` and `.sh` files are never read.

## Try a task by hand

```bash
cp tasks/tests/D1_delete_only_selected_movie.test.jsx src/__tests__/
npx vitest run src/__tests__/D1_delete_only_selected_movie.test.jsx   # fails
git apply tasks/patches/D1.diff
npx vitest run src/__tests__/D1_delete_only_selected_movie.test.jsx   # passes
git checkout -- src && rm src/__tests__/D1_delete_only_selected_movie.test.jsx   # undo
```

## Check every task

```bash
bash tasks/verify.sh
```
