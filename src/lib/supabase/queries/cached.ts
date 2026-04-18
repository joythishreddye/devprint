import { unstable_cache } from 'next/cache';
import {
  getAllTechnologies,
  getTechnologiesByCategory,
  getTechnologyBySlug,
} from '@/lib/supabase/queries/get-technology';
import type { Technology } from '@/types/database';

const REVALIDATE_SECONDS = 300; // 5 minutes

/** All technologies, cached with the 'technologies' tag */
export const getCachedTechnologies: () => Promise<Technology[]> = unstable_cache(
  () => getAllTechnologies(),
  ['getCachedTechnologies'],
  { tags: ['technologies'], revalidate: REVALIDATE_SECONDS },
);

/** Technologies filtered by category, cached with the 'technologies' tag */
export const getCachedTechnologiesByCategory: (category: string) => Promise<Technology[]> =
  unstable_cache(
    (category: string) => getTechnologiesByCategory(category),
    ['getCachedTechnologiesByCategory'],
    { tags: ['technologies'], revalidate: REVALIDATE_SECONDS },
  );

/** Single technology by slug, cached with the 'technologies' tag */
export const getCachedTechnologyBySlug: (slug: string) => Promise<Technology | null> =
  unstable_cache(
    (slug: string) => getTechnologyBySlug(slug),
    ['getCachedTechnologyBySlug'],
    { tags: ['technologies'], revalidate: REVALIDATE_SECONDS },
  );
