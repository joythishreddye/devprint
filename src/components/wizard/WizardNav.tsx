'use client';

import { useWizard } from './WizardProvider';
import { canProceed } from '@/lib/wizard/state';
import { WIZARD_STEPS, TOTAL_STEPS } from '@/lib/wizard/steps';
import { WIZARD_PHASE } from '@/types/wizard';

export function WizardNav() {
  const { state, handleNext, handleBack } = useWizard();

  if (state.phase !== WIZARD_PHASE.steps) return null;

  const isLastStep = state.currentStepIndex === TOTAL_STEPS - 1;
  const isFirstStep = state.currentStepIndex === 0;
  const proceed = canProceed(state);

  return (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-100">
      <button
        type="button"
        onClick={handleBack}
        disabled={isFirstStep}
        className={[
          'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          isFirstStep
            ? 'text-zinc-300 cursor-default'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50',
        ].join(' ')}
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      <div className="text-xs text-zinc-400">
        {WIZARD_STEPS[state.currentStepIndex]?.title}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!proceed}
        className={[
          'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          proceed
            ? 'bg-zinc-900 text-white hover:bg-zinc-700'
            : 'bg-zinc-100 text-zinc-400 cursor-default',
        ].join(' ')}
      >
        {isLastStep ? 'Review Selections' : 'Next'}
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
