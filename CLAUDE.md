@import docs/PRD.md
@import docs/PROJECT_STRUCTURE.md
@import docs/CODE_PATTERNS.md

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

---

## Architecture Decisions

1. **App Router only** — all routing uses `src/app/`. No Pages Router.
2. **Server Components by default** — only add `"use client"` when the component needs event handlers, React hooks, or browser APIs.
3. **Supabase RLS is the last line of defense** — every table has RLS policies. API routes verify auth, but RLS ensures correctness even if middleware is bypassed.
4. **Pure utilities in `src/lib/`** — business logic is pure TypeScript with zero React/Next.js imports.
5. **Template-based config generation** — deterministic, fast, no API costs.
6. **No ORM** — Supabase client handles all queries.
7. **Zod for all external input** — forms, API requests, URL params.
8. **Immutable patterns only** — spread operator, `.map()`, `.filter()`. Never mutate.

---

## Critical Rules

### Database (Supabase)
- All queries use Supabase client with RLS — **never bypass RLS**
- Use `select()` with **explicit column lists**, not `select('*')`
- All list queries **must include `.limit()`**
- Handle the `error` field on **every** query

### Authentication
- Use `createServerClient()` in server components and API routes
- Protected routes check `getUser()` — **never trust `getSession()` alone**
- Roles enforced at two layers: middleware (route-level) + RLS (row-level)

### TypeScript
- **No `any`** — use `unknown` and narrow with type guards
- **No enums** — use `as const` objects + union types
- **No type assertions (`as`)** unless unavoidable (add comment)
- Exported functions must have explicit return types

### React / Next.js
- **Server Components by default** — no `"use client"` unless interactivity is required
- **No `useEffect` for data fetching** — use async server components
- **No prop drilling >3 levels** — extract to context or composition

### Code Style
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- Functions: `camelCase`. Types: `PascalCase`. Constants: `UPPER_SNAKE_CASE`. DB columns: `snake_case`
- Tailwind utility classes only — no custom CSS files
- Conventional commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `style:`, `chore:`

### Security
- No secrets in `NEXT_PUBLIC_` environment variables
- No `dangerouslySetInnerHTML` without sanitization
- No `eval()`, `new Function()`, or `child_process.exec` with user input
- Validate all user input with Zod before processing
- Security headers configured in `next.config.ts`

---

## Testing Strategy

| Type | Location | Tool |
|------|----------|------|
| Unit | `src/lib/**/__tests__/` | Vitest |
| Component | `src/components/**/__tests__/` | Vitest + Testing Library |
| E2E | `e2e/` | Playwright |

**Coverage targets**: >80% lines, >70% branches, >80% functions

**TDD for `src/lib/`**: RED (failing test) → GREEN (minimal impl) → REFACTOR (improve). Separate commits at each step.

```bash
npm run test              # Run all unit tests
npm run test:coverage     # With coverage report
npm run test:e2e          # Playwright E2E tests
npm run typecheck         # tsc --noEmit
npm run lint              # ESLint
```

---

## Context Management

- Use `/compact` when context exceeds 90% — summarizes conversation to free up tokens
- Use `--continue` to resume after session breaks — picks up where you left off
- Delegate scoped tasks to subagents (code review, security scan) — keeps main context clean
- Read only what you need — use `offset`/`limit` on large files instead of reading entire files
- Keep MCP tools under 5 enabled at a time — each tool consumes context window

---

## Subagents

| Agent | When to Use |
|-------|------------|
| `tdd-guide` | Writing new features in `src/lib/` — enforces red-green-refactor |
| `planner` | Complex feature implementation — creates phased plan with file paths |
| `code-reviewer` | After implementing features — checks quality, security, conventions |
| `security-reviewer` | After writing auth, API, or input handling code — OWASP Top 10 scan |
| `database-reviewer` | After schema or query changes — RLS, performance, constraints |
| `typescript-reviewer` | Before merging PRs — type safety, async correctness, idiomatic patterns |

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=          # Server-only — NEVER expose to client
NEXT_PUBLIC_SENTRY_DSN=             # Sentry error tracking (Sprint 3)
```

---

## Git Workflow

- Feature branches from `main`, named `feat/<name>` or `fix/<name>`
- Conventional commits. All merges to `main` require PR with passing CI.
- CI gates: Lint → Typecheck → Test → Build → Security audit
- Deploy: Vercel preview on PR, production on merge to `main`

---

## Do NOT

- Use `any` type — use `unknown` and narrow
- Put business logic in components — extract to `src/lib/`
- Skip error handling on Supabase queries
- Use `dangerouslySetInnerHTML`
- Store secrets in `NEXT_PUBLIC_*` vars
- Bypass RLS with service role key in client code
- Use `useEffect` for initial data fetching
- Mutate arrays or objects — use spread/map/filter
- Commit `.env.local` or any file with secrets
- Use `select('*')` in Supabase queries
