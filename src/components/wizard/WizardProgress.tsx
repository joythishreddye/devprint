'use client';

import { useWizard } from './WizardProvider';
import { WIZARD_STEPS } from '@/lib/wizard/steps';
import { isStepComplete } from '@/lib/wizard/state';
import { WIZARD_PHASE } from '@/types/wizard';

export function WizardProgress() {
  const { state, handleGoToStep } = useWizard();

  return (
    <nav aria-label="Wizard progress" className="w-full">
      <ol className="flex items-center gap-1 overflow-x-auto pb-1">
        {WIZARD_STEPS.map((step, index) => {
          const complete = isStepComplete(state, step.id);
          const isCurrent =
            state.phase === WIZARD_PHASE.steps && state.currentStepIndex === index;
          const isSummary = state.phase === WIZARD_PHASE.summary;

          return (
            <li key={step.id} className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => complete && handleGoToStep(index)}
                disabled={!complete}
                aria-current={isCurrent ? 'step' : undefined}
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors',
                  isCurrent
                    ? 'bg-zinc-900 text-white'
                    : complete
                      ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 cursor-pointer'
                      : 'bg-zinc-100 text-zinc-400 cursor-default',
                  isSummary && complete ? 'bg-zinc-200 text-zinc-700' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                title={step.title}
              >
                {complete && !isCurrent ? (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8l3.5 3.5L13 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              {index < WIZARD_STEPS.length - 1 && (
                <span
                  className={[
                    'w-4 h-px',
                    complete ? 'bg-zinc-300' : 'bg-zinc-100',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
        <li className="flex items-center gap-1 shrink-0">
          <span className="w-4 h-px bg-zinc-100" aria-hidden="true" />
          <span
            className={[
              'flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold',
              state.phase === WIZARD_PHASE.summary
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-400',
            ].join(' ')}
            title="Summary"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 4h12M2 8h8M2 12h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </li>
      </ol>
      <p className="mt-2 text-xs text-zinc-500">
        {state.phase === WIZARD_PHASE.summary
          ? 'Review your selections'
          : state.phase === WIZARD_PHASE.steps
            ? `Step ${state.currentStepIndex + 1} of ${WIZARD_STEPS.length} — ${WIZARD_STEPS[state.currentStepIndex]?.title ?? ''}`
            : 'Project details'}
      </p>
    </nav>
  );
}
