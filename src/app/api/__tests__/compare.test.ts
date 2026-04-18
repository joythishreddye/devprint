// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/lib/supabase/queries/cached', () => ({
  getCachedTechnologies: vi.fn(),
  getCachedTechnologiesByCategory: vi.fn(),
  getCachedTechnologyBySlug: vi.fn(),
}));

import { getCachedTechnologyBySlug } from '@/lib/supabase/queries/cached';
import { NextRequest } from 'next/server';

const makeTech = (slug: string, name: string) => ({
  id: `id-${slug}`, name, slug, category: 'library',
  description: `${name} description`, logo_url: null, website_url: null, github_url: null,
  npm_package: slug, github_stars: 100000, npm_weekly_downloads: 10000000,
  pros: ['Fast'], cons: ['Complex'], best_for: ['Web'],
  learning_curve: 'intermediate' as const, community_size: 'large' as const, maturity: 'mature' as const,
  metadata: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
});

const REACT = makeTech('react', 'React');
const VUE = makeTech('vue', 'Vue');

beforeEach(() => vi.clearAllMocks());

async function callRoute(url: string) {
  const { GET } = await import('../../../app/api/compare/route');
  return GET(new NextRequest(url));
}

describe('GET /api/compare', () => {
  it('returns 200 with comparison result for valid slug pair', async () => {
    (getCachedTechnologyBySlug as Mock)
      .mockResolvedValueOnce(REACT)
      .mockResolvedValueOnce(VUE);
    const res = await callRoute('http://localhost/api/compare?a=react&b=vue');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.result).toBeDefined();
    expect(body.data.summary).toBeDefined();
  });

  it('returns 400 when a === b', async () => {
    const res = await callRoute('http://localhost/api/compare?a=react&b=react');
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returns 400 when a param is missing', async () => {
    const res = await callRoute('http://localhost/api/compare?b=vue');
    expect(res.status).toBe(400);
  });

  it('returns 400 when b param is missing', async () => {
    const res = await callRoute('http://localhost/api/compare?a=react');
    expect(res.status).toBe(400);
  });

  it('returns 404 when technology a is not found', async () => {
    (getCachedTechnologyBySlug as Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(VUE);
    const res = await callRoute('http://localhost/api/compare?a=nonexistent&b=vue');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/nonexistent/);
  });

  it('returns 404 when technology b is not found', async () => {
    (getCachedTechnologyBySlug as Mock)
      .mockResolvedValueOnce(REACT)
      .mockResolvedValueOnce(null);
    const res = await callRoute('http://localhost/api/compare?a=react&b=nonexistent');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/nonexistent/);
  });

  it('returns 400 for invalid slug format', async () => {
    const res = await callRoute('http://localhost/api/compare?a=React&b=vue');
    expect(res.status).toBe(400);
  });

  it('includes Cache-Control header on success', async () => {
    (getCachedTechnologyBySlug as Mock)
      .mockResolvedValueOnce(REACT)
      .mockResolvedValueOnce(VUE);
    const res = await callRoute('http://localhost/api/compare?a=react&b=vue');
    expect(res.headers.get('Cache-Control')).toBeTruthy();
  });
});
