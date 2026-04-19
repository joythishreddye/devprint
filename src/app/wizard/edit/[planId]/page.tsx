import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { wizardSelectionsSchema } from '@/lib/validators/wizard-schema';
import { WizardEditShell } from '@/components/wizard/WizardEditShell';

export const metadata: Metadata = {
  title: 'Edit Plan — DevPrint',
};

interface WizardEditPageProps {
  params: Promise<{ planId: string }>;
}

export default async function WizardEditPage({ params }: WizardEditPageProps) {
  const { planId } = await params;
  const planIdResult = z.string().uuid().safeParse(planId);
  if (!planIdResult.success) notFound();

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data, error } = await supabase
    .from('project_plans')
    .select('id, selections')
    .eq('id', planIdResult.data)
    .eq('user_id', user.id)
    .single();

  if (error || !data) notFound();

  // Validate saved selections against the canonical schema so stale/malformed data is caught early
  const parsed = wizardSelectionsSchema.safeParse(data.selections);
  if (!parsed.success) notFound();

  return <WizardEditShell initialSelections={parsed.data} planId={planIdResult.data} />;
}
