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

## Phase 0: Pre-flight

**Branch guard** — never work directly on `main`:

```bash
git branch --show-current
```

If on `main`, create a feature branch first: `git checkout -b feat/<feature-name>` (kebab-case).

**Baseline test run**:

```bash
npm run test
```

All existing tests must pass before starting. Fix any failures before continuing.

**Report**: List each check and its result before moving to Phase 1.

---

## Phase 1: Plan

Invoke the `planner` subagent with the following prompt (fill in `<FEATURE>` and `<ISSUE_DETAILS>`):

```
Plan the implementation of: <FEATURE>

Issue details:
<ISSUE_DETAILS>

Constraints:
- Pure TypeScript module in src/lib/ — zero React/Next.js imports
- Tests live in src/lib/<module>/__tests__/<file>.test.ts
- All test files must start with // @vitest-environment node on line 1
- Follow CLAUDE.md conventions (immutable patterns, no any, no enums, explicit return types)

Produce:
1. Ordered implementation steps with exact file paths
2. Type definitions needed in src/types/
3. Functions to export from the module
4. Edge cases to test (null inputs, empty arrays, boundary values)
```

**Gate**: Plan must include at least 3 steps with exact file paths before proceeding.

---

## Phase 2: Types First

Define or update types in `src/types/`. Follow CLAUDE.md TypeScript rules.

Run `npm run typecheck` — must pass with zero errors before continuing.

**Commit**: `feat: add types for <feature>`

---

## Phase 3: TDD — Red (Failing Tests)

Write failing tests **before any implementation**. All test files in `src/lib/` must begin with:

```typescript
// @vitest-environment node
```

Tests must cover:
- Happy path
- Null/undefined inputs
- Empty arrays/strings
- Boundary values
- Error paths

Run `npm run test` — tests **must fail** at this point (confirms they are real tests, not vacuous passes).

**Commit**: `test: add failing tests for <feature>`

---

## Phase 4: TDD — Green (Minimal Implementation)

Write minimal implementation to make all tests pass. No extra logic, no future-proofing.

Run `npm run test` — all tests **must pass**.

**Commit**: `feat: implement <feature>`

---

## Phase 5: TDD — Refactor

Improve without changing behavior. Remove duplication, improve names, extract helpers.

Run `npm run test` — must still pass after every change.

**Commit**: `refactor: <what you improved>`

---

## Phase 6: Coverage Gate

Run `npm run test:coverage`.

**Required thresholds** for the module under development:
- Lines: ≥ 80%
- Branches: ≥ 70%
- Functions: ≥ 80%

If below threshold, write additional tests before continuing. **Do not proceed with failing coverage.**

Add a barrel export at `src/lib/<module>/index.ts` if it does not exist.

**Commit**: `feat: add barrel export for <module>`

---

## Phase 7: Wire Up (Components / Pages)

If the feature requires UI, follow `.claude/rules/react-nextjs-patterns.md`.

Run `npm run typecheck && npm run lint` — must pass.

**Commit**: `feat: wire up <feature> UI`

---

## Phase 8: Code Review

Invoke the `code-reviewer` subagent on all new/modified files.

If the feature touches:
- Authentication or API routes → also invoke `security-reviewer`
- Database schema or queries → also invoke `database-reviewer`

Resolve all HIGH and MEDIUM severity findings before continuing.

---

## Phase 9: Final Gate

```bash
npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

All four commands must exit with code 0. Fix any failures before considering the feature done.

---

## Phase 10: Completion

Commit all remaining changes:

```bash
git commit -m "feat: <feature summary>

Implements #<issue-number>: <issue title>"
```

Post a comment to the GitHub issue:

```bash
gh issue comment <issue-number> --repo <owner>/<repo> --body "$(cat <<'EOF'
## Implementation Complete

**Branch**: `feat/<feature-name>`

### What was built
<2-3 sentence summary of what the feature does and where the code lives>

### Files added
- `<path>` — <one-line description>

### Coverage
| Module | Lines | Branches | Functions |
|--------|-------|----------|-----------|
| `lib/<module>` | X% | X% | X% |

### How to review
\`\`\`bash
git checkout feat/<feature-name>
git diff main...HEAD -- src/lib/<module>/
\`\`\`
EOF
)"
```

Report back in the conversation:
1. Branch name
2. Files created/modified (with line counts)
3. Test count added
4. Coverage % for the new module
5. Findings from code/security review and how they were resolved
6. Commit history (`git log --oneline`)
