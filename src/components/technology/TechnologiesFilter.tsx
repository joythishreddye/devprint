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
      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search technologies..."
          className="w-full max-w-sm rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      {/* Category pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {formatCategory(cat)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500">
          No technologies match your search.
        </p>
      ) : (
        <>
          <p className="mb-4 text-xs text-zinc-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
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
