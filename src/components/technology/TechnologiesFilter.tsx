'use client';

import { useState } from 'react';
import type { Technology } from '@/types/database';
import { TechnologyCard } from '@/components/ui/TechnologyCard';

export interface TechnologiesFilterProps {
  technologies: Technology[];
  categories: string[];
}

function formatCategory(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function TechnologiesFilter({
  technologies,
  categories,
}: TechnologiesFilterProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = technologies.filter((tech) => {
    const matchesCategory =
      activeCategory === 'all' || tech.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery =
      q === '' ||
      tech.name.toLowerCase().includes(q) ||
      tech.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      {/* Control panel — contained surface so filters feel designed, not floating */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search technologies..."
            aria-label="Search technologies by name or description"
            className="w-full max-w-xs rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:bg-white focus:ring-1 focus:ring-zinc-300"
          />
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              aria-pressed={activeCategory === 'all'}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <p className="text-sm font-medium text-zinc-700">No technologies match your search</p>
          <p className="text-sm text-zinc-500">
            Try a different search term or clear the category filter.
          </p>
          <button
            type="button"
            onClick={() => { setQuery(''); setActiveCategory('all'); }}
            className="mt-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="mb-5 text-xs font-medium text-zinc-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
