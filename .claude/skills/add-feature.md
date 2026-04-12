---
name: add-feature
description: Orchestrates the feature development loop — plan, TDD red-green-refactor, quality gates, and review. Use whenever adding a new feature to src/lib/, src/components/, or src/app/.
---

You are running the `/add-feature` skill for the DevPrint project. Follow each phase in order. Do not skip phases. Do not move to the next phase until the current phase is complete and verified.

## Usage

```
/add-feature <description of the feature to build>
```

Example: `/add-feature comparison engine that scores technologies by category weights`

---

## Phase 0: Pre-flight Checks

Run these checks before touching any code. If any check fails, fix it and re-verify before continuing.

**0a. Branch guard — never work directly on main or HW5.**

```bash
git branch --show-current
```

If the current branch is `main` or `HW5`, stop and create a feature branch first:

```bash
git checkout -b feat/<feature-name>
```

Use kebab-case for the branch name matching the feature (e.g. `feat/comparison-engine`, `feat/config-generator`).

**0b. ESM config check.**

```bash
node -e "import('./package.json', { assert: { type: 'json' } }).then(m => console.log(m.default.type))"
```

If output is not `module`, add `"type": "module"` to `package.json` at the top level before scripts.

**0c. Coverage provider check.**

```bash
node -e "import('./node_modules/@vitest/coverage-istanbul/package.json', { assert: { type: 'json' } }).then(m => console.log('found:', m.default.version)).catch(() => console.log('MISSING'))"
```

If output is `MISSING`, install it:

```bash
npm install --save-dev @vitest/coverage-istanbul@^3.2.4 --legacy-peer-deps
```

**0d. Baseline test run.**

```bash
npm run test
```

All existing tests must pass before starting. If any fail, investigate and fix before continuing — do not add new features on a broken baseline.

**Report**: List each check and its result before moving to Phase 1.

---

## Phase 1: Plan

Invoke the `planner` subagent with the following prompt structure (fill in `<FEATURE>` and `<ISSUE_DETAILS>`):

```
Plan the implementation of: <FEATURE>

Issue details:
<ISSUE_DETAILS>

Constraints:
- This is a src/lib/ pure TypeScript module — zero React/Next.js imports
- Tests live in src/lib/<module>/__tests__/<file>.test.ts
- All test files must start with // @vitest-environment node on line 1
- Follow the project's immutable patterns (spread, map, filter — no mutation)
- Use as const objects instead of enums
- No any types — use unknown + type guards
- Exported functions must have explicit return types

Produce:
1. Ordered implementation steps with exact file paths
2. Type definitions needed in src/types/
3. Functions to export from the module
4. Edge cases to test (null inputs, empty arrays, boundary values)
```

**Gate**: Plan must include at least 3 steps with exact file paths before proceeding.

---

## Phase 2: Types First

Before writing any logic, define or update the TypeScript types in `src/types/`.

- No `any` — use `unknown` and narrow with type guards
- No enums — use `as const` objects + union types
- Exported types must have explicit names (no anonymous inline types)

Run: `npm run typecheck` — must pass with zero errors before continuing.

**Commit**: `feat: add types for <feature>`

---

## Phase 3: TDD — Red (Failing Tests)

Write failing tests **before any implementation**. All test files in `src/lib/` must begin with:

```typescript
// @vitest-environment node
```

This prevents ESM/jsdom conflicts with CSS dependencies.

Tests live in `src/lib/<module>/__tests__/<file>.test.ts`.

Tests must cover:
- Happy path
- Null/undefined inputs
- Empty arrays/strings
- Boundary values
- Error paths

Run: `npm run test` — tests **must fail** at this point (confirms they are real tests, not vacuous passes).

**Commit**: `test: add failing tests for <feature>`

---

## Phase 4: TDD — Green (Minimal Implementation)

Write the minimal implementation to make all tests pass. No extra logic, no future-proofing.

- Business logic in `src/lib/` only — never in components or pages
- Pure TypeScript with zero React/Next.js imports in `src/lib/`
- Follow Supabase query pattern from CLAUDE.md if DB is involved
- Validate all external input with Zod

Run: `npm run test` — all tests **must pass**.

**Commit**: `feat: implement <feature>`

---

## Phase 5: TDD — Refactor

Improve the implementation without changing behavior. Remove duplication, improve names, extract helpers.

Run: `npm run test` — must still pass after every change.

**Commit**: `refactor: <what you improved>`

---

## Phase 6: Coverage Gate

Run: `npm run test:coverage`

**Required thresholds** for the module under development:
- Lines: ≥ 80%
- Branches: ≥ 70%
- Functions: ≥ 80%

If coverage is below threshold: write additional tests before continuing. **Do not proceed with failing coverage.**

Add a barrel export at `src/lib/<module>/index.ts` if it does not exist.

**Commit**: `feat: add barrel export for <module>`

---

## Phase 7: Wire Up (Components / Pages)

If the feature requires UI:
- Server Component by default — only add `"use client"` if the component needs event handlers, hooks, or browser APIs
- Props interface named `ComponentNameProps`, exported
- One component per file, filename matches component name (PascalCase.tsx)
- No prop drilling more than 3 levels — extract to context or composition

Run: `npm run typecheck && npm run lint` — must pass.

**Commit**: `feat: wire up <feature> UI`

---

## Phase 8: Code Review

Invoke the `code-reviewer` subagent on all new/modified files.

If the feature touches:
- Authentication → also invoke `security-reviewer`
- API routes → also invoke `security-reviewer`
- Database schema or queries → also invoke `database-reviewer`

Resolve all HIGH and MEDIUM severity findings before committing.

---

## Phase 9: Final Gate

Run the full CI check:

```bash
npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

All four commands must exit with code 0. If any fail, fix before considering the feature done.

**Commit**: `chore: final gate pass for <feature>`

---

## Phase 10: Completion

Create a summary commit that closes the issue:

```bash
git add <all new and modified files>
git commit -m "feat: <feature summary>

Implements #<issue-number>: <issue title>

Files added:
- <list each new file>

Tests: <N> tests, 100% coverage on lib/<module>"
```

Then post a comment to the GitHub issue summarizing the work using `gh`:

```bash
gh issue comment <issue-number> --repo <owner>/<repo> --body "$(cat <<'EOF'
## Implementation Complete

**Branch**: `feat/<feature-name>`

### What was built
<2-3 sentence summary of what the feature does and where the code lives>

### Files added
- `<file path>` — <one-line description>
- `<file path>` — <one-line description>

### How to test
\`\`\`bash
npm run test                         # run all tests
npm run test:coverage                # view coverage report
\`\`\`

### Coverage
| Module | Statements | Branches | Functions | Lines |
|--------|-----------|---------|-----------|-------|
| `lib/<module>` | X% | X% | X% | X% |

### How to review
\`\`\`bash
git checkout feat/<feature-name>
git diff main...HEAD -- src/lib/<module>/
\`\`\`
EOF
)"
```

Finally, report back in the conversation:
1. Branch name
2. Files created/modified (with line counts)
3. Test count added
4. Coverage % for the new module
5. Any findings from code/security review and how they were resolved
6. Commit history for this feature (`git log --oneline`)

---

## Constraints

- Never skip Phase 0 — it prevents the most common mid-run failures
- Never skip Phase 3 (failing tests) — this is the most important phase
- All `src/lib/` test files must start with `// @vitest-environment node`
- Never use `select('*')` in Supabase queries — always name columns explicitly
- Never add `"use client"` to a component that does not need interactivity
- Never commit `.env.local` or any file containing secrets
- Coverage must not drop below 80% lines from the baseline before this feature
- No `any` types introduced — CI will catch these via strict TypeScript
- Do not merge or push to `main` — leave on feature branch for PR review
