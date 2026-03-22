import { createServerClient } from '@/lib/supabase/server';
import type { Technology } from '@/types/database';

export async function getTechnologyBySlug(slug: string): Promise<Technology | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('id, name, slug, category, description, logo_url, website_url, github_url, npm_package, github_stars, npm_weekly_downloads, pros, cons, best_for, learning_curve, community_size, maturity, metadata, created_at, updated_at')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching technology:', error);
    return null;
  }

  return data;
}

export async function getAllTechnologies(): Promise<Technology[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('id, name, slug, category, description, logo_url, website_url, github_url, npm_package, github_stars, npm_weekly_downloads, pros, cons, best_for, learning_curve, community_size, maturity, metadata, created_at, updated_at')
    .order('name')
    .limit(100);

  if (error) {
    console.error('Error fetching technologies:', error);
    return [];
  }

  return data ?? [];
}

export async function getTechnologiesByCategory(category: string): Promise<Technology[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('id, name, slug, category, description, logo_url, website_url, github_url, npm_package, github_stars, npm_weekly_downloads, pros, cons, best_for, learning_curve, community_size, maturity, metadata, created_at, updated_at')
    .eq('category', category)
    .order('name')
    .limit(100);

  if (error) {
    console.error('Error fetching technologies by category:', error);
    return [];
  }

  return data ?? [];
}
