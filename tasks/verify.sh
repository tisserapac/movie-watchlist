#!/usr/bin/env bash
# Checks every demo task (tasks/D*.yaml) in a throwaway git worktree:
#   1. at the task's git_commit, the task test FAILS;
#   2. the reference patch applies cleanly;
#   3. with the patch, the task test and the whole suite (npm test) PASS.
#
# Usage (from the repository root, after npm install):  bash tasks/verify.sh
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
if [ ! -d node_modules ]; then
  echo "Run npm install first." >&2
  exit 1
fi

WORK="$(mktemp -d)"
FAILED=0
trap 'git -C "$ROOT" worktree remove --force "$WORK/wt" >/dev/null 2>&1; rm -rf "$WORK"' EXIT

field() {  # field <yaml> <key>  -> first value of a top-level "key: value" line
  sed -n "s/^$2: *//p" "$1" | head -n1
}

test_dest() {  # the single entry under test_files:
  sed -n '/^test_files:/,/^[a-z_]*:/p' "$1" | sed -n 's/^ *- *//p' | head -n1
}

result() {  # result <ok?> <message>
  if [ "$1" = 0 ]; then echo "  PASS  $2"; else echo "  FAIL  $2"; FAILED=1; fi
}

fresh_worktree() {  # fresh_worktree <commit>
  git worktree remove --force "$WORK/wt" >/dev/null 2>&1
  git worktree add --detach --quiet "$WORK/wt" "$1"
  ln -s "$ROOT/node_modules" "$WORK/wt/node_modules"
}

run_task_test() {  # run_task_test <dest>   (inside the worktree)
  (cd "$WORK/wt" && npx vitest run "$1" >/dev/null 2>&1)
}

check_task() {  # check_task <yaml>
  local yaml="$1"
  local id commit patch src dest label
  id="$(field "$yaml" task_id)"
  commit="$(field "$yaml" git_commit)"
  patch="tasks/$(field "$yaml" reference_patch)"
  dest="$(test_dest "$yaml")"
  src="tasks/tests/$(basename "$dest")"
  label="$id"

  fresh_worktree "$commit"
  cp "$src" "$WORK/wt/$dest"

  echo "$label — $(field "$yaml" task_type)"
  run_task_test "$dest"; [ $? -ne 0 ]; result $? "task test fails before the patch"
  git -C "$WORK/wt" apply --check "$ROOT/$patch" 2>/dev/null; result $? "reference patch applies cleanly"
  git -C "$WORK/wt" apply "$ROOT/$patch" 2>/dev/null
  run_task_test "$dest"; result $? "task test passes with the patch"
  (cd "$WORK/wt" && npx vitest run >/dev/null 2>&1); result $? "whole suite passes with the patch"
}

for yaml in tasks/D*.yaml; do
  check_task "$yaml"
done

echo
if [ "$FAILED" = 0 ]; then echo "All task checks passed."; else echo "Some task checks FAILED."; fi
exit "$FAILED"
