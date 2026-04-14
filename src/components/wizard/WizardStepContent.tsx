'use client';

import { useWizard } from './WizardProvider';
import { WizardOptionCard } from './WizardOptionCard';
import { WIZARD_STEPS } from '@/lib/wizard/steps';
import { WIZARD_PHASE } from '@/types/wizard';
import type { WizardStepId } from '@/types/wizard';

export function WizardStepContent() {
  const { state, handleSetSelection } = useWizard();

  if (state.phase !== WIZARD_PHASE.steps) return null;

  const step = WIZARD_STEPS[state.currentStepIndex];
  if (!step) return null;

  const currentValue = state.selections[step.selectionKey as keyof typeof state.selections];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">{step.title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{step.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {step.options.map((option) => (
          <WizardOptionCard
            key={option.value}
            option={option}
            selected={currentValue === option.value}
            onSelect={(value) => handleSetSelection(step.id as WizardStepId, value)}
          />
        ))}
      </div>
    </div>
  );
}
