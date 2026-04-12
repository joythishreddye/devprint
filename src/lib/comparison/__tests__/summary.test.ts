import { describe, it, expect } from 'vitest';
import { generateComparisonSummary } from '../summary';
import type { ComparisonResult } from '@/types/comparison';

const reactWinsResult: ComparisonResult = {
  techA: { name: 'React', slug: 'react', category: 'frontend-framework' },
  techB: { name: 'Svelte', slug: 'svelte', category: 'frontend-framework' },
  categoryScores: [
    { category: 'performance', scoreA: 5, scoreB: 7, weight: 0.2, normalizedScoreA: 5, normalizedScoreB: 7 },
    { category: 'developer_experience', scoreA: 7, scoreB: 8, weight: 0.25, normalizedScoreA: 7, normalizedScoreB: 8 },
    { category: 'community', scoreA: 9.5, scoreB: 7, weight: 0.15, normalizedScoreA: 9.5, normalizedScoreB: 7 },
    { category: 'learning_curve', scoreA: 6, scoreB: 9, weight: 0.15, normalizedScoreA: 6, normalizedScoreB: 9 },
    { category: 'ecosystem', scoreA: 10, scoreB: 7.5, weight: 0.15, normalizedScoreA: 10, normalizedScoreB: 7.5 },
    { category: 'maturity', scoreA: 9, scoreB: 7, weight: 0.1, normalizedScoreA: 9, normalizedScoreB: 7 },
  ],
  overallScoreA: 7.5,
  overallScoreB: 7.4,
  winner: 'A',
};

const tieResult: ComparisonResult = {
  techA: { name: 'React', slug: 'react', category: 'frontend-framework' },
  techB: { name: 'Vue.js', slug: 'vuejs', category: 'frontend-framework' },
  categoryScores: [
    { category: 'performance', scoreA: 7, scoreB: 7, weight: 0.2, normalizedScoreA: 7, normalizedScoreB: 7 },
    { category: 'developer_experience', scoreA: 7, scoreB: 7, weight: 0.25, normalizedScoreA: 7, normalizedScoreB: 7 },
    { category: 'community', scoreA: 7, scoreB: 7, weight: 0.15, normalizedScoreA: 7, normalizedScoreB: 7 },
    { category: 'learning_curve', scoreA: 7, scoreB: 7, weight: 0.15, normalizedScoreA: 7, normalizedScoreB: 7 },
    { category: 'ecosystem', scoreA: 7, scoreB: 7, weight: 0.15, normalizedScoreA: 7, normalizedScoreB: 7 },
    { category: 'maturity', scoreA: 7, scoreB: 7, weight: 0.1, normalizedScoreA: 7, normalizedScoreB: 7 },
  ],
  overallScoreA: 7,
  overallScoreB: 7,
  winner: 'tie',
};

describe('generateComparisonSummary', () => {
  it('should return a ComparisonSummary object', () => {
    const summary = generateComparisonSummary(reactWinsResult);

    expect(summary).toHaveProperty('recommendation');
    expect(summary).toHaveProperty('advantages');
    expect(summary).toHaveProperty('tradeoffs');
    expect(summary).toHaveProperty('bestFor');
  });

  it('should include a non-empty recommendation string', () => {
    const summary = generateComparisonSummary(reactWinsResult);

    expect(summary.recommendation).toBeTruthy();
    expect(typeof summary.recommendation).toBe('string');
    expect(summary.recommendation.length).toBeGreaterThan(0);
  });

  it('should mention the winner name in the recommendation', () => {
    const summary = generateComparisonSummary(reactWinsResult);

    expect(summary.recommendation).toContain('React');
  });

  it('should list advantages for both technologies', () => {
    const summary = generateComparisonSummary(reactWinsResult);

    expect(Array.isArray(summary.advantages.techA)).toBe(true);
    expect(Array.isArray(summary.advantages.techB)).toBe(true);
  });

  it('should identify categories where each tech wins as advantages', () => {
    const summary = generateComparisonSummary(reactWinsResult);

    // React wins: community, ecosystem, maturity
    expect(summary.advantages.techA.length).toBeGreaterThan(0);
    // Svelte wins: performance, developer_experience, learning_curve
    expect(summary.advantages.techB.length).toBeGreaterThan(0);
  });

  it('should include tradeoffs as an array of strings', () => {
    const summary = generateComparisonSummary(reactWinsResult);

    expect(Array.isArray(summary.tradeoffs)).toBe(true);
    expect(summary.tradeoffs.length).toBeGreaterThan(0);
    for (const tradeoff of summary.tradeoffs) {
      expect(typeof tradeoff).toBe('string');
    }
  });

  it('should include bestFor descriptions for both technologies', () => {
    const summary = generateComparisonSummary(reactWinsResult);

    expect(typeof summary.bestFor.techA).toBe('string');
    expect(typeof summary.bestFor.techB).toBe('string');
    expect(summary.bestFor.techA.length).toBeGreaterThan(0);
    expect(summary.bestFor.techB.length).toBeGreaterThan(0);
  });

  it('should handle tie results gracefully', () => {
    const summary = generateComparisonSummary(tieResult);

    expect(summary.recommendation).toBeTruthy();
    // Should mention both or indicate a tie
    expect(
      summary.recommendation.includes('tie') ||
      summary.recommendation.includes('either') ||
      summary.recommendation.includes('both') ||
      (summary.recommendation.includes('React') && summary.recommendation.includes('Vue.js'))
    ).toBe(true);
  });

  it('should not crash with minimal category score differences', () => {
    const closerResult: ComparisonResult = {
      ...reactWinsResult,
      overallScoreA: 7.01,
      overallScoreB: 7.0,
      winner: 'A',
    };

    const summary = generateComparisonSummary(closerResult);
    expect(summary.recommendation).toBeTruthy();
  });
});
