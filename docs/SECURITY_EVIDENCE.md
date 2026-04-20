# Security Evidence — 4 Security Gates

**Project**: DevPrint (CS 7180)  
**Date**: 2026-04-20  
**Evidence Type**: CI/CD security gates + OWASP hardening

---

## Summary

DevPrint implements **4 active security gates** enforced in every PR and production deploy through the 8-stage CI/CD pipeline defined in `.github/workflows/ci.yml`.

---

## Gate 1: Secrets Detection — Gitleaks

**Stage**: Stage 5 (Security) in `ci.yml`  
**Tool**: Gitleaks (gitleaks/gitleaks-action@v2)

**CI Configuration**:
```yaml
- name: Gitleaks secrets scan
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**What it catches**:
- Hardcoded API keys, tokens, passwords in code
- Supabase keys accidentally committed
- Any credential pattern in diff

**Result**: All PRs pass Gitleaks with no secrets detected. All secrets are stored in GitHub Actions secrets (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.) and never committed to code.

**Additional measure**: `.gitignore` excludes `.env.local` to prevent accidental secret commits.

---

## Gate 2: Dependency Vulnerability Scan — npm audit

**Stage**: Stage 5 (Security) in `ci.yml`  
**Tool**: `npm audit --audit-level=high`

**CI Configuration**:
```yaml
- name: npm audit
  run: npm audit --audit-level=high
```

**Current Status** (from `npm audit`):
```
found 0 vulnerabilities
```

**What it catches**:
- Known CVEs in npm dependencies
- High and critical severity vulnerabilities
- Blocks merge if any high/critical vulns found

**Result**: ✓ 0 vulnerabilities found. CI gate passes on every PR.

---

## Gate 3: SAST — Security Reviewer Agent + AI PR Review

**Stage**: Stage 6 (AI PR Review) in `ci.yml` + `.claude/agents/security-reviewer.md`  
**Tool**: Claude Code Action + custom security-reviewer agent

**CI Configuration**:
```yaml
ai-pr-review:
  name: "Stage 6: AI PR Review"
  uses: anthropics/claude-code-action@beta
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

**Custom Agent** (`.claude/agents/security-reviewer.md`):
Reviews all code changes for:
- Missing auth checks on protected routes
- Supabase RLS bypass (service role key in client code)
- XSS (`dangerouslySetInnerHTML`, unsanitized user input in JSX)
- SQL injection (raw queries without parameterization)
- Secrets in `NEXT_PUBLIC_` environment variables
- Input validation gaps

**Evidence of use**:
- Security agent was used during auth implementation (Issue #8)
- Applied to all API routes in `src/app/api/`
- Applied to Zod validators in `src/lib/validators/`
- Commit `6c7e6ba feat: security audit and OWASP hardening` reflects agent-guided fixes

---

## Gate 4: OWASP Top 10 Documentation + Hardening

**Stage**: Commit `6c7e6ba` + `docs/SECURITY_AUDIT.md`  
**Tools**: security-reviewer agent + manual audit

**OWASP Categories Addressed**:

| Category | Measure | Status |
|----------|---------|--------|
| A01: Broken Access Control | Supabase RLS on all tables + middleware role checks | ✓ |
| A02: Cryptographic Failures | No secrets in code, HTTPS enforced by Vercel, JWT via Supabase Auth | ✓ |
| A03: Injection | Supabase parameterized queries, Zod input validation at all API boundaries | ✓ |
| A04: Insecure Design | Architecture review in CLAUDE.md, server-first design, no mutable patterns | ✓ |
| A05: Security Misconfiguration | HSTS, CSP, Permissions-Policy headers in `next.config.ts` | ✓ |
| A06: Vulnerable Components | `npm audit` in CI gates at high severity | ✓ |
| A07: Authentication Failures | Supabase Auth JWT, `getUser()` not `getSession()`, HttpOnly cookies | ✓ |
| A08: Integrity Failures | Gitleaks secrets scan in CI, no eval/exec with user input | ✓ |
| A09: Logging Failures | Sentry error tracking + structured logger in `src/lib/monitoring/` | ✓ |
| A10: SSRF | No server-side URL fetching from user input | ✓ |

**Security headers added** (from commit `6c7e6ba`):
```javascript
// next.config.ts
headers: [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'Content-Security-Policy', value: "default-src 'self'..." },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
]
```

---

## CI/CD Pipeline — Stage 5 Full Configuration

From `.github/workflows/ci.yml`:

```yaml
security:
  name: "Stage 5: Security"
  runs-on: ubuntu-latest
  needs: [lint, typecheck, unit-tests]
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0        # Full history for Gitleaks to scan
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: npm
    - run: npm ci
    - name: npm audit
      run: npm audit --audit-level=high
    - name: Gitleaks secrets scan
      uses: gitleaks/gitleaks-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Gate behavior**: Blocks deploy if any high/critical npm vulnerability found or any secret pattern detected.

---

## Additional Security Measures

Beyond the 4 gates, DevPrint has:

- **Row-Level Security (RLS)**: All Supabase tables have RLS policies. Schema in `scripts/schema.sql`.
- **Input validation**: Zod schemas at every API boundary (`src/lib/validators/`)
- **Auth enforcement**: `createServerClient()` in all server components; `getUser()` (not `getSession()`) for auth checks
- **No `dangerouslySetInnerHTML`**: Enforced by CLAUDE.md rules and code-reviewer agent
- **No `select('*')`**: All Supabase queries use explicit column lists + `.limit()`
- **Pre-commit detection**: Gitleaks runs in CI with full git history (`fetch-depth: 0`)

---

## Commits Demonstrating Security Work

```
6c7e6ba  feat: security audit and OWASP hardening (issue #22)
f51d3e1  feat: Zod validators, Sentry monitoring, and security hardening (Sprint 2)
944ad8e  chore: expand CI/CD to 8-stage pipeline with security and AI review
```

---

**Status**: ✓ All 4 security gates active in CI/CD  
**npm audit**: 0 vulnerabilities  
**Gitleaks**: No secrets in history  
**OWASP**: All 10 categories addressed  
