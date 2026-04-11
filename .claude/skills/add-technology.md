---
name: add-technology
description: Adds a new technology entry to scripts/seed.ts following the DevPrint schema. Prompts for all required fields, validates against the Technology type, and generates a correctly-shaped seed record ready to insert.
---

You are running the `/add-technology` skill for the DevPrint project. Follow each step in order.

## Usage

```
/add-technology <technology name>
```

Example: `/add-technology Bun`

---

## Step 1: Gather Information

Ask the user for the following fields. If any were provided in the command, use them. Otherwise prompt for each:

| Field | Type | Allowed values |
|-------|------|---------------|
| `name` | string | Display name (e.g. "Bun") |
| `slug` | string | kebab-case URL slug (e.g. "bun") — auto-derive from name if obvious |
| `category` | string | One of: `frontend-framework`, `fullstack-framework`, `backend-framework`, `database`, `orm`, `styling`, `testing`, `deployment`, `runtime`, `language`, `tooling` |
| `description` | string | 1–2 sentence description |
| `website_url` | string \| null | Official website |
| `github_url` | string \| null | GitHub repo URL |
| `npm_package` | string \| null | npm package name (null if not on npm) |
| `github_stars` | number \| null | Approximate current stars |
| `npm_weekly_downloads` | number \| null | Approximate weekly downloads |
| `pros` | string[] | 3–5 bullet points |
| `cons` | string[] | 2–4 bullet points |
| `best_for` | string[] | 2–4 use cases |
| `learning_curve` | `'beginner'` \| `'intermediate'` \| `'advanced'` | |
| `community_size` | `'small'` \| `'medium'` \| `'large'` | |
| `maturity` | `'emerging'` \| `'growing'` \| `'mature'` \| `'declining'` | |
| `metadata` | object | At minimum: `{ first_release: 'YYYY', maintained_by: 'Name' }` |

---

## Step 2: Validate

Before writing anything, check:

- `slug` is kebab-case with no spaces or uppercase
- `learning_curve` is exactly one of: `beginner`, `intermediate`, `advanced`
- `community_size` is exactly one of: `small`, `medium`, `large`
- `maturity` is exactly one of: `emerging`, `growing`, `mature`, `declining`
- `pros`, `cons`, `best_for` are non-empty arrays of strings
- No field value contains the string `"null"` or `"undefined"`

If any validation fails, report the issue and ask for a corrected value before continuing.

---

## Step 3: Check for duplicates

Read `scripts/seed.ts` and check that no existing entry has the same `slug` or `name`. If a duplicate is found, report it and stop.

```bash
grep -n "slug: '" scripts/seed.ts
```

---

## Step 4: Generate the seed entry

Produce a TypeScript object in the exact shape used by `scripts/seed.ts`:

```typescript
  {
    name: '<name>',
    slug: '<slug>',
    category: '<category>',
    description: '<description>',
    website_url: <'url' | null>,
    github_url: <'url' | null>,
    npm_package: <'package' | null>,
    github_stars: <number | null>,
    npm_weekly_downloads: <number | null>,
    pros: ['...', '...'],
    cons: ['...', '...'],
    best_for: ['...', '...'],
    learning_curve: '<beginner|intermediate|advanced>' as const,
    community_size: '<small|medium|large>' as const,
    maturity: '<emerging|growing|mature|declining>' as const,
    metadata: { first_release: '<YYYY>', maintained_by: '<maintainer>' },
  },
```

---

## Step 5: Insert into seed.ts

Read `scripts/seed.ts`, then append the new entry to the `technologies` array before the closing `]`.

Run `npm run typecheck` to confirm no TypeScript errors were introduced.

---

## Step 6: Commit

```bash
git add scripts/seed.ts
git commit -m "feat: add <name> to technology seed data"
```

---

## Step 7: Report

Print a summary:
- Technology name and slug added
- Category
- The full generated seed object
- Confirmation that `npm run typecheck` passed

---

## Constraints

- Never use `select('*')` or bypass the schema shape
- `as const` is required on `learning_curve`, `community_size`, and `maturity`
- Do not add `logo_url` — it is omitted from the seed (added later via admin panel)
- Do not modify any existing entries in the array
- If the user cannot provide `github_stars` or `npm_weekly_downloads`, use `null`
