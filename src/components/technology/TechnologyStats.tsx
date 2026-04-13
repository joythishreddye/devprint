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
    { label: 'Community Size', value: capitalize(community_size) },
    { label: 'Maturity', value: capitalize(maturity) },
  ];

  return (
    <div className="mb-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-5">
        At a Glance
      </h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500">{stat.label}</span>
            <span className="text-sm font-semibold text-zinc-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
