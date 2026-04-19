# Critical Rules

## Database (Supabase)
- All queries use `@supabase/supabase-js` with RLS — **never bypass RLS**
- Schema changes go in `scripts/schema.sql` — never modify the database directly in production
- Use `select()` with **explicit column lists**, not `select('*')`
- All list queries **must include `.limit()`** to prevent unbounded results
- Use `.single()` only when exactly one row is expected; `.maybeSingle()` when row may not exist
- Handle the `error` field on **every** query — never destructure only `data`

## Authentication
- Use `createServerClient()` in server components and API routes
- Use `createClient()` (browser client) only in `"use client"` components
- Protected routes check `getUser()` — **never trust `getSession()` alone**
- Roles enforced at two layers: middleware (route-level) + RLS (row-level)
- Never store or log JWT tokens

## TypeScript
- **No `any` type** — use `unknown` and narrow with type guards
- **No enums** — use `as const` objects + union types
- **No type assertions (`as`)** unless absolutely unavoidable (add comment explaining why)
- Exported functions must have explicit return types
- Prefer `interface` for object shapes, `type` for unions/intersections
- All types live in `src/types/` — import with `@/types/...`

## React / Next.js
- **Server Components by default** — no `"use client"` unless interactivity is required
- **No `useEffect` for data fetching** — use async server components
- **No prop drilling >3 levels** — extract to context or composition
- One component per file, file name matches component name
- Props interfaces named `ComponentNameProps`

## Code Style
- No emojis in code or comments
- `const` over `let`, never `var`
- Immutable patterns only — spread operator, never mutate
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- Functions: `camelCase`. Types: `PascalCase`. Constants: `UPPER_SNAKE_CASE`. DB columns: `snake_case`
- Tailwind utility classes only — no custom CSS files
- Conventional commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `style:`, `chore:`

## Security
- No secrets in `NEXT_PUBLIC_` environment variables
- No `dangerouslySetInnerHTML` without sanitization
- No `eval()`, `new Function()`, or `child_process.exec` with user input
- Validate all user input with Zod before processing
- Rate limit API routes that accept user input
- Security headers configured in `next.config.ts`
