'use client';

import { WizardProvider } from './WizardProvider';
import { WizardShell } from './WizardShell';
import type { WizardSelections } from '@/types/wizard';

export interface WizardEditShellProps {
  initialSelections: WizardSelections;
  planId: string;
}

/**
 * Wraps WizardShell in a fresh WizardProvider pre-loaded with an existing plan's
 * selections, starting in the summary phase so the user can review and edit.
 * The inner provider takes precedence over the parent layout's empty provider.
 */
export function WizardEditShell({ initialSelections, planId }: WizardEditShellProps) {
  return (
    <WizardProvider initialSelections={initialSelections} planId={planId}>
      <WizardShell />
    </WizardProvider>
  );
}
