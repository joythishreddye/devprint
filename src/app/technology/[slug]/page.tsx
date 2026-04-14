import { notFound } from 'next/navigation';
import type React from 'react';
import TechnologyHeader from '@/components/technology/TechnologyHeader';
import TechnologyStats from '@/components/technology/TechnologyStats';
import TechnologyProsCons from '@/components/technology/TechnologyProsCons';

interface TechnologyPageProps {
  params: Promise<{ slug: string }>;
}

async function getTechnology(slug: string) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const { FIXTURE_TECHNOLOGIES_BY_SLUG } = await import('@/lib/comparison/fixtures');
    return FIXTURE_TECHNOLOGIES_BY_SLUG[slug] ?? null;
  }
  const { getTechnologyBySlug } = await import('@/lib/supabase/queries/get-technology');
  return getTechnologyBySlug(slug);
}

export default async function TechnologyPage({
  params,
}: TechnologyPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const technology = await getTechnology(slug);

  if (!technology) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      {/* Hero band — same tonal treatment as landing page hero */}
      <div className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <TechnologyHeader technology={technology} />
        </div>
      </div>

      {/* Stats + pros/cons on white */}
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-6">
        <TechnologyStats technology={technology} />
        <TechnologyProsCons technology={technology} />
      </div>
    </div>
  );
}
