# DevPrint — AI-Assisted Development Planning Platform

A production-grade web application that helps developers make informed technology stack decisions through interactive exploration, side-by-side comparisons, and intelligent configuration generation for AI coding tools.

**Built for:** CS 7180 (AI Assisted Coding) at Northeastern University  
**Built with:** Claude Code, Next.js 16, TypeScript, Supabase, Tailwind CSS  
**Deployed on:** [Vercel](https://devprint-delta.vercel.app/)

## Features

- **Interactive Technology Explorer** — Browse 50+ real technologies with pros/cons, learning curves, community stats
- **Side-by-Side Comparisons** — Compare any two technologies across 6 scoring dimensions with intelligent summaries
- **Project Wizard** — Step-by-step guided setup process for new projects, decision tree recommendations
- **Config Generation** — Auto-generate ready-to-use configuration files for Claude Code, Gemini CLI, and GitHub Copilot
- **Multi-Role Access** — Developers browse and plan, contributors submit new technologies, admins manage content
- **Production-Ready** — 8-stage CI/CD pipeline, comprehensive security hardening, error tracking, E2E testing

## Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- Supabase account (free tier works)

### Setup

```bash
# Clone and install
git clone https://github.com/joythishreddye/devprint.git
cd devprint
npm install

# Environment variables
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Seed database (optional, for demo data)
npx tsx scripts/seed.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
  app/              # Next.js App Router pages
    (auth)/         # Sign-in, sign-up
    admin/          # Admin dashboard (role-gated)
    api/            # API routes with caching
    contributor/    # Tech submission panel
    technology/     # Detail pages and listing
    wizard/         # Multi-step project setup
    compare/        # Side-by-side comparisons
  components/       # React components
  lib/
    comparison/     # Comparison engine (TDD-built, 100% coverage)
    generators/     # Config file templates
    supabase/       # Database queries and auth
    validators/     # Zod schemas for input validation
  types/            # Shared TypeScript types
evals/              # Code quality evaluation runners
.claude/            # Claude Code configuration
  skills/           # Custom /add-technology, /create-pr skills
  agents/           # Specialized reviewer agents
  settings.json     # Hooks and permissions
.github/workflows/  # 8-stage CI/CD pipeline
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (JWT) |
| Testing | Vitest (unit), Playwright (E2E) |
| CI/CD | GitHub Actions → Vercel |
| Monitoring | Sentry (errors), Vercel Analytics (perf) |
| Deployment | Vercel (preview + production) |

## Key Workflows

### For Developers
1. Browse technologies → Compare options → Run project wizard → Download config → Start coding with Claude Code

### For Contributors
1. Submit new technology → Admin reviews → Approved techs appear in explorer

### For Admins
1. Review pending submissions → Approve/reject → Manage content

## Development

```bash
# Install dependencies
npm install

# Run tests
npm run test              # Unit tests
npm run test:coverage     # With coverage report
npm run test:e2e          # E2E tests (requires local server)

# Type checking and linting
npm run typecheck
npm run lint
npm run lint:fix

# Build for production
npm run build
npm run start

# Database
npx tsx scripts/seed.ts   # Populate with demo technologies
```

## Testing

DevPrint maintains **70%+ test coverage** with:
- **Unit tests** for comparison engine, validators, config generators (Vitest)
- **Component tests** for interactive UI elements (Testing Library)
- **E2E tests** for critical user flows: auth, wizard, comparison, config export (Playwright)

Key test files:
- `src/lib/comparison/__tests__/` — comparison engine with red-green-refactor TDD history
- `src/lib/validators/__tests__/` — input validation with edge case coverage
- `e2e/` — full user workflow tests

## Security

DevPrint addresses all [OWASP Top 10](https://owasp.org/Top10/) categories:
- Row-level security (RLS) on all Supabase tables
- Input validation with Zod at API boundaries
- Secrets never exposed in client code
- Dependency scanning in CI (`npm audit`)
- Pre-commit secrets detection (Gitleaks)
- CSRF protection via HTTP-only session cookies

See `docs/SECURITY_AUDIT.md` for full details.

## CI/CD Pipeline

All PRs run through an 8-stage pipeline:
1. **Lint** (ESLint + Prettier)
2. **Typecheck** (`tsc --noEmit`)
3. **Unit tests** (vitest, >70% coverage gate)
4. **E2E tests** (Playwright)
5. **Security scan** (`npm audit` + Gitleaks)
6. **AI PR review** (Claude Code action)
7. **Preview deploy** (Vercel)
8. **Production deploy** (merge to main only)

## Claude Code Mastery

This project demonstrates advanced Claude Code extensibility features:

- **Custom Skills** — `/add-technology`, `/create-pr` (v1→v2 iteration documented)
- **Hooks** — PreToolUse lint enforcement, Stop test-runner on session end
- **MCP Servers** — Playwright integration via `.mcp.json`
- **Agents** — 6 specialized sub-agents (tdd-guide, planner, code-reviewer, security-reviewer, etc.)
- **Parallel Worktrees** — Multiple features developed simultaneously using `claude --worktree`
- **Writer/Reviewer Pattern** — PRs reviewed with C.L.E.A.R. framework + AI disclosure

See `CLAUDE.md` for implementation details.

## Deployment

DevPrint is deployed on Vercel with automatic preview deploys on every PR and production deploys on merge to `main`.

**Live URL:** [devprint.vercel.app](https://devprint.vercel.app)

## Documentation

- `CLAUDE.md` — Project conventions, architecture decisions, testing strategy
- `docs/ARCHITECTURE.md` — System design, data model, API structure
- `docs/SECURITY_AUDIT.md` — OWASP assessment and hardening details
- `docs/PARALLEL_DEVELOPMENT.md` — Worktree usage and parallel agent workflow

## Team

Created by **Joythish Reddy Evuri** and **Keeyon Hajjafar**

## License

MIT

---

Built with [Claude Code](https://claude.com/claude-code) — 100% AI-assisted development workflow with human review and refinement.

