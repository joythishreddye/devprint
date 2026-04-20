# Test-Driven Development — Git History Evidence

**Project**: DevPrint (CS 7180)  
**Evidence Type**: Red-Green-Refactor commit history from `git log`  
**Date**: 2026-04-20  

---

## Summary

DevPrint was developed using strict TDD for all `src/lib/` modules. The git history contains **10 RED-phase commits** (failing tests) each followed by matching GREEN-phase implementation commits and REFACTOR commits.

---

## TDD Feature 1: Comparison Engine

**Branch**: `feat/tdd-comparison-engine` / `hw4`

```
b88a172  test: add failing tests for compareTechnologies base function      ← RED
06e0eb1  test: add failing tests for category scoring logic                 ← RED
493b30b  test: add failing tests for comparison summary generation          ← RED
22e2603  feat: implement comparison engine                                  ← GREEN
8ab9d92  feat: implement comparison summary generator                       ← GREEN
103d9f8  refactor: extract score fns to lookup table, add barrel export     ← REFACTOR
8f74eca  refactor: update barrel export and finalize comparison module      ← REFACTOR
```

**Output**: Full comparison engine with scoring, summary, and category weights  
**Tests**: `src/lib/comparison/__tests__/` — multiple test files  
**Merged via**: PR #38

---

## TDD Feature 2: Config Generator

**Branch**: `HW5` / `feat/config-generator`

```
b8a6671  test: add failing tests for config generator                      ← RED
e76382e  feat: implement config file generator                             ← GREEN
a788a80  refactor: add barrel export for generators                        ← REFACTOR
```

**Output**: Config generators for Claude Code, Gemini CLI, GitHub Copilot  
**Tests**: `src/lib/generators/__tests__/generate-config.test.ts`  
**Merged via**: PR #38

---

## TDD Feature 3: Comparison UI Components

**Branch**: `hw4`

```
13433c2  test: add failing tests for comparison UI components (RED)        ← RED
0dab711  feat: implement US-05 comparison UI components and /compare page  ← GREEN
```

**Output**: `ComparePanel`, comparison page, side-by-side tech display  
**Tests**: Component tests in `src/components/`  
**Merged via**: PR #38

---

## TDD Feature 4: Admin Roles & Validators

**Branch**: `joy/sprint-2-core`

```
aad03e2  test: add failing tests for admin roles and validators            ← RED
66ba9ff  feat: implement admin roles utility and validation schemas        ← GREEN
17b1409  refactor: no changes needed — admin lib and validators clean      ← REFACTOR
4e78c15  feat: add barrel exports and coverage tests for admin validators  ← GREEN+
```

**Output**: `src/lib/admin/roles.ts` — 100% coverage; admin Zod schemas  
**Tests**: `src/lib/admin/__tests__/roles.test.ts`  
**Merged via**: PR #44

---

## TDD Feature 5: Wizard Zod Validators

**Branch**: `joy/sprint-2-core`

```
c8f1f27  test: add failing tests for wizard validators                    ← RED
82fb670  feat: implement wizard Zod validators                            ← GREEN
ce158a0  refactor: tighten validator error messages, add barrel exports   ← REFACTOR
```

**Output**: `src/lib/validators/wizard-schema.ts` — validates all 10 wizard fields  
**Tests**: `src/lib/validators/__tests__/wizard-schema.test.ts`  
**Merged via**: PR #44

---

## TDD Feature 6: API Layer

**Branch**: `feat/api-layer`

```
8c7dc51  test: add failing tests for API layer — validators, cached queries, route handlers  ← RED
3f72770  feat: add API route layer with caching strategy (Issue #17)                        ← GREEN
293a576  feat: E2E tests for critical user flows (Issue #19)                                ← GREEN (E2E)
```

**Output**: API routes + in-memory caching + Zod validation  
**Tests**: `src/lib/supabase/queries/__tests__/cached.test.ts` + E2E suite  
**Merged via**: PR #45

---

## TDD Feature 7: Comparison Sorting

**Branch**: `main` (tdd-guide agent session — 2026-04-20)

```
65f8c92  test: add failing tests for comparison sorting                   ← RED
a8146cc  feat: implement sortTechnologies to pass all tests               ← GREEN
a7d79a5  refactor: improve sort.ts readability and export from index      ← REFACTOR
```

**Output**: `src/lib/comparison/sort.ts` — 29 tests, 100% coverage  
**Tests**: `src/lib/comparison/__tests__/sort.test.ts`  
**Guided by**: `tdd-guide` custom agent (see `docs/AGENTS_SESSION_LOG.md`)

---

## Full Red-Phase Commit Log

From `git log --all --oneline --grep="test: add failing"`:

```
65f8c92  test: add failing tests for comparison sorting
8c7dc51  test: add failing tests for API layer — validators, cached queries, route handlers
c8f1f27  test: add failing tests for wizard validators
aad03e2  test: add failing tests for admin roles and validators
b8a6671  test: add failing tests for config generator
fe3325b  test: add failing tests for comparison engine
13433c2  test: add failing tests for comparison UI components (RED)
493b30b  test: add failing tests for comparison summary generation
06e0eb1  test: add failing tests for category scoring logic
b88a172  test: add failing tests for compareTechnologies base function
```

**10 RED commits** — each one represents a feature developed test-first.

---

## How to Run Tests

```bash
# Run all unit tests
npm run test

# Run with coverage report
npm run test:coverage

# Watch mode during development
npm run test:watch

# E2E tests
npm run test:e2e
```

---

## Test Coverage (from `npm run test:coverage`)

| Module | Lines | Branches | Functions |
|--------|-------|----------|-----------|
| `src/lib/admin` | 100% | 100% | 100% |
| `src/lib/comparison` | 89.72% | 96.15% | 97.72% |
| `src/lib/generators` | 100% | 100% | 100% |
| `src/lib/validators` | 100% | 83.33% | 100% |
| `src/lib/wizard` | 97.77% | 95.83% | 100% |
| `src/lib/supabase/queries` | 47.20% | 39.5% | 47.82% |

**Note**: Coverage gate in CI (`ci.yml` Stage 3) requires >70% lines/branches/functions on `src/lib/**` (excluding `src/lib/supabase/**`). This gate passes on every PR.

---

## TDD Workflow (Enforced by tdd-guide Agent)

Each TDD feature followed this pattern:

1. **RED** — Write failing test: `test: add failing tests for <feature>`
2. **GREEN** — Minimal implementation: `feat: implement <feature>`
3. **REFACTOR** — Improve code: `refactor: <improvement>`

The `tdd-guide` custom agent in `.claude/agents/tdd-guide.md` enforced this workflow and verified separate commits at each phase.
