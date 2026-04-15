# Security Audit — DevPrint (Issue #22)

**Date**: 2026-04-14
**Branch**: joy/sprint-2-core
**Auditor**: Joy Thishevuri (assisted by Claude Code)
**Scope**: OWASP Top 10 hardening, CI secrets scanning, security headers, API input validation, authentication patterns

---

## 1. CI/CD — Secrets Scanning

### Finding: Gitleaks already configured
**Status**: PASS

`.github/workflows/ci.yml` — Stage 5 ("Security") includes:

```yaml
- name: Gitleaks secrets scan
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

`fetch-depth: 0` is set on the checkout step so Gitleaks scans full history, not just the latest commit.

### Finding: `npm audit` gate configured
**Status**: PASS

`npm audit --audit-level=high` runs in Stage 5 before production deploys. High and critical severity advisories will fail the build.

---

## 2. HTTP Security Headers

### Findings before this audit

| Header | Was Present | Status |
|--------|-------------|--------|
| `X-Frame-Options: DENY` | Yes | PASS |
| `X-Content-Type-Options: nosniff` | Yes | PASS |
| `Referrer-Policy: strict-origin-when-cross-origin` | Yes | PASS |
| `X-XSS-Protection: 1; mode=block` | Yes | PASS |
| `Strict-Transport-Security` | **No** | FAIL |
| `Content-Security-Policy` | **No** | FAIL |
| `Permissions-Policy` | **No** | FAIL |

### Mitigations applied

Added to `next.config.ts` (all routes `/(.*)`):

**Strict-Transport-Security**
```
max-age=63072000; includeSubDomains; preload
```
Enforces HTTPS for 2 years, including subdomains. Eligible for HSTS preload list.

**Content-Security-Policy**
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

Note: `unsafe-inline` and `unsafe-eval` are required by Next.js App Router's inline hydration scripts. Tighten to nonce-based CSP once Next.js build pipeline supports it. `frame-ancestors 'none'` reinforces `X-Frame-Options: DENY` at the CSP layer.

**Permissions-Policy**
```
camera=(), microphone=(), geolocation=()
```
Disables browser feature APIs not used by this application.

---

## 3. API Routes

### `/api/health` (GET)

**Status**: PASS

- No user-supplied input accepted (GET, no query params processed).
- Queries `technologies` table with `select('id').limit(1)` — no `select('*')`, limit enforced.
- Errors handled; returns 503 on failure.
- No authentication required (health check is intentionally public).
- **Note**: No rate limiting. Acceptable for a health endpoint (no sensitive data exposed). Consider adding rate limiting if DoS becomes a concern.

### `/api/generate-config` (directory exists, no route implemented yet)

**Status**: NOT IMPLEMENTED

The directory `src/app/api/generate-config/` is empty — no `route.ts` file exists. When implemented, this route **must**:
- Validate all request body inputs with Zod before processing.
- Verify the authenticated user with `getUser()`.
- Apply rate limiting (this endpoint generates file output — potential for abuse).
- Use `ApiResponse<T>` discriminated union for all responses.

---

## 4. Authentication

### Middleware (`src/middleware.ts`)

**Status**: PASS

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

- `getUser()` is used — this makes a network request to Supabase to verify the JWT server-side. `getSession()` is **not** used alone (it only reads the local cookie, which can be forged).
- Protected paths (`/wizard`, `/admin`, `/contributor`) redirect unauthenticated users to `/sign-in`.
- The Supabase client is constructed from env vars, not hardcoded credentials.

### Auth Server Actions (`src/app/(auth)/actions.ts`)

**Status**: PASS

- `signIn` and `signUp` both run `safeParse` against Zod schemas before touching Supabase.
- `signInSchema` enforces email format and minimum password length (8 chars).
- `signUpSchema` enforces display name bounds (1–100 chars), email format, and password length.
- `signOut` calls `supabase.auth.signOut()` before redirecting.
- No JWT tokens are logged or stored.
- Auth error messages from Supabase are surfaced without stack traces.

**Minor observation**: `signUp` only inserts the user profile if `data.session` is non-null (email confirmation flow). If email confirmation is required and the user never confirms, the profile row is never created. This is acceptable — profile creation on first confirmed sign-in is a common pattern — but should be handled at the email confirmation callback when that route is implemented.

---

## 5. Database (Supabase / RLS)

**Status**: PASS (reviewed by inspection)

- All queries use explicit column lists — no `select('*')` found in source.
- `.limit()` is present on all list queries.
- RLS is documented as the last line of defense in `CLAUDE.md`. Policies are defined in `scripts/schema.sql`.
- `SUPABASE_SERVICE_ROLE_KEY` is a server-only env var, not prefixed with `NEXT_PUBLIC_`.
- No service role key usage found in client-side code.

---

## 6. Input Validation (OWASP A03 — Injection)

**Status**: PASS

- Zod v4 schemas validate all auth form inputs before any Supabase call.
- No raw SQL — all queries use the Supabase JS client with parameterized bindings.
- No `eval()`, `new Function()`, or `child_process.exec` with user input found.
- No `dangerouslySetInnerHTML` usage found in source.

---

## 7. Secrets Management

**Status**: PASS

- `.env.local` is git-ignored.
- `.env.local.example` contains only placeholder values (no real secrets).
- `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` are server-only env vars.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (no `NEXT_PUBLIC_` prefix).
- Gitleaks scans full git history on every CI run.

---

## 8. Open Findings / Future Work

| # | Severity | Finding | Recommended Action |
|---|----------|---------|-------------------|
| 1 | Low | No rate limiting on `/api/health` | Add simple in-memory rate limiter if DoS becomes concern |
| 2 | Medium | `/api/generate-config` not yet implemented | When added: Zod validation + auth check + rate limiting required |
| 3 | Low | CSP uses `unsafe-inline`/`unsafe-eval` | Migrate to nonce-based CSP when Next.js build pipeline supports it |
| 4 | Low | Email confirmation callback not implemented | Handle profile creation at confirmation callback route |

---

## Summary

**Mitigations applied in this audit:**
- Added `Strict-Transport-Security` header (HSTS, 2-year max-age, preload-eligible)
- Added `Content-Security-Policy` header (baseline policy with Supabase/Sentry allowlists)
- Added `Permissions-Policy` header (disables camera, mic, geolocation)

**No critical or high vulnerabilities found.** The codebase follows secure defaults: server-side auth verification, Zod input validation, parameterized DB queries, RLS enforcement, and no secrets in client-accessible env vars.
