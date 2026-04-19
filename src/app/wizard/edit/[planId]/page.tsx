import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { WizardEditShell } from '@/components/wizard/WizardEditShell';
import type { WizardSelections } from '@/types/wizard';

export const metadata: Metadata = {
  title: 'Edit Plan — DevPrint',
};

interface WizardEditPageProps {
  params: Promise<{ planId: string }>;
}

const selectionsSchema = z.object({
  projectName: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
  projectType: z.string().nullable().default(null),
  architecture: z.string().nullable().default(null),
  frontend: z.string().nullable().default(null),
  styling: z.string().nullable().default(null),
  backend: z.string().nullable().default(null),
  database: z.string().nullable().default(null),
  auth: z.string().nullable().default(null),
  hosting: z.string().nullable().default(null),
  cicd: z.string().nullable().default(null),
  testing: z.string().nullable().default(null),
});

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

  const parsed = selectionsSchema.safeParse(data.selections);
  if (!parsed.success) notFound();

  const initialSelections: WizardSelections = parsed.data;

  return <WizardEditShell initialSelections={initialSelections} planId={planIdResult.data} />;
}
