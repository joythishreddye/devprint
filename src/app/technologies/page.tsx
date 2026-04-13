import type React from 'react';
import TechnologiesFilter from '@/components/technology/TechnologiesFilter';
import type { Technology } from '@/types/database';

async function getTechnologies(): Promise<Technology[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const { FIXTURE_TECHNOLOGIES } = await import('@/lib/comparison/fixtures');
    return FIXTURE_TECHNOLOGIES;
  }
  try {
    const { getAllTechnologies } = await import('@/lib/supabase/queries/get-technology');
    return getAllTechnologies();
  } catch {
    const { FIXTURE_TECHNOLOGIES } = await import('@/lib/comparison/fixtures');
    return FIXTURE_TECHNOLOGIES;
  }
}

export default async function TechnologiesPage(): Promise<React.ReactElement> {
  const technologies = await getTechnologies();
  const categories = Array.from(new Set(technologies.map((t) => t.category))).sort();

  return (
    <div className="flex flex-col">
      {/* Page header band — mirrors landing page section rhythm */}
      <div className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-2">
            Library
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Browse Technologies
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Explore {technologies.length} technologies across {categories.length} categories.
            Filter by category or search by name to find the right fit for your project.
          </p>
        </div>
      </div>

      {/* Filter + grid */}
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <TechnologiesFilter technologies={technologies} categories={categories} />
      </div>
    </div>
  );
}
