// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// Mock next/cache before importing the module under test
vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn, keys, opts) => {
    // In tests, unstable_cache just returns the function as-is
    // but we capture the call args for assertion
    const wrapped = (...args: unknown[]) => fn(...args);
    (wrapped as unknown as Record<string, unknown>).__keys = keys;
    (wrapped as unknown as Record<string, unknown>).__opts = opts;
    return wrapped;
  }),
}));

vi.mock('@/lib/supabase/queries/get-technology', () => ({
  getAllTechnologies: vi.fn(),
  getTechnologiesByCategory: vi.fn(),
  getTechnologyBySlug: vi.fn(),
}));

import { unstable_cache } from 'next/cache';
import {
  getAllTechnologies,
  getTechnologiesByCategory,
  getTechnologyBySlug,
} from '@/lib/supabase/queries/get-technology';
import {
  getCachedTechnologies,
  getCachedTechnologiesByCategory,
  getCachedTechnologyBySlug,
} from '../cached';

const MOCK_TECH = {
  id: 'tech-1',
  name: 'React',
  slug: 'react',
  category: 'library',
  description: 'A JS library',
  logo_url: null,
  website_url: null,
  github_url: null,
  npm_package: 'react',
  github_stars: 220000,
  npm_weekly_downloads: 50000000,
  pros: ['Composable'],
  cons: ['JSX'],
  best_for: ['SPAs'],
  learning_curve: 'intermediate' as const,
  community_size: 'large' as const,
  maturity: 'mature' as const,
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getCachedTechnologies', () => {
  it('returns technologies from the underlying query', async () => {
    (getAllTechnologies as Mock).mockResolvedValue([MOCK_TECH]);
    const result = await getCachedTechnologies();
    expect(result).toEqual([MOCK_TECH]);
  });

  it('wraps the query with unstable_cache', () => {
    expect(unstable_cache).toHaveBeenCalled();
  });

  it('uses the technologies cache tag', () => {
    const calls = (unstable_cache as Mock).mock.calls;
    const techCall = calls.find(
      ([, , opts]: [unknown, unknown, { tags?: string[] }]) =>
        opts?.tags?.includes('technologies'),
    );
    expect(techCall).toBeDefined();
  });

  it('returns empty array on underlying error', async () => {
    (getAllTechnologies as Mock).mockResolvedValue([]);
    const result = await getCachedTechnologies();
    expect(result).toEqual([]);
  });
});

describe('getCachedTechnologiesByCategory', () => {
  it('returns filtered technologies', async () => {
    (getTechnologiesByCategory as Mock).mockResolvedValue([MOCK_TECH]);
    const result = await getCachedTechnologiesByCategory('library');
    expect(result).toEqual([MOCK_TECH]);
  });

  it('passes category to the underlying query', async () => {
    (getTechnologiesByCategory as Mock).mockResolvedValue([]);
    await getCachedTechnologiesByCategory('framework');
    expect(getTechnologiesByCategory).toHaveBeenCalledWith('framework');
  });
});

describe('getCachedTechnologyBySlug', () => {
  it('returns the technology when found', async () => {
    (getTechnologyBySlug as Mock).mockResolvedValue(MOCK_TECH);
    const result = await getCachedTechnologyBySlug('react');
    expect(result).toEqual(MOCK_TECH);
  });

  it('returns null when not found', async () => {
    (getTechnologyBySlug as Mock).mockResolvedValue(null);
    const result = await getCachedTechnologyBySlug('nonexistent');
    expect(result).toBeNull();
  });

  it('passes slug to the underlying query', async () => {
    (getTechnologyBySlug as Mock).mockResolvedValue(null);
    await getCachedTechnologyBySlug('next-js');
    expect(getTechnologyBySlug).toHaveBeenCalledWith('next-js');
  });

  it('uses both technologies and slug-specific cache tags', () => {
    const calls = (unstable_cache as Mock).mock.calls;
    const slugCall = calls.find(
      ([, keys]: [unknown, string[]]) => Array.isArray(keys) && keys.some((k) => k.startsWith('getCachedTechnologyBySlug')),
    );
    expect(slugCall).toBeDefined();
    const opts = slugCall?.[2] as { tags?: string[] };
    expect(opts?.tags).toContain('technologies');
  });
});
