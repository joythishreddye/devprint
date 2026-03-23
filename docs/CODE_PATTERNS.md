## Key Patterns

### API Response Format
```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
```

### Supabase Query Pattern
```typescript
const { data, error } = await supabase
  .from('technologies')
  .select('id, name, slug, category, description, github_stars')
  .eq('category', category)
  .order('name')
  .limit(50);

if (error) {
  console.error('Failed to fetch technologies:', error);
  return { success: false, error: 'Failed to fetch technologies' };
}
return { success: true, data };
```

### Server Action Pattern
```typescript
'use server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const schema = z.object({ name: z.string().min(1).max(100) });

export async function createPlan(formData: FormData) {
  const parsed = schema.safeParse({ name: formData.get('name') });
  if (!parsed.success) return { success: false, error: parsed.error.flatten() };

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
