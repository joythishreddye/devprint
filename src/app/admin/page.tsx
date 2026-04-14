export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import {
  getAdminDashboardStats,
  getPendingContributions,
  getAllTechnologiesAdmin,
  getAllUserProfiles,
} from '@/lib/supabase/queries/admin';
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { SubmissionQueue } from '@/components/admin/SubmissionQueue';
import { TechnologyManager } from '@/components/admin/TechnologyManager';
import { UserRoleManager } from '@/components/admin/UserRoleManager';

export default async function AdminPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    return <AdminAccessDenied />;
  }

  const [stats, contributions, technologies, users] = await Promise.all([
    getAdminDashboardStats(),
    getPendingContributions(),
    getAllTechnologiesAdmin(),
    getAllUserProfiles(),
  ]);

  const tabs = [
    {
      label: `Dashboard${stats.pendingSubmissions > 0 ? ` (${stats.pendingSubmissions})` : ''}`,
      content: <DashboardStats stats={stats} />,
    },
    {
      label: `Submissions (${contributions.length})`,
      content: <SubmissionQueue contributions={contributions} />,
    },
    {
      label: `Technologies (${technologies.length})`,
      content: <TechnologyManager technologies={technologies} />,
    },
    {
      label: `Users (${users.length})`,
      content: <UserRoleManager users={users} currentUserId={user.id} />,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Admin panel</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage content, review submissions, and configure users.</p>
      </div>
      <AdminTabs tabs={tabs} />
    </div>
  );
}
