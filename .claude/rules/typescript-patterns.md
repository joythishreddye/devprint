# TypeScript Patterns for DevPrint

Applies to: `*.ts`, `*.tsx`

## API Response Format

Always use a discriminated union for API responses:

```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
```

## Supabase Query Pattern

Always handle errors explicitly. Never ignore the error field:

```typescript
// GOOD
const { data, error } = await supabase
  .from('technologies')
  .select('id, name, slug, category')
  .eq('category', category)
  .order('name')
  .limit(50);

if (error) {
  console.error('Failed to fetch technologies:', error);
  return { success: false, error: 'Failed to fetch technologies' };
}

return { success: true, data };

// BAD — ignoring error, using select('*'), no limit
const { data } = await supabase.from('technologies').select('*');
```

## Server Action Pattern

```typescript
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const schema = z.object({
  name: z.string().min(1).max(100),
});

export async function createPlan(formData: FormData) {
  const parsed = schema.safeParse({ name: formData.get('name') });
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }

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

## Component Props Pattern

```typescript
// GOOD — interface named after component, exported for reuse
export interface TechnologyCardProps {
  technology: Pick<Technology, 'name' | 'slug' | 'category' | 'description' | 'github_stars'>;
  showStats?: boolean;
}

export function TechnologyCard({ technology, showStats = true }: TechnologyCardProps) {
  // ...
}
```

## Custom Hook Pattern

```typescript
// GOOD — prefixed with "use", returns typed object
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## Type Guard Pattern

```typescript
// GOOD — use type guards instead of type assertions
function isAdmin(profile: UserProfile): profile is UserProfile & { role: 'admin' } {
  return profile.role === 'admin';
}

// BAD — type assertion
const admin = profile as AdminProfile;
```

## Const Object Pattern (instead of enum)

```typescript
// GOOD
export const LEARNING_CURVE = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
} as const;

export type LearningCurve = typeof LEARNING_CURVE[keyof typeof LEARNING_CURVE];

// BAD — enum
enum LearningCurve {
  Beginner = 'beginner',
  // ...
}
```

## Error Handling Pattern

```typescript
// GOOD — structured error with context
function handleQueryError(operation: string, error: unknown): ApiResponse<never> {
  console.error(`${operation} failed:`, error);
  return {
    success: false,
    error: `Failed to ${operation}. Please try again.`,
  };
}
```
