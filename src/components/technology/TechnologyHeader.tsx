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
    <div className="mb-10">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          {formatCategory(category)}
        </span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{name}</h1>
      <p className="mt-4 text-lg leading-8 text-zinc-600 max-w-3xl">{description}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        {website_url && (
          <a
            href={website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors underline underline-offset-2"
          >
            Website
          </a>
        )}
        {github_url && (
          <a
            href={github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors underline underline-offset-2"
          >
            GitHub
          </a>
        )}
        {npm_package && (
          <a
            href={`https://www.npmjs.com/package/${npm_package}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors underline underline-offset-2"
          >
            npm
          </a>
        )}
        <Link
          href="/compare"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors underline underline-offset-2"
        >
          Compare with another &rarr;
        </Link>
      </div>
    </div>
  );
}
