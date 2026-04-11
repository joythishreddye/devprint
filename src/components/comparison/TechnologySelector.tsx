'use client';

import type { Technology } from '@/types/database';

export interface TechnologySelectorProps {
  technologies: Pick<Technology, 'name' | 'slug'>[];
  selectedSlugA: string;
  selectedSlugB: string;
  onChangeA: (slug: string) => void;
  onChangeB: (slug: string) => void;
  validationError: string | null;
}

export function TechnologySelector({
  technologies,
  selectedSlugA,
  selectedSlugB,
  onChangeA,
  onChangeB,
  validationError,
}: TechnologySelectorProps): React.ReactElement {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label htmlFor="tech-a" className="mb-1 block text-sm font-medium text-zinc-700">
            First technology
          </label>
          <select
            id="tech-a"
            value={selectedSlugA}
            onChange={(e) => onChangeA(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a technology</option>
            {technologies.map((tech) => (
              <option key={tech.slug} value={tech.slug}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>

        <span className="mt-5 text-zinc-400">vs</span>

        <div className="flex-1">
          <label htmlFor="tech-b" className="mb-1 block text-sm font-medium text-zinc-700">
            Second technology
          </label>
          <select
            id="tech-b"
            value={selectedSlugB}
            onChange={(e) => onChangeB(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a technology</option>
            {technologies.map((tech) => (
              <option key={tech.slug} value={tech.slug}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {validationError !== null && (
        <p role="alert" className="text-sm text-red-600">
          {validationError}
        </p>
      )}
    </div>
  );
}
