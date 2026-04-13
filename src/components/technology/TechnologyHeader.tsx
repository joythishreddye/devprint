import Link from 'next/link';
import type { Technology } from '@/types/database';

export interface TechnologyHeaderProps {
  technology: Pick<
    Technology,
    'name' | 'category' | 'description' | 'website_url' | 'github_url' | 'npm_package'
  >;
}

function formatCategory(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function TechnologyHeader({ technology }: TechnologyHeaderProps) {
  const { name, category, description, website_url, github_url, npm_package } = technology;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">
        {formatCategory(category)}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        {website_url && (
          <a
            href={website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Website &rarr;
          </a>
        )}
        {github_url && (
          <a
            href={github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            GitHub &rarr;
          </a>
        )}
        {npm_package && (
          <a
            href={`https://www.npmjs.com/package/${npm_package}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            npm &rarr;
          </a>
        )}
        <span className="text-zinc-200">|</span>
        <Link
          href="/compare"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Compare with another &rarr;
        </Link>
      </div>
    </div>
  );
}
