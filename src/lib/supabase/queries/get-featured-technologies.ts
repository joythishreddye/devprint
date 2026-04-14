import type { Technology } from '@/types/database';

export async function getFeaturedTechnologies(): Promise<Technology[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const { FIXTURE_TECHNOLOGIES } = await import('@/lib/comparison/fixtures');
    return FIXTURE_TECHNOLOGIES.slice(0, 6);
  }

  try {
    const { createServerClient } = await import('@/lib/supabase/server');
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('technologies')
      .select(
        'id, name, slug, category, description, logo_url, website_url, github_url, npm_package, github_stars, npm_weekly_downloads, pros, cons, best_for, learning_curve, community_size, maturity, metadata, created_at, updated_at'
      )
      .order('github_stars', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Failed to fetch featured technologies:', error);
      const { FIXTURE_TECHNOLOGIES } = await import('@/lib/comparison/fixtures');
      return FIXTURE_TECHNOLOGIES.slice(0, 6);
    }

    return data ?? [];
  } catch {
    const { FIXTURE_TECHNOLOGIES } = await import('@/lib/comparison/fixtures');
    return FIXTURE_TECHNOLOGIES.slice(0, 6);
  }
}
