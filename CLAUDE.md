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

## Project Structure

```
src/
  app/                              # Next.js App Router pages
    (auth)/sign-in, sign-up         # Auth pages (Supabase Auth)
    admin/                          # Admin panel (role-gated via middleware)
    api/
      health/route.ts               # Health check — { status, db, timestamp, responseTime }
      generate-config/route.ts      # Config file generation endpoint
    contributor/                    # Contributor submission panel
    technology/[slug]/page.tsx      # Technology detail page (server component)
    technologies/page.tsx           # Technology listing with filters
    wizard/                         # Multi-step project wizard
    compare/                        # Side-by-side comparison page
    layout.tsx                      # Root layout with providers
    page.tsx                        # Landing page
  components/
    ui/                             # Reusable primitives (Button, Card, Input, Badge)
    technology/                     # TechnologyCard, TechnologyStats, ProsCons
    wizard/                         # WizardStep, WizardSummary, WizardNav
    admin/                          # SubmissionQueue, EvalDashboard
    layout/                         # Header, Footer, Sidebar
  lib/
    supabase/
      client.ts                     # Browser client (createClient)
      server.ts                     # Server client (createServerClient)
      queries/                      # Typed query functions (getTechnologyBySlug, etc.)
    comparison/                     # Comparison engine — PURE TS, TDD
      __tests__/                    # Vitest tests for comparison logic
      compare-technologies.ts       # Core comparison function
    generators/                     # Config file template generators
    wizard/                         # Wizard state logic + recommendations
    monitoring/                     # Sentry init, structured logging
    validators/                     # Zod schemas for input validation
  types/
    database.ts                     # Supabase Database type + table interfaces
    comparison.ts                   # ComparisonResult, CategoryScore, CATEGORY_WEIGHTS
  hooks/                            # Custom React hooks (useDebounce, etc.)
evals/                              # Eval system (code quality, LLM-as-judge, reports)
  runners/                          # Eval runner scripts
  results/                          # Historical eval results
docs/                               # PRD, security audit, reflections
scripts/
  schema.sql                        # Supabase schema with RLS policies
  seed.ts                           # Seed 12+ real technology entries
.github/workflows/
  ci.yml                            # Lint → typecheck → test → build → security audit
.claude/
  agents/                           # Specialized subagents (tdd-guide, planner, etc.)
  rules/                            # TypeScript and React/Next.js pattern rules
  settings.json                     # Permissions, hooks, safety guards
```

---

## Critical Rules

### Database (Supabase)
- All queries use `@supabase/supabase-js` with RLS — **never bypass RLS**
- Schema changes go in `scripts/schema.sql` — never modify the database directly in production
- Use `select()` with **explicit column lists**, not `select('*')`
- All list queries **must include `.limit()`** to prevent unbounded results
- Use `.single()` only when exactly one row is expected; `.maybeSingle()` when row may not exist
- Handle the `error` field on **every** query — never destructure only `data`

### Authentication
- Use `createServerClient()` in server components and API routes
- Use `createClient()` (browser client) only in `"use client"` components
- Protected routes check `getUser()` — **never trust `getSession()` alone**
- Roles enforced at two layers: middleware (route-level) + RLS (row-level)
- Never store or log JWT tokens

### TypeScript
- **No `any` type** — use `unknown` and narrow with type guards
- **No enums** — use `as const` objects + union types
- **No type assertions (`as`)** unless absolutely unavoidable (add comment explaining why)
- Exported functions must have explicit return types
- Prefer `interface` for object shapes, `type` for unions/intersections
- All types live in `src/types/` — import with `@/types/...`

### React / Next.js
- **Server Components by default** — no `"use client"` unless interactivity is required
- **No `useEffect` for data fetching** — use async server components
- **No prop drilling >3 levels** — extract to context or composition
- One component per file, file name matches component name
- Props interfaces named `ComponentNameProps`

### Code Style
- No emojis in code or comments
- `const` over `let`, never `var`
- Immutable patterns only — spread operator, never mutate
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- Functions: `camelCase`. Types: `PascalCase`. Constants: `UPPER_SNAKE_CASE`. DB columns: `snake_case`
- Tailwind utility classes only — no custom CSS files
- Conventional commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `style:`, `chore:`

### Security
- No secrets in `NEXT_PUBLIC_` environment variables
- No `dangerouslySetInnerHTML` without sanitization
- No `eval()`, `new Function()`, or `child_process.exec` with user input
- Validate all user input with Zod before processing
- Rate limit API routes that accept user input
- Security headers configured in `next.config.ts`

---

## Testing Strategy

| Type | Location | What to Test | Tool |
|------|----------|-------------|------|
| Unit | `src/lib/**/__tests__/` | Pure utility functions — comparison engine, generators, validators | Vitest |
| Component | `src/components/**/__tests__/` | Interactive UI components with user events | Vitest + Testing Library |
| E2E | `e2e/` | Critical user flows (auth, wizard, compare, generate config) | Playwright |

### Coverage Targets
- **Lines**: >80%
- **Branches**: >70%
- **Functions**: >80%

### TDD Workflow (for `src/lib/`)
Strict red-green-refactor with separate commits at each step:
1. **RED**: Write failing test → commit `test: add failing tests for <feature>`
2. **GREEN**: Minimal implementation → commit `feat: implement <feature>`
3. **REFACTOR**: Improve code, tests stay green → commit `refactor: <improvement>`

### Running Tests
```bash
npm run test              # Run all unit tests once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:e2e          # Playwright E2E tests
npm run typecheck         # tsc --noEmit
npm run lint              # ESLint
```

---

## Key Patterns

### API Response Format
```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
```

### Supabase Query Pattern
```typescript
const { data, error } = await supabase
  .from('technologies')
  .select('id, name, slug, category, description, github_stars')
  .eq('category', category)
  .order('name')
  .limit(50);

if (error) {
  console.error('Failed to fetch technologies:', error);
  return { success: false, error: 'Failed to fetch technologies' };
}
return { success: true, data };
```

### Server Action Pattern
```typescript
'use server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const schema = z.object({ name: z.string().min(1).max(100) });

export async function createPlan(formData: FormData) {
  const parsed = schema.safeParse({ name: formData.get('name') });
  if (!parsed.success) return { success: false, error: parsed.error.flatten() };

  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('project_plans')
    .insert({ name: parsed.data.name, user_id: user.id, selections: {}, config_data: {} })
    .select('id, name, created_at')
    .single();

  if (error) return { success: false, error: 'Failed to create plan' };
  return { success: true, data };
}
```

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
