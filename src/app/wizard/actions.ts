'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { mapWizardToProjectSelections } from '@/lib/wizard/mapper';
import { generateAllConfigs } from '@/lib/generators/generate-config';
import type { ApiResponse } from '@/types/api';

const planIdSchema = z.string().uuid();

const selectionField = z.string().max(100).nullable();

const wizardSelectionsSchema = z.object({
  projectName: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).default(''),
  projectType: selectionField,
  architecture: selectionField,
  frontend: selectionField,
  styling: selectionField,
  backend: selectionField,
  database: selectionField,
  auth: selectionField,
  hosting: selectionField,
  cicd: selectionField,
  testing: selectionField,
});

export async function saveWizardPlan(
  selectionsJson: string,
): Promise<ApiResponse<{ planId: string }>> {
  let parsed: ReturnType<typeof wizardSelectionsSchema.safeParse>;

  try {
    const raw: unknown = JSON.parse(selectionsJson);
    parsed = wizardSelectionsSchema.safeParse(raw);
  } catch {
    return { success: false, error: 'Invalid selections format' };
  }

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? 'Invalid selections' };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { count } = await supabase
    .from('project_plans')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', new Date(Date.now() - 60_000).toISOString());

  if ((count ?? 0) >= 10) {
    return { success: false, error: 'Too many plans created recently. Please wait before trying again.' };
  }

  const projectSelections = mapWizardToProjectSelections({
    phase: 'steps',
    currentStepIndex: 0,
    selections: parsed.data,
  });

  const configResult = generateAllConfigs(projectSelections);

  const { data, error } = await supabase
    .from('project_plans')
    .insert({
      user_id: user.id,
      name: parsed.data.projectName,
      description: parsed.data.description || null,
      selections: parsed.data,
      config_data: configResult as unknown as Record<string, unknown>,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to save wizard plan:', error);
    return { success: false, error: 'Failed to save plan. Please try again.' };
  }

  return { success: true, data: { planId: data.id } };
}

export async function updateWizardPlan(
  planId: string,
  selectionsJson: string,
): Promise<ApiResponse<{ planId: string }>> {
  const planIdResult = planIdSchema.safeParse(planId);
  if (!planIdResult.success) return { success: false, error: 'Invalid plan ID' };

  let parsed: ReturnType<typeof wizardSelectionsSchema.safeParse>;
  try {
    const raw: unknown = JSON.parse(selectionsJson);
    parsed = wizardSelectionsSchema.safeParse(raw);
  } catch {
    return { success: false, error: 'Invalid selections format' };
  }

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? 'Invalid selections' };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const projectSelections = mapWizardToProjectSelections({
    phase: 'steps',
    currentStepIndex: 0,
    selections: parsed.data,
  });

  const configResult = generateAllConfigs(projectSelections);

  const { data, error } = await supabase
    .from('project_plans')
    .update({
      name: parsed.data.projectName,
      description: parsed.data.description || null,
      selections: parsed.data,
      config_data: configResult as unknown as Record<string, unknown>,
    })
    .eq('id', planIdResult.data)
    .eq('user_id', user.id)
    .select('id')
    .single();

  if (error) {
    console.error('Failed to update wizard plan:', error);
    return { success: false, error: 'Failed to update plan. Please try again.' };
  }

  return { success: true, data: { planId: data.id } };
}
