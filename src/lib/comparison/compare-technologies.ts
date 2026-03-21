import type { Technology } from '@/types/database';
import type { ComparisonResult, CategoryScore } from '@/types/comparison';
import { CATEGORY_WEIGHTS, type ComparisonCategory } from '@/types/comparison';

function scoreLearningCurve(curve: Technology['learning_curve']): number {
  const scores = { beginner: 9, intermediate: 6, advanced: 3 };
  return scores[curve];
}

function scoreCommunitySize(size: Technology['community_size']): number {
  const scores = { large: 9, medium: 6, small: 3 };
  return scores[size];
}

function scoreMaturity(maturity: Technology['maturity']): number {
  const scores = { mature: 9, growing: 7, emerging: 4, declining: 2 };
  return scores[maturity];
}

function scoreGitHubStars(stars: number | null): number {
  if (stars === null) return 5;
  if (stars >= 200000) return 10;
  if (stars >= 100000) return 9;
  if (stars >= 50000) return 8;
  if (stars >= 20000) return 7;
  if (stars >= 10000) return 6;
  if (stars >= 5000) return 5;
  return 3;
}

function scoreNpmDownloads(downloads: number | null): number {
  if (downloads === null) return 5;
  if (downloads >= 20000000) return 10;
  if (downloads >= 10000000) return 9;
  if (downloads >= 5000000) return 8;
  if (downloads >= 1000000) return 7;
  if (downloads >= 500000) return 6;
  if (downloads >= 100000) return 5;
  return 3;
}

function calculateCategoryScore(
  techA: Technology,
  techB: Technology,
  category: ComparisonCategory
): CategoryScore {
  let scoreA: number;
  let scoreB: number;

  switch (category) {
    case 'performance':
      // Lower learning curve + smaller bundle (fewer downloads = potentially lighter)
      scoreA = (scoreLearningCurve(techA.learning_curve) + (10 - scoreNpmDownloads(techA.npm_weekly_downloads) + 5)) / 2;
      scoreB = (scoreLearningCurve(techB.learning_curve) + (10 - scoreNpmDownloads(techB.npm_weekly_downloads) + 5)) / 2;
      break;
    case 'developer_experience':
      scoreA = (scoreLearningCurve(techA.learning_curve) + Math.min(techA.pros.length * 2, 10)) / 2;
      scoreB = (scoreLearningCurve(techB.learning_curve) + Math.min(techB.pros.length * 2, 10)) / 2;
      break;
    case 'community':
      scoreA = (scoreGitHubStars(techA.github_stars) + scoreCommunitySize(techA.community_size)) / 2;
      scoreB = (scoreGitHubStars(techB.github_stars) + scoreCommunitySize(techB.community_size)) / 2;
      break;
    case 'learning_curve':
      scoreA = scoreLearningCurve(techA.learning_curve);
      scoreB = scoreLearningCurve(techB.learning_curve);
      break;
    case 'ecosystem':
      scoreA = (scoreNpmDownloads(techA.npm_weekly_downloads) + scoreGitHubStars(techA.github_stars)) / 2;
      scoreB = (scoreNpmDownloads(techB.npm_weekly_downloads) + scoreGitHubStars(techB.github_stars)) / 2;
      break;
    case 'maturity':
      scoreA = scoreMaturity(techA.maturity);
      scoreB = scoreMaturity(techB.maturity);
      break;
  }

  // Normalize to 0-10
  const normalizedScoreA = Math.max(0, Math.min(10, Math.round(scoreA * 10) / 10));
  const normalizedScoreB = Math.max(0, Math.min(10, Math.round(scoreB * 10) / 10));

  return {
    category,
    scoreA,
    scoreB,
    weight: CATEGORY_WEIGHTS[category],
    normalizedScoreA,
    normalizedScoreB,
  };
}

export function compareTechnologies(techA: Technology, techB: Technology): ComparisonResult {
  const categories = Object.keys(CATEGORY_WEIGHTS) as ComparisonCategory[];

  const categoryScores = categories.map((category) =>
    calculateCategoryScore(techA, techB, category)
  );

  const overallScoreA = categoryScores.reduce(
    (sum, s) => sum + s.normalizedScoreA * s.weight,
    0
  );
  const overallScoreB = categoryScores.reduce(
    (sum, s) => sum + s.normalizedScoreB * s.weight,
    0
  );

  const roundedA = Math.round(overallScoreA * 100) / 100;
  const roundedB = Math.round(overallScoreB * 100) / 100;

  let winner: 'A' | 'B' | 'tie';
  if (roundedA > roundedB) {
    winner = 'A';
  } else if (roundedB > roundedA) {
    winner = 'B';
  } else {
    winner = 'tie';
  }

  return {
    techA: { name: techA.name, slug: techA.slug, category: techA.category },
    techB: { name: techB.name, slug: techB.slug, category: techB.category },
    categoryScores,
    overallScoreA: Math.round(roundedA * 10) / 10,
    overallScoreB: Math.round(roundedB * 10) / 10,
    winner,
  };
}
