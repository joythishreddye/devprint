import { createServerClient } from '@/lib/supabase/server';
import type { Technology, UserProfile, Contribution } from '@/types/database';
import type { AdminDashboardStats, ContributionWithContributor } from '@/types/admin';

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createServerClient();

  const [pendingResult, techResult, usersResult] = await Promise.all([
    supabase
      .from('contributions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('technologies')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('user_profiles')
      .select('id', { count: 'exact', head: true }),
  ]);

  return {
    pendingSubmissions: pendingResult.count ?? 0,
    totalTechnologies: techResult.count ?? 0,
    totalUsers: usersResult.count ?? 0,
  };
}

export async function getPendingContributions(): Promise<ContributionWithContributor[]> {
  const supabase = await createServerClient();

  const { data: contributions, error } = await supabase
    .from('contributions')
    .select('id, contributor_id, technology_data, status, reviewer_id, review_notes, created_at, updated_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50);

  if (error || !contributions || contributions.length === 0) {
    if (error) console.error('Failed to fetch pending contributions:', error);
    return [];
  }

  // Batch-fetch contributor display names
  const contributorIds = [...new Set(contributions.map((c) => c.contributor_id))];
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, display_name')
    .in('id', contributorIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return contributions.map((c) => ({
    ...(c as Contribution),
    contributor_display_name: profileMap.get(c.contributor_id) ?? 'Unknown',
  }));
}

export async function getAllTechnologiesAdmin(): Promise<Technology[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('id, name, slug, category, description, logo_url, website_url, github_url, npm_package, github_stars, npm_weekly_downloads, pros, cons, best_for, learning_curve, community_size, maturity, metadata, created_at, updated_at')
    .order('name')
    .limit(200);

  if (error) {
    console.error('Failed to fetch technologies:', error);
    return [];
  }

  return data ?? [];
}

export async function getTechnologyByIdAdmin(id: string): Promise<Technology | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('id, name, slug, category, description, logo_url, website_url, github_url, npm_package, github_stars, npm_weekly_downloads, pros, cons, best_for, learning_curve, community_size, maturity, metadata, created_at, updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch technology:', error);
    return null;
  }

  return data ?? null;
}

export async function getAllUserProfiles(): Promise<UserProfile[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, display_name, role, avatar_url, created_at, updated_at')
    .order('created_at', { ascending: true })
    .limit(200);

  if (error) {
    console.error('Failed to fetch user profiles:', error);
    return [];
  }

  return data ?? [];
}
