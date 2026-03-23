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
