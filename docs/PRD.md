# DevPrint — Product Requirements Document

**Version:** 1.0
**Date:** March 21, 2026
**Team Size:** 2 engineers
**Timeline:** 3 sprints + 1 buffer week (Mar 20 – Apr 19)
**Stack:** Next.js 16 + TypeScript + Tailwind CSS + Supabase (PostgreSQL + Auth)

---

## 1. Executive Summary

### 1.1 Vision

DevPrint is a development planning platform that guides developers through technology decisions with data-driven comparisons and generates ready-to-use configuration files for AI coding tools (Claude Code, Gemini CLI, GitHub Copilot). Instead of scattered blog posts and Reddit opinions, DevPrint provides structured, side-by-side analysis backed by real metrics — GitHub stars, npm downloads, community size — and translates chosen stacks into tool-specific config files so developers can start building immediately.

### 1.2 Target Users

Developers — from students starting their first full-stack project to professionals evaluating new frameworks — who want to make informed technology choices without spending hours on research. Secondary users include community contributors who submit technology entries and admins who curate content quality.

### 1.3 Key Insight

The gap is not information — there are thousands of "React vs. Vue" blog posts. The gap is **structured, actionable output**. Developers read five comparison articles, form an opinion, and then still have to manually configure their editor, linter, AI tools, and project structure. DevPrint closes the loop: compare → decide → generate config → start coding.

### 1.4 Success Criteria

- Users can complete the full flow (browse → compare → wizard → download config) in under 5 minutes
- Technology comparison scores align with developer consensus (validated via user testing)
- Generated config files are immediately usable without manual editing
- Community contributors submit 10+ technology entries within the first month of launch

---

## 2. Problem Statement

Developers starting new projects face a compounding decision problem. First, they must choose a tech stack — framework, language, database, styling, deployment — from hundreds of options. Second, once they've decided, they must configure their development environment and AI coding tools for that specific stack. These are two separate problems, but every existing tool addresses only one:

- **Comparison resources** (blog posts, Reddit, StackOverflow) are fragmented, subjective, and stale within months. A "Best Frameworks of 2025" post doesn't tell you whether that framework fits your specific project constraints.
- **AI tool configurations** (CLAUDE.md, .github/copilot-instructions.md, .gemini) are written from scratch for every project. Most developers copy-paste from previous projects and tweak, missing tool-specific best practices.

No single platform connects the decision (which technologies?) to the output (configured project). DevPrint bridges this gap.

---

## 3. Mom Test — Customer Discovery Simulations

The following simulated interviews follow The Mom Test methodology (Fitzpatrick): asking about past behavior and real problems rather than pitching the idea or soliciting opinions about the future.

---

### Interview 1 — Junior Developer Starting a Side Project

**Interviewer:** Walk me through the last time you started a new project from scratch.

**Developer:** "I wanted to build a portfolio site with a blog. I knew I wanted React but then I spent like three hours reading about Next.js versus Remix versus Astro. Every blog post said something different. One said Remix was the future, another said Astro was better for content sites."

**Interviewer:** What did you end up doing?

**Developer:** "I just went with Next.js because I'd used it before. I didn't actually feel confident it was the best choice, I was just tired of reading comparisons."

**Interviewer:** After you picked the stack, how long before you were actually writing feature code?

**Developer:** "Probably another two hours? I had to set up ESLint, Tailwind, configure TypeScript strict mode. And then I started using Copilot but it kept suggesting patterns that didn't match my project structure. I didn't know you could give it a config file."

**Interviewer:** If you could change one thing about that process, what would it be?

**Developer:** "I wish someone had just said: for a content site with a blog, use X, and here's the config files. Like a recipe instead of a buffet."

> **Key Insights:**
> - Decision fatigue is real — developer defaulted to familiarity, not fit.
> - Setup time after choosing a stack is a separate, significant pain point.
> - Developer didn't know AI tool config files existed (CLAUDE.md, copilot-instructions).
> - **Mom Test signal:** Developer spent 5+ hours on a problem they've encountered before and will encounter again. They have already searched for solutions (blog posts) and found them inadequate.

---

### Interview 2 — Senior Engineer Evaluating Frameworks for a Team

**Interviewer:** Tell me about the last time you had to make a technology decision for your team.

**Engineer:** "We were migrating off an old Express backend and I had to choose between Fastify, NestJS, and Hono. I made a spreadsheet — GitHub stars, last commit date, bundle size, TypeScript support. Took me most of a day."

**Interviewer:** What information was hardest to find?

**Engineer:** "The qualitative stuff. Like, how's the developer experience? How mature is the plugin ecosystem? I can look up GitHub stars in 10 seconds but 'is this pleasant to work with' requires reading forums, watching conference talks, trying it out."

**Interviewer:** What happened after you made the choice?

**Engineer:** "I wrote a one-page justification doc for the team. Then I realized three of us were using Claude Code and none of us had a CLAUDE.md file. We were all getting different suggestions from the AI. I spent another hour writing a shared config."

**Interviewer:** How often do you go through this process?

**Engineer:** "Every new microservice. So maybe 3-4 times a year. It's not fun."

> **Key Insights:**
> - Even senior engineers manually build comparison spreadsheets — no tool does this well.
> - Qualitative factors (DX, ecosystem maturity) are the hardest to evaluate and the most important.
> - AI tool configuration is a team-level problem, not just individual.
> - **Mom Test signal:** This is a recurring problem (3-4x/year) with measurable time cost (full day). The engineer has already built their own solution (spreadsheet), confirming the problem is worth solving.

---

### Interview 3 — CS Graduate Student in a Project-Based Course

**Interviewer:** You're starting a team project for your class. How are you picking your tech stack?

**Student:** "Honestly, we just went with whatever the most experienced person on the team knew. One person had done React, another had done Vue, and we went with React because more of us knew it."

**Interviewer:** Did you consider whether it was the best fit for the project?

**Student:** "Not really. We had two weeks and couldn't afford to learn something new. I googled 'React vs Vue for small projects' and read like two articles but they contradicted each other."

**Interviewer:** What about setting up the repo and dev tools?

**Student:** "We used create-react-app and that was it. No linting, no testing setup, no CI. Half the team was using Copilot but it kept generating class components because there was no instruction file. We didn't know that was a thing."

**Interviewer:** What went wrong because of those early decisions?

**Student:** "We had merge conflicts constantly because nobody agreed on file structure. And Copilot would generate code in one style for me and a different style for my teammate. We wasted a lot of time on that."

> **Key Insights:**
> - Teams default to familiarity, not fit — especially under time pressure.
> - Lack of shared AI tool config causes real team friction (inconsistent code generation).
> - Students don't know project setup best practices exist (linting, testing, CI).
> - **Mom Test signal:** The consequences were real and measurable — merge conflicts, wasted time, inconsistent code. The student has already attempted to research (googled comparisons) and found it unhelpful.

---

## 4. Design Principles

| # | Principle | What It Means |
|---|-----------|---------------|
| 1 | **Decisions, Not Just Data** | Showing raw stats is not enough. DevPrint should surface recommendations, trade-offs, and "best for" guidance that helps users decide, not just compare. |
| 2 | **End-to-End Flow** | The product is only valuable if it connects browsing → comparing → planning → generating config. Each step in isolation is just another blog post or template repo. |
| 3 | **Community-Driven Accuracy** | Technology data goes stale fast. A contributor system with admin review keeps information current without relying on a single maintainer. |
| 4 | **Config Files Are First-Class Output** | Generated CLAUDE.md, Gemini, and Copilot configs are not an afterthought — they are the primary deliverable. They must be production-quality and immediately usable. |
| 5 | **Opinionated Defaults, Flexible Overrides** | The wizard should recommend a stack based on project type, but never lock users in. Every recommendation is overridable. |

---

## 5. User Personas

### 5.1 The Solo Developer (Primary)

| | |
|-|---|
| **Profile** | 24 / junior-to-mid developer, 1-3 years experience |
| **Context** | Starting a new side project or freelance contract. Works alone. Has used 2-3 frameworks but doesn't have strong opinions about the rest of the ecosystem. |
| **Goals** | Pick the right tools for their specific project without spending a full day researching. Get a project scaffold with AI tool configs that match their stack. |
| **Frustrations** | Every comparison article is either too shallow ("React is popular!") or too opinionated ("You MUST use Svelte"). Setting up ESLint, Prettier, and AI configs takes as long as writing the first feature. |
| **DevPrint Use** | Browses technologies by category, runs a comparison between 2-3 candidates, goes through the wizard, downloads generated config files. |

### 5.2 The Tech Lead (Secondary)

| | |
|-|---|
| **Profile** | 30 / senior engineer leading a small team (3-6 people) |
| **Context** | Evaluating technologies for a new service or migration. Needs to justify the choice to stakeholders. Team uses AI coding tools but without standardized configs. |
| **Goals** | Build a defensible comparison with real data (not just vibes). Generate shared AI tool configs so the whole team gets consistent suggestions. |
| **Frustrations** | Manually builds comparison spreadsheets every time. Spends hours writing CLAUDE.md files from scratch. Team members use AI tools differently, causing inconsistent code. |
| **DevPrint Use** | Uses comparison engine for side-by-side analysis, saves project plans, generates team-wide config files, shares comparison URLs with stakeholders. |

### 5.3 The Community Contributor

| | |
|-|---|
| **Profile** | 26 / developer who is passionate about a specific technology (e.g., maintains a Svelte library) |
| **Context** | Notices that their favorite framework is missing or has outdated information on DevPrint. Wants to contribute accurate data. |
| **Goals** | Submit a well-structured technology entry that gets approved and helps other developers discover their tool. |
| **Frustrations** | Other comparison sites are closed — you can't fix wrong information. Wikipedia-style editing is too unstructured. |
| **DevPrint Use** | Signs up as a contributor, submits a technology entry with pros/cons/stats, tracks approval status. |

### 5.4 The Platform Admin

| | |
|-|---|
| **Profile** | DevPrint team member responsible for content quality |
| **Context** | Reviews community submissions, ensures data accuracy, manages the technology catalog. |
| **Goals** | Approve high-quality submissions quickly, reject spam or low-effort entries with clear feedback, keep the catalog accurate and up-to-date. |
| **Frustrations** | Without a structured review flow, quality control is ad-hoc and inconsistent. |
| **DevPrint Use** | Reviews pending submissions in the admin panel, approves/rejects with notes, edits existing entries, monitors platform health via eval dashboard. |

---

## 6. Goals & Non-Goals

### Goals

- Allow developers to browse and search a curated catalog of technologies with real metrics
- Allow developers to compare two technologies side-by-side with weighted scoring and recommendations
- Provide a guided project wizard that recommends a tech stack based on project type and constraints
- Generate production-quality config files for Claude Code (CLAUDE.md), Gemini CLI (.gemini), and GitHub Copilot (.github/copilot-instructions.md)
- Support user accounts with saved project plans and comparison history
- Enable community members to submit new technology entries through a structured contributor flow
- Provide an admin panel for content curation and platform management
- Expose a health check API endpoint for uptime monitoring

### Non-Goals (out of scope for v1)

- Real-time collaboration (shared project plans, team workspaces)
- AI chatbot for stack recommendations (wizard is form-based, not conversational)
- Code scaffolding or project generation (DevPrint generates config files, not boilerplate code)
- Package manager integration (no `npm init` or `create-next-app` wrappers)
- Monetization, premium tiers, or paid features
- Mobile native app (responsive web only)
- Technology ranking or "best of" lists (DevPrint compares, it does not rank)

---

## 7. User Stories & Acceptance Criteria

### SPRINT 1 — Foundation & Core Browsing

---

#### US-01 · User Registration & Login
**As a developer**, I want to create an account and sign in so that my project plans and comparisons are saved.

**Acceptance Criteria:**
- [ ] User can sign up with email and password via Supabase Auth
- [ ] User receives an error if the email is already in use
- [ ] User receives an error if the password is under 8 characters
- [ ] User can sign in with correct credentials
- [ ] User sees a generic error on incorrect credentials (no field-specific detail)
- [ ] User session persists across page refreshes (JWT in cookie)
- [ ] User can sign out from any page
- [ ] New users are assigned the "developer" role by default

---

#### US-02 · Technology Browsing & Search
**As a developer**, I want to browse and search technologies by name or category so that I can discover tools relevant to my project.

**Acceptance Criteria:**
- [ ] User can view a paginated list of all technologies at `/technologies`
- [ ] Each card shows: name, category, description (truncated), GitHub stars, learning curve
- [ ] User can filter by category (frontend-framework, backend-framework, database, etc.)
- [ ] User can search by name with real-time filtering
- [ ] If no results match, a clear empty state message is shown
- [ ] Page works without being logged in (public access)

---

#### US-03 · Technology Detail Page
**As a developer**, I want to view a technology's full details so that I can understand its strengths, weaknesses, and fit for my project.

**Acceptance Criteria:**
- [ ] Clicking a technology navigates to `/technology/[slug]`
- [ ] Detail page shows: full description, pros, cons, best-for use cases
- [ ] Statistics displayed: GitHub stars, npm weekly downloads, learning curve, community size, maturity
- [ ] External links to website, GitHub repo, and npm package (where available)
- [ ] Page is server-rendered for SEO
- [ ] Loading and error states handled gracefully

---

#### US-04 · Technology Comparison Engine (Core Logic)
**As a developer**, I want to compare two technologies with weighted scoring so that I can make a data-informed decision.

**Acceptance Criteria:**
- [ ] `compareTechnologies(techA, techB)` returns a structured comparison result
- [ ] Scoring covers 6 categories: performance, developer experience, community, learning curve, ecosystem, maturity
- [ ] Each category has a configurable weight (default weights sum to 1.0)
- [ ] Scores are normalized to 0-10 scale
- [ ] Result includes an overall winner or "tie" designation
- [ ] `generateComparisonSummary()` produces a human-readable recommendation with advantages, trade-offs, and best-for guidance
- [ ] All comparison logic is pure TypeScript with no UI or database dependencies
- [ ] >90% test coverage on comparison module

---

### SPRINT 2 — Interactive Features & Integrations

---

#### US-05 · Side-by-Side Comparison Page
**As a developer**, I want a visual comparison page where I can select two technologies and see them side by side.

**Acceptance Criteria:**
- [ ] User can select two technologies from dropdowns or search at `/compare`
- [ ] Page displays side-by-side cards with all stats and pros/cons
- [ ] Category scores shown as a visual chart (bar or radar)
- [ ] Recommendation summary displayed below the comparison
- [ ] Comparison URL is shareable (query params: `?a=react&b=vuejs`)
- [ ] Selecting the same technology for both sides shows a validation error

---

#### US-06 · Project Setup Wizard
**As a developer**, I want a guided wizard that recommends a tech stack based on my project requirements.

**Acceptance Criteria:**
- [ ] Multi-step form at `/wizard` with steps: project type → frontend → backend → database → styling → deployment
- [ ] Each step shows relevant technology options with brief descriptions
- [ ] Previous selections influence recommendations in later steps (e.g., if "static site" is selected, recommend Astro/Next.js over Express)
- [ ] User can navigate forward and backward between steps
- [ ] Final summary shows the complete selected stack
- [ ] Logged-in users can save the plan to their dashboard
- [ ] Plan is saved as a `project_plans` row with selections as JSON

---

#### US-07 · Config File Generator
**As a developer**, I want to generate AI coding tool configuration files for my selected tech stack.

**Acceptance Criteria:**
- [ ] From a saved project plan or the wizard summary, user can generate config files
- [ ] Supported outputs: CLAUDE.md (Claude Code), .gemini (Gemini CLI), .github/copilot-instructions.md (GitHub Copilot)
- [ ] Generated files include: project overview, tech stack details, coding conventions, file structure, do's and don'ts — all tailored to the selected technologies
- [ ] User can preview each generated file before downloading
- [ ] User can download individual files or all as a zip
- [ ] Generated content is template-based (no LLM calls at generation time)

---

#### US-08 · Contributor Panel
**As a community contributor**, I want to submit new technology entries so that the catalog stays current and comprehensive.

**Acceptance Criteria:**
- [ ] Authenticated users with "contributor" role can access `/contributor`
- [ ] Submission form includes all technology fields: name, category, description, pros, cons, best-for, links, stats
- [ ] Form validates required fields with Zod before submission
- [ ] Submitted entries are saved with status "pending"
- [ ] Contributor can view their submissions and current status (pending/approved/rejected)
- [ ] Approved submissions appear in the public technology catalog

---

#### US-09 · Admin Panel
**As an admin**, I want to review and manage technology submissions so that the catalog maintains quality standards.

**Acceptance Criteria:**
- [ ] Only users with "admin" role can access `/admin`
- [ ] Middleware redirects non-admin users to the home page
- [ ] Admin can view all pending submissions in a queue
- [ ] Admin can approve or reject a submission with optional review notes
- [ ] Approved submissions are inserted into the `technologies` table
- [ ] Admin can edit or delete existing technology entries
- [ ] Admin can view platform eval results at `/admin/evals`

---

#### US-10 · User Dashboard
**As a logged-in developer**, I want a dashboard that shows my saved project plans so that I can pick up where I left off.

**Acceptance Criteria:**
- [ ] After login, user lands on a dashboard
- [ ] Dashboard shows a list of saved project plans with name, date, and selected stack summary
- [ ] User can click a plan to view details or generate config files
- [ ] User can delete a plan (with confirmation prompt)
- [ ] Empty state shows a CTA to start the project wizard

---

### SPRINT 3 — Polish, Monitoring & Security

---

#### US-11 · Landing Page
**As a visitor**, I want an informative landing page so that I understand what DevPrint does and can start using it immediately.

**Acceptance Criteria:**
- [ ] Hero section with tagline, description, and primary CTA ("Start Planning" → wizard)
- [ ] Featured technologies section showing 4-6 popular entries
- [ ] How-it-works section (3 steps: Browse → Compare → Generate)
- [ ] Secondary CTA to browse all technologies
- [ ] Fully responsive (mobile, tablet, desktop)

---

#### US-12 · Production Monitoring
**As a platform operator**, I want error tracking and uptime monitoring so that I can detect and respond to issues quickly.

**Acceptance Criteria:**
- [ ] Sentry integrated for error tracking (client + server)
- [ ] Vercel Analytics enabled for Web Vitals (LCP, FID, CLS)
- [ ] UptimeRobot monitoring production URL and `/api/health` endpoint
- [ ] Health check returns `{ status, db, timestamp, responseTime }`
- [ ] Sentry alerts configured for error spikes (>10 in 5 minutes)

---

## 8. Product Features Table

| Feature | Priority | Complexity | Sprint | Description |
|---------|----------|------------|--------|-------------|
| Technology Browsing & Search | Must Have | Medium | 1 | Filterable, searchable catalog with category tags and stats |
| Technology Detail Pages | Must Have | Low | 1 | Server-rendered pages with full tech info, pros/cons, links |
| Technology Comparison Engine | Must Have | High | 1 | Weighted scoring across 6 categories with summary generation |
| User Auth (Sign Up/In/Out) | Must Have | Medium | 1 | Supabase Auth with role-based access (developer/contributor/admin) |
| Side-by-Side Comparison UI | Must Have | Medium | 2 | Visual comparison page with charts and shareable URLs |
| Project Setup Wizard | Must Have | High | 2 | Multi-step guided form with context-aware recommendations |
| Config File Generator | Must Have | High | 2 | Template-based generation for Claude Code, Gemini CLI, Copilot |
| User Dashboard | Must Have | Low | 2 | Saved plans list with manage and generate actions |
| Contributor Panel | Should Have | Medium | 2 | Structured submission form with status tracking |
| Admin Panel | Should Have | Medium | 2 | Submission review queue, content management, eval dashboard |
| Landing Page | Should Have | Low | 3 | Hero, featured tech, how-it-works, responsive design |
| Production Monitoring | Should Have | Medium | 3 | Sentry, Vercel Analytics, UptimeRobot integration |
| E2E Tests | Should Have | Medium | 2-3 | Playwright tests for critical user flows |
| Eval System | Could Have | High | 3 | Code quality, LLM-as-judge, historical metrics dashboard |

---

## 9. Technical Architecture

### 9.1 Tech Stack

| Concern | Tool / Version | Notes |
|---------|---------------|-------|
| Framework | Next.js 16 (App Router) | Server components by default, React 19 |
| Language | TypeScript (strict mode) | No `any` types |
| Styling | Tailwind CSS v4 | Utility classes only — no custom CSS files |
| Database | Supabase (PostgreSQL) | Row Level Security on all tables |
| Auth | Supabase Auth | JWT sessions (1h access, 7d refresh) |
| Validation | Zod | All external input validated |
| Unit Testing | Vitest + Testing Library | >80% coverage target |
| E2E Testing | Playwright | Critical user flows |
| CI/CD | GitHub Actions + Vercel | Lint → typecheck → test → build → deploy |
| Error Tracking | Sentry (@sentry/nextjs) | Free tier: 5K errors/month |
| Web Vitals | Vercel Analytics | LCP, FID, CLS, TTFB |
| Uptime | UptimeRobot | 5-min intervals, monitors `/api/health` |
| Package Manager | npm | Lockfile committed |

### 9.2 Architecture Decisions

- **App Router (not Pages Router):** All routing uses Next.js App Router with `src/app/`. Server Components by default — `"use client"` only when interactivity (event handlers, hooks, browser APIs) is required.
- **Supabase RLS over API middleware:** Row Level Security policies on every table enforce access control at the database layer. API routes still verify auth, but RLS is the last line of defense.
- **Pure utilities in `src/lib/`:** Business logic (comparison engine, config generators, validators) is pure TypeScript with no React or Next.js imports. This makes it easy to test and reuse.
- **Template-based config generation:** Config files are generated from handlebars-style templates, not LLM calls. This ensures deterministic, fast output with no API costs.
- **No ORM:** Supabase client handles all database queries. The schema is simple enough that an ORM adds complexity without benefit.

### 9.3 API Design

Frontend data fetching uses server components with direct Supabase queries where possible. API routes (`src/app/api/`) are used for mutations and endpoints consumed by external services.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/health` | Health check (DB connectivity, uptime) | No |
| `POST` | `/api/generate-config` | Generate config files for a tech stack | Yes |

Most reads happen in server components via Supabase queries — no REST API layer needed for reads in v1.

### 9.4 Database Schema

**Tables:**

| Table | Description | RLS |
|-------|-------------|-----|
| `technologies` | Curated technology catalog (name, slug, category, stats, pros/cons) | Everyone reads. Admins write. |
| `comparisons` | Cached comparison results (tech_a, tech_b, comparison_data JSON) | Everyone reads. |
| `user_profiles` | User metadata + role (developer/contributor/admin). References `auth.users`. | Everyone reads. Users update own. |
| `project_plans` | Saved wizard results (selections JSON, config_data JSON) | Users manage own. |
| `contributions` | Contributor submissions with approval status | Contributors insert + read own. Admins manage all. |
| `eval_results` | Historical eval metrics per sprint | Admin read. CI writes. |

### 9.5 Folder Structure

```
src/
  app/                          # Next.js App Router pages
    (auth)/sign-in, sign-up     # Auth pages
    admin/                      # Admin panel (role-gated)
    api/health/, generate-config/ # API route handlers
    contributor/                # Contributor panel
    technology/[slug]/          # Technology detail page
    technologies/               # Technology listing with filters
    wizard/                     # Multi-step project wizard
    compare/                    # Side-by-side comparison page
  components/
    ui/                         # Reusable primitives (Button, Card, Input)
    technology/                 # TechnologyCard, TechnologyStats, ProsCons
    wizard/                     # WizardStep, WizardSummary, WizardNav
    admin/                      # SubmissionQueue, EvalDashboard
    layout/                     # Header, Footer, Sidebar
  lib/
    supabase/                   # Client, server client, query functions
    comparison/                 # Comparison engine (pure TS, TDD)
    generators/                 # Config file template generators
    wizard/                     # Wizard state logic + recommendations
    monitoring/                 # Sentry init, structured logging
    validators/                 # Zod schemas for all input validation
  types/                        # Shared TypeScript types
  hooks/                        # Custom React hooks
evals/                          # Eval system (runners, results)
docs/                           # PRD, security audit, reflections
scripts/                        # Schema SQL, seed script
.github/workflows/              # CI/CD pipeline configs
```

### 9.6 Dependencies to Prefer

| Purpose | Library | Notes |
|---------|---------|-------|
| Auth & Database | @supabase/supabase-js | Already in stack |
| Validation | zod | Input validation, form schemas |
| Testing | vitest + @testing-library/react | Unit + component tests |
| E2E | @playwright/test | Browser automation |
| Error Tracking | @sentry/nextjs | Free tier, client + server |
| HTTP | Native fetch (Next.js) | No axios needed |
| State | React useState + useContext | No Redux — app is simple enough |
| Date/time | Native Intl + Date | No date library needed for v1 |

---

## 10. Sprint Plan Summary

| Issue | User Story / Task | Sprint | Owner |
|-------|-------------------|--------|-------|
| #1 | Repository & project scaffolding | Sprint 1 | Joy |
| #2 | CLAUDE.md, PRD, CI/CD pipeline | Sprint 1 | Joy |
| #3 | Supabase schema + seed script | Sprint 1 | Joy |
| #4 | US-04 · Technology comparison engine (TDD) | Sprint 1 | Joy |
| #5 | US-03 · Technology detail page | Sprint 1 | Joy |
| #6 | US-01 · User auth (sign up, sign in, sign out) | Sprint 1 | Keeyon |
| #7 | US-11 · Landing page | Sprint 1 | Keeyon |
| #8 | US-02 · Technology listing with filtering | Sprint 1 | Keeyon |
| #9 | US-10 · User dashboard skeleton | Sprint 1 | Keeyon |
| #10 | US-06 · Project setup wizard | Sprint 2 | Joy |
| #11 | US-05 · Side-by-side comparison UI | Sprint 2 | Joy |
| #12 | US-07 · Config file generator | Sprint 2 | Joy |
| #13 | US-08 · Contributor panel | Sprint 2 | Keeyon |
| #14 | US-09 · Admin panel | Sprint 2 | Keeyon |
| #15 | API route layer with caching | Sprint 2 | Keeyon |
| #16 | Technology data scraper (GitHub/npm) | Sprint 2 | Joy |
| #17 | E2E tests (Playwright) | Sprint 2 | Keeyon |
| #18 | CI/CD: multi-environment + canary | Sprint 3 | Joy |
| #19 | US-12 · Production monitoring | Sprint 3 | Keeyon |
| #20 | Security audit + OWASP hardening | Sprint 3 | Joy |
| #21 | Eval system (code quality + LLM-as-judge) | Sprint 3 | Joy |
| #22 | UI polish, accessibility, error boundaries | Sprint 3 | Keeyon |
| #23 | Documentation: API docs, blog post, demo | Sprint 3 | Keeyon |

---

## 11. Success Metrics

| Metric | Target | How to Measure | Why It Matters |
|--------|--------|----------------|----------------|
| End-to-end flow completion | <5 min from browse to config download | User testing (timed tasks) | Core value prop: DevPrint saves time vs. manual research |
| Comparison accuracy | Scores align with >80% of testers' intuitions | User survey after comparing 3 pairs | If comparisons feel wrong, users won't trust the platform |
| Config file usability | 0 manual edits needed to use generated config | User testing: import config, start coding | Generated files must be immediately useful, not a starting draft |
| Contributor submissions | 10+ entries in first month | Count rows in `contributions` table | Community-driven catalog is a core differentiator |
| Test coverage | >80% lines, >70% branches | Vitest coverage report | Code quality and maintainability |
| Lighthouse performance | >90 on all 4 metrics | Lighthouse CI in GitHub Actions | Performance is table stakes for a developer tool |
| Uptime | >99.5% measured monthly | UptimeRobot dashboard | Reliability builds trust |

---

## 12. Risk Assessment

| Risk | Likelihood | Impact | Description | Mitigation |
|------|------------|--------|-------------|------------|
| Stale technology data | High | High | GitHub stars and npm downloads change daily. Descriptions and pros/cons become outdated as frameworks evolve. | Automated scraper runs weekly (GitHub API + npm registry). Contributor system allows community updates. |
| Comparison scoring disagreement | Medium | High | Developers may disagree with how technologies are scored. Subjective categories (DX, ecosystem) are inherently debatable. | Transparent scoring: show weights and raw scores. Allow users to adjust weights. LLM-as-judge eval validates scoring logic. |
| Low contributor adoption | Medium | Medium | If no one submits technology entries, the catalog relies solely on the seed data and manual updates. | Seed with 12+ well-researched entries. Lower barrier: "suggest an edit" flow in addition to full submissions. |
| Config file drift | Medium | Medium | AI tool config formats may change (e.g., Claude Code updates CLAUDE.md spec). Generated configs could become invalid. | Template-based generation makes updates easy. Version templates per tool version. |
| Scope creep under time pressure | High | Medium | 3 sprints for 23 issues is ambitious. Features may be cut or rushed. | Strict MoSCoW prioritization. Buffer week built in. "Must Have" features are achievable by Sprint 2 end. |
| Supabase free tier limits | Low | Medium | Free tier: 500MB DB, 2GB bandwidth, 50K auth requests. | Sufficient for course project scale. Monitor usage in Supabase dashboard. |

---

## 13. Out of Scope / Future Considerations

| Feature | Rationale |
|---------|-----------|
| AI chatbot / conversational recommendations | Wizard is form-based by design. A chatbot adds LLM API costs and latency without clear UX benefit for structured decisions. |
| Code scaffolding / project generation | DevPrint generates config files, not boilerplate. Tools like `create-next-app` already solve scaffolding well. |
| Real-time collaboration | Shared workspaces add significant complexity (real-time sync, permissions). Out of scope for a 2-person team in 4 weeks. |
| Mobile native app | Responsive web covers mobile use cases. Native apps are not justified for the usage pattern (occasional, task-oriented). |
| Monetization | No premium features, ads, or paywalls. This is a course project and community tool. |
| Technology rankings / "Top 10" lists | DevPrint compares, it does not rank. Rankings are inherently subjective and create controversy. |
| Integration with IDE extensions | Future consideration: VS Code extension that generates config from DevPrint. Not in v1 scope. |
