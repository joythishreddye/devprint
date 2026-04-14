import Link from 'next/link';
import type { Technology } from '@/types/database';

export interface TechnologyCardProps {
  technology: Pick<
    Technology,
    'name' | 'slug' | 'category' | 'description' | 'github_stars' | 'learning_curve' | 'maturity'
  >;
}

function formatStars(stars: number | null): string {
  if (stars === null) return '';
  if (stars >= 1000) return `${(stars / 1000).toFixed(0)}k stars`;
  return `${stars} stars`;
}

function formatCategory(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function TechnologyCard({ technology }: TechnologyCardProps) {
  const { name, slug, category, description, github_stars, learning_curve, maturity } =
    technology;

  return (
    <Link
      href={`/technology/${slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-150 hover:border-zinc-300 hover:shadow-md hover:-translate-y-px"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
          {name}
        </span>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
          {formatCategory(category)}
        </span>
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600">{description}</p>

      <div className="mt-auto flex items-center gap-3 border-t border-zinc-100 pt-3 text-xs text-zinc-400">
        {github_stars !== null && (
          <span>{formatStars(github_stars)}</span>
        )}
        <span className="capitalize">{learning_curve}</span>
        <span className="capitalize">{maturity}</span>
      </div>
    </Link>
  );
}
