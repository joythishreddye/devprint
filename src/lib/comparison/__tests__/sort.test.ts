// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { sortTechnologies, type SortedTechnology } from '../sort';
import type { Technology } from '@/types/database';
import { compareTechnologies } from '../compare-technologies';

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const makeTech = (overrides: Partial<Technology> & { id: string; name: string; slug: string }): Technology => ({
  id: overrides.id,
  name: overrides.name,
  slug: overrides.slug,
  category: 'frontend-framework',
  description: 'A test technology',
  logo_url: null,
  website_url: null,
  github_url: null,
  npm_package: null,
  github_stars: 50000,
  npm_weekly_downloads: 5000000,
  pros: ['pro1', 'pro2'],
  cons: ['con1'],
  best_for: ['spas', 'teams'],
  learning_curve: 'intermediate',
  community_size: 'large',
  maturity: 'mature',
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

/** High-signal tech: large community, tons of downloads, mature, beginner curve */
const highScoreTech: Technology = makeTech({
  id: 'high',
  name: 'HighScore',
  slug: 'high-score',
  github_stars: 200000,
  npm_weekly_downloads: 25000000,
  community_size: 'large',
  maturity: 'mature',
  learning_curve: 'beginner',
  best_for: ['spas', 'teams', 'enterprise', 'mobile'],
});

/** Low-signal tech: small community, few downloads, emerging, advanced curve */
const lowScoreTech: Technology = makeTech({
  id: 'low',
  name: 'LowScore',
  slug: 'low-score',
  github_stars: 500,
  npm_weekly_downloads: 1000,
  community_size: 'small',
  maturity: 'emerging',
  learning_curve: 'advanced',
  best_for: ['niche'],
});

/** Mid-tier tech */
const midScoreTech: Technology = makeTech({
  id: 'mid',
  name: 'MidScore',
  slug: 'mid-score',
  github_stars: 20000,
  npm_weekly_downloads: 2000000,
  community_size: 'medium',
  maturity: 'growing',
  learning_curve: 'intermediate',
  best_for: ['small teams'],
});

/** Identical clone of highScoreTech (for tie tests) */
const highScoreTwin: Technology = { ...highScoreTech, id: 'high-twin', name: 'HighScoreTwin', slug: 'high-score-twin' };

// ─── Empty / single-item edge cases ──────────────────────────────────────────

describe('sortTechnologies — empty and single-item', () => {
  it('returns an empty array when given an empty array', () => {
    expect(sortTechnologies([])).toEqual([]);
  });

  it('returns a single entry with rank 1 when given one technology', () => {
    const result = sortTechnologies([highScoreTech]);
    expect(result).toHaveLength(1);
    expect(result[0].rank).toBe(1);
    expect(result[0].technology).toBe(highScoreTech);
  });

  it('score for a single technology is a finite number', () => {
    const result = sortTechnologies([highScoreTech]);
    expect(Number.isFinite(result[0].score)).toBe(true);
  });
});

// ─── Descending ordering (default) ───────────────────────────────────────────

describe('sortTechnologies — descending order (default)', () => {
  it('returns technologies sorted high-to-low by score by default', () => {
    const result = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech]);
    expect(result[0].technology.slug).toBe('high-score');
    expect(result[result.length - 1].technology.slug).toBe('low-score');
  });

  it('rank 1 goes to the highest-scoring technology', () => {
    const result = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech]);
    const rankOne = result.find((r) => r.rank === 1);
    expect(rankOne).toBeDefined();
    expect(rankOne!.technology.slug).toBe('high-score');
  });

  it('ranks are in ascending order across a fully distinct-scored list', () => {
    const result = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech]);
    const ranks = result.map((r) => r.rank);
    expect(ranks).toEqual([1, 2, 3]);
  });

  it('explicit order:"desc" produces the same result as the default', () => {
    const defaultResult = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech]);
    const explicitResult = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech], { order: 'desc' });
    expect(explicitResult.map((r) => r.technology.slug)).toEqual(
      defaultResult.map((r) => r.technology.slug),
    );
  });
});

// ─── Ascending ordering ───────────────────────────────────────────────────────

describe('sortTechnologies — ascending order', () => {
  it('returns technologies sorted low-to-high when order is "asc"', () => {
    const result = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech], { order: 'asc' });
    expect(result[0].technology.slug).toBe('low-score');
    expect(result[result.length - 1].technology.slug).toBe('high-score');
  });

  it('rank 1 goes to the lowest-scoring technology in ascending mode', () => {
    const result = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech], { order: 'asc' });
    const rankOne = result.find((r) => r.rank === 1);
    expect(rankOne).toBeDefined();
    expect(rankOne!.technology.slug).toBe('low-score');
  });

  it('asc and desc produce reversed slug orders for a distinct-scored list', () => {
    const desc = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech]);
    const asc = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech], { order: 'asc' });
    expect(asc.map((r) => r.technology.slug)).toEqual(
      desc.map((r) => r.technology.slug).reverse(),
    );
  });
});

// ─── Score bounds ─────────────────────────────────────────────────────────────

describe('sortTechnologies — score bounds', () => {
  it('every score is a finite number (no NaN or Infinity)', () => {
    const result = sortTechnologies([highScoreTech, midScoreTech, lowScoreTech]);
    for (const item of result) {
      expect(Number.isFinite(item.score)).toBe(true);
    }
  });

  it('every score is in the range [0, 10]', () => {
    const result = sortTechnologies([highScoreTech, midScoreTech, lowScoreTech]);
    for (const item of result) {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(10);
    }
  });

  it('high-signal tech has a strictly greater score than low-signal tech', () => {
    const result = sortTechnologies([lowScoreTech, highScoreTech]);
    const high = result.find((r) => r.technology.slug === 'high-score')!;
    const low = result.find((r) => r.technology.slug === 'low-score')!;
    expect(high.score).toBeGreaterThan(low.score);
  });
});

// ─── Null stats ───────────────────────────────────────────────────────────────

describe('sortTechnologies — null numeric stats', () => {
  it('does not throw when github_stars is null', () => {
    const tech = makeTech({ id: 'n1', name: 'NoStars', slug: 'no-stars', github_stars: null });
    expect(() => sortTechnologies([tech])).not.toThrow();
  });

  it('does not throw when npm_weekly_downloads is null', () => {
    const tech = makeTech({ id: 'n2', name: 'NoNpm', slug: 'no-npm', npm_weekly_downloads: null });
    expect(() => sortTechnologies([tech])).not.toThrow();
  });

  it('does not throw when both github_stars and npm_weekly_downloads are null', () => {
    const tech = makeTech({ id: 'n3', name: 'NoStats', slug: 'no-stats', github_stars: null, npm_weekly_downloads: null });
    expect(() => sortTechnologies([tech])).not.toThrow();
  });

  it('tech with null stats still gets a valid finite score in [0, 10]', () => {
    const tech = makeTech({ id: 'n4', name: 'NoStats2', slug: 'no-stats-2', github_stars: null, npm_weekly_downloads: null });
    const result = sortTechnologies([tech]);
    expect(Number.isFinite(result[0].score)).toBe(true);
    expect(result[0].score).toBeGreaterThanOrEqual(0);
    expect(result[0].score).toBeLessThanOrEqual(10);
  });

  it('tech with all stats null is ranked lower than a tech with high stats', () => {
    const noStats = makeTech({ id: 'n5', name: 'NoStats3', slug: 'no-stats-3', github_stars: null, npm_weekly_downloads: null, community_size: 'small', maturity: 'emerging' });
    const result = sortTechnologies([noStats, highScoreTech]);
    expect(result[0].technology.slug).toBe('high-score');
  });
});

// ─── Tie handling ─────────────────────────────────────────────────────────────

describe('sortTechnologies — tie handling', () => {
  it('two identical technologies get the same rank', () => {
    const result = sortTechnologies([highScoreTech, highScoreTwin]);
    expect(result[0].rank).toBe(result[1].rank);
  });

  it('when two techs tie at the top, the next distinct rank is 3 (standard competition ranking)', () => {
    const result = sortTechnologies([highScoreTech, highScoreTwin, lowScoreTech]);
    const tiedRanks = result.filter((r) => r.rank === 1);
    const nextItem = result.find((r) => r.technology.slug === 'low-score');
    expect(tiedRanks).toHaveLength(2);
    expect(nextItem!.rank).toBe(3);
  });

  it('when all technologies are identical, all get rank 1', () => {
    const clone1: Technology = { ...highScoreTech, id: 'c1', name: 'Clone1', slug: 'clone1' };
    const clone2: Technology = { ...highScoreTech, id: 'c2', name: 'Clone2', slug: 'clone2' };
    const clone3: Technology = { ...highScoreTech, id: 'c3', name: 'Clone3', slug: 'clone3' };
    const result = sortTechnologies([clone1, clone2, clone3]);
    for (const item of result) {
      expect(item.rank).toBe(1);
    }
  });

  it('tied items have the same score', () => {
    const result = sortTechnologies([highScoreTech, highScoreTwin]);
    expect(result[0].score).toBeCloseTo(result[1].score, 5);
  });
});

// ─── Result shape ─────────────────────────────────────────────────────────────

describe('sortTechnologies — result shape', () => {
  it('every result item has technology, score, and rank fields', () => {
    const result = sortTechnologies([highScoreTech, midScoreTech]);
    for (const item of result) {
      expect(item).toHaveProperty('technology');
      expect(item).toHaveProperty('score');
      expect(item).toHaveProperty('rank');
    }
  });

  it('result length equals input length', () => {
    const techs = [highScoreTech, midScoreTech, lowScoreTech];
    const result = sortTechnologies(techs);
    expect(result).toHaveLength(techs.length);
  });

  it('every input technology appears exactly once in the output', () => {
    const techs = [highScoreTech, midScoreTech, lowScoreTech];
    const result = sortTechnologies(techs);
    const outputSlugs = result.map((r) => r.technology.slug);
    for (const tech of techs) {
      expect(outputSlugs.filter((s) => s === tech.slug)).toHaveLength(1);
    }
  });

  it('rank values are positive integers', () => {
    const result = sortTechnologies([highScoreTech, midScoreTech, lowScoreTech]);
    for (const item of result) {
      expect(Number.isInteger(item.rank)).toBe(true);
      expect(item.rank).toBeGreaterThan(0);
    }
  });
});

// ─── Stable sort (preserves insertion order for equal scores) ─────────────────

describe('sortTechnologies — stable sort for ties', () => {
  it('preserves the original relative order of tied technologies', () => {
    const clone1: Technology = { ...highScoreTech, id: 'c1', name: 'Clone1', slug: 'clone1' };
    const clone2: Technology = { ...highScoreTech, id: 'c2', name: 'Clone2', slug: 'clone2' };
    const clone3: Technology = { ...highScoreTech, id: 'c3', name: 'Clone3', slug: 'clone3' };
    const result = sortTechnologies([clone1, clone2, clone3]);
    expect(result[0].technology.slug).toBe('clone1');
    expect(result[1].technology.slug).toBe('clone2');
    expect(result[2].technology.slug).toBe('clone3');
  });
});

// ─── Consistency with pairwise compareTechnologies ────────────────────────────

describe('sortTechnologies — consistency with pairwise comparison', () => {
  it('the tech ranked #1 wins the head-to-head compareTechnologies against last place', () => {
    const result = sortTechnologies([lowScoreTech, highScoreTech, midScoreTech]);
    const first = result[0].technology;
    const last = result[result.length - 1].technology;
    const pairwise = compareTechnologies(first, last);
    // first should beat last — 'A' wins (first is techA)
    expect(pairwise.winner).toBe('A');
  });
});

// ─── Immutability ─────────────────────────────────────────────────────────────

describe('sortTechnologies — immutability', () => {
  it('does not mutate the input array', () => {
    const techs = [lowScoreTech, highScoreTech, midScoreTech];
    const originalOrder = techs.map((t) => t.slug);
    sortTechnologies(techs);
    expect(techs.map((t) => t.slug)).toEqual(originalOrder);
  });
});
