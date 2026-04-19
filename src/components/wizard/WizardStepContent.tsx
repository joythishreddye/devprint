'use client';

import { useState } from 'react';
import { useWizard } from './WizardProvider';
import { WizardOptionCard } from './WizardOptionCard';
import { WizardComparePanel } from './WizardComparePanel';
import { WIZARD_STEPS } from '@/lib/wizard/steps';
import { WIZARD_PHASE } from '@/types/wizard';
import type { WizardStepId } from '@/types/wizard';

export function WizardStepContent() {
  const { state, handleSetSelection } = useWizard();
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  if (state.phase !== WIZARD_PHASE.steps) return null;

  const step = WIZARD_STEPS[state.currentStepIndex];
  if (!step) return null;

  const currentValue = state.selections[step.selectionKey as keyof typeof state.selections];

  // Only show Compare when there are at least 2 non-"None" options to compare
  const comparableOptions = step.options.filter((o) => o.value !== 'None');
  const canCompare = comparableOptions.length >= 2;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">{step.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{step.description}</p>
        </div>

        {canCompare && (
          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="shrink-0 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 shadow-sm hover:border-zinc-300 hover:text-zinc-900 transition-colors"
            aria-label={`Compare ${step.title} options`}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
              <rect x="1" y="3" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="3" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Compare
          </button>
        )}
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

      {isCompareOpen && (
        <WizardComparePanel
          options={comparableOptions}
          stepTitle={step.title}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  );
}
