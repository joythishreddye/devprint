---
name: create-pr
description: Drafts and creates a GitHub pull request with a structured body including summary, C.L.E.A.R. review checklist, AI disclosure metadata, and conventional commit summary. Use before merging any feature branch.
---

You are running the `/create-pr` skill for the DevPrint project. Follow each step in order.

## Usage

```
/create-pr [base-branch]
```

Default base branch is `main` if not specified.

Example: `/create-pr` or `/create-pr HW5`

---

## Step 1: Gather branch context

```bash
git branch --show-current          # current (head) branch
git log --oneline <base>...HEAD    # commits being added
git diff <base>...HEAD --stat      # files changed
```

If the current branch is `main` or the base branch, stop and ask the user to switch to a feature branch first.

---

## Step 2: Run quality gates

Before creating the PR, all gates must pass:

```bash
npm run lint        # 0 errors
npm run typecheck   # 0 errors
npm run test        # all tests pass
```

If any gate fails, report which gate failed and what must be fixed. Do not create the PR until all gates pass.

---

## Step 3: Determine PR metadata

From the commit log and diff stat:

- **Title**: Concise summary under 70 characters, conventional commit prefix (`feat:`, `fix:`, `chore:`, etc.)
- **Issue number**: Look for `#NNN` references in commit messages or ask the user
- **Type**: `feature` / `fix` / `chore` / `refactor` / `docs`
- **Files changed**: List from `git diff --stat`
- **Test count**: From `npm run test` output
- **Coverage**: From most recent `npm run test:coverage` output if available

---

## Step 4: Draft PR body

Use this exact template:

```markdown
## Summary
- <bullet 1: what was built and why>
- <bullet 2: key technical decisions>
- <bullet 3: what was NOT included and why, if relevant>

## Changes
<paste git diff --stat output here>

## C.L.E.A.R. Review Checklist
- [ ] **C**orrect — logic is correct, edge cases handled, no off-by-one errors
- [ ] **L**egible — code is readable, names are descriptive, no magic numbers
- [ ] **E**fficient — no unnecessary re-renders, no N+1 queries, no blocking operations
- [ ] **A**dherent — follows project conventions (CLAUDE.md, TypeScript patterns, Supabase rules)
- [ ] **R**obust — error paths handled, inputs validated, RLS respected

## Test plan
- [ ] `npm run test` — all <N> tests pass
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] Manual: <describe the key thing to click/verify in the UI, or "N/A — pure lib change">

## AI Disclosure
| Field | Value |
|-------|-------|
| AI-generated | ~<X>% |
| Tool | Claude Code (claude-sonnet-4-6) |
| Human review | ✓ |
| Prompts reviewed | ✓ |

## Linked issues
Closes #<issue-number>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## Step 5: Create the PR

```bash
gh pr create \
  --repo joythishreddye/devprint \
  --base <base-branch> \
  --head <current-branch> \
  --title "<title>" \
  --body "<body from Step 4>"
```

---

## Step 6: Report

Print:
- PR URL
- Title
- Base → Head branch
- Number of commits included
- Gates passed (lint / typecheck / test)

---

## Constraints

- Never create a PR from `main` to `main`
- Never skip the quality gates — the PR body must reflect actual passing results
- AI disclosure percentage should be a honest estimate: 0% if human-written, ~80% if Claude wrote most of it with human review, ~100% if fully generated
- The C.L.E.A.R. checklist items are left unchecked — they are for the reviewer to complete
- If `gh` is not authenticated, instruct the user to run `gh auth login` first
