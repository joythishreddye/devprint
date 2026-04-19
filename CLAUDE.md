@import docs/PRD.md

# DevPrint — Claude Code Configuration

## Project Overview

DevPrint is a development planning platform that helps developers compare technologies, plan projects via an interactive wizard, and generate config files for AI coding tools (Claude Code, Gemini CLI, Copilot). Built with Next.js 16, TypeScript, Supabase, and Tailwind CSS.

**Repository**: `devprint-app/devprint`
**Deploy target**: Vercel (production: `devprint.vercel.app`)
**Team**: Joy Thishevuri, Keeyon

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16 |
| Runtime | React | 19 |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS | v4 |
| Database | Supabase (PostgreSQL + RLS) | Latest |
| Auth | Supabase Auth (JWT) | Latest |
| Validation | Zod | 4.x |
| Unit Testing | Vitest + Testing Library | 3.x |
| E2E Testing | Playwright | 1.x |
| CI/CD | GitHub Actions → Vercel | — |
| Error Tracking | Sentry (@sentry/nextjs) | — |
| Web Vitals | Vercel Analytics | — |
| Uptime | UptimeRobot | — |

---

## Architecture Decisions

1. **App Router only** — all routing uses `src/app/`. No Pages Router.
2. **Server Components by default** — only add `"use client"` when the component needs event handlers, React hooks, or browser APIs. If a component only renders JSX with props, it is a server component.
3. **Supabase RLS is the last line of defense** — every table has Row Level Security policies. API routes verify auth, but RLS ensures data access is correct even if middleware is bypassed.
4. **Pure utilities in `src/lib/`** — business logic (comparison engine, config generators, validators) is pure TypeScript with zero React/Next.js imports. This makes it trivially testable.
5. **Template-based config generation** — config files are generated from templates, not LLM calls. Deterministic, fast, no API costs.
6. **No ORM** — Supabase client handles all queries. The schema is simple enough that an ORM adds complexity without benefit.
7. **Zod for all external input** — forms, API requests, URL params. Validated before processing.
8. **Immutable patterns only** — spread operator, `.map()`, `.filter()`. Never mutate arrays or objects.

---

@import docs/PROJECT_STRUCTURE.md

---

@import docs/CRITICAL_RULES.md

---

@import docs/TESTING_STRATEGY.md

---

@import docs/KEY_PATTERNS.md

---

## Subagents

Specialized agents in `.claude/agents/` for delegation:

| Agent | When to Use |
|-------|------------|
| `tdd-guide` | Writing new features in `src/lib/` — enforces red-green-refactor |
| `planner` | Complex feature implementation — creates phased plan with file paths |
| `code-reviewer` | After implementing features — checks quality, security, conventions |
| `security-reviewer` | After writing auth, API, or input handling code — OWASP Top 10 scan |
| `database-reviewer` | After schema or query changes — RLS, performance, constraints |
| `typescript-reviewer` | Before merging PRs — type safety, async correctness, idiomatic patterns |

---

## Workflow Commands

```bash
# Planning a feature
# Use planner agent to break down into phases → implement → review

# TDD workflow (for src/lib/ modules)
# 1. Write failing test  2. Implement  3. Refactor  4. Repeat

# Before committing
npm run lint && npm run typecheck && npm run test

# Before merging
# Use code-reviewer agent, then security-reviewer agent

# Full CI check (mirrors GitHub Actions)
npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

---

## Environment Variables

```bash
# Required — Supabase
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=          # Server-only — NEVER expose to client

# Optional — Monitoring (Sprint 3)
NEXT_PUBLIC_SENTRY_DSN=             # Sentry error tracking
SENTRY_AUTH_TOKEN=                  # Sentry source maps upload

# Optional — CI
VERCEL_TOKEN=                       # Vercel deploy from CI
```

---

## Git Workflow

- **Branching**: Feature branches from `main`, named `feat/<name>` or `fix/<name>`
- **Commits**: Conventional commits — `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- **PRs**: All merges to `main` require PR with passing CI
- **CI gates**: Lint → Typecheck → Test → Build → Security audit
- **Deploy**: Vercel preview on PR, production on merge to `main`

---

## Do NOT

- Use `any` type — use `unknown` and narrow
- Put business logic in components — extract to `src/lib/`
- Skip error handling on Supabase queries
- Use `dangerouslySetInnerHTML`
- Store secrets in `NEXT_PUBLIC_*` vars
- Bypass RLS with service role key in client code
- Use `eslint-disable` without a comment explaining why
- Use `useEffect` for initial data fetching
- Mutate arrays or objects — use spread/map/filter
- Commit `.env.local` or any file with secrets
- Use `select('*')` in Supabase queries
- Add dependencies without checking if native APIs suffice
