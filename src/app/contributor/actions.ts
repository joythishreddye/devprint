'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { technologySubmissionSchema } from '@/lib/validators/contribution';
import {
  submitContribution,
  deleteContribution,
  getContributionById,
} from '@/lib/supabase/queries/contributions';
import type { ApiResponse } from '@/types/api';
import type { Contribution } from '@/types/database';
import { z } from 'zod';

const idSchema = z.string().uuid('Invalid contribution ID');

export async function submitContributionAction(
  formData: FormData,
): Promise<ApiResponse<Contribution>> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const rawData = Object.fromEntries(formData.entries());

  // Parse comma-separated array fields from form
  const parsedData = {
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

  const parsed = technologySubmissionSchema.safeParse(parsedData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? 'Invalid form data',
    };
  }

  const result = await submitContribution(user.id, parsed.data as Record<string, unknown>);
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

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify the contribution is still pending and owned by the user
  const existing = await getContributionById(idParsed.data, user.id);
  if (!existing) {
    return { success: false, error: 'Contribution not found.' };
  }
  if (existing.status !== 'pending') {
    return { success: false, error: 'Only pending contributions can be edited.' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsedData = {
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

  const validated = technologySubmissionSchema.safeParse(parsedData);
  if (!validated.success) {
    const firstError = validated.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? 'Invalid form data',
    };
  }

  // Delete existing, then re-insert
  const deleteResult = await deleteContribution(idParsed.data, user.id);
  if (!deleteResult.success) {
    return deleteResult as ApiResponse<Contribution>;
  }

  const insertResult = await submitContribution(
    user.id,
    validated.data as Record<string, unknown>,
  );
  if (insertResult.success) {
    revalidatePath('/contributor');
  }
  return insertResult;
}

export async function deleteContributionAction(
  contributionId: string,
): Promise<ApiResponse<null>> {
  const idParsed = idSchema.safeParse(contributionId);
  if (!idParsed.success) {
    return { success: false, error: 'Invalid contribution ID' };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const result = await deleteContribution(idParsed.data, user.id);
  if (result.success) {
    revalidatePath('/contributor');
  }
  return result;
}

function parseArrayField(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}
