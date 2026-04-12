import type { Technology } from '@/types/database';

/**
 * Score mappings for categorical Technology fields.
 * Higher score = better for that dimension.
 */

const LEARNING_CURVE_SCORES: Record<Technology['learning_curve'], number> = {
  beginner: 9,
  intermediate: 6,
  advanced: 3,
};

const COMMUNITY_SIZE_SCORES: Record<Technology['community_size'], number> = {
  large: 9,
  medium: 6,
  small: 3,
};

const MATURITY_SCORES: Record<Technology['maturity'], number> = {
  mature: 9,
  growing: 7,
  emerging: 4,
  declining: 2,
};

export function scoreLearningCurve(curve: Technology['learning_curve']): number {
  return LEARNING_CURVE_SCORES[curve];
}

export function scoreCommunitySize(size: Technology['community_size']): number {
  return COMMUNITY_SIZE_SCORES[size];
}

export function scoreMaturity(maturity: Technology['maturity']): number {
  return MATURITY_SCORES[maturity];
}

export function scoreGitHubStars(stars: number | null): number {
  if (stars === null) return 5;
  if (stars >= 200000) return 10;
  if (stars >= 100000) return 9;
  if (stars >= 50000) return 8;
  if (stars >= 20000) return 7;
  if (stars >= 10000) return 6;
  if (stars >= 5000) return 5;
  return 3;
}

export function scoreNpmDownloads(downloads: number | null): number {
  if (downloads === null) return 5;
  if (downloads >= 20000000) return 10;
  if (downloads >= 10000000) return 9;
  if (downloads >= 5000000) return 8;
  if (downloads >= 1000000) return 7;
  if (downloads >= 500000) return 6;
  if (downloads >= 100000) return 5;
  return 3;
}

/** Clamp and round a score to the 0-10 range with 1 decimal precision. */
export function normalizeScore(score: number): number {
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}
