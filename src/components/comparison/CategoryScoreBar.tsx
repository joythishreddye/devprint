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

/** Converts a 0–1 normalized score to a 0–10 display value, 1 decimal place. */
function fmt(n: number): string {
  return (n * 10).toFixed(1);
}

export function CategoryScoreBar({ scores, nameA, nameB }: CategoryScoreBarProps): React.ReactElement {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-100">
            <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 w-40">
              Category
            </th>
            <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {nameA}
            </th>
            <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {nameB}
            </th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => {
            const barA = score.normalizedScoreA * 100;
            const barB = score.normalizedScoreB * 100;
            const aWins = score.normalizedScoreA > score.normalizedScoreB;
            const bWins = score.normalizedScoreB > score.normalizedScoreA;
            return (
              <tr key={score.category} role="row" className="border-b border-zinc-50">
                <td className="py-3 pr-4 text-xs font-medium text-zinc-600 align-middle w-40">
                  {CATEGORY_LABELS[score.category] ?? score.category}
                </td>
                <td className="py-3 pr-4 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden min-w-0">
                      <div
                        data-testid="score-bar"
                        className={`h-full rounded-full transition-all ${aWins ? 'bg-blue-500' : 'bg-zinc-300'}`}
                        style={{ width: `${barA}%` }}
                      />
                    </div>
                    <span className={`w-8 shrink-0 text-right tabular-nums text-sm ${aWins ? 'font-semibold text-zinc-900' : 'text-zinc-400'}`}>
                      {fmt(score.normalizedScoreA)}
                    </span>
                  </div>
                </td>
                <td className="py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden min-w-0">
                      <div
                        data-testid="score-bar"
                        className={`h-full rounded-full transition-all ${bWins ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                        style={{ width: `${barB}%` }}
                      />
                    </div>
                    <span className={`w-8 shrink-0 text-right tabular-nums text-sm ${bWins ? 'font-semibold text-zinc-900' : 'text-zinc-400'}`}>
                      {fmt(score.normalizedScoreB)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
