'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { technologySubmissionSchema } from '@/lib/validators/contribution';
import {
  submitContribution,
  deleteContribution,
  getContributionById,
  getUserRole,
} from '@/lib/supabase/queries/contributions';
import type { ApiResponse } from '@/types/api';
import type { Contribution } from '@/types/database';
import { z } from 'zod';

const idSchema = z.string().uuid('Invalid contribution ID');

async function getAuthorizedUser(): Promise<
  | { user: { id: string }; role: 'contributor' | 'admin' }
  | { error: ApiResponse<never> }
> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { success: false, error: 'Unauthorized' } };
  }

  const role = await getUserRole(user.id);
  if (role !== 'contributor' && role !== 'admin') {
    return { error: { success: false, error: 'Forbidden' } };
  }

  return { user, role };
}

export async function submitContributionAction(
  formData: FormData,
): Promise<ApiResponse<Contribution>> {
  const auth = await getAuthorizedUser();
  if ('error' in auth) return auth.error as ApiResponse<Contribution>;

  const rawData = Object.fromEntries(formData.entries());
  const parsedData = normalizeFormData(rawData);

  const parsed = technologySubmissionSchema.safeParse(parsedData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { success: false, error: firstError?.message ?? 'Invalid form data' };
  }

  // Rate-limit: reject if user has 10+ submissions in the last 24 hours
  const supabaseForCount = await createServerClient();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabaseForCount
    .from('contributions')
    .select('id', { count: 'exact', head: true })
    .eq('contributor_id', auth.user.id)
    .gte('created_at', oneDayAgo);

  if (typeof count === 'number' && count >= 10) {
    return { success: false, error: 'Submission limit reached. You can submit up to 10 technologies per day.' };
  }

  const result = await submitContribution(auth.user.id, parsed.data as Record<string, unknown>);
  if (result.success) {
    revalidatePath('/contributor');
  }
  return result;
}

export async function editContributionAction(
  contributionId: string,
  formData: FormData,
): Promise<ApiResponse<Contribution>> {
  const idParsed = idSchema.safeParse(contributionId);
  if (!idParsed.success) {
    return { success: false, error: 'Invalid contribution ID' };
  }

  const auth = await getAuthorizedUser();
  if ('error' in auth) return auth.error as ApiResponse<Contribution>;

  // Verify the contribution is still pending and owned by the user
  const existing = await getContributionById(idParsed.data, auth.user.id);
  if (!existing) {
    return { success: false, error: 'Contribution not found.' };
  }
  if (existing.status !== 'pending') {
    return { success: false, error: 'Only pending contributions can be edited.' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsedData = normalizeFormData(rawData);

  const validated = technologySubmissionSchema.safeParse(parsedData);
  if (!validated.success) {
    const firstError = validated.error.issues[0];
    return { success: false, error: firstError?.message ?? 'Invalid form data' };
  }

  // Use UPDATE instead of delete+reinsert to avoid data loss on insert failure
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('contributions')
    .update({ technology_data: validated.data as Record<string, unknown> })
    .eq('id', idParsed.data)
    .eq('contributor_id', auth.user.id)
    .eq('status', 'pending')
    .select('id, contributor_id, technology_data, status, reviewer_id, review_notes, created_at, updated_at')
    .single();

  if (error || !data) {
    console.error('Failed to update contribution:', error);
    return { success: false, error: 'Failed to update contribution. Please try again.' };
  }

  revalidatePath('/contributor');
  return { success: true, data };
}

export async function deleteContributionAction(
  contributionId: string,
): Promise<ApiResponse<null>> {
  const idParsed = idSchema.safeParse(contributionId);
  if (!idParsed.success) {
    return { success: false, error: 'Invalid contribution ID' };
  }

  const auth = await getAuthorizedUser();
  if ('error' in auth) return auth.error as ApiResponse<null>;

  const result = await deleteContribution(idParsed.data, auth.user.id);
  if (result.success) {
    revalidatePath('/contributor');
  }
  return result;
}

function normalizeFormData(rawData: Record<string, FormDataEntryValue>): Record<string, unknown> {
  return {
    ...rawData,
    pros: parseArrayField(rawData.pros as string),
    cons: parseArrayField(rawData.cons as string),
    best_for: parseArrayField(rawData.best_for as string),
    github_stars: rawData.github_stars ? Number(rawData.github_stars) : null,
    npm_weekly_downloads: rawData.npm_weekly_downloads
      ? Number(rawData.npm_weekly_downloads)
      : null,
    metadata: {},
  };
}

function parseArrayField(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}
