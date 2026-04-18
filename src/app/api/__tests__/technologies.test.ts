// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/lib/supabase/queries/cached', () => ({
  getCachedTechnologies: vi.fn(),
  getCachedTechnologiesByCategory: vi.fn(),
  getCachedTechnologyBySlug: vi.fn(),
}));

import { getCachedTechnologies, getCachedTechnologiesByCategory, getCachedTechnologyBySlug } from '@/lib/supabase/queries/cached';
import { NextRequest } from 'next/server';

const MOCK_TECH = {
  id: 'tech-1', name: 'React', slug: 'react', category: 'library',
  description: 'A JS library', logo_url: null, website_url: null, github_url: null,
  npm_package: 'react', github_stars: 220000, npm_weekly_downloads: 50000000,
  pros: ['Composable'], cons: ['JSX'], best_for: ['SPAs'],
  learning_curve: 'intermediate', community_size: 'large', maturity: 'mature',
  metadata: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
};

beforeEach(() => vi.clearAllMocks());

// ─── GET /api/technologies ────────────────────────────────────────────────

describe('GET /api/technologies', () => {
  async function callRoute(url: string) {
    const { GET } = await import('../../../app/api/technologies/route');
    return GET(new NextRequest(url));
  }

  it('returns 200 with technology list', async () => {
    (getCachedTechnologies as Mock).mockResolvedValue([MOCK_TECH]);
    const res = await callRoute('http://localhost/api/technologies');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual([MOCK_TECH]);
  });

  it('filters by category when provided', async () => {
    (getCachedTechnologiesByCategory as Mock).mockResolvedValue([MOCK_TECH]);
    const res = await callRoute('http://localhost/api/technologies?category=library');
    expect(res.status).toBe(200);
    expect(getCachedTechnologiesByCategory).toHaveBeenCalledWith('library');
  });

  it('returns 400 for empty category param', async () => {
    const res = await callRoute('http://localhost/api/technologies?category=');
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returns 400 for category exceeding 50 chars', async () => {
    const res = await callRoute(`http://localhost/api/technologies?category=${'a'.repeat(51)}`);
    expect(res.status).toBe(400);
  });

  it('includes Cache-Control header', async () => {
    (getCachedTechnologies as Mock).mockResolvedValue([]);
    const res = await callRoute('http://localhost/api/technologies');
    expect(res.headers.get('Cache-Control')).toBeTruthy();
  });
});

// ─── GET /api/technologies/[slug] ─────────────────────────────────────────

describe('GET /api/technologies/[slug]', () => {
  async function callRoute(slug: string) {
    const { GET } = await import('../../../app/api/technologies/[slug]/route');
    return GET(new NextRequest(`http://localhost/api/technologies/${slug}`), {
      params: Promise.resolve({ slug }),
    });
  }

  it('returns 200 with the technology', async () => {
    (getCachedTechnologyBySlug as Mock).mockResolvedValue(MOCK_TECH);
    const res = await callRoute('react');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual(MOCK_TECH);
  });

  it('returns 404 when technology not found', async () => {
    (getCachedTechnologyBySlug as Mock).mockResolvedValue(null);
    const res = await callRoute('nonexistent');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returns 400 for invalid slug (uppercase)', async () => {
    const res = await callRoute('React-JS');
    expect(res.status).toBe(400);
  });
});
