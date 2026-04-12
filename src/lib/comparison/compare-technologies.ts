import type { Technology } from '@/types/database';
import {
  CATEGORY_WEIGHTS,
  type CategoryScore,
  type ComparisonCategory,
  type ComparisonResult,
  type ComparisonSummary,
} from '@/types/comparison';

// ─── Scoring lookup tables ────────────────────────────────────────────────────

const LEARNING_CURVE_SCORE: Record<Technology['learning_curve'], number> = {
  beginner: 3,
  intermediate: 2,
  advanced: 1,
};

const COMMUNITY_SIZE_SCORE: Record<Technology['community_size'], number> = {
  small: 1,
  medium: 2,
  large: 3,
};

const MATURITY_SCORE: Record<Technology['maturity'], number> = {
  emerging: 1,
  growing: 2,
  mature: 4,
  declining: 1,
};

// ─── Score functions per category ─────────────────────────────────────────────

type ScoreFn = (tech: Technology) => number;

const SCORE_FNS: Record<ComparisonCategory, ScoreFn> = {
  performance: (t) =>
    (t.github_stars ?? 0) * 0.0001 + (t.npm_weekly_downloads ?? 0) * 0.000001,
  developer_experience: (t) =>
    LEARNING_CURVE_SCORE[t.learning_curve] + t.pros.length * 0.1,
  community: (t) =>
    COMMUNITY_SIZE_SCORE[t.community_size] + (t.github_stars ?? 0) * 0.000005,
  learning_curve: (t) => LEARNING_CURVE_SCORE[t.learning_curve],
  ecosystem: (t) =>
    (t.npm_weekly_downloads ?? 0) * 0.000001 + t.best_for.length * 0.5,
  maturity: (t) => MATURITY_SCORE[t.maturity],
};

function rawScore(tech: Technology, category: ComparisonCategory): number {
  return SCORE_FNS[category](tech);
}

function normalize(a: number, b: number): [number, number] {
  const sum = a + b;
  if (sum === 0) return [0.5, 0.5];
  return [a / sum, b / sum];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function calculateCategoryScores(
  techA: Technology,
  techB: Technology,
): CategoryScore[] {
  return (Object.keys(CATEGORY_WEIGHTS) as ComparisonCategory[]).map((category) => {
    const scoreA = rawScore(techA, category);
    const scoreB = rawScore(techB, category);
    const [normalizedScoreA, normalizedScoreB] = normalize(scoreA, scoreB);
    return { category, scoreA, scoreB, weight: CATEGORY_WEIGHTS[category], normalizedScoreA, normalizedScoreB };
  });
}

export function compareTechnologies(
  techA: Technology,
  techB: Technology,
): ComparisonResult {
  const categoryScores = calculateCategoryScores(techA, techB);
  const overallScoreA = categoryScores.reduce((sum, s) => sum + s.normalizedScoreA * s.weight, 0);
  const overallScoreB = categoryScores.reduce((sum, s) => sum + s.normalizedScoreB * s.weight, 0);
  const winner: 'A' | 'B' | 'tie' =
    overallScoreA > overallScoreB ? 'A' : overallScoreB > overallScoreA ? 'B' : 'tie';
  return {
    techA: { name: techA.name, slug: techA.slug, category: techA.category },
    techB: { name: techB.name, slug: techB.slug, category: techB.category },
    categoryScores,
    overallScoreA,
    overallScoreB,
    winner,
  };
}

export function generateComparisonSummary(result: ComparisonResult): ComparisonSummary {
  const { techA, techB, categoryScores, winner } = result;
  const advantagesA = categoryScores.filter((s) => s.normalizedScoreA > 0.5).map((s) => s.category);
  const advantagesB = categoryScores.filter((s) => s.normalizedScoreB > 0.5).map((s) => s.category);
  const tradeoffs = categoryScores
    .filter((s) => Math.abs(s.normalizedScoreA - s.normalizedScoreB) < 0.1)
    .map((s) => `${s.category} is similar between both`);
  const recommendation =
    winner === 'tie'
      ? `It's a tie between ${techA.name} and ${techB.name}`
      : winner === 'A'
        ? `${techA.name} is the stronger choice overall`
        : `${techB.name} is the stronger choice overall`;
  return {
    recommendation,
    advantages: { techA: advantagesA, techB: advantagesB },
    tradeoffs,
    bestFor: { techA: techA.category, techB: techB.category },
  };
}
