import { createServerClient } from '@/lib/supabase/server';
import type { ProjectPlan } from '@/types/database';
import type { ProjectPlanSummary } from '@/types/dashboard';

export async function getProjectPlansByUser(userId: string): Promise<ProjectPlanSummary[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('project_plans')
    .select('id, name, description, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch project plans:', error);
    return [];
  }

  return data ?? [];
}

export async function getProjectPlanById(
  planId: string,
  userId: string,
): Promise<ProjectPlan | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('project_plans')
    .select('id, user_id, name, description, selections, config_data, created_at, updated_at')
    .eq('id', planId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch project plan:', error);
    return null;
  }

  return data ?? null;
}

export async function deleteProjectPlan(
  planId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('project_plans')
    .delete()
    .eq('id', planId)
    .eq('user_id', userId)
    .select('id');

  if (error) {
    console.error('Failed to delete project plan:', error);
    return { success: false, error: 'Failed to delete plan. Please try again.' };
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Plan not found or already deleted.' };
  }

  return { success: true };
}
