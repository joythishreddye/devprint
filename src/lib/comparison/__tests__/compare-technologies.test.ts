import { describe, it, expect } from 'vitest';
import { compareTechnologies } from '../compare-technologies';
import type { Technology } from '@/types/database';

// Test fixtures — minimal Technology objects for comparison
const react: Technology = {
  id: '1',
  name: 'React',
  slug: 'react',
  category: 'frontend-framework',
  description: 'A JavaScript library for building user interfaces.',
  logo_url: null,
  website_url: 'https://react.dev',
  github_url: 'https://github.com/facebook/react',
  npm_package: 'react',
  github_stars: 228000,
  npm_weekly_downloads: 25000000,
  pros: ['Massive ecosystem', 'Strong job market', 'Flexible architecture', 'React Native for mobile'],
  cons: ['JSX learning curve', 'Frequent ecosystem changes', 'Boilerplate for state management'],
  best_for: ['Large-scale SPAs', 'Cross-platform development'],
  learning_curve: 'intermediate',
  community_size: 'large',
  maturity: 'mature',
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const svelte: Technology = {
  id: '2',
  name: 'Svelte',
  slug: 'svelte',
  category: 'frontend-framework',
  description: 'A compiler-based framework that shifts work to build time.',
  logo_url: null,
  website_url: 'https://svelte.dev',
  github_url: 'https://github.com/sveltejs/svelte',
  npm_package: 'svelte',
  github_stars: 80000,
  npm_weekly_downloads: 1200000,
  pros: ['No virtual DOM overhead', 'Minimal boilerplate', 'Small bundle sizes'],
  cons: ['Smaller ecosystem', 'Fewer jobs', 'Less mature tooling'],
  best_for: ['Performance-critical apps', 'Small to medium projects'],
  learning_curve: 'beginner',
  community_size: 'medium',
  maturity: 'growing',
  metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('compareTechnologies', () => {
  it('should return a ComparisonResult with both technologies', () => {
    const result = compareTechnologies(react, svelte);

    expect(result.techA).toEqual({ name: 'React', slug: 'react', category: 'frontend-framework' });
    expect(result.techB).toEqual({ name: 'Svelte', slug: 'svelte', category: 'frontend-framework' });
  });

  it('should return category scores for all 6 comparison categories', () => {
    const result = compareTechnologies(react, svelte);

    expect(result.categoryScores).toHaveLength(6);

    const categoryNames = result.categoryScores.map((s) => s.category);
    expect(categoryNames).toContain('performance');
    expect(categoryNames).toContain('developer_experience');
    expect(categoryNames).toContain('community');
    expect(categoryNames).toContain('learning_curve');
    expect(categoryNames).toContain('ecosystem');
    expect(categoryNames).toContain('maturity');
  });

  it('should return normalized scores between 0 and 10', () => {
    const result = compareTechnologies(react, svelte);

    for (const score of result.categoryScores) {
      expect(score.normalizedScoreA).toBeGreaterThanOrEqual(0);
      expect(score.normalizedScoreA).toBeLessThanOrEqual(10);
      expect(score.normalizedScoreB).toBeGreaterThanOrEqual(0);
      expect(score.normalizedScoreB).toBeLessThanOrEqual(10);
    }
  });

  it('should return overall scores between 0 and 10', () => {
    const result = compareTechnologies(react, svelte);

    expect(result.overallScoreA).toBeGreaterThanOrEqual(0);
    expect(result.overallScoreA).toBeLessThanOrEqual(10);
    expect(result.overallScoreB).toBeGreaterThanOrEqual(0);
    expect(result.overallScoreB).toBeLessThanOrEqual(10);
  });

  it('should determine a winner or tie', () => {
    const result = compareTechnologies(react, svelte);

    expect(['A', 'B', 'tie']).toContain(result.winner);
  });

  it('should return winner A when techA has higher overall score', () => {
    // React has larger community, more stars, more mature — should score higher overall
    const result = compareTechnologies(react, svelte);

    if (result.overallScoreA > result.overallScoreB) {
      expect(result.winner).toBe('A');
    } else if (result.overallScoreA < result.overallScoreB) {
      expect(result.winner).toBe('B');
    } else {
      expect(result.winner).toBe('tie');
    }
  });

  it('should return tie when comparing a technology to itself', () => {
    const result = compareTechnologies(react, react);

    expect(result.winner).toBe('tie');
    expect(result.overallScoreA).toBe(result.overallScoreB);
  });

  it('should include weights that match CATEGORY_WEIGHTS', () => {
    const result = compareTechnologies(react, svelte);

    const weights = result.categoryScores.map((s) => s.weight);
    expect(weights).toContain(0.2);  // performance
    expect(weights).toContain(0.25); // developer_experience
    expect(weights).toContain(0.15); // community, learning_curve, ecosystem
    expect(weights).toContain(0.1);  // maturity
  });
});
