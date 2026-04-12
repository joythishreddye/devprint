# Log: Comparison Engine — US-04

**Date:** 2026-03-22
**Branch:** `feat/tdd-comparison-engine`
**Author:** Claude (assisted)
**PRD Reference:** US-04 · Technology Comparison Engine (Core Logic)

---

## What was done

Verified, fixed, and confirmed the full comparison engine module at `src/lib/comparison/`.

### Files reviewed

| File | Status |
|------|--------|
| `src/lib/comparison/scoring.ts` | Already implemented |
| `src/lib/comparison/compare-technologies.ts` | Already implemented |
| `src/lib/comparison/summary.ts` | Already implemented |
| `src/lib/comparison/index.ts` | Already implemented — barrel exports all public functions |
| `src/types/comparison.ts` | Already implemented — `ComparisonResult`, `ComparisonSummary`, `CategoryScore`, `CATEGORY_WEIGHTS` |
| `src/types/database.ts` | Already implemented — `Technology` type used by comparison engine |

### Test files confirmed passing

| File | Tests |
|------|-------|
| `src/lib/comparison/__tests__/scoring.test.ts` | 27 tests |
| `src/lib/comparison/__tests__/compare-technologies.test.ts` | 8 tests |
| `src/lib/comparison/__tests__/summary.test.ts` | 9 tests |

**Total: 44 tests, all passing.**

---

## Bugs fixed

### 1. `vitest.config.ts` → `vitest.config.mts`

**Problem:** Vitest 3.x internally uses Vite, which requires ESM. The config file was named `.ts`, causing Node to load it as CommonJS (`require()`), which threw `ERR_REQUIRE_ESM`.

**Fix:** Renamed `vitest.config.ts` to `vitest.config.mts`. The `.mts` extension forces Node to treat the file as an ES module regardless of the project-level `"type"` field in `package.json`.

### 2. Default test environment changed from `jsdom` to `node`

**Problem:** The default `environment: 'jsdom'` caused `jsdom` to attempt loading CSS processing libraries (`@csstools/css-calc`, `@asamuzakjp/css-color`) that ship as ESM-only. This produced 3 unhandled errors before any test ran.

**Fix:** Changed default environment to `node` in `vitest.config.mts`. Added `environmentMatchGlobs` so that `src/components/**` and `src/app/**` tests still use `jsdom` when component tests are added.

```ts
environment: 'node',
environmentMatchGlobs: [
  ['src/components/**', 'jsdom'],
  ['src/app/**', 'jsdom'],
],
```

The comparison engine is pure TypeScript with no DOM dependency, so `node` is the correct environment for `src/lib/` tests.

---

## Comparison engine summary

### `scoring.ts` — raw score functions

| Function | Input | Output |
|----------|-------|--------|
| `scoreLearningCurve` | `'beginner' \| 'intermediate' \| 'advanced'` | 9 / 6 / 3 |
| `scoreCommunitySize` | `'large' \| 'medium' \| 'small'` | 9 / 6 / 3 |
| `scoreMaturity` | `'mature' \| 'growing' \| 'emerging' \| 'declining'` | 9 / 7 / 4 / 2 |
| `scoreGitHubStars` | `number \| null` | 3–10 (tiered thresholds) |
| `scoreNpmDownloads` | `number \| null` | 3–10 (tiered thresholds) |
| `normalizeScore` | `number` | Clamped to 0–10, 1 decimal place |

### `compare-technologies.ts` — core comparison

`compareTechnologies(techA, techB): ComparisonResult`

Computes 6 weighted category scores and returns:
- `categoryScores` — per-category normalized scores for both technologies
- `overallScoreA / overallScoreB` — weighted sum across all categories
- `winner` — `'A' | 'B' | 'tie'`

Category weights (must sum to 1.0):

| Category | Weight |
|----------|--------|
| `developer_experience` | 0.25 |
| `performance` | 0.20 |
| `community` | 0.15 |
| `learning_curve` | 0.15 |
| `ecosystem` | 0.15 |
| `maturity` | 0.10 |

### `summary.ts` — human-readable output

`generateComparisonSummary(result: ComparisonResult): ComparisonSummary`

Returns:
- `recommendation` — one-sentence verdict naming the winner (or indicating a tie)
- `advantages.techA / advantages.techB` — list of categories where each tech leads
- `tradeoffs` — categories with a score gap >= 1.5 points
- `bestFor.techA / bestFor.techB` — plain-language use-case guidance

---

## How to run

```bash
npm run test              # run all unit tests once
npm run test:coverage     # with coverage report
npm run test:watch        # watch mode during development
```

---

## Next steps

- **US-05** · Side-by-side comparison UI at `/compare` — wire `compareTechnologies` + `generateComparisonSummary` into the page
- **US-03** · Technology detail page — links to comparison from individual tech pages
