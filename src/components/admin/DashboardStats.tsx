import type { AdminDashboardStats } from '@/types/admin';

export interface DashboardStatsProps {
  stats: AdminDashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    { label: 'Pending submissions', value: stats.pendingSubmissions, highlight: stats.pendingSubmissions > 0 },
    { label: 'Total technologies', value: stats.totalTechnologies, highlight: false },
    { label: 'Total users', value: stats.totalUsers, highlight: false },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(({ label, value, highlight }) => (
        <div
          key={label}
          className={`rounded-xl border px-6 py-5 ${
            highlight
              ? 'border-amber-200 bg-amber-50'
              : 'border-zinc-200 bg-white'
          }`}
        >
          <p className="text-xs font-medium text-zinc-500">{label}</p>
          <p className={`mt-1 text-3xl font-semibold ${highlight ? 'text-amber-700' : 'text-zinc-900'}`}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
