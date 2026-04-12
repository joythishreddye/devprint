# Log: Side-by-Side Comparison Page — US-05

**Date:** 2026-03-22
**Branch:** `feat/tdd-comparison-engine`
**Author:** Claude (assisted)
**PRD Reference:** US-05 · Side-by-Side Comparison Page

---

## What was built

Full implementation of the `/compare` page and all supporting UI components, following strict TDD (red → green) with no database dependency.

### New files

| File | Type | Description |
|------|------|-------------|
| `src/components/comparison/CategoryScoreBar.tsx` | Server component | Renders 6 weighted category scores as visual bars with inline-style widths |
| `src/components/comparison/ComparisonSummaryPanel.tsx` | Server component | Renders recommendation, per-tech advantages, tradeoffs, and best-for guidance |
| `src/components/comparison/TechnologySelector.tsx` | Client component | Controlled dual-select for picking technologies; renders validation error |
| `src/components/comparison/ComparisonClient.tsx` | Client component | Thin client boundary; uses `useRouter` to update `?a=&b=` URL params on selection change |
| `src/lib/comparison/fixtures.ts` | Pure TS | 4 hardcoded `Technology` objects (React, Vue.js, Svelte, Next.js) + slug-keyed lookup map |
| `src/app/compare/page.tsx` | Server component | Reads `searchParams`, computes comparison, renders all panels |
| `src/app/compare/loading.tsx` | Server component | Animated skeleton with `animate-pulse` |
| `src/app/compare/error.tsx` | Client component | Error boundary with reset button |

### New test files

| File | Tests |
|------|-------|
| `src/components/comparison/__tests__/CategoryScoreBar.test.tsx` | 6 tests |
| `src/components/comparison/__tests__/ComparisonSummaryPanel.test.tsx` | 7 tests |
| `src/components/comparison/__tests__/TechnologySelector.test.tsx` | 8 tests |

**Total: 65 tests passing (up from 44).**

---

## Architecture decisions

### Client/server split

The page uses App Router's server/client boundary cleanly:

- **Server:** `page.tsx` reads `searchParams`, resolves technologies from fixtures, calls `compareTechnologies()` and `generateComparisonSummary()`, passes results as props.
- **Client:** `ComparisonClient.tsx` wraps only the selector. Uses `useRouter().replace()` with `{ scroll: false }` to update URL params without a full page jump, triggering a server re-render.
- **Server:** `CategoryScoreBar`, `ComparisonSummaryPanel`, `TechCard` are all server components — no `"use client"` needed.

This keeps the comparison engine computation server-side.

### Validation at the server layer

The same-technology validation (`slugA === slugB`) runs in `page.tsx`, not in the client component. This means the error is visible on direct URL load (e.g. `/compare?a=react&b=react`) as well as from user interaction.

### Bar widths use inline styles

Tailwind v4 JIT cannot generate arbitrary width classes from runtime values. Bar widths use `style={{ width: \`${(score / 10) * 100}%\` }}` — the only correct approach for data-driven bar charts in Tailwind. Surrounding layout uses Tailwind classes normally.

### No database required

`FIXTURE_TECHNOLOGIES_BY_SLUG` in `fixtures.ts` provides a slug-keyed lookup for the page. When Supabase is connected (US-02 / US-03), the page can be updated to fetch from the `technologies` table instead.

### `happy-dom` replaces `jsdom`

`jsdom` v27 has a CJS/ESM compatibility bug with `@asamuzakjp/css-color` that prevents component test files from collecting. Replaced with `happy-dom` in `vitest.config.mts`. `@testing-library/react` works correctly with `happy-dom`.

---

## How to view the feature

```bash
npm run dev
```

Then open:

| URL | What you see |
|-----|-------------|
| `http://localhost:3000/compare` | Empty state with example comparison links |
| `http://localhost:3000/compare?a=react&b=svelte` | React vs Svelte full comparison |
| `http://localhost:3000/compare?a=react&b=vuejs` | React vs Vue.js |
| `http://localhost:3000/compare?a=nextjs&b=react` | Next.js vs React |
| `http://localhost:3000/compare?a=react&b=react` | Validation error: same technology |

All URLs are shareable — the comparison is fully server-rendered from query params.

---

## Acceptance criteria status

| Criterion | Status |
|-----------|--------|
| User can select two technologies at `/compare` | Done — dual selects update URL params |
| Side-by-side cards with stats and pros/cons | Done — `TechCard` shows score, pros, cons |
| Category scores as visual bar chart | Done — `CategoryScoreBar` with proportional bars |
| Recommendation summary below comparison | Done — `ComparisonSummaryPanel` |
| Shareable URL (`?a=react&b=svelte`) | Done — server renders from `searchParams` |
| Selecting same technology shows error | Done — validated server-side, rendered via prop |

---

## Next steps

- **US-03** · Technology detail page — link to `/compare?a=<slug>` from detail pages
- **US-02** · Technology listing — replace fixture data with real Supabase queries once DB is connected
- Replace `FIXTURE_TECHNOLOGIES_BY_SLUG` lookup in `page.tsx` with a Supabase query when schema is ready
