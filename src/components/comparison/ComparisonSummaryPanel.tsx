import type { ComparisonSummary } from '@/types/comparison';

export interface ComparisonSummaryPanelProps {
  summary: ComparisonSummary;
  nameA: string;
  nameB: string;
}

export function ComparisonSummaryPanel({
  summary,
  nameA,
  nameB,
}: ComparisonSummaryPanelProps): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-base font-medium text-blue-900">{summary.recommendation}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-zinc-200 p-4">
          <h3 className="mb-2 text-sm font-semibold text-zinc-900">{nameA} Advantages</h3>
          {summary.advantages.techA.length > 0 ? (
            <ul className="space-y-1">
              {summary.advantages.techA.map((advantage) => (
                <li key={advantage} className="text-sm text-zinc-600">
                  {advantage}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">No clear advantages</p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 p-4">
          <h3 className="mb-2 text-sm font-semibold text-zinc-900">{nameB} Advantages</h3>
          {summary.advantages.techB.length > 0 ? (
            <ul className="space-y-1">
              {summary.advantages.techB.map((advantage) => (
                <li key={advantage} className="text-sm text-zinc-600">
                  {advantage}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-400">No clear advantages</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 p-4">
        <h3 className="mb-2 text-sm font-semibold text-zinc-900">Key Trade-offs</h3>
        <ul className="space-y-1">
          {summary.tradeoffs.map((tradeoff) => (
            <li key={tradeoff} className="text-sm text-zinc-600">
              {tradeoff}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-zinc-200 p-4">
          <h3 className="mb-1 text-sm font-semibold text-zinc-900">Best for ({nameA})</h3>
          <p className="text-sm text-zinc-600">{summary.bestFor.techA}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <h3 className="mb-1 text-sm font-semibold text-zinc-900">Best for ({nameB})</h3>
          <p className="text-sm text-zinc-600">{summary.bestFor.techB}</p>
        </div>
      </div>
    </div>
  );
}
