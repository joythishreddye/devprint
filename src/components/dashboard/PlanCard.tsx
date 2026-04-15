import Link from 'next/link';
import type { ProjectPlanSummary } from '@/types/dashboard';
import { DeletePlanButton } from './DeletePlanButton';

export interface PlanCardProps {
  plan: ProjectPlanSummary;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-150 hover:border-zinc-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/dashboard/${plan.id}`}
          className="flex-1 min-w-0"
        >
          <span className="block text-base font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors truncate">
            {plan.name}
          </span>
        </Link>
        <DeletePlanButton planId={plan.id} planName={plan.name} />
      </div>

      {plan.description && (
        <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2">{plan.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3">
        <span className="text-xs text-zinc-400">{formatDate(plan.created_at)}</span>
        <Link
          href={`/dashboard/${plan.id}`}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          View configs →
        </Link>
      </div>
    </div>
  );
}
