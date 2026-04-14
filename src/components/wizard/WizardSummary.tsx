'use client';

import { useState, useTransition } from 'react';
import { useWizard } from './WizardProvider';
import { WIZARD_STEPS } from '@/lib/wizard/steps';
import { isStepComplete } from '@/lib/wizard/state';
import { saveWizardPlan } from '@/app/wizard/actions';

export function WizardSummary() {
  const { state, handleGoToStep, handleBack } = useWizard();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveWizardPlan(JSON.stringify(state.selections));
      if (!result.success) {
        setError(result.error);
        return;
      }
      window.location.href = `/wizard/success?planId=${encodeURIComponent(result.data.planId)}`;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Review your selections</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Check everything looks right before saving. Click any row to change a selection.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-200">
          <p className="text-sm font-medium text-zinc-700">Project details</p>
        </div>
        <div className="divide-y divide-zinc-100">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-zinc-500">Name</span>
            <span className="text-sm font-medium text-zinc-900">{state.selections.projectName}</span>
          </div>
          {state.selections.description && (
            <div className="flex items-start justify-between gap-4 px-4 py-3">
              <span className="text-sm text-zinc-500 shrink-0">Description</span>
              <span className="text-sm text-zinc-700 text-right">{state.selections.description}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-200">
          <p className="text-sm font-medium text-zinc-700">Technology stack</p>
        </div>
        <div className="divide-y divide-zinc-100">
          {WIZARD_STEPS.map((step, index) => {
            const value = state.selections[step.selectionKey as keyof typeof state.selections];
            const complete = isStepComplete(state, step.id);
            return (
              <div key={step.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-zinc-500">{step.title}</span>
                <div className="flex items-center gap-2">
                  {complete ? (
                    <span className="text-sm font-medium text-zinc-900">{value as string}</span>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">Not selected</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleGoToStep(index)}
                    className="text-xs text-zinc-400 hover:text-zinc-700 underline underline-offset-2"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
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

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className={[
            'rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
            isPending
              ? 'bg-zinc-300 text-zinc-500 cursor-default'
              : 'bg-zinc-900 text-white hover:bg-zinc-700',
          ].join(' ')}
        >
          {isPending ? 'Saving...' : 'Save & Generate Configs'}
        </button>
      </div>
    </div>
  );
}
