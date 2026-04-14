import type { ProjectPlanSummary } from '@/types/dashboard';

export interface DashboardStatsProps {
  plans: ProjectPlanSummary[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DashboardStats({ plans }: DashboardStatsProps) {
  const total = plans.length;
  const mostRecent = plans[0];

  return (
    <div className="flex items-center gap-6 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-semibold text-zinc-900">{total}</span>
        <span className="text-xs text-zinc-500">
          {total === 1 ? 'saved plan' : 'saved plans'}
        </span>
      </div>
      {mostRecent && (
        <>
          <div className="h-8 w-px bg-zinc-200" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-zinc-900">{mostRecent.name}</span>
            <span className="text-xs text-zinc-500">
              Most recent · {formatDate(mostRecent.created_at)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
