'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { planIdSchema } from '@/lib/validators/plan-id';
import { deleteProjectPlan } from '@/lib/supabase/queries/get-project-plans';
import type { ApiResponse } from '@/types/api';

export async function deletePlanAction(
  planId: string,
): Promise<ApiResponse<{ deleted: true }>> {
  const parsed = planIdSchema.safeParse(planId);
  if (!parsed.success) {
    return { success: false, error: 'Invalid plan ID' };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const result = await deleteProjectPlan(parsed.data, user.id);
  if (!result.success) {
    return { success: false, error: result.error ?? 'Failed to delete plan' };
  }

  revalidatePath('/dashboard');
  return { success: true, data: { deleted: true } };
}
