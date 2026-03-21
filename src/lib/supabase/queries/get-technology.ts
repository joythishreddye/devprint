import { createServerClient } from '@/lib/supabase/server';
import type { Technology } from '@/types/database';

export async function getTechnologyBySlug(slug: string): Promise<Technology | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching technology:', error);
    return null;
  }

  return data;
}

export async function getAllTechnologies(): Promise<Technology[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching technologies:', error);
    return [];
  }

  return data ?? [];
}

export async function getTechnologiesByCategory(category: string): Promise<Technology[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('category', category)
    .order('name');

  if (error) {
    console.error('Error fetching technologies by category:', error);
    return [];
  }

  return data ?? [];
}
