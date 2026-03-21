import type { Technology } from '@/types/database';
import type { ComparisonResult, CategoryScore } from '@/types/comparison';
import { CATEGORY_WEIGHTS, type ComparisonCategory } from '@/types/comparison';
import {
  scoreLearningCurve,
  scoreCommunitySize,
  scoreMaturity,
  scoreGitHubStars,
  scoreNpmDownloads,
  normalizeScore,
} from './scoring';

function calculateCategoryScore(
  techA: Technology,
  techB: Technology,
  category: ComparisonCategory
): CategoryScore {
  let rawA: number;
  let rawB: number;

  switch (category) {
    case 'performance':
      rawA = (scoreLearningCurve(techA.learning_curve) + (10 - scoreNpmDownloads(techA.npm_weekly_downloads) + 5)) / 2;
      rawB = (scoreLearningCurve(techB.learning_curve) + (10 - scoreNpmDownloads(techB.npm_weekly_downloads) + 5)) / 2;
      break;
    case 'developer_experience':
      rawA = (scoreLearningCurve(techA.learning_curve) + Math.min(techA.pros.length * 2, 10)) / 2;
      rawB = (scoreLearningCurve(techB.learning_curve) + Math.min(techB.pros.length * 2, 10)) / 2;
      break;
    case 'community':
      rawA = (scoreGitHubStars(techA.github_stars) + scoreCommunitySize(techA.community_size)) / 2;
      rawB = (scoreGitHubStars(techB.github_stars) + scoreCommunitySize(techB.community_size)) / 2;
      break;
    case 'learning_curve':
      rawA = scoreLearningCurve(techA.learning_curve);
      rawB = scoreLearningCurve(techB.learning_curve);
      break;
    case 'ecosystem':
      rawA = (scoreNpmDownloads(techA.npm_weekly_downloads) + scoreGitHubStars(techA.github_stars)) / 2;
      rawB = (scoreNpmDownloads(techB.npm_weekly_downloads) + scoreGitHubStars(techB.github_stars)) / 2;
      break;
    case 'maturity':
      rawA = scoreMaturity(techA.maturity);
      rawB = scoreMaturity(techB.maturity);
      break;
  }

  return {
    category,
    scoreA: rawA,
    scoreB: rawB,
    weight: CATEGORY_WEIGHTS[category],
    normalizedScoreA: normalizeScore(rawA),
    normalizedScoreB: normalizeScore(rawB),
  };
}

function calculateOverallScore(categoryScores: CategoryScore[], side: 'A' | 'B'): number {
  const weighted = categoryScores.reduce(
    (sum, s) => sum + (side === 'A' ? s.normalizedScoreA : s.normalizedScoreB) * s.weight,
    0
  );
  return Math.round(weighted * 10) / 10;
}

function determineWinner(scoreA: number, scoreB: number): 'A' | 'B' | 'tie' {
  if (scoreA > scoreB) return 'A';
  if (scoreB > scoreA) return 'B';
  return 'tie';
}

export function calculateCategoryScores(
  techA: Technology,
  techB: Technology
): CategoryScore[] {
  const categories = Object.keys(CATEGORY_WEIGHTS) as ComparisonCategory[];
  return categories.map((category) => calculateCategoryScore(techA, techB, category));
}

export function compareTechnologies(techA: Technology, techB: Technology): ComparisonResult {
  const categoryScores = calculateCategoryScores(techA, techB);

  const overallScoreA = calculateOverallScore(categoryScores, 'A');
  const overallScoreB = calculateOverallScore(categoryScores, 'B');

  return {
    techA: { name: techA.name, slug: techA.slug, category: techA.category },
    techB: { name: techB.name, slug: techB.slug, category: techB.category },
    categoryScores,
    overallScoreA,
    overallScoreB,
    winner: determineWinner(overallScoreA, overallScoreB),
  };
}
