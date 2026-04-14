import type { Technology } from '@/types/database';

export interface TechnologyStatsProps {
  technology: Pick<
    Technology,
    'github_stars' | 'npm_weekly_downloads' | 'learning_curve' | 'community_size' | 'maturity'
  >;
}

interface StatItem {
  label: string;
  value: string;
}

function formatNumber(n: number | null): string {
  if (n === null) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function TechnologyStats({ technology }: TechnologyStatsProps) {
  const { github_stars, npm_weekly_downloads, learning_curve, community_size, maturity } =
    technology;

  const stats: StatItem[] = [
    { label: 'GitHub Stars', value: formatNumber(github_stars) },
    { label: 'Weekly Downloads', value: formatNumber(npm_weekly_downloads) },
    { label: 'Learning Curve', value: capitalize(learning_curve) },
    { label: 'Community', value: capitalize(community_size) },
    { label: 'Maturity', value: capitalize(maturity) },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          At a Glance
        </h2>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 sm:grid-cols-5 sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 px-5 py-4">
            <span className="text-xs text-zinc-400">{stat.label}</span>
            <span className="text-sm font-semibold text-zinc-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
