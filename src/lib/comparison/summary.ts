import type { ComparisonResult, ComparisonSummary } from '@/types/comparison';

const CATEGORY_LABELS: Record<string, string> = {
  performance: 'Performance',
  developer_experience: 'Developer Experience',
  community: 'Community & Support',
  learning_curve: 'Learning Curve',
  ecosystem: 'Ecosystem & Libraries',
  maturity: 'Maturity & Stability',
};

function formatCategoryName(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function generateComparisonSummary(result: ComparisonResult): ComparisonSummary {
  const { techA, techB, categoryScores, winner } = result;

  const advantagesA: string[] = [];
  const advantagesB: string[] = [];
  const tradeoffs: string[] = [];

  for (const score of categoryScores) {
    const label = formatCategoryName(score.category);
    const diff = Math.abs(score.normalizedScoreA - score.normalizedScoreB);

    if (score.normalizedScoreA > score.normalizedScoreB) {
      advantagesA.push(`Stronger ${label} (${score.normalizedScoreA} vs ${score.normalizedScoreB})`);
    } else if (score.normalizedScoreB > score.normalizedScoreA) {
      advantagesB.push(`Stronger ${label} (${score.normalizedScoreB} vs ${score.normalizedScoreA})`);
    }

    if (diff >= 1.5) {
      tradeoffs.push(
        `${label}: ${score.normalizedScoreA > score.normalizedScoreB ? techA.name : techB.name} leads by ${diff.toFixed(1)} points`
      );
    }
  }

  if (tradeoffs.length === 0) {
    tradeoffs.push(`${techA.name} and ${techB.name} are very close across all categories`);
  }

  let recommendation: string;
  if (winner === 'tie') {
    recommendation = `${techA.name} and ${techB.name} are evenly matched — either is a strong choice. Pick based on your team's existing experience.`;
  } else {
    const winnerName = winner === 'A' ? techA.name : techB.name;
    const loserName = winner === 'A' ? techB.name : techA.name;
    recommendation = `${winnerName} edges ahead overall, but ${loserName} has clear strengths in specific areas. Consider your project priorities when deciding.`;
  }

  const bestForA = advantagesA.length > 0
    ? `Projects prioritizing ${advantagesA.map((a) => a.replace(/^Stronger /, '').replace(/ \(.*$/, '')).slice(0, 2).join(' and ')}`
    : `General-purpose projects in the ${techA.category} space`;

  const bestForB = advantagesB.length > 0
    ? `Projects prioritizing ${advantagesB.map((a) => a.replace(/^Stronger /, '').replace(/ \(.*$/, '')).slice(0, 2).join(' and ')}`
    : `General-purpose projects in the ${techB.category} space`;

  return {
    recommendation,
    advantages: {
      techA: advantagesA,
      techB: advantagesB,
    },
    tradeoffs,
    bestFor: {
      techA: bestForA,
      techB: bestForB,
    },
  };
}
