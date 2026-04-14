'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import {
  reviewSubmissionSchema,
  technologyFormSchema,
  promoteUserSchema,
} from '@/lib/validators/admin';
import { isPromotion } from '@/lib/admin/roles';
import type { ApiResponse } from '@/types/api';
import type { Technology, UserRole } from '@/types/database';

const idSchema = z.string().uuid('Invalid ID');

// ─── Auth helper ──────────────────────────────────────────────────────────

async function requireAdmin(): Promise<
  { userId: string } | { error: string }
> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') return { error: 'Forbidden' };

  return { userId: user.id };
}

// ─── Submission review ────────────────────────────────────────────────────

export async function reviewSubmissionAction(
  formData: FormData,
): Promise<ApiResponse<null>> {
  const auth = await requireAdmin();
  if ('error' in auth) return { success: false, error: auth.error };

  const raw = {
    contributionId: formData.get('contributionId'),
    action: formData.get('action'),
    reviewNotes: formData.get('reviewNotes') ?? '',
  };

  const parsed = reviewSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { contributionId, action, reviewNotes } = parsed.data;
  const supabase = await createServerClient();

  // Verify contribution is still pending (race condition guard)
  const { data: contribution } = await supabase
    .from('contributions')
    .select('id, status, technology_data')
    .eq('id', contributionId)
    .maybeSingle();

  if (!contribution) return { success: false, error: 'Contribution not found.' };
  if (contribution.status !== 'pending') {
    return { success: false, error: 'This submission has already been reviewed.' };
  }

  if (action === 'approve') {
    // Validate technology_data before insert
    const techParsed = technologyFormSchema.safeParse(contribution.technology_data);
    if (!techParsed.success) {
      const msg = techParsed.error.issues[0]?.message ?? 'Invalid technology data';
      return { success: false, error: `Cannot approve: ${msg}` };
    }

    const { error: insertError } = await supabase
      .from('technologies')
      .insert({
        name: techParsed.data.name,
        slug: techParsed.data.slug,
        category: techParsed.data.category,
        description: techParsed.data.description,
        logo_url: techParsed.data.logo_url,
        website_url: techParsed.data.website_url,
        github_url: techParsed.data.github_url,
        npm_package: techParsed.data.npm_package,
        github_stars: techParsed.data.github_stars,
        npm_weekly_downloads: techParsed.data.npm_weekly_downloads,
        pros: techParsed.data.pros,
        cons: techParsed.data.cons,
        best_for: techParsed.data.best_for,
        learning_curve: techParsed.data.learning_curve,
        community_size: techParsed.data.community_size,
        maturity: techParsed.data.maturity,
        metadata: techParsed.data.metadata,
      });

    if (insertError) {
      // Postgres unique constraint violation on slug
      if (insertError.code === '23505') {
        return {
          success: false,
          error: `A technology with slug "${techParsed.data.slug}" already exists.`,
        };
      }
      console.error('Failed to insert technology:', insertError);
      return { success: false, error: 'Failed to add technology. Please try again.' };
    }
  }

  // Update contribution status
  const { error: updateError } = await supabase
    .from('contributions')
    .update({
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewer_id: auth.userId,
      review_notes: reviewNotes,
    })
    .eq('id', contributionId);

  if (updateError) {
    console.error('Failed to update contribution status:', updateError);
    return { success: false, error: 'Failed to update submission status.' };
  }

  revalidatePath('/admin');
  return { success: true, data: null };
}

// ─── Technology management ────────────────────────────────────────────────

export async function createTechnologyAction(
  formData: FormData,
): Promise<ApiResponse<Technology>> {
  const auth = await requireAdmin();
  if ('error' in auth) return { success: false, error: auth.error };

  const parsed = technologyFormSchema.safeParse(formDataToTechObject(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('technologies')
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      category: parsed.data.category,
      description: parsed.data.description,
      logo_url: parsed.data.logo_url,
      website_url: parsed.data.website_url,
      github_url: parsed.data.github_url,
      npm_package: parsed.data.npm_package,
      github_stars: parsed.data.github_stars,
      npm_weekly_downloads: parsed.data.npm_weekly_downloads,
      pros: parsed.data.pros,
      cons: parsed.data.cons,
      best_for: parsed.data.best_for,
      learning_curve: parsed.data.learning_curve,
      community_size: parsed.data.community_size,
      maturity: parsed.data.maturity,
      metadata: parsed.data.metadata,
    })
    .select('id, name, slug, category, description, logo_url, website_url, github_url, npm_package, github_stars, npm_weekly_downloads, pros, cons, best_for, learning_curve, community_size, maturity, metadata, created_at, updated_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: `A technology with slug "${parsed.data.slug}" already exists.` };
    }
    console.error('Failed to create technology:', error);
    return { success: false, error: 'Failed to create technology.' };
  }

  revalidatePath('/admin');
  return { success: true, data };
}

export async function updateTechnologyAction(
  formData: FormData,
): Promise<ApiResponse<Technology>> {
  const auth = await requireAdmin();
  if ('error' in auth) return { success: false, error: auth.error };

  const idParsed = idSchema.safeParse(formData.get('id'));
  if (!idParsed.success) return { success: false, error: 'Invalid technology ID' };

  const parsed = technologyFormSchema.safeParse(formDataToTechObject(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('technologies')
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      category: parsed.data.category,
      description: parsed.data.description,
      logo_url: parsed.data.logo_url,
      website_url: parsed.data.website_url,
      github_url: parsed.data.github_url,
      npm_package: parsed.data.npm_package,
      github_stars: parsed.data.github_stars,
      npm_weekly_downloads: parsed.data.npm_weekly_downloads,
      pros: parsed.data.pros,
      cons: parsed.data.cons,
      best_for: parsed.data.best_for,
      learning_curve: parsed.data.learning_curve,
      community_size: parsed.data.community_size,
      maturity: parsed.data.maturity,
      metadata: parsed.data.metadata,
    })
    .eq('id', idParsed.data)
    .select('id, name, slug, category, description, logo_url, website_url, github_url, npm_package, github_stars, npm_weekly_downloads, pros, cons, best_for, learning_curve, community_size, maturity, metadata, created_at, updated_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: `A technology with slug "${parsed.data.slug}" already exists.` };
    }
    console.error('Failed to update technology:', error);
    return { success: false, error: 'Failed to update technology.' };
  }

  revalidatePath('/admin');
  return { success: true, data };
}

export async function deleteTechnologyAction(
  formData: FormData,
): Promise<ApiResponse<null>> {
  const auth = await requireAdmin();
  if ('error' in auth) return { success: false, error: auth.error };

  const idParsed = idSchema.safeParse(formData.get('id'));
  if (!idParsed.success) return { success: false, error: 'Invalid technology ID' };

  const supabase = await createServerClient();
  const { error } = await supabase
    .from('technologies')
    .delete()
    .eq('id', idParsed.data);

  if (error) {
    console.error('Failed to delete technology:', error);
    return { success: false, error: 'Failed to delete technology.' };
  }

  revalidatePath('/admin');
  return { success: true, data: null };
}

// ─── User role management ─────────────────────────────────────────────────

export async function promoteUserAction(
  formData: FormData,
): Promise<ApiResponse<null>> {
  const auth = await requireAdmin();
  if ('error' in auth) return { success: false, error: auth.error };

  const parsed = promoteUserSchema.safeParse({
    userId: formData.get('userId'),
    newRole: formData.get('newRole'),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { userId, newRole } = parsed.data;

  if (userId === auth.userId) {
    return { success: false, error: 'You cannot change your own role.' };
  }

  const supabase = await createServerClient();

  // Fetch current role to verify this is a promotion
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) return { success: false, error: 'User not found.' };

  if (!isPromotion(profile.role as UserRole, newRole)) {
    return { success: false, error: 'Role can only be promoted, not demoted.' };
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error('Failed to promote user:', error);
    return { success: false, error: 'Failed to update user role.' };
  }

  revalidatePath('/admin');
  return { success: true, data: null };
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function parseArrayField(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function formDataToTechObject(formData: FormData): Record<string, unknown> {
  return {
    name: formData.get('name'),
    slug: formData.get('slug'),
    category: formData.get('category'),
    description: formData.get('description'),
    logo_url: formData.get('logo_url') ?? null,
    website_url: formData.get('website_url') ?? null,
    github_url: formData.get('github_url') ?? null,
    npm_package: formData.get('npm_package') ?? null,
    github_stars: formData.get('github_stars') ? Number(formData.get('github_stars')) : null,
    npm_weekly_downloads: formData.get('npm_weekly_downloads')
      ? Number(formData.get('npm_weekly_downloads'))
      : null,
    pros: parseArrayField(formData.get('pros')),
    cons: parseArrayField(formData.get('cons')),
    best_for: parseArrayField(formData.get('best_for')),
    learning_curve: formData.get('learning_curve'),
    community_size: formData.get('community_size'),
    maturity: formData.get('maturity'),
    metadata: {},
  };
}
