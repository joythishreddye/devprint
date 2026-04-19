import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import type { GenerateConfigResult } from '@/types/generators';

export const metadata: Metadata = {
  title: 'Plan Saved — DevPrint',
};

interface WizardSuccessPageProps {
  searchParams: Promise<{ planId?: string }>;
}

export default async function WizardSuccessPage({ searchParams }: WizardSuccessPageProps) {
  const { planId } = await searchParams;
  const planIdResult = z.string().uuid().safeParse(planId);
  if (!planIdResult.success) notFound();

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data, error } = await supabase
    .from('project_plans')
    .select('id, name, description, config_data, created_at')
    .eq('id', planIdResult.data)
    .eq('user_id', user.id)
    .single();

  if (error || !data) notFound();

  const configResult = data.config_data as unknown as GenerateConfigResult;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">Plan saved</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">{data.name}</h1>
        {data.description && (
          <p className="mt-1 text-sm text-zinc-500">{data.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-zinc-700">Generated config files</h2>
        <p className="text-sm text-zinc-500">
          Copy these into the root of your project to give your AI coding tool context about your
          stack.
        </p>

        {configResult.configs.map((config) => (
          <div key={config.format} className="rounded-xl border border-zinc-200 overflow-hidden">
            <div className="flex items-center justify-between bg-zinc-50 px-4 py-3 border-b border-zinc-200">
              <span className="text-sm font-medium text-zinc-700">{config.filename}</span>
              <span className="text-xs rounded-full bg-zinc-200 px-2 py-0.5 text-zinc-500 capitalize">
                {config.format}
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap">
              {config.content}
            </pre>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/wizard/edit/${data.id}`}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          Edit plan
        </Link>
        <Link
          href="/wizard"
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
        >
          New plan
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
