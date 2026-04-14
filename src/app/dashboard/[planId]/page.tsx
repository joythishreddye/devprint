export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { getProjectPlanById } from '@/lib/supabase/queries/get-project-plans';
import { planIdSchema } from '@/lib/validators/plan-id';
import { ConfigFileDisplay } from '@/components/dashboard/ConfigFileDisplay';
import type { GenerateConfigResult } from '@/types/generators';

interface PlanDetailPageProps {
  params: Promise<{ planId: string }>;
}


function parseConfigData(raw: Record<string, unknown>): GenerateConfigResult | null {
  if (!raw || typeof raw !== 'object') return null;
  if (!Array.isArray(raw.configs)) return null;
  return raw as unknown as GenerateConfigResult;
}

export default async function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { planId } = await params;

  const parsed = planIdSchema.safeParse(planId);
  if (!parsed.success) notFound();

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const plan = await getProjectPlanById(parsed.data, user.id);
  if (!plan) notFound();

  const configResult = parseConfigData(plan.config_data);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/dashboard" className="hover:text-zinc-700 transition-colors">
          Dashboard
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-600">{plan.name}</span>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-zinc-900">{plan.name}</h1>
        {plan.description && (
          <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
        )}
        <p className="mt-1 text-xs text-zinc-400">
          Created{' '}
          {new Date(plan.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {configResult ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-zinc-700">Generated config files</h2>
          {configResult.configs.map((config) => (
            <ConfigFileDisplay key={config.format} config={config} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-8 text-center">
          <p className="text-sm text-zinc-500">Config data is unavailable for this plan.</p>
        </div>
      )}
    </div>
  );
}
