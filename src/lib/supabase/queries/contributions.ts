import { createServerClient } from '@/lib/supabase/server';
import type { Contribution, UserRole } from '@/types/database';
import type { ApiResponse } from '@/types/api';

export async function getUserContributions(userId: string): Promise<Contribution[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('contributions')
    .select('id, contributor_id, technology_data, status, reviewer_id, review_notes, created_at, updated_at')
    .eq('contributor_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch contributions:', error);
    return [];
  }

  return data ?? [];
}

export async function getContributionById(
  id: string,
  userId: string,
): Promise<Contribution | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('contributions')
    .select('id, contributor_id, technology_data, status, reviewer_id, review_notes, created_at, updated_at')
    .eq('id', id)
    .eq('contributor_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch contribution:', error);
    return null;
  }

  return data ?? null;
}

export async function submitContribution(
  contributorId: string,
  technologyData: Record<string, unknown>,
): Promise<ApiResponse<Contribution>> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('contributions')
    .insert({
      contributor_id: contributorId,
      technology_data: technologyData,
      status: 'pending' as const,
      reviewer_id: null,
      review_notes: null,
    })
    .select('id, contributor_id, technology_data, status, reviewer_id, review_notes, created_at, updated_at')
    .single();

  if (error) {
    console.error('Failed to submit contribution:', error);
    return { success: false, error: 'Failed to submit contribution. Please try again.' };
  }

  return { success: true, data };
}

export async function deleteContribution(
  id: string,
  userId: string,
): Promise<ApiResponse<null>> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('contributions')
    .delete()
    .eq('id', id)
    .eq('contributor_id', userId)
    .select('id');

  if (error) {
    console.error('Failed to delete contribution:', error);
    return { success: false, error: 'Failed to delete contribution. Please try again.' };
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Contribution not found or already deleted.' };
  }

  return { success: true, data: null };
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch user role:', error);
    return null;
  }

  return (data?.role as UserRole) ?? null;
}
