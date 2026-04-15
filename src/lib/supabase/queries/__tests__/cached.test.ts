// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn: (...args: unknown[]) => unknown) => {
    // Return a passthrough in tests so we can verify underlying queries are called
    return (...args: unknown[]) => fn(...args);
  }),
}));

vi.mock('@/lib/supabase/queries/get-technology', () => ({
  getAllTechnologies: vi.fn(),
  getTechnologiesByCategory: vi.fn(),
  getTechnologyBySlug: vi.fn(),
}));

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
  id: 'tech-1', name: 'React', slug: 'react', category: 'library',
  description: 'A JS library', logo_url: null, website_url: null, github_url: null,
  npm_package: 'react', github_stars: 220000, npm_weekly_downloads: 50000000,
  pros: ['Composable'], cons: ['JSX'], best_for: ['SPAs'],
  learning_curve: 'intermediate' as const, community_size: 'large' as const, maturity: 'mature' as const,
  metadata: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
};

beforeEach(() => vi.clearAllMocks());

// ─── getCachedTechnologies ────────────────────────────────────────────────

describe('getCachedTechnologies', () => {
  it('returns technologies from the underlying query', async () => {
    (getAllTechnologies as Mock).mockResolvedValue([MOCK_TECH]);
    const result = await getCachedTechnologies();
    expect(result).toEqual([MOCK_TECH]);
  });

  it('delegates to getAllTechnologies', async () => {
    (getAllTechnologies as Mock).mockResolvedValue([]);
    await getCachedTechnologies();
    expect(getAllTechnologies).toHaveBeenCalledOnce();
  });

  it('returns empty array when underlying query returns empty', async () => {
    (getAllTechnologies as Mock).mockResolvedValue([]);
    expect(await getCachedTechnologies()).toEqual([]);
  });
});

// ─── getCachedTechnologiesByCategory ─────────────────────────────────────

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

  it('returns empty array when no match', async () => {
    (getTechnologiesByCategory as Mock).mockResolvedValue([]);
    expect(await getCachedTechnologiesByCategory('unknown')).toEqual([]);
  });
});

// ─── getCachedTechnologyBySlug ────────────────────────────────────────────

describe('getCachedTechnologyBySlug', () => {
  it('returns the technology when found', async () => {
    (getTechnologyBySlug as Mock).mockResolvedValue(MOCK_TECH);
    const result = await getCachedTechnologyBySlug('react');
    expect(result).toEqual(MOCK_TECH);
  });

  it('returns null when not found', async () => {
    (getTechnologyBySlug as Mock).mockResolvedValue(null);
    expect(await getCachedTechnologyBySlug('nonexistent')).toBeNull();
  });

  it('passes slug to the underlying query', async () => {
    (getTechnologyBySlug as Mock).mockResolvedValue(null);
    await getCachedTechnologyBySlug('next-js');
    expect(getTechnologyBySlug).toHaveBeenCalledWith('next-js');
  });
});
