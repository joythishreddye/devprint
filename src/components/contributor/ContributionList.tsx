import Link from 'next/link';
import type { Contribution } from '@/types/database';
import { ContributionStatusBadge } from './ContributionStatusBadge';

export interface ContributionListProps {
  contributions: Contribution[];
}

export function ContributionList({ contributions }: ContributionListProps) {
  if (contributions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-10 text-center">
        <p className="text-sm font-medium text-zinc-700">No submissions yet</p>
        <p className="text-sm text-zinc-500">
          Use the form above to submit your first technology for review.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {contributions.map((contribution) => {
        const techName =
          typeof contribution.technology_data?.name === 'string'
            ? contribution.technology_data.name
            : 'Untitled';

        return (
          <div
            key={contribution.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <ContributionStatusBadge status={contribution.status} />
              <span className="text-sm font-medium text-zinc-900 truncate">{techName}</span>
              <span className="text-xs text-zinc-400 shrink-0">
                {new Date(contribution.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            {contribution.status === 'pending' && (
              <Link
                href={`/contributor/edit/${contribution.id}`}
                className="ml-4 shrink-0 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Edit
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
