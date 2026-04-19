import type { Technology } from '@/types/database';
import {
  CATEGORY_WEIGHTS,
  type ComparisonCategory,
} from '@/types/comparison';
import {
  scoreLearningCurve,
  scoreCommunitySize,
  scoreMaturity,
  scoreGitHubStars,
  scoreNpmDownloads,
  normalizeScore,
} from './scoring';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SortedTechnology {
  /** The original technology object — never mutated. */
  technology: Technology;
  /** Weighted absolute score in [0, 10]. */
  score: number;
  /**
   * 1-based rank using standard competition ranking.
   * Ties share the same rank; the next distinct rank skips accordingly.
   * e.g. scores [9, 9, 7] → ranks [1, 1, 3]
   */
  rank: number;
}

export interface SortOptions {
  /**
   * `'desc'` (default) — highest score first (rank 1 = best).
   * `'asc'`           — lowest score first (rank 1 = lowest scorer).
   */
  order?: 'asc' | 'desc';
}

// ─── Internal scoring ─────────────────────────────────────────────────────────

/**
 * Maps each ComparisonCategory to an absolute per-technology score in [0, 10]
 * using the atomic scoring functions from `scoring.ts`.
 */
const CATEGORY_SCORE_FNS: Record<ComparisonCategory, (tech: Technology) => number> = {
  performance: (t) =>
    normalizeScore(
      (scoreGitHubStars(t.github_stars) + scoreNpmDownloads(t.npm_weekly_downloads)) / 2,
    ),
  developer_experience: (t) => normalizeScore(scoreLearningCurve(t.learning_curve)),
  community: (t) =>
    normalizeScore(
      (scoreCommunitySize(t.community_size) + scoreGitHubStars(t.github_stars)) / 2,
    ),
  learning_curve: (t) => normalizeScore(scoreLearningCurve(t.learning_curve)),
  ecosystem: (t) =>
    normalizeScore(
      scoreNpmDownloads(t.npm_weekly_downloads) + Math.min(t.best_for.length, 5),
    ),
  maturity: (t) => normalizeScore(scoreMaturity(t.maturity)),
};

/**
 * Computes an absolute weighted score for a single technology.
 * Each category score is clamped to [0, 10]; the weighted sum is in [0, 10]
 * because CATEGORY_WEIGHTS sums to exactly 1.0.
 */
function computeScore(tech: Technology): number {
  const weightedSum = (
    Object.entries(CATEGORY_WEIGHTS) as [ComparisonCategory, number][]
  ).reduce(
    (total, [category, weight]) => total + CATEGORY_SCORE_FNS[category](tech) * weight,
    0,
  );
  return normalizeScore(weightedSum);
}

/**
 * Assigns standard competition ranks to an already-sorted list of scored items.
 * Ties receive the same rank; the next distinct rank skips by the number of ties.
 * e.g. scores [9, 9, 7] → ranks [1, 1, 3]
 */
function assignRanks(items: Omit<SortedTechnology, 'rank'>[]): SortedTechnology[] {
  const result: SortedTechnology[] = [];
  let currentRank = 1;

  for (let i = 0; i < items.length; i++) {
    if (i > 0 && items[i].score !== items[i - 1].score) {
      currentRank = i + 1;
    }
    result.push({ ...items[i], rank: currentRank });
  }

  return result;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Sorts an array of technologies by their absolute weighted score.
 *
 * @param techs   - Technologies to rank. The original array is NOT mutated.
 * @param options - `order` defaults to `'desc'` (highest score = rank 1).
 * @returns       An array of `SortedTechnology` items with `score` and `rank`.
 */
export function sortTechnologies(
  techs: Technology[],
  options: SortOptions = {},
): SortedTechnology[] {
  const { order = 'desc' } = options;

  if (techs.length === 0) return [];

  // Score each technology without mutating the input
  const scored: Omit<SortedTechnology, 'rank'>[] = techs.map((technology) => ({
    technology,
    score: computeScore(technology),
  }));

  // Sort a copy — never mutate the original
  const comparator = order === 'desc'
    ? (a: Omit<SortedTechnology, 'rank'>, b: Omit<SortedTechnology, 'rank'>) => b.score - a.score
    : (a: Omit<SortedTechnology, 'rank'>, b: Omit<SortedTechnology, 'rank'>) => a.score - b.score;
  const sorted = [...scored].sort(comparator);

  return assignRanks(sorted);
}
