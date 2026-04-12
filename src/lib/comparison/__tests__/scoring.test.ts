import { describe, it, expect } from 'vitest';
import {
  scoreLearningCurve,
  scoreCommunitySize,
  scoreMaturity,
  scoreGitHubStars,
  scoreNpmDownloads,
  normalizeScore,
} from '../scoring';

describe('scoreLearningCurve', () => {
  it('should score beginner highest', () => {
    expect(scoreLearningCurve('beginner')).toBe(9);
  });

  it('should score intermediate in the middle', () => {
    expect(scoreLearningCurve('intermediate')).toBe(6);
  });

  it('should score advanced lowest', () => {
    expect(scoreLearningCurve('advanced')).toBe(3);
  });

  it('should always return beginner > intermediate > advanced', () => {
    expect(scoreLearningCurve('beginner')).toBeGreaterThan(scoreLearningCurve('intermediate'));
    expect(scoreLearningCurve('intermediate')).toBeGreaterThan(scoreLearningCurve('advanced'));
  });
});

describe('scoreCommunitySize', () => {
  it('should score large highest', () => {
    expect(scoreCommunitySize('large')).toBe(9);
  });

  it('should score medium in the middle', () => {
    expect(scoreCommunitySize('medium')).toBe(6);
  });

  it('should score small lowest', () => {
    expect(scoreCommunitySize('small')).toBe(3);
  });
});

describe('scoreMaturity', () => {
  it('should score mature highest', () => {
    expect(scoreMaturity('mature')).toBe(9);
  });

  it('should score growing second', () => {
    expect(scoreMaturity('growing')).toBe(7);
  });

  it('should score emerging third', () => {
    expect(scoreMaturity('emerging')).toBe(4);
  });

  it('should score declining lowest', () => {
    expect(scoreMaturity('declining')).toBe(2);
  });

  it('should maintain order: mature > growing > emerging > declining', () => {
    expect(scoreMaturity('mature')).toBeGreaterThan(scoreMaturity('growing'));
    expect(scoreMaturity('growing')).toBeGreaterThan(scoreMaturity('emerging'));
    expect(scoreMaturity('emerging')).toBeGreaterThan(scoreMaturity('declining'));
  });
});

describe('scoreGitHubStars', () => {
  it('should return 10 for 200k+ stars', () => {
    expect(scoreGitHubStars(228000)).toBe(10);
  });

  it('should return 9 for 100k+ stars', () => {
    expect(scoreGitHubStars(130000)).toBe(9);
  });

  it('should return 8 for 50k+ stars', () => {
    expect(scoreGitHubStars(80000)).toBe(8);
  });

  it('should return 5 as default for null', () => {
    expect(scoreGitHubStars(null)).toBe(5);
  });

  it('should return 3 for very low stars', () => {
    expect(scoreGitHubStars(1000)).toBe(3);
  });

  it('should always return between 3 and 10', () => {
    const testValues = [null, 0, 100, 5000, 10000, 50000, 200000, 500000];
    for (const val of testValues) {
      const score = scoreGitHubStars(val);
      expect(score).toBeGreaterThanOrEqual(3);
      expect(score).toBeLessThanOrEqual(10);
    }
  });
});

describe('scoreNpmDownloads', () => {
  it('should return 10 for 20M+ downloads', () => {
    expect(scoreNpmDownloads(25000000)).toBe(10);
  });

  it('should return 7 for 1M+ downloads', () => {
    expect(scoreNpmDownloads(1200000)).toBe(7);
  });

  it('should return 5 as default for null', () => {
    expect(scoreNpmDownloads(null)).toBe(5);
  });

  it('should return 3 for very low downloads', () => {
    expect(scoreNpmDownloads(50000)).toBe(3);
  });

  it('should increase monotonically with download count', () => {
    const values = [50000, 100000, 500000, 1000000, 5000000, 10000000, 20000000];
    for (let i = 1; i < values.length; i++) {
      expect(scoreNpmDownloads(values[i])).toBeGreaterThanOrEqual(scoreNpmDownloads(values[i - 1]));
    }
  });
});

describe('normalizeScore', () => {
  it('should clamp scores above 10 to 10', () => {
    expect(normalizeScore(15)).toBe(10);
  });

  it('should clamp scores below 0 to 0', () => {
    expect(normalizeScore(-5)).toBe(0);
  });

  it('should round to 1 decimal place', () => {
    expect(normalizeScore(7.456)).toBe(7.5);
    expect(normalizeScore(3.14)).toBe(3.1);
  });

  it('should pass through valid scores unchanged', () => {
    expect(normalizeScore(5)).toBe(5);
    expect(normalizeScore(0)).toBe(0);
    expect(normalizeScore(10)).toBe(10);
  });
});
