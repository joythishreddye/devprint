import type { CategoryScore } from '@/types/comparison';

const CATEGORY_LABELS: Record<string, string> = {
  performance: 'Performance',
  developer_experience: 'Developer Experience',
  community: 'Community & Support',
  learning_curve: 'Learning Curve',
  ecosystem: 'Ecosystem & Libraries',
  maturity: 'Maturity & Stability',
};

export interface CategoryScoreBarProps {
  scores: CategoryScore[];
  nameA: string;
  nameB: string;
}

export function CategoryScoreBar({ scores, nameA, nameB }: CategoryScoreBarProps): React.ReactElement {
  return (
    <div className="w-full">
      <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-2 text-sm font-semibold text-zinc-500">
        <span />
        <span className="w-48 text-center">{nameA}</span>
        <span className="w-48 text-center">{nameB}</span>
      </div>
      {scores.map((score) => (
        <div key={score.category} role="row" className="mb-3">
          <div className="mb-1 text-sm font-medium text-zinc-700">
            {CATEGORY_LABELS[score.category] ?? score.category}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <div
                  data-testid="score-bar"
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${(score.normalizedScoreA / 10) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-sm tabular-nums text-zinc-600">
                {score.normalizedScoreA}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <div
                  data-testid="score-bar"
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(score.normalizedScoreB / 10) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-sm tabular-nums text-zinc-600">
                {score.normalizedScoreB}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
