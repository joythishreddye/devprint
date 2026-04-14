import type { ContributionStatus } from '@/types/database';

export interface ContributionStatusBadgeProps {
  status: ContributionStatus;
}

const BADGE_STYLES: Record<ContributionStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function ContributionStatusBadge({ status }: ContributionStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${BADGE_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
