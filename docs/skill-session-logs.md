# `/add-feature` Skill — Session Logs & Iteration Evidence

## Overview

The `/add-feature` skill was tested on two real GitHub issues across two iterations (v1 → v2). This document captures the evidence: what broke in v1, what was fixed in v2, and the results of both runs.

---

## Skill v1 → v2: What Changed

### v1 (branch: `HW5-skillv1`)

Original skill had 9 phases but **no pre-flight checks**. This caused mid-run failures on both issue runs:

| Mid-run failure | Phase it hit | Time lost |
|----------------|-------------|-----------|
| `ERR_REQUIRE_ESM` — missing `"type": "module"` in `package.json` | Phase 3 (RED) | Tests couldn't run at all |
| `@vitest/coverage-istanbul` not installed | Phase 6 (Coverage) | Coverage gate blocked entirely |
| `// @vitest-environment node` not mentioned | Phase 3 | jsdom ESM conflict, had to debug manually |
| No explicit branch creation step | Phase 0 (didn't exist) | Worked directly on feature branch without a spec |
| Planner invocation was vague ("invoke planner subagent") | Phase 1 | Skipped in practice — no prompt template |
| No GitHub issue comment at completion | Phase 10 (didn't exist) | No evidence trail on the issue itself |

### v2 (branch: `HW5-skillv2`) — Changes Made

**Added Phase 0: Pre-flight Checks**
- `0a` — Branch guard: blocks if on `main` or `HW5`, creates `feat/<name>` branch
- `0b` — ESM check: detects missing `"type": "module"` and fixes before any test is written
- `0c` — Coverage provider check: detects missing `@vitest/coverage-istanbul` and installs it
- `0d` — Baseline test run: confirms nothing is broken before starting

**Added concrete planner prompt template** (Phase 1)
- Exact prompt structure with constraints and expected outputs
- Prevents the phase from being skipped or producing vague results

**Added `// @vitest-environment node` requirement** (Phase 3)
- Explicit instruction that all `src/lib/` test files must start with this comment
- Prevents jsdom/ESM conflicts with CSS dependencies

**Added commit steps at every phase** (Phases 2–6, 9)
- Each phase ends with a specific `git commit` with a conventional commit message
- Creates the red-green-refactor commit history the issues require

**Added Phase 10: Completion with GitHub comment**
- Creates a summary commit closing the issue
- Posts a structured comment to the GitHub issue with: what was built, files added, how to test, coverage table, how to review, commit history

---

## v1 Run Evidence — Mid-run Failures

### Issue #6 (Comparison Engine) — v1

**Phase 3 failure (RED):** Tests couldn't run due to missing ESM config.

```
> devprint@0.1.0 test
> vitest run

failed to load config from vitest.config.ts

Error [ERR_REQUIRE_ESM]: require() of ES Module
.../vitest/node_modules/vite/dist/node/index.js not supported.
```

Fix applied mid-run: added `"type": "module"` to `package.json`.

**Phase 6 failure (Coverage):**

```
> devprint@0.1.0 test:coverage
> vitest run --coverage

 MISSING DEPENDENCY  Cannot find dependency '@vitest/coverage-istanbul'
```

Fix applied mid-run: `npm install --save-dev @vitest/coverage-istanbul@^3.2.4 --legacy-peer-deps`

**Phase 6 failure (Coverage — version mismatch):**

```
SyntaxError: The requested module 'vitest/node' does not provide an export named 'BaseCoverageProvider'
```

Fix applied mid-run: downgraded to `@vitest/coverage-istanbul@^3.2.4` to match vitest 3.x.

### Issue #14 (Config Generator) — v1

Same ESM and coverage failures repeated — identical mid-run fixes needed again.

---

## v2 Run Evidence — Clean Runs

### Phase 0 output (both issues)

**Issue #6 — `feat/comparison-engine`:**

```
0a. Branch: feat/comparison-engine ✓ (created from HW5-skillv2)
0b. ESM check: MISSING → added "type": "module" to package.json ✓
0c. Coverage provider: MISSING → installed @vitest/coverage-istanbul@3.2.4 ✓
0d. Baseline: No test files found — clean slate ✓
```

**Issue #14 — `feat/config-generator`:**

```
0a. Branch: feat/config-generator ✓ (created from HW5-skillv2)
0b. ESM check: MISSING → added "type": "module" to package.json ✓
0c. Coverage provider: MISSING → installed @vitest/coverage-istanbul@3.2.4 ✓
0d. Baseline: No test files found — clean slate ✓
```

No mid-run failures on either issue. All fixes happened in Phase 0 before any code was written.

---

## Coverage Results

### Issue #6 — Comparison Engine (`feat/comparison-engine`)

```
 ✓ src/lib/comparison/__tests__/compare-technologies.test.ts (27 tests)

 % Coverage report from istanbul
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
 lib/comparison    |     100 |      100 |     100 |     100 |
  ...chnologies.ts |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|
```

### Issue #14 — Config Generator (`feat/config-generator`)

```
 ✓ src/lib/generators/__tests__/generate-config.test.ts (33 tests)

 % Coverage report from istanbul
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
 lib/generators    |     100 |      100 |     100 |     100 |
  ...ate-config.ts |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|
```

---

## Commit Histories

### Issue #6 — `feat/comparison-engine`

```
103d9f8 refactor: extract score fns to lookup table, add barrel export
22e2603 feat: implement comparison engine
fe3325b test: add failing tests for comparison engine
```

### Issue #14 — `feat/config-generator`

```
a788a80 refactor: add barrel export for generators
e76382e feat: implement config file generator
b8a6671 test: add failing tests for config generator
a25d9cb feat: add types for config generator
```

---

## Screenshots

All screenshots saved to `docs/screenshots/`:

| File | What it shows |
|------|--------------|
| `issue-6-full.png` | Issue #6 full page including implementation comment |
| `issue-6-comment.png` | Issue #6 — implementation comment with coverage table |
| `issue-14-full.png` | Issue #14 full page including implementation comment |
| `issue-14-comment.png` | Issue #14 — implementation comment with coverage table |

GitHub issue comments (permanent links):
- Issue #6: https://github.com/joythishreddye/devprint/issues/6#issuecomment-4187211615
- Issue #14: https://github.com/joythishreddye/devprint/issues/14#issuecomment-4187214448
