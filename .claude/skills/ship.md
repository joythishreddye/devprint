---
name: ship
description: Pre-merge quality gate for DevPrint. Runs lint, typecheck, coverage, and type-safety checks in order. Invokes typescript-reviewer only if all gates pass. Use before opening or merging any PR.
---

You are running the `/ship` skill for the DevPrint project. This skill is a strict, ordered quality gate. Each check must pass before moving to the next. Report results clearly.

## Usage

```
/ship
```

Run from any branch before opening a PR or merging to `main`.

---

## Gate 1: Lint

```bash
npm run lint
```

**Pass condition**: Zero errors, zero warnings.

If lint fails:
- Fix all errors automatically where safe (unused imports, formatting)
- For logic-related lint errors, explain the issue and fix with minimal change
- Never use `eslint-disable` without adding a comment explaining why
- Re-run until clean

**Report**: "Lint: PASS" or "Lint: FAIL — <N> errors, <M> warnings fixed"

---

## Gate 2: Type Check

```bash
npm run typecheck
```

**Pass condition**: Zero TypeScript errors (`tsc --noEmit` exits 0).

If typecheck fails:
- Fix type errors — do not use `any` or type assertions (`as`) to silence them
- Use `unknown` + type guards for truly unknown values
- Re-run until clean

**Banned fixes** (will cause this gate to re-fail):
- Adding `// @ts-ignore` or `// @ts-expect-error` without a comment
- Introducing `any` type to suppress errors
- Adding a type assertion `as SomeType` without a comment explaining why

**Report**: "Typecheck: PASS" or "Typecheck: FAIL — <list of errors fixed>"

---

## Gate 3: Test Coverage

```bash
npm run test:coverage
```

**Pass condition**: All tests pass AND coverage meets thresholds:
- Lines: ≥ 80%
- Branches: ≥ 70%
- Functions: ≥ 80%

If tests fail:
- Read the failure output carefully
- Fix the implementation (not the test) unless the test is genuinely wrong
- Never delete or skip tests to make coverage pass

If coverage is below threshold:
- Identify which files are under-covered (check the coverage report)
- Write additional tests for uncovered branches/lines
- Re-run until thresholds are met

**Report**:
```
Tests: PASS (<N> tests)
Coverage: Lines <X>% | Branches <Y>% | Functions <Z>%
```

---

## Gate 4: No `any` Types Introduced

Check that the current branch has not introduced new `any` types:

```bash
git diff main...HEAD -- '*.ts' '*.tsx' | grep '^\+' | grep -v '^\+\+\+' | grep ': any'
```

**Pass condition**: Zero new lines with `: any`.

If `any` types are found:
- Replace each with `unknown` and add a type guard, or use the correct specific type
- Re-run the diff check until clean

**Report**: "No new `any` types: PASS" or "No new `any` types: FAIL — fixed <N> occurrences"

---

## Gate 5: Build

```bash
npm run build
```

**Pass condition**: Next.js build exits 0 with no errors.

If build fails:
- Read the build output for the root cause (missing env vars are warnings, not errors)
- Fix import errors, missing modules, or type errors surfaced only at build time
- Re-run until clean

**Report**: "Build: PASS" or "Build: FAIL — <root cause and fix>"

---

## Gate 6: TypeScript Review (only if all gates above pass)

Invoke the `typescript-reviewer` subagent on all files changed in this branch:

```bash
git diff main...HEAD --name-only -- '*.ts' '*.tsx'
```

Pass that file list to the reviewer. The reviewer checks:
- Async correctness (unhandled promises, missing await)
- Type safety (narrowing, discriminated unions)
- Idiomatic patterns (const assertions, proper generics)

Resolve all HIGH severity findings. Document MEDIUM findings in the PR description.

---

## Completion Report

Print a final summary table:

```
/ship results for branch: <branch-name>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gate 1 — Lint           PASS / FAIL
Gate 2 — Typecheck      PASS / FAIL
Gate 3 — Coverage       PASS / FAIL  (Lines X% | Branches Y% | Functions Z%)
Gate 4 — No any types   PASS / FAIL
Gate 5 — Build          PASS / FAIL
Gate 6 — TS Review      PASS / FINDINGS (list findings)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: READY TO SHIP / BLOCKED
```

If overall is BLOCKED, list which gates failed and what must be fixed before the PR can be opened.

---

## Constraints

- Never skip a gate even if the previous gate had no issues
- Never silence errors with `eslint-disable`, `@ts-ignore`, or `any` — fix the root cause
- Never delete tests to make coverage pass
- Run gates in order — do not run Gate 6 if Gates 1–5 have not all passed
- If a gate repeatedly fails after 3 fix attempts, stop and report the blocker to the user
