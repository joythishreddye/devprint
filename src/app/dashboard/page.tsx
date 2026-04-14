export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { getProjectPlansByUser } from '@/lib/supabase/queries/get-project-plans';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { PlanCard } from '@/components/dashboard/PlanCard';
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard';

export const metadata: Metadata = {
  title: 'Dashboard — DevPrint',
  description: 'Your saved project plans and generated config files.',
};

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const plans = await getProjectPlansByUser(user.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900">Your plans</h1>

      {plans.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <>
          <DashboardStats plans={plans} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
