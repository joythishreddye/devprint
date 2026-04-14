'use client';

import { useWizard } from './WizardProvider';
import { WizardProgress } from './WizardProgress';
import { WizardProjectInfo } from './WizardProjectInfo';
import { WizardStepContent } from './WizardStepContent';
import { WizardNav } from './WizardNav';
import { WizardSummary } from './WizardSummary';
import { getCompletionPercentage } from '@/lib/wizard/state';
import { WIZARD_PHASE } from '@/types/wizard';

export function WizardShell() {
  const { state } = useWizard();
  const pct = getCompletionPercentage(state);

  return (
    <div className="flex flex-col gap-6">
      {state.phase !== WIZARD_PHASE.info && (
        <div className="flex flex-col gap-3">
          <WizardProgress />
          <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-zinc-900 transition-all duration-300"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {state.phase === WIZARD_PHASE.info && <WizardProjectInfo />}
      {state.phase === WIZARD_PHASE.steps && (
        <div className="flex flex-col gap-6">
          <WizardStepContent />
          <WizardNav />
        </div>
      )}
      {state.phase === WIZARD_PHASE.summary && <WizardSummary />}
    </div>
  );
}
