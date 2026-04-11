'use client';

import { useRouter } from 'next/navigation';
import type { Technology } from '@/types/database';
import { TechnologySelector } from './TechnologySelector';

export interface ComparisonClientProps {
  technologies: Pick<Technology, 'name' | 'slug'>[];
  initialSlugA: string;
  initialSlugB: string;
  validationError: string | null;
}

export function ComparisonClient({
  technologies,
  initialSlugA,
  initialSlugB,
  validationError,
}: ComparisonClientProps): React.ReactElement {
  const router = useRouter();

  function handleChangeA(slug: string): void {
    router.replace(`/compare?a=${slug}&b=${initialSlugB}`, { scroll: false });
  }

  function handleChangeB(slug: string): void {
    router.replace(`/compare?a=${initialSlugA}&b=${slug}`, { scroll: false });
  }

  return (
    <TechnologySelector
      technologies={technologies}
      selectedSlugA={initialSlugA}
      selectedSlugB={initialSlugB}
      onChangeA={handleChangeA}
      onChangeB={handleChangeB}
      validationError={validationError}
    />
  );
}
