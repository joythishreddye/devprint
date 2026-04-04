// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  calculateCategoryScores,
  compareTechnologies,
  generateComparisonSummary,
} from '../compare-technologies';
import type { Technology } from '@/types/database';
import type { ComparisonResult } from '@/types/comparison';
import { CATEGORY_WEIGHTS } from '@/types/comparison';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseTech: Technology = {
  id: 'a',
  name: 'React',
  slug: 'react',
  category: 'frontend',
  description: 'A JS library for building UIs',
  logo_url: null,
  website_url: null,
  github_url: null,
  npm_package: 'react',
  github_stars: 200000,
  npm_weekly_downloads: 20000000,
  pros: ['large ecosystem', 'flexible', 'widely adopted'],
  cons: ['steep learning curve', 'boilerplate'],
  best_for: ['SPAs', 'large teams'],
  learning_curve: 'intermediate',
  community_size: 'large',
  maturity: 'mature',
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const techB: Technology = {
  ...baseTech,
  id: 'b',
  name: 'Vue',
  slug: 'vue',
  github_stars: 40000,
  npm_weekly_downloads: 4000000,
  pros: ['easy to learn', 'gentle curve'],
  cons: ['smaller ecosystem'],
  best_for: ['small teams', 'rapid prototyping'],
  learning_curve: 'beginner',
  community_size: 'medium',
  maturity: 'growing',
};

// ─── calculateCategoryScores ──────────────────────────────────────────────────

describe('calculateCategoryScores', () => {
  it('returns a score entry for every category in CATEGORY_WEIGHTS', () => {
    const scores = calculateCategoryScores(baseTech, techB);
    const categories = scores.map((s) => s.category);
    expect(categories).toEqual(expect.arrayContaining(Object.keys(CATEGORY_WEIGHTS)));
    expect(scores).toHaveLength(Object.keys(CATEGORY_WEIGHTS).length);
  });

  it('each score has the correct weight from CATEGORY_WEIGHTS', () => {
    const scores = calculateCategoryScores(baseTech, techB);
    for (const score of scores) {
      const key = score.category as keyof typeof CATEGORY_WEIGHTS;
      expect(score.weight).toBe(CATEGORY_WEIGHTS[key]);
    }
  });

  it('normalizedScoreA + normalizedScoreB === 1 for every category', () => {
    const scores = calculateCategoryScores(baseTech, techB);
    for (const score of scores) {
      expect(score.normalizedScoreA + score.normalizedScoreB).toBeCloseTo(1, 5);
    }
  });

  it('normalizedScores are in range [0, 1]', () => {
    const scores = calculateCategoryScores(baseTech, techB);
    for (const score of scores) {
      expect(score.normalizedScoreA).toBeGreaterThanOrEqual(0);
      expect(score.normalizedScoreA).toBeLessThanOrEqual(1);
      expect(score.normalizedScoreB).toBeGreaterThanOrEqual(0);
      expect(score.normalizedScoreB).toBeLessThanOrEqual(1);
    }
  });

  it('gives equal 0.5/0.5 split when both techs have identical stats', () => {
    const scores = calculateCategoryScores(baseTech, baseTech);
    for (const score of scores) {
      expect(score.normalizedScoreA).toBeCloseTo(0.5, 5);
      expect(score.normalizedScoreB).toBeCloseTo(0.5, 5);
    }
  });

  it('handles null github_stars and npm_weekly_downloads without throwing', () => {
    const noStats: Technology = { ...baseTech, github_stars: null, npm_weekly_downloads: null };
    expect(() => calculateCategoryScores(noStats, techB)).not.toThrow();
  });

  it('handles both techs having null numeric stats — falls back to 0.5 split', () => {
    const noStats: Technology = { ...baseTech, github_stars: null, npm_weekly_downloads: null };
    const noStatsB: Technology = { ...techB, github_stars: null, npm_weekly_downloads: null };
    const scores = calculateCategoryScores(noStats, noStatsB);
    for (const score of scores) {
      expect(score.normalizedScoreA + score.normalizedScoreB).toBeCloseTo(1, 5);
    }
  });

  it('tech with higher github_stars scores higher on community', () => {
    const scores = calculateCategoryScores(baseTech, techB);
    const community = scores.find((s) => s.category === 'community');
    expect(community).toBeDefined();
    expect(community!.normalizedScoreA).toBeGreaterThan(community!.normalizedScoreB);
  });

  it('beginner learning_curve scores higher on learning_curve category', () => {
    const scores = calculateCategoryScores(baseTech, techB);
    const lc = scores.find((s) => s.category === 'learning_curve');
    expect(lc).toBeDefined();
    expect(lc!.normalizedScoreB).toBeGreaterThan(lc!.normalizedScoreA);
  });

  it('mature maturity scores higher than growing', () => {
    const scores = calculateCategoryScores(baseTech, techB);
    const maturity = scores.find((s) => s.category === 'maturity');
    expect(maturity).toBeDefined();
    expect(maturity!.normalizedScoreA).toBeGreaterThan(maturity!.normalizedScoreB);
  });
});

// ─── compareTechnologies ──────────────────────────────────────────────────────

describe('compareTechnologies', () => {
  it('returns a ComparisonResult with both tech identities', () => {
    const result = compareTechnologies(baseTech, techB);
    expect(result.techA).toMatchObject({ name: 'React', slug: 'react', category: 'frontend' });
    expect(result.techB).toMatchObject({ name: 'Vue', slug: 'vue', category: 'frontend' });
  });

  it('overallScoreA + overallScoreB === 1', () => {
    const result = compareTechnologies(baseTech, techB);
    expect(result.overallScoreA + result.overallScoreB).toBeCloseTo(1, 5);
  });

  it('overall scores are in range [0, 1]', () => {
    const result = compareTechnologies(baseTech, techB);
    expect(result.overallScoreA).toBeGreaterThanOrEqual(0);
    expect(result.overallScoreA).toBeLessThanOrEqual(1);
    expect(result.overallScoreB).toBeGreaterThanOrEqual(0);
    expect(result.overallScoreB).toBeLessThanOrEqual(1);
  });

  it('categoryScores has one entry per CATEGORY_WEIGHTS key', () => {
    const result = compareTechnologies(baseTech, techB);
    expect(result.categoryScores).toHaveLength(Object.keys(CATEGORY_WEIGHTS).length);
  });

  it('winner is "tie" when both techs are identical', () => {
    const result = compareTechnologies(baseTech, baseTech);
    expect(result.winner).toBe('tie');
  });

  it('winner is "A" when techA is clearly stronger', () => {
    const dominant: Technology = {
      ...baseTech,
      github_stars: 999999,
      npm_weekly_downloads: 999999999,
      community_size: 'large',
      maturity: 'mature',
      learning_curve: 'beginner',
    };
    const weak: Technology = {
      ...techB,
      github_stars: 1,
      npm_weekly_downloads: 1,
      community_size: 'small',
      maturity: 'emerging',
      learning_curve: 'advanced',
    };
    const result = compareTechnologies(dominant, weak);
    expect(result.winner).toBe('A');
  });

  it('winner is "B" when techB is clearly stronger', () => {
    const weak: Technology = {
      ...baseTech,
      github_stars: 1,
      npm_weekly_downloads: 1,
      community_size: 'small',
      maturity: 'emerging',
      learning_curve: 'advanced',
    };
    const dominant: Technology = {
      ...techB,
      github_stars: 999999,
      npm_weekly_downloads: 999999999,
      community_size: 'large',
      maturity: 'mature',
      learning_curve: 'beginner',
    };
    const result = compareTechnologies(weak, dominant);
    expect(result.winner).toBe('B');
  });

  it('is commutative — swapping A and B flips scores symmetrically', () => {
    const ab = compareTechnologies(baseTech, techB);
    const ba = compareTechnologies(techB, baseTech);
    expect(ab.overallScoreA).toBeCloseTo(ba.overallScoreB, 5);
    expect(ab.overallScoreB).toBeCloseTo(ba.overallScoreA, 5);
  });
});

// ─── generateComparisonSummary ────────────────────────────────────────────────

describe('generateComparisonSummary', () => {
  const makeResult = (winner: 'A' | 'B' | 'tie'): ComparisonResult => ({
    techA: { name: 'React', slug: 'react', category: 'frontend' },
    techB: { name: 'Vue', slug: 'vue', category: 'frontend' },
    categoryScores: Object.entries(CATEGORY_WEIGHTS).map(([category, weight]) => ({
      category,
      weight,
      scoreA: 10,
      scoreB: winner === 'A' ? 5 : winner === 'B' ? 15 : 10,
      normalizedScoreA: winner === 'A' ? 0.67 : winner === 'B' ? 0.4 : 0.5,
      normalizedScoreB: winner === 'A' ? 0.33 : winner === 'B' ? 0.6 : 0.5,
    })),
    overallScoreA: winner === 'A' ? 0.6 : winner === 'B' ? 0.4 : 0.5,
    overallScoreB: winner === 'A' ? 0.4 : winner === 'B' ? 0.6 : 0.5,
    winner,
  });

  it('returns a recommendation string', () => {
    const summary = generateComparisonSummary(makeResult('A'));
    expect(typeof summary.recommendation).toBe('string');
    expect(summary.recommendation.length).toBeGreaterThan(0);
  });

  it('recommendation mentions the winning tech name when A wins', () => {
    const summary = generateComparisonSummary(makeResult('A'));
    expect(summary.recommendation).toContain('React');
  });

  it('recommendation mentions the winning tech name when B wins', () => {
    const summary = generateComparisonSummary(makeResult('B'));
    expect(summary.recommendation).toContain('Vue');
  });

  it('recommendation mentions tie when winner is tie', () => {
    const summary = generateComparisonSummary(makeResult('tie'));
    expect(summary.recommendation.toLowerCase()).toContain('tie');
  });

  it('advantages.techA lists categories where A scores above 0.5', () => {
    const result = makeResult('A');
    const summary = generateComparisonSummary(result);
    expect(summary.advantages.techA.length).toBeGreaterThan(0);
  });

  it('advantages.techB lists categories where B scores above 0.5', () => {
    const result = makeResult('B');
    const summary = generateComparisonSummary(result);
    expect(summary.advantages.techB.length).toBeGreaterThan(0);
  });

  it('tradeoffs is an array of strings', () => {
    const summary = generateComparisonSummary(makeResult('tie'));
    expect(Array.isArray(summary.tradeoffs)).toBe(true);
    for (const t of summary.tradeoffs) {
      expect(typeof t).toBe('string');
    }
  });

  it('bestFor.techA and bestFor.techB are non-empty strings', () => {
    const summary = generateComparisonSummary(makeResult('A'));
    expect(typeof summary.bestFor.techA).toBe('string');
    expect(typeof summary.bestFor.techB).toBe('string');
    expect(summary.bestFor.techA.length).toBeGreaterThan(0);
    expect(summary.bestFor.techB.length).toBeGreaterThan(0);
  });

  it('does not throw on a tie result', () => {
    expect(() => generateComparisonSummary(makeResult('tie'))).not.toThrow();
  });
});
