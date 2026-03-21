# React & Next.js Patterns for DevPrint

Applies to: `*.tsx` files in `src/app/` and `src/components/`

## Server vs Client Components

```typescript
// Server Component (DEFAULT — no directive needed)
// Can: await, read DB, access server-only resources
// Cannot: useState, useEffect, onClick, browser APIs
export default async function TechnologyPage({ params }: { params: { slug: string } }) {
  const technology = await getTechnologyBySlug(params.slug);
  if (!technology) notFound();
  return <TechnologyDetail technology={technology} />;
}

// Client Component (only when interactivity is needed)
'use client';
// Can: useState, useEffect, onClick, browser APIs
// Cannot: await at top level, direct DB access
export function SearchFilter({ categories }: SearchFilterProps) {
  const [query, setQuery] = useState('');
  // ...
}
```

## When to use "use client"

Add `"use client"` ONLY when the component needs:
- Event handlers (onClick, onChange, onSubmit)
- React hooks (useState, useEffect, useRef, useContext)
- Browser APIs (localStorage, window, document)
- Third-party client libraries (charts, animations)

If a component only renders JSX with props — it's a server component.

## Data Fetching

```typescript
// GOOD — fetch in server component directly
export default async function TechnologiesPage() {
  const technologies = await getAllTechnologies();
  return <TechnologyGrid technologies={technologies} />;
}

// BAD — useEffect for initial data
'use client';
export default function TechnologiesPage() {
  const [techs, setTechs] = useState([]);
  useEffect(() => { fetchTechs().then(setTechs); }, []);  // NO
}
```

## Loading & Error States

Every page in `src/app/` should have:
- `loading.tsx` — shown while async server component loads
- `error.tsx` — shown when server component throws (must be client component)
- `not-found.tsx` — shown when `notFound()` is called

```typescript
// src/app/technology/[slug]/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading technology...</div>;
}

// src/app/technology/[slug]/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Layout Pattern

```typescript
// Layouts are server components that wrap child pages
// They do NOT re-render when navigating between child pages
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

## Form Pattern (Server Actions)

```typescript
// Prefer server actions over API routes for mutations
// src/app/wizard/actions.ts
'use server';

export async function savePlan(formData: FormData) {
  const supabase = createServerClient();
  // validate, insert, return result
}

// src/app/wizard/page.tsx (server component)
import { savePlan } from './actions';
export default function WizardPage() {
  return <form action={savePlan}>...</form>;
}
```
